import React, { useEffect, useState } from "react";
import { getClients, getTranslators } from "../services/usersData";
import { useSelector } from "react-redux";
import "./GeneralInfo.css";
import { getAlldocumentsByUser } from "../services/documents";

const GeneralInfo = () => {
  const { token } = useSelector((state) => state.auth);
  const [clientsNumber, setClientsNumber] = useState(0);
  const [TranslatorsNumber, setTranslatorsNumber] = useState(0);
  const [completedTariffs, setCompletedTariffs] = useState(0);
  const [pendingDocs, setPendingDocs] = useState(0);
  const [completedDocs, setCompletedDocs] = useState(0);
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
        const total = completedDocs.reduce(
          (accu, currentValue) => accu + currentValue.Price,
          0
        );
        setCompletedTariffs(total);
        setPendingDocs(pendingDocs.length);
        setCompletedDocs(completedDocs.length);
      } catch (e) {}
    }
    fetchData();
  }, []);
  return (
    <div>
      <p className="paragraphe">Users & Tariffs</p>
      <div className="cards">
        <div className="card">
          <div className="title">
            <p className="title-text">Clients</p>
          </div>
          <div className="data">
            <p>{clientsNumber}</p>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p className="title-text">Translators</p>
          </div>
          <div className="data">
            <p>{TranslatorsNumber}</p>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p className="title-text">Completed Tariffs</p>
          </div>
          <div className="data">
            <p>{completedTariffs}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p className="paragraphe">Documents</p>
        <div className="cards">
          <div className="card">
            <div className="title">
              <p className="title-text">Pending Documents</p>
            </div>
            <div className="data">
              <p>{pendingDocs}</p>
            </div>
          </div>
          <div className="card">
            <div className="title">
              <p className="title-text">Completed Documents</p>
            </div>
            <div className="data">
              <p>{completedDocs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
