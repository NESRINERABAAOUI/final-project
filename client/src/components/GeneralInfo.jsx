import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getClients, getTranslators } from "../services/usersData";
import { getAlldocumentsByUser } from "../services/documents";
import "./GeneralInfo.css";

function GeneralInfo() {
  const { token } = useSelector((state) => state.auth);
  const [clientsNumber, setClientsNumber] = useState(0);
  const [translatorsNumber, setTranslatorsNumber] = useState(0);
  const [completedTariffs, setCompletedTariffs] = useState(0);
  const [pendingDocs, setPendingDocs] = useState(0);
  const [completedDocs, setCompletedDocs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clients, translators, completedDocs, pendingDocs] =
          await Promise.all([
            getClients(token),
            getTranslators(token),
            getAlldocumentsByUser("completed", token),
            getAlldocumentsByUser("pending", token),
          ]);

        setClientsNumber(clients.length);
        setTranslatorsNumber(translators.length);

        const totalTariffs = completedDocs.reduce(
          (sum, doc) => sum + (doc.Price || 0),
          0
        );

        setCompletedTariffs(totalTariffs);
        setPendingDocs(pendingDocs.length);
        setCompletedDocs(completedDocs.length);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (loading) {
    return <p className="loading">Chargement des données...</p>;
  }

  return (
    <div>
      <p className="paragraphe">Utilisateurs & Tarifs</p>
      <div className="cards">
        <InfoCard title="Clients" value={clientsNumber} />
        <InfoCard title="Traducteurs" value={translatorsNumber} />
        <InfoCard
          title="Tarifs complétés"
          value={completedTariffs.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <p className="paragraphe">Documents</p>
        <div className="cards">
          <InfoCard title="Documents en attente" value={pendingDocs} />
          <InfoCard title="Documents complétés" value={completedDocs} />
        </div>
      </div>
    </div>
  );
}

// Petit composant réutilisable pour les cartes
function InfoCard({ title, value }) {
  return (
    <div className="card">
      <div className="title">
        <p className="title-text">{title}</p>
      </div>
      <div className="data">
        <p>{value}</p>
      </div>
    </div>
  );
}

export default GeneralInfo;
