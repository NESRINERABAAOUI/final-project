import * as React from "react";
import { useEffect, useState } from "react";
import "../styles/admin-client.scss";

import { getClients } from "../services/usersData";

const ClientsComponent = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const clients = await getClients();
      setClients(clients);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="table-container">
            <h1>Clients</h1>
            <table border={1}>
              <thead>
                <tr>
                  <th>ID Traducteur</th>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Adresse</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.Id_Client}>
                    <td>{client.Id_Client}</td>
                    <td>{client.Email}</td>
                    <td>{client.FirstName}</td>
                    <td>{client.LastName}</td>
                    <td>{client.Adresse}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <button>Ajouter</button>
                  <button>Modifier</button>
                  <button>Supprimer</button>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsComponent;
