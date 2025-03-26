import "../styles/admin-traducteur.scss";
import { useState, useEffect } from "react";
import { getTranslators } from "../services/usersData";

const TraducteurComponent = () => {
  const [traducteurs, setTraducteurs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const trads = await getTranslators();
      setTraducteurs(trads);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="traducteur-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>Traducteurs</h1>
          <table>
            <thead>
              <tr>
                <th>ID Traducteur</th>
                <th>Email</th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Language</th>
                <th>Adresse</th>
              </tr>
            </thead>
            <tbody>
              {traducteurs.map((trad) => (
                <tr key={trad.Id_Translator}>
                  <td>{trad.Id_Translator}</td>
                  <td>{trad.Email}</td>
                  <td>{trad.FirstName}</td>
                  <td>{trad.LastName}</td>
                  <td>{trad.Language}</td>
                  <td>{trad.Adresse}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <button>Ajouter</button>
                  <button>Modifier</button>
                  <button>Supprimer</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default TraducteurComponent;
