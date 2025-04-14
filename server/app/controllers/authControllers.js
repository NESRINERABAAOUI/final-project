// Dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tables = require("../../database/tables"); // Adjust the path as necessary
const { body, validationResult } = require("express-validator");

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const jwtSecretKey = process.env.JWT_SECRET_TOKEN;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_TOKEN;
if (!jwtSecretKey || !jwtRefreshSecretKey) {
  throw new Error(
    "JWT_SECRET_TOKEN or JWT_REFRESH_SECRET_TOKEN is not defined in the environment variables."
  );
}

// Token Expiry Times
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "3d";

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const cleanedToken = token.replace("Bearer ", "");
    const verified = jwt.verify(cleanedToken, jwtSecretKey);
    req.user = verified.user;
    console.info(verified);
    return next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Role-Based Authorization Middleware
const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Unauthorized role." });
    }
    return next();
  };

const signupValidator = [
  body("Email").isEmail().withMessage("Invalid email address."),

  body("Password")
    .matches(strongPasswordRegex)
    .withMessage(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    ),

  body("Role")
    .isIn(["client", "translator", "admin"])
    .withMessage("Role must be either client, translator, or admin."),

  body("FirstName")
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("First name is required. at least 6 characters long"),

  body("LastName")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Last name is required. at least 6 characters long"),

  body("NumberPhone")
    .matches(/^[0-9+\-().\s]{6,20}$/)
    .withMessage("Invalid phone number."),

  body("LanguageToTranslate")
    .if(body("Role").equals("translator"))
    .notEmpty()
    .withMessage("LanguageToTranslate is required for translators."),

  body("MotherLanguage")
    .if(body("Role").equals("translator"))
    .notEmpty()
    .withMessage("MotherLanguage is required for translators."),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Login Controller
const login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await tables.Users.findOne("Email = ?", [Email]);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password." });
    }

    const token = jwt.sign(
      { user: { userId: user.Id_User, email: user.Email, role: user.Role } },
      jwtSecretKey,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { user: { userId: user.Id_User, email: user.Email, role: user.Role } },
      jwtRefreshSecretKey,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: { userId: user.Id_User, email: user.Email, role: user.Role },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
};

// Signup Controller
const signup = async (req, res) => {
  const {
    Email,
    Role,
    Password,
    FirstName,
    LastName,
    NumberPhone,
    LanguageToTranslate,
    MotherLanguage,
  } = req.body;

  const allowedRoles = ["client", "translator", "admin"];
  if (!allowedRoles.includes(Role)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid role provided." });
  }

  try {
    const existingUser = await tables.Users.findOne("Email = ?", [Email]);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await tables.Users.create({
      Email,
      Password: hashedPassword,
      Role,
    });

    if (Role === "client") {
      await tables.Clients.create({
        Id_User: user.id,
        FirstName,
        LastName,
        NumberPhone,
      });
    } else if (Role === "translator") {
      await tables.Translators.create({
        Id_User: user.id,
        FirstName,
        LastName,
        NumberPhone,
        MotherLanguage,
        LanguageToTranslate,
      });
    } else if (Role === "admin") {
      await tables.Administrators.create({
        Id_User: user.id,
        FirstName,
        LastName,
        NumberPhone,
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.Email, role: user.Role },
      jwtSecretKey,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.Email, role: user.Role },
      jwtRefreshSecretKey,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return res.status(201).json({
      success: true,
      data: {
        userId: user.id,
        email: user.Email,
        role: user.Role,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ success: false, message: "Signup failed." });
  }
};

// Refresh Token Controller
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "Refresh token is required." });
  }

  try {
    const verified = jwt.verify(refreshToken, jwtRefreshSecretKey);

    const newAccessToken = jwt.sign(
      { userId: verified.userId, email: verified.email, role: verified.role },
      jwtSecretKey,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return res
      .status(200)
      .json({ success: true, data: { token: newAccessToken } });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token." });
  }
};

module.exports = {
  authMiddleware,
  authorizeRoles,
  login,
  signup,
  refreshAccessToken,
  validateRequest,
  signupValidator,
};
