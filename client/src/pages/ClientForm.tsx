import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  updateAdmin,
  updateClient,
  updateTraducteur,
} from "../services/usersData";
import "../styles/ClientForm.scss";

const ClientForm = ({ onUpdateSuccess }) => {
  const { isLoggedIn } = useAuth();
  const connectedUser = JSON.parse(localStorage.getItem("Profile_User") || "");
  const [clientData, setClientData] = useState({
    userId: connectedUser.userId,
    role: connectedUser.roleUser,
    firstName: connectedUser.firstName,
    lastName: connectedUser.lastName,
    email: connectedUser.email,
    phone: connectedUser.phoneNumber,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (clientData.role == "C") {
        response = await updateClient(clientData);
      } else if (clientData.role == "T") {
        response = await updateTraducteur(clientData);
      } else if (clientData.role == "A") {
        response = await updateAdmin(clientData);
      }

      if (response != undefined && response.data) {
        //onUpdateSuccess();
        setClientData({
          role: clientData.role,
          userId: clientData.userId,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
        });

        if (connectedUser && connectedUser.token) {
          (connectedUser.role = clientData.role),
            (connectedUser.userId = clientData.userId),
            (connectedUser.firstName = clientData.firstName),
            (connectedUser.lastName = clientData.lastName),
            (connectedUser.email = clientData.email),
            (connectedUser.phone = clientData.phone),
            localStorage.setItem("Profile_User", JSON.stringify(connectedUser));
        }
      } else {
        setError(!response || "Update failed");
      }
    } catch (error) {
      setError("An error occurred while updating client data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-form">
      <h2>Update User Information</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={clientData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={clientData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={clientData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={clientData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update user"}
        </button>
      </form>
    </div>
  );
};

export default ClientForm;
