/* eslint-disable import/prefer-default-export */
import axios from "axios";

const API_URL = "http://localhost:3310/api/documents"; // Change to your backend URL

export const createDocument = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return only the response data
  } catch (error) {
    console.error("Error creating document:", error);
    throw error; // Rethrow for handling in the caller function
  }
};
export const getAlldocumentsByUser = async (status, token) => {
  try {
    const response = await axios.get(`${API_URL}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return only the response data
  } catch (error) {
    console.error("Error creating document:", error);
    throw error; // Rethrow for handling in the caller function
  }
};

export const updateDocumentStatus = async (docId, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${docId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return only the response data
  } catch (error) {
    console.error("Error creating document:", error);
    throw error; // Rethrow for handling in the caller function
  }
};
export const uploadTranslationFile = async (docId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.put(
      `${API_URL}/${docId}/upload-translation`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to upload translation file"
    );
  }
};
