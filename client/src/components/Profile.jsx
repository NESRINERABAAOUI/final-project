import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAdmin,
  getClientByID,
  getTranslatorById,
  updateUser,
  updateUserImage,
} from "../services/usersData";

// Responsive and professional inline styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
  },
  profileHeader: {
    marginBottom: "24px",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  editImageButton: {
    position: "absolute",
    bottom: "0",
    right: "0",
    backgroundColor: "#667eea",
    border: "2px solid #fff",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#764ba2",
    },
  },
  profileName: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "16px 0 8px",
    color: "#333",
  },
  profileRole: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  detailLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "#ff0000",
  },
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "24px",
    maxWidth: "400px",
    width: "90%", // Responsive width
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  },
  modalContent: {
    marginBottom: "24px",
  },
  modalImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  fileInput: {
    marginTop: "16px",
  },
  Input: {
    display: "block",
  },
  modalActions: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },
  modalButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#764ba2",
    },
  },
};

function Profile() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [newImage, setNewImage] = useState(null); // For previewing the image
  const [selectedFile, setSelectedFile] = useState(null); // For storing the actual file
  const { token, user } = useSelector((state) => state.auth);
  const [emailUpdate, setemailUpdate] = useState("");
  const [phoneUpdate, setPhoneUpdate] = useState("");
  useEffect(() => {
    async function fetchUserData() {
      try {
        let userdata;
        switch (user.role) {
          case "admin":
            userdata = await getAdmin(user.userId, token);
            break;
          case "client":
            userdata = await getClientByID(user.userId, token);
            break;
          case "translator":
            userdata = await getTranslatorById(user.userId, token);
            break;
          default:
            userdata = {};
            break;
        }
        setUserData(userdata);
        setemailUpdate(userdata.Email);
        setPhoneUpdate(userdata.NumberPhone);
      } catch (Error) {
        console.error("Failed to fetch user data:", Error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [token, user]);

  const handleEditImage = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setNewImage(null); // Reset the preview image
    setSelectedFile(null); // Reset the selected file
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file for upload
      setNewImage(URL.createObjectURL(file)); // Preview the new image
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    try {
      const result = await updateUserImage(selectedFile, user.userId, token);
      console.info("Image updated successfully:", result);
      // Update the user data with the new image path (if returned by the backend)
      setUserData((prevData) => ({
        ...prevData,
        ImagePath: result.imagePath, // Assuming the backend returns the new image path
      }));
    } catch (Error) {
      console.error("Failed to update image:", Error);
    }
  };

  const handleSaveImage = async () => {
    await handleUpdateImage(); // Upload the image
    handleCloseModal(); // Close the modal after saving
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>; // Simple loading text
  }

  if (error) {
    return <div style={styles.error}>{error}</div>; // Simple error message
  }

  const updateDataUser = async () => {
    try {
      await updateUser(
        user.userId,
        { Email: emailUpdate, NumberPhone: phoneUpdate },
        token
      );
      setIsModalEditOpen(!isModalEditOpen);
    } catch (e) {}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div style={styles.imageContainer}>
            <img
              src={
                userData.ImagePath
                  ? `http://localhost:3310/uploads/${userData.ImagePath}`
                  : ""
              }
              alt="Profile"
              style={styles.profileImage}
            />
            <button
              type="button"
              style={styles.editImageButton}
              onClick={handleEditImage}
            >
              ✏️
            </button>
          </div>
          <h1 style={styles.profileName}>
            {userData.FirstName} {userData.LastName}
          </h1>
          <p style={styles.profileRole}>{user.role}</p>
        </div>
        <div style={styles.profileDetails}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Email:</span>
            <span style={styles.detailValue}>{userData.Email}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Phone:</span>
            <span style={styles.detailValue}>{userData.NumberPhone}</span>
          </div>
          <button onClick={() => setIsModalEditOpen(!isModalEditOpen)}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Image Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Edit Profile Image</h2>
            <div style={styles.modalContent}>
              <img
                src={
                  newImage ||
                  (userData.ImagePath
                    ? `http://localhost:3310/uploads/${userData.ImagePath}`
                    : "")
                }
                alt="Current Profile"
                style={styles.modalImage}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
              />
            </div>
            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalButton}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                style={styles.modalButton}
                onClick={handleSaveImage}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalEditOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Edit Profile data</h2>
            <div style={styles.modalContent}>
              <input
                type="email"
                style={{
                  display: "block",
                  margin: "10px",
                  width: "80%",
                  padding: "12px 10px",
                }}
                value={emailUpdate}
                onChange={(e) => setemailUpdate(e.target.value)}
              />
              <input
                type="text"
                style={{
                  display: "block",
                  margin: "10px",
                  width: "80%",
                  padding: "12px 10px",
                }}
                value={phoneUpdate}
                onChange={(e) => setPhoneUpdate(e.target.value)}
              />
              <button
                type="button"
                style={styles.modalButton}
                onClick={() => setIsModalEditOpen(!isModalEditOpen)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={styles.modalButton}
                onClick={() => {
                  updateDataUser();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
