const fs = require("fs");
const path = require("path");
const tables = require("../../database/tables");

// Fetch all clients (Admin only)
const getClients = async (req, res) => {
  try {
    // Ensure only Admin can fetch all clients
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Unauthorized role." });
    }

    const clients = await tables.Clients.buildJoinQuery(
      ["Users", "Clients"],
      ["Users.Id_User = Clients.Id_User"],
      "Users.Id_User, Users.Email, Clients.FirstName, Clients.LastName, Clients.NumberPhone, Clients.ImagePath"
    );
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// Fetch a single client by ID (Admin & the client himself)
const getOneClientById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure Admin or the client himself can access
    if (req.user.role !== "admin" && req.user.userId !== Number(id)) {
      return res.status(403).json({ error: "Access denied." });
    }

    const client = await tables.Clients.buildJoinQuery(
      ["Users", "Clients"],
      ["Users.Id_User = Clients.Id_User"],
      "Users.Id_User, Users.Email, Clients.FirstName, Clients.LastName, Clients.NumberPhone, Clients.ImagePath",
      "Users.Id_User = ?",
      [id]
    );

    if (!client.length) {
      return res.status(404).json({ error: "Client not found" });
    }

    return res.status(200).json(client[0]);
  } catch (error) {
    console.error("Error fetching client:", error);
    return res.status(500).json({ error: "Failed to fetch client" });
  }
};

// Fetch all translators (Admin only)
const getTranslators = async (req, res) => {
  try {
    console.info(req);
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Unauthorized role." });
    }

    const translators = await tables.Translators.buildJoinQuery(
      ["Users", "Translators", "Languages AS ML", "Languages AS TL"],
      [
        "Users.Id_User = Translators.Id_User",
        "ML.Id_Language = Translators.MotherLanguage",
        "TL.Id_Language = Translators.LanguageToTranslate",
      ],
      "Users.Id_User, Users.Email, Translators.FirstName, Translators.LastName, Translators.NumberPhone, Translators.ImagePath, ML.Language_Name AS MotherLanguage, TL.Language_Name AS LanguageToTranslate"
    );

    return res.status(200).json(translators);
  } catch (error) {
    console.error("Error fetching translators:", error);
    return res.status(500).json({ error: "Failed to fetch translators" });
  }
};

// Fetch a single translator by ID (Admin & the translator himself)
const getOneTranslatorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure Admin or the translator himself can access
    if (req.user.role !== "admin" && req.user.userId !== Number(id)) {
      return res.status(403).json({ error: "Access denied." });
    }

    const translator = await tables.Translators.buildJoinQuery(
      ["Users", "Translators", "Languages AS ML", "Languages AS TL"],
      [
        "Users.Id_User = Translators.Id_User",
        "ML.Id_Language = Translators.MotherLanguage",
        "TL.Id_Language = Translators.LanguageToTranslate",
      ],
      "Users.Id_User, Users.Email,Translators.Id_Translator, Translators.FirstName, Translators.LastName, Translators.NumberPhone, Translators.ImagePath, ML.Language_Name AS MotherLanguage, TL.Language_Name AS LanguageToTranslate",
      "Users.Id_User = ?",
      [id]
    );

    if (!translator.length) {
      return res.status(404).json({ error: "Translator not found" });
    }

    return res.status(200).json(translator[0]);
  } catch (error) {
    console.error("Error fetching translator:", error);
    return res.status(500).json({ error: "Failed to fetch translator" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params; // User ID from URL
  const { role } = req.user; // Extract role from JWT
  const updateData = req.body; // Data to update

  try {
    // Check if the user exists
    const user = await tables.Users.findOne("Id_User = ?", [id]);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Authorization: Admin can update anyone, users can only update themselves
    if (role !== "admin" && req.user.userId !== parseInt(id)) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action." });
    }

    // Update in Users table
    await tables.Users.update({ Email: updateData.Email }, "Id_User = ?", [id]);

    // Update specific role-related table
    if (user.Role === "client") {
      await tables.Clients.update(
        { NumberPhone: updateData.NumberPhone },
        "Id_User = ?",
        [id]
      );
    } else if (user.Role === "translator") {
      await tables.Translators.update(
        { NumberPhone: updateData.NumberPhone },
        "Id_User = ?",
        [id]
      );
    } else if (user.Role === "admin") {
      await tables.Administrators.update(
        { NumberPhone: updateData.NumberPhone },
        "Id_User = ?",
        [id]
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("Update error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update user." });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({ error: "Failed to update admin" });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params; // User ID from URL
  const { role } = req.user; // User role from JWT

  try {
    // Only admins can delete users
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action." });
    }

    // Check if the user exists
    const user = await tables.Users.findOne("Id_User = ?", [id]);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Delete from role-specific table first
    if (user.Role === "client") {
      await tables.Clients.delete("Id_User = ?", [id]);
    } else if (user.Role === "translator") {
      await tables.Translators.delete("Id_User = ?", [id]);
    } else if (user.Role === "admin") {
      await tables.Administrators.delete("Id_User = ?", [id]);
    }

    // Finally, delete from Users table
    await tables.Users.delete("Id_User = ?", [id]);

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete user." });
  }
};

const editImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.user;
    const newImage = req.file;

    if (!newImage)
      return res.status(400).json({ message: "No image uploaded" });

    let user;
    switch (role) {
      case "admin":
        user = await tables.Administrators.findOne("Id_User = ?", [userId]);
        break;
      case "client":
        user = await tables.Clients.findOne("Id_User = ?", [userId]);
        break;
      case "translator":
        user = await tables.Translators.findOne("Id_User = ?", [userId]);
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const oldImagePath = user.ImagePath;

    // Delete the old image if it exists
    if (oldImagePath) {
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(oldImagePath)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // ✅ STORE NEW IMAGE PATH WITHOUT "uploads\\" PREFIX
    const cleanImagePath = path.basename(newImage.path);

    // Update user with the new image path
    const updatedUser = { ...user, ImagePath: cleanImagePath };

    switch (role) {
      case "admin":
        await tables.Administrators.update(updatedUser, "Id_User = ?", [
          userId,
        ]);
        break;
      case "client":
        await tables.Clients.update(updatedUser, "Id_User = ?", [userId]);
        break;
      case "translator":
        await tables.Translators.update(updatedUser, "Id_User = ?", [userId]);
        break;
      default:
        return res.status(400).json({ message: "Image updated fail" });
    }

    return res
      .status(200)
      .json({ user: updatedUser, message: "Image updated successfully" });
  } catch (error) {
    console.error("Error updating image:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
const getTranslatorsByLanguages = async (req, res) => {
  try {
    const { motherLanguage, languageToTranslate } = req.query;
    // Validate inputs
    if (!motherLanguage || !languageToTranslate) {
      return res.status(400).json({
        message: "Both motherLanguage and languageToTranslate are required.",
      });
    }

    // Fetch translators from the database
    const translators = await tables.Translators.findAll(
      "MotherLanguage = ? AND LanguageToTranslate = ?",
      [motherLanguage, languageToTranslate]
    );

    // Check if translators were found
    if (translators.length === 0) {
      return res.status(404).json({
        message: `No translators found for ${motherLanguage} to ${languageToTranslate}.`,
      });
    }
    // Return the list of translators
    return res.status(200).json(translators);
  } catch (error) {
    console.error("Error fetching translators:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await tables.Administrators.buildJoinQuery(
      ["Users", "Administrators"],
      ["Users.Id_User = Administrators.Id_User"],
      "Users.Id_User, Users.Email, Administrators.FirstName, Administrators.LastName, Administrators.NumberPhone, Administrators.ImagePath",
      "Users.Id_User = ?",
      [id]
    );

    if (!admin.length) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res.status(200).json(admin[0]);
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  getClients,
  getOneClientById,
  getTranslators,
  getOneTranslatorById,
  updateUser,
  deleteUser,
  editImage,
  getTranslatorsByLanguages,
  getAdminById,
};
