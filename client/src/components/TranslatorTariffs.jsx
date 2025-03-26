import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getTariffsByTranslator,
  addTariff,
  updateTariff,
  deleteTariff,
} from "../services/TariffService";
import { getTranslatorById } from "../services/usersData";
import { getCategories } from "../services/connection";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  toggleButton: {
    display: "block",
    margin: "10px auto",
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  input: {
    padding: "5px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    padding: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    marginRight: "5px",
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
    width: "300px",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
function TranslatorTariffs() {
  const [tariffs, setTariffs] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showTariffs, setShowTariffs] = useState(true);
  const [newTariff, setNewTariff] = useState({ Id_Type: "", RatePerWord: "" });
  const [editingTariff, setEditingTariff] = useState(null);
  const { token, user } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({});
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userdata = await getTranslatorById(user.userId, token);
        setUserData(userdata);

        const categoriesData = await getCategories();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user.userId, token, refresh]);

  useEffect(() => {
    if (userData.Id_Translator) {
      getTariffsByTranslator(userData.Id_Translator, token)
        .then((response) => {
          setTariffs(response.data);
          setDocumentTypes(
            categories.filter(
              (type) =>
                !response.data.some((tariff) => tariff.Id_Type === type.Id_Type)
            )
          );
        })
        .catch((error) => console.error("Error fetching tariffs:", error));
    }
  }, [userData.Id_Translator, categories, token, refresh]);

  const handleAddTariff = async () => {
    if (!newTariff.Id_Type || !newTariff.RatePerWord) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addTariff(
        { ...newTariff, Id_Translator: userData.Id_Translator },
        token
      );
      setNewTariff({ Id_Type: "", RatePerWord: "" });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error adding tariff:", error);
    }
  };

  const handleUpdateTariff = async () => {
    if (!editingTariff) return;
    try {
      await updateTariff(editingTariff.Id_Tariff, editingTariff, token);
      setEditingTariff(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating tariff:", error);
    }
  };

  const handleDeleteTariff = async (id) => {
    try {
      await deleteTariff(id, token);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting tariff:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Translator Tariffs</h2>
      <button
        type="button"
        style={styles.toggleButton}
        onClick={() => setShowTariffs(!showTariffs)}
      >
        {showTariffs ? "Show Types Without Tariffs" : "Show Types With Tariffs"}
      </button>

      {showTariffs ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Rate Per Word</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((tariff) => (
              <tr key={tariff.Id_Tariff} style={{ textAlign: "center" }}>
                <td>{tariff.Type_Name}</td>
                <td>
                  {editingTariff?.Id_Tariff === tariff.Id_Tariff ? (
                    <input
                      type="number"
                      value={editingTariff.RatePerWord}
                      onChange={(e) =>
                        setEditingTariff({
                          ...editingTariff,
                          RatePerWord: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  ) : (
                    `$${tariff.RatePerWord} per word`
                  )}
                </td>
                <td>
                  {editingTariff?.Id_Tariff === tariff.Id_Tariff ? (
                    <>
                      <button
                        type="button"
                        style={styles.saveButton}
                        onClick={handleUpdateTariff}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        style={styles.cancelButton}
                        onClick={() => setEditingTariff(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        style={styles.editButton}
                        onClick={() => setEditingTariff(tariff)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={() => handleDeleteTariff(tariff.Id_Tariff)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <h3>Document Types Without Tariffs</h3>
          <ul style={styles.list}>
            {documentTypes.map((type) => (
              <li key={type.Id_Type} style={styles.listItem}>
                {type.Type_Name} ( {type.Description} )
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => setNewTariff(type)}
                >
                  Add Tariff
                </button>
              </li>
            ))}
          </ul>
          {newTariff.Id_Type && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <h3>Add New Tariff</h3>
                <h6>{newTariff.Type_Name}</h6>
                <input
                  type="number"
                  placeholder="Rate Per Word"
                  value={newTariff.RatePerWord}
                  onChange={(e) =>
                    setNewTariff({ ...newTariff, RatePerWord: e.target.value })
                  }
                  style={styles.input}
                />
                <button
                  type="button"
                  style={styles.saveButton}
                  onClick={handleAddTariff}
                >
                  Submit
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setNewTariff({})}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Styles in the same file

export default TranslatorTariffs;
