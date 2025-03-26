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
  const navigate = useNavigate();
  const fetchLanguages = async () => {
    try {
      const result = await getLanguages();
      setLanguages(result.data); // Assuming the response data is an array of languages
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  useEffect(() => {
    // Fetch languages only if the role is Translator
    if (roleUser === "translator") {
      fetchLanguages();
    }
  }, [roleUser]);

  const onSubmit = async (e) => {
    e.preventDefault();

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

      await registedUser(userData);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSubmit}>
        <h1 className="register-title">Créer un Nouveau Compte</h1>
        <div className="input-containers">
          <div>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="input-field"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              required
            />
            <input
              className="input-field"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              required
            />
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div>
            <label className="role-label">
              Choisissez votre rôle :
              <select
                value={roleUser}
                onChange={(e) => setRoleUser(e.target.value)}
                className="role-select"
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
                <option value="translator">Traducteur</option>
              </select>
            </label>
            <input
              className="input-field"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Numéro de téléphone"
              required
            />
            {/* Show translator-specific fields if the role is Translator */}
            {roleUser === "translator" && (
              <>
                <label>
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
                <label>
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
              </>
            )}
          </div>
        </div>
        <button type="submit" className="submit-button">
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;
