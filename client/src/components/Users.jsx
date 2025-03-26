import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getClients, getTranslators } from "../services/usersData";

// CSS Styles
const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    flex: "1 1 auto",
    minWidth: "120px",
  },
  activeButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "1px solid #3b82f6",
  },
  tableContainer: {
    overflowX: "auto",
    width: "100%",
    marginBottom: "24px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    minWidth: "600px",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableHeaderCell: {
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s ease",
  },
  tableRowHover: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
  },
  actionButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    marginRight: "8px",
    transition: "background-color 0.2s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  modalHeading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
    textAlign: "center",
  },
  modalContent: {
    marginBottom: "16px",
  },
  userImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "16px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  closeButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "block",
    margin: "0 auto",
  },
  cardContainer: {
    display: "grid",
    gap: "10px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardHeader: {
    margin: "6px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
  cardText: {
    margin: "6px",
    fontSize: "14px",
    color: "#374151",
  },
  mobileActions: {
    display: "flex",
    gap: "10px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
  },
  paginationButton: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  activePaginationButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "1px solid #3b82f6",
  },
  paginationEllipsis: {
    padding: "8px 12px",
    fontSize: "14px",
    color: "#374151",
  },
};

function Users() {
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [role, setRole] = useState("client"); // Default: Show Clients
  const [selectedUser, setSelectedUser] = useState(null); // User to display in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch clients and translators simultaneously
        const [clientsResponse, translatorsResponse] = await Promise.all([
          getClients(token),
          getTranslators(token),
        ]);
        console.info(clientsResponse);
        // Normalize and combine data
        const normalizedClients = clientsResponse.map((client) => ({
          id: client.Id_User,
          firstName: client.FirstName,
          lastName: client.LastName,
          email: client.Email,
          phone: client.NumberPhone,
          image: client.ImagePath,
          role: "client", // Explicitly set role
        }));

        const normalizedTranslators = translatorsResponse.map((translator) => ({
          id: translator.Id_User,
          firstName: translator.FirstName,
          lastName: translator.LastName,
          email: translator.Email,
          phone: translator.NumberPhone,
          image: translator.ImagePath,
          motherLanguage: translator.MotherLanguage,
          languagesToTranslate: translator.LanguageToTranslate,
          tariffs: translator.Tariffs,
          role: "translator", // Explicitly set role
        }));

        // Combine and set users
        setUsers([...normalizedClients, ...normalizedTranslators]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [token]);

  useEffect(() => {
    setFilteredUsers(users.filter((user) => user.role === role));
  }, [role, users]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open modal with user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    // Add your delete logic here (e.g., call an API)
    setUsers(users.filter((user) => user.id !== userId));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Total number of pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of page numbers to show

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Users List</h2>

      {/* Buttons to Toggle Users */}
      <div style={styles.buttonGroup}>
        <button
          type="button"
          style={{
            ...styles.button,
            ...(role === "client" ? styles.activeButton : {}),
          }}
          onClick={() => setRole("client")}
        >
          Show Clients
        </button>
        <button
          type="button"
          style={{
            ...styles.button,
            ...(role === "translator" ? styles.activeButton : {}),
          }}
          onClick={() => setRole("translator")}
        >
          Show Translators
        </button>
      </div>

      {/* Users Table */}
      {screenWidth > 768 ? (
        <div style={{ ...styles.tableContainer, display: "block" }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Email</th>
                <th style={styles.tableHeaderCell}>Role</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={styles.tableCell}>{user.email}</td>
                  <td style={styles.tableCell}>{user.role}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtonGroup}>
                      <button
                        type="button"
                        style={styles.actionButton}
                        onClick={() => handleViewUser(user)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        style={{
                          ...styles.actionButton,
                          backgroundColor: "#dc2626",
                        }}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.cardContainer}>
          {currentUsers.map((user) => (
            <div key={user.id} style={styles.card}>
              <h3 style={styles.cardHeader}>
                {user.firstName} {user.lastName}
              </h3>
              <p style={styles.cardText}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={styles.cardText}>
                <strong>Role:</strong> {user.role}
              </p>
              <div style={styles.mobileActions}>
                <button
                  type="button"
                  style={styles.actionButton}
                  onClick={() => handleViewUser(user)}
                >
                  View
                </button>
                <button
                  type="button"
                  style={{ ...styles.actionButton, backgroundColor: "#dc2626" }}
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} style={styles.paginationEllipsis}>
              ...
            </span>
          ) : (
            <button
              key={index}
              style={{
                ...styles.paginationButton,
                ...(currentPage === page ? styles.activePaginationButton : {}),
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          )
        )}
        <button
          style={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeading}>User Details</h3>
            <div style={styles.modalContent}>
              <img
                src={selectedUser.image}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                style={styles.userImage}
              />
              <p>
                <strong>Name:</strong> {selectedUser.firstName}{" "}
                {selectedUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              {selectedUser.role === "translator" && (
                <>
                  <p>
                    <strong>Mother Language:</strong>{" "}
                    {selectedUser.motherLanguage}
                  </p>
                  <p>
                    <strong>Languages to Translate:</strong>{" "}
                    {selectedUser.languagesToTranslate}
                  </p>
                  <p>
                    <strong>Tariffs:</strong> {selectedUser.tariffs}
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              style={styles.closeButton}
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
