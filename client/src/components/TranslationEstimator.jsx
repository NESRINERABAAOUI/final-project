import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

function TranslationEstimator() {
  const [fileContent, setFileContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle file input and read file content
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file selected
    if (file) {
      const fileType = file.type; // Get the MIME type of the file
      setFileContent(""); // Clear previous content

      if (fileType.startsWith("text")) {
        // If it's a text-based file (like .txt, .md), use FileReader
        const reader = new FileReader();
        reader.onload = () => {
          setFileContent(reader.result); // Set the text content to state
          setErrorMessage("");
        };
        reader.onerror = () => {
          setErrorMessage("Error reading the file.");
        };
        reader.readAsText(file);
      } else if (fileType === "application/pdf") {
        // If it's a PDF file, use pdf.js to extract text
        readPdf(file);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // If it's a Word file, use mammoth.js to extract text
        readWord(file);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        // If it's a PowerPoint file (PPTX), you can use pptxgenjs or another library
        readPowerPoint(file);
      } else {
        setErrorMessage("Unsupported file type.");
      }
    }
  };

  // Function to extract text from PDF file
  const readPdf = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const typedArray = new Uint8Array(reader.result);
      pdfjsLib
        .getDocument(typedArray)
        .promise.then((pdf) => {
          let text = "";
          const numPages = pdf.numPages;
          const loadPage = (pageNum) => {
            pdf.getPage(pageNum).then((page) => {
              page.getTextContent().then((content) => {
                content.items.forEach((item) => {
                  text += item.str + " ";
                });

                if (pageNum < numPages) {
                  loadPage(pageNum + 1); // Load the next page
                } else {
                  setFileContent(text); // Once all pages are loaded, set the content
                }
              });
            });
          };
          loadPage(1); // Start loading from the first page
        })
        .catch((error) => {
          setErrorMessage("Error reading PDF.");
        });
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to extract text from Word (DOCX) file
  const readWord = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      mammoth
        .extractRawText({ arrayBuffer: reader.result })
        .then((result) => {
          setFileContent(result.value); // Set the extracted text
        })
        .catch(() => {
          setErrorMessage("Error reading Word file.");
        });
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to handle PowerPoint (PPTX) files (basic text extraction example)
  const readPowerPoint = (file) => {
    setErrorMessage("PowerPoint file handling is not yet implemented.");
    // You can use pptxgenjs or other libraries here for PPTX handling.
  };

  return (
    <div className="App">
      <h1>Read and View File Content</h1>
      <input
        type="file"
        accept=".txt,.md,.pdf,.docx,.pptx" // Specify file types you want to support
        onChange={handleFileChange}
      />
      {/* Display error message if any */}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      {/* Display file content */}
      {fileContent && (
        <div>
          <h2>File Content:</h2>
          <pre>{fileContent}</pre>{" "}
          {/* Show the content in a preformatted block */}
        </div>
      )}
    </div>
  );
}

export default TranslationEstimator;
