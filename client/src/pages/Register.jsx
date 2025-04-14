import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.scss";
import { registedUser, getLanguages } from "../services/connection";

function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [languageToTranslate, setLanguageToTranslate] = useState("");
  const [motherLanguage, setMotherLanguage] = useState("");
  const [roleUser, setRoleUser] = useState("");
  const [password, setPassword] = useState("");
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const navigate = useNavigate();

  const fetchLanguages = async () => {
    try {
      const result = await getLanguages();
      setLanguages(result.data); // Assuming the response data is an array of languages
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValidation({
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    });

    return (
      minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Email invalide";
    }
    if (!validatePassword(password)) {
      newErrors.password =
        "Le mot de passe ne respecte pas les exigences de sécurité";
    }
    if (!firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!number.match(/^\d+$/)) {
      newErrors.number =
        "Le numéro de téléphone doit contenir uniquement des chiffres";
    }
    if (!roleUser) {
      newErrors.roleUser = "Veuillez sélectionner un rôle";
    }
    if (roleUser === "translator") {
      if (!languageToTranslate) {
        newErrors.languageToTranslate = "Sélectionnez une langue à traduire";
      }
      if (!motherLanguage) {
        newErrors.motherLanguage = "Sélectionnez votre langue maternelle";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Fetch languages only if the role is Translator
    if (roleUser === "translator") {
      fetchLanguages();
    }
  }, [roleUser]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = {
        Email: email,
        Role: roleUser,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        NumberPhone: number,
      };

      // Add additional fields for translators
      if (roleUser === "translator") {
        userData.LanguageToTranslate = languageToTranslate;
        userData.MotherLanguage = motherLanguage;
      }

      const response = await registedUser(userData);

      // If registration is successful, navigate to login
      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      // Handle backend errors
      if (error.response && error.response.status === 400) {
        // Parse the backend error response
        const backendErrors = error.response.data.message || {};
        console.info(backendErrors);
        setErrors((prevErrors) => ({ ...prevErrors, email: backendErrors }));
      } else {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSubmit}>
        <h1 className="register-title">Créer un Nouveau Compte</h1>
        <div className="input-containers">
          <div style={{ marginRight: "20px" }}>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            <input
              className="input-field"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              required
            />
            {errors.firstName && (
              <p style={{ color: "red" }}>{errors.firstName}</p>
            )}
            <input
              className="input-field"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              required
            />
            {errors.lastName && (
              <p style={{ color: "red" }}>{errors.lastName}</p>
            )}
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              placeholder="Mot de passe"
              required
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
            {/* Password validation feedback */}
            <div className="password-validation">
              <p
                style={{
                  color: passwordValidation.minLength ? "green" : "red",
                }}
              >
                • Au moins 8 caractères
              </p>
              <p
                style={{
                  color: passwordValidation.hasUppercase ? "green" : "red",
                }}
              >
                • Au moins une lettre majuscule
              </p>
              <p
                style={{
                  color: passwordValidation.hasLowercase ? "green" : "red",
                }}
              >
                • Au moins une lettre minuscule
              </p>
              <p
                style={{
                  color: passwordValidation.hasNumber ? "green" : "red",
                }}
              >
                • Au moins un chiffre
              </p>
              <p
                style={{
                  color: passwordValidation.hasSpecialChar ? "green" : "red",
                }}
              >
                • Au moins un caractère spécial (!@#$%^&*)
              </p>
            </div>
          </div>
          <div>
            <select
              value={roleUser}
              onChange={(e) => setRoleUser(e.target.value)}
              className=" role-label role-select"
              required
            >
              <option value="">Sélectionner un rôle</option>
              <option value="client">Client</option>
              <option value="translator">Traducteur</option>
            </select>

            {errors.roleUser && (
              <p style={{ color: "red" }}>{errors.roleUser}</p>
            )}
            <input
              className="input-field"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Numéro de téléphone"
              required
            />
            {errors.number && <p style={{ color: "red" }}>{errors.number}</p>}
            {/* Show translator-specific fields if the role is Translator */}
            {roleUser === "translator" && (
              <>
                <label className="role-label">
                  Langues à traduire :
                  <select
                    value={languageToTranslate}
                    onChange={(e) => setLanguageToTranslate(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Sélectionner une langue</option>
                    {languages.map((language) => (
                      <option
                        key={language.Id_Language}
                        value={language.Id_Language}
                      >
                        {language.Language_Name} (
                        {language.Language_Code.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </label>
                {errors.languageToTranslate && (
                  <p style={{ color: "red" }}>{errors.languageToTranslate}</p>
                )}
                <label className="role-label">
                  Langue maternelle :
                  <select
                    value={motherLanguage}
                    onChange={(e) => setMotherLanguage(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Sélectionner une langue</option>
                    {languages.map((language) => (
                      <option
                        key={language.Id_Language}
                        value={language.Id_Language}
                      >
                        {language.Language_Name} ({language.Language_Code})
                      </option>
                    ))}
                  </select>
                </label>
                {errors.motherLanguage && (
                  <p style={{ color: "red" }}>{errors.motherLanguage}</p>
                )}
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit" className="submit-button">
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
