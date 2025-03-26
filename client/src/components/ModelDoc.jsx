/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import { getCategories, getLanguages } from "../services/connection";
import { getTranslatorsByLanguages } from "../services/usersData";
import { getTariffsByTranslatorAndType } from "../services/TariffService";
import { createDocument } from "../services/documents";
import { getTranslator } from "../services/trasnlators";

function ModelDoc({ setAddRequest, token }) {
  const [documentType, setDocumentType] = useState("");
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [languageToTranslate, setLanguageToTranslate] = useState("");
  const [originalFilePath, setOriginalFilePath] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [translators, setTranslators] = useState([]);
  const [selectedTranslator, setSelectedTranslator] = useState("");
  const [tariff, setTariff] = useState(null);
  const [Description, setDescription] = useState("");

  // Fetch languages and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesResult = await getLanguages();
        const categoriesResult = await getCategories();
        setLanguages(languagesResult.data);
        setCategories(categoriesResult.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch translators when original and target languages are selected
  useEffect(() => {
    const fetchTranslators = async () => {
      if (originalLanguage && languageToTranslate) {
        try {
          const result = await getTranslatorsByLanguages(
            originalLanguage,
            languageToTranslate
          );
          setTranslators(result.data);
        } catch (error) {
          console.error("Error fetching translators:", error);
        }
      }
    };
    fetchTranslators();
  }, [originalLanguage, languageToTranslate]);

  // Fetch tariff when translator and document type are selected
  useEffect(() => {
    const fetchTariff = async () => {
      if (selectedTranslator && documentType) {
        try {
          const result = await getTariffsByTranslatorAndType(
            selectedTranslator,
            documentType,
            token
          );
          setTariff(result.data[0]); // Assuming the API returns an array
        } catch (error) {
          console.error("Error fetching tariff:", error);
        }
      }
    };
    fetchTariff();
  }, [selectedTranslator, documentType, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!documentType) newErrors.documentType = "Document type is required.";
    if (!originalLanguage)
      newErrors.originalLanguage = "Original language is required.";
    if (!languageToTranslate)
      newErrors.languageToTranslate = "Target language is required.";
    if (!originalFilePath)
      newErrors.originalFilePath = "Original file is required.";
    if (wordCount <= 0)
      newErrors.wordCount = "Word count must be greater than 0.";
    if (!selectedTranslator) newErrors.translator = "Translator is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("originalLanguage", originalLanguage);
    formData.append("languageToTranslate", languageToTranslate);
    formData.append("originalFile", originalFilePath);
    formData.append("wordCount", wordCount);
    formData.append("translator", selectedTranslator);
    formData.append("Price", wordCount * tariff.RatePerWord);
    formData.append("Description", Description);

    // Submit data to API
    try {
      const response = await createDocument(formData, token);

      if (response) {
        alert("Document created successfully!");
        setAddRequest(false); // Close modal
      } else {
        alert("Error creating document.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Count words in text
  const countWords = (text) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginalFilePath(file);

    const fileType = file.type;

    if (fileType === "text/plain") {
      // Handle plain text files
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setWordCount(countWords(text));
      };
      reader.readAsText(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Handle DOCX files
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = await mammoth.extractRawText({
          arrayBuffer: event.target.result,
        });
        setWordCount(countWords(result.value));
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === "application/pdf") {
      // Handle PDF files
      const reader = new FileReader();
      reader.onload = async (event) => {
        const pdfBytes = new Uint8Array(event.target.result);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        let text = "";

        for (const page of pages) {
          text += page.getTextContent();
        }

        setWordCount(countWords(text));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert(
        "Unsupported file format. Please upload a .txt, .docx, or .pdf file."
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          width: "450px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
          Add New Translation Request
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Document Type */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#555" }}>
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
              required
            >
              <option value="">Select a document type</option>
              {categories.map((cat) => (
                <option key={cat.Id_Type} value={cat.Id_Type}>
                  {cat.Type_Name}
                </option>
              ))}
            </select>
            {errors.documentType && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.documentType}
              </span>
            )}
          </div>

          {/* Original Language */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#555" }}>
              Original Language
            </label>
            <select
              value={originalLanguage}
              onChange={(e) => setOriginalLanguage(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
              required
            >
              <option value="">Select original language</option>
              {languages.map((language) => (
                <option key={language.Id_Language} value={language.Id_Language}>
                  {language.Language_Name} (
                  {language.Language_Code.toUpperCase()})
                </option>
              ))}
            </select>
            {errors.originalLanguage && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.originalLanguage}
              </span>
            )}
          </div>

          {/* Target Language */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#555" }}>
              Target Language
            </label>
            <select
              value={languageToTranslate}
              onChange={(e) => setLanguageToTranslate(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
              required
            >
              <option value="">Select target language</option>
              {languages.map((language) => (
                <option key={language.Id_Language} value={language.Id_Language}>
                  {language.Language_Name} (
                  {language.Language_Code.toUpperCase()})
                </option>
              ))}
            </select>
            {errors.languageToTranslate && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.languageToTranslate}
              </span>
            )}
          </div>

          {/* File Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#555" }}>
              Original File
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
              required
            />
            {errors.originalFilePath && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.originalFilePath}
              </span>
            )}
          </div>

          {/* Translators */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#555" }}>
              Translators
            </label>
            <select
              value={selectedTranslator}
              onChange={(e) => setSelectedTranslator(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
              required
            >
              <option value="">Select a translator</option>
              {translators.map((translator) => (
                <option
                  key={translator.Id_Translator}
                  value={translator.Id_Translator}
                >
                  {translator.FirstName} {translator.LastName}
                </option>
              ))}
            </select>
            {errors.translator && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.translator}
              </span>
            )}
          </div>

          {/* Word Count and Price */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "500", color: "#555" }}>
                Word Count:
              </span>
              <span>{wordCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "500", color: "#555" }}>
                Price per word:
              </span>
              <span>{tariff ? `$${tariff.RatePerWord}` : "N/A"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "500", color: "#555" }}>
                Total Price:
              </span>
              <span>
                {tariff ? `$${wordCount * tariff.RatePerWord}` : "N/A"}
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontWeight: "500", color: "#555" }}>
              Description
            </label>
            <textarea
              value={Description} // Controlled input
              onChange={(e) => setDescription(e.target.value)} // Updates state on change
              style={{
                width: "100%",
                height: "30px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => setAddRequest(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#28a745",
                color: "white",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PropTypes validation
ModelDoc.propTypes = {
  setAddRequest: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default ModelDoc;
