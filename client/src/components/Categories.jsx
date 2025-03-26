import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  deleteCategory,
  addCategory,
  getCategories,
} from "../services/connection";

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
    fontSize: "16px",
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
    marginBottom: "15px",
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

function Categories() {
  const [categories, setCategories] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    typeName: "",
    description: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id, token);
      setCategories(categories.filter((cat) => cat.Id_Type !== id));
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await addCategory(newCategory, token);
      const addedCategory = response.data.category;
      console.info(addedCategory);
      setCategories([
        ...categories,
        {
          Id_Type: addedCategory.Id_Type,
          Type_Name: addedCategory.Type_Name,
          Description: addedCategory.Description,
        },
      ]);

      setIsModalOpen(false);
      setNewCategory({ typeName: "", description: "" });
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Total number of pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of page numbers to show

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i += 1) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i += 1) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = totalPages - 3; i <= totalPages; i += 1) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Categories</h2>
      <button
        type="button"
        style={styles.actionButton}
        onClick={() => setIsModalOpen(true)}
      >
        Add Category
      </button>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Category Name</th>
              <th style={styles.tableHeaderCell}>Description</th>
              <th style={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat) => (
              <tr key={cat.Id_Type} style={styles.tableRow}>
                <td style={styles.tableCell}>{cat.Type_Name}</td>
                <td style={styles.tableCell}>{cat.Description}</td>
                <td style={styles.tableCell}>
                  <button
                    type="button"
                    style={styles.actionButton}
                    onClick={() => handleDelete(cat.Id_Type)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Professional Pagination */}
      <div style={styles.pagination}>
        <button
          type="button"
          style={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getPageNumbers().map((page) =>
          page === "..." ? (
            <span key={page} style={styles.paginationEllipsis}>
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
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
          type="button"
          style={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeading}>Add Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.typeName}
              onChange={(e) =>
                setNewCategory({ ...newCategory, typeName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Language Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <button
              type="button"
              style={styles.actionButton}
              onClick={handleAddCategory}
            >
              Add
            </button>
            <button
              type="button"
              style={styles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
