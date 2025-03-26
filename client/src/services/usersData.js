import axios from "axios";

export const getTranslators = async (token) => {
  const translators = await axios.get(
    "http://localhost:3310/api/users/translators",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return translators.data;
};

export const getClients = async (token) => {
  const clients = await axios.get("http://localhost:3310/api/users/clients", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return clients.data;
};

export const getTranslatorById = async (id, token) => {
  const translators = await axios.get(
    `http://localhost:3310/api/users/translators/oneTranslator/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return translators.data;
};

export const updateTraducteur = async (data, token) => {
  const client = await axios.put(
    "http://localhost:3310/api/users/translators",
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return client.data;
};
export const deleteTraducteur = async (id, token) => {
  const Traducteur = await axios.delete(
    "http://localhost:3310/api/users/translators",
    "/",
    id,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return Traducteur.data;
};

export const getClientByID = async (id, token) => {
  const client = await axios.get(
    `http://localhost:3310/api/users/clients/oneClient/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return client.data;
};

export const updateClient = async (data, token) => {
  const client = await axios.put(
    "http://localhost:3310/api/users/clients",
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return client.data;
};
export const deleteClient = async (id, token) => {
  const client = await axios.delete(
    "http://localhost:3310/api/users/clients",
    "/",
    id,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return client;
};

export const getAdmin = async (id, token) => {
  const admin = await axios.get(
    `http://localhost:3310/api/users/admins/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return admin.data;
};

export const updateUser = async (id, data, token) => {
  const admin = await axios.put(`http://localhost:3310/api/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return admin.data;
};
export const deleteAdmin = async (id, token) => {
  const admin = await axios.delete(
    "http://localhost:3310/api/users/admins",
    "/",
    id,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return admin;
};

export const updateUserImage = async (file, userId, token) => {
  const formData = new FormData();
  formData.append("image", file); // Append the file to FormData

  try {
    const response = await axios.put(
      `http://localhost:3310/api/users/editimage/${userId}`, // Replace with your backend endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      }
    );

    return response.data; // Return the response data (e.g., new image path)
  } catch (error) {
    console.error("Error updating image:", error);
    throw error; // Re-throw the error for handling in the calling component
  }
};

export const getTranslatorsByLanguages = async (
  motherLanguage,
  languageToTranslate
) => {
  try {
    console.info(motherLanguage, languageToTranslate);
    const result = await axios.get(
      "http://localhost:3310/api/users/translatorsbyLanguages",
      { params: { motherLanguage, languageToTranslate } }
    );
    return result;
  } catch (error) {
    console.error("Error updating image:", error);
    throw error; // Re-throw the error for handling in the calling component
  }
};
