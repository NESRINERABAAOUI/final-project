import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import ModelDoc from "./ModelDoc";
import {
  getAlldocumentsByUser,
  updateDocumentStatus,
  uploadTranslationFile,
} from "../services/documents";
import UploadTranslationModal from "./UploadTranslationModal";

// Constants
const statusList = [
  "pending",
  "translator_assigned",
  "translation_in_progress",
  "translation_completed",
  "cancelled",
  "completed",
];

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
`;

const Button = styled.button`
  background-color: ${({ bgColor }) => bgColor || "#3b82f6"};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  margin-top: 10px;
  margin-right: 8px;
  margin-left: ${({ ml }) => ml || "0"};
`;

const StatusTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
`;

const StatusTab = styled.div`
  padding: 10px 20px;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#e5e7eb")};
  color: ${({ active }) => (active ? "white" : "#4b5563")};
  cursor: pointer;
  font-size: 14px;
  transition:
    background-color 0.3s,
    color 0.3s;
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RequestCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === "completed"
      ? "#d1fae5"
      : status === "cancelled"
        ? "#fee2e2"
        : "#dbeafe"};
  color: ${({ status }) =>
    status === "completed"
      ? "#065f46"
      : status === "cancelled"
        ? "#991b1b"
        : "#1e40af"};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageNumber = styled.button`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? "#3b82f6" : "white")};
  color: ${({ active }) => (active ? "white" : "#1a1a1a")};
  cursor: pointer;
  font-size: 14px;
  transition:
    background-color 0.3s,
    color 0.3s;
`;

const NoRequests = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 16px;
`;

function Requests() {
  const { token, user } = useSelector((state) => state.auth);
  const [addRequest, setAddRequest] = useState(false);
  const [status, setStatus] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(4);
  const [refresh, setRefresh] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    try {
      const req = await getAlldocumentsByUser(status, token);
      setRequests(req);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [status, token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, status, refresh, fetchRequests]);

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle status updates
  const handleStatusUpdate = useCallback(
    async (docId, newStatus) => {
      try {
        await updateDocumentStatus(docId, newStatus, token);
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error updating document status:", error);
      }
    },
    [token]
  );

  // Handle viewing the file
  const handleViewFile = (filePath) => {
    const fullFilePath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    const fileUrl = `http://localhost:3310${fullFilePath}`;
    window.open(fileUrl, "_blank");
  };
  const handleOpenUploadModal = (docId) => {
    setSelectedDocId(docId);
    setUploadModalOpen(true);
  };

  // Handle file upload
  const handleUploadTranslationFile = async (docId, file) => {
    try {
      await uploadTranslationFile(docId, file, token); // Call the backend API
      setRefresh((prev) => !prev); // Refresh the requests list
    } catch (error) {
      console.error("Error uploading translation file:", error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Translation Requests</Title>
        {user.role === "client" && (
          <Button bgColor="#3b82f6" onClick={() => setAddRequest(true)}>
            Add Request
          </Button>
        )}
      </Header>

      <StatusTabs>
        {statusList.map((stat) => (
          <StatusTab
            key={stat}
            active={stat === status}
            onClick={() => {
              setStatus(stat);
              setCurrentPage(1);
            }}
          >
            {stat.replace(/_/g, " ")}
          </StatusTab>
        ))}
      </StatusTabs>

      <RequestsList>
        {currentRequests.length > 0 ? (
          currentRequests.map((doc) => (
            <RequestCard key={doc.Id_Doc}>
              <div>
                {user.role === "client" && (
                  <p>
                    <strong>Translator:</strong> {doc.TranslatorFirstName}{" "}
                    {doc.TranslatorLastName} - {doc.TranslatorNumberPhone}
                  </p>
                )}
                {user.role === "translator" && (
                  <p>
                    <strong>Client:</strong> {doc.ClientFirstName}{" "}
                    {doc.ClientLastName} - {doc.ClientNumberPhone}
                  </p>
                )}
                {user.role === "admin" && (
                  <>
                    <p>
                      <strong>Client:</strong> {doc.ClientFirstName}{" "}
                      {doc.ClientLastName} - {doc.ClientNumberPhone}
                    </p>
                    <p>
                      <strong>Translator:</strong> {doc.TranslatorFirstName}{" "}
                      {doc.TranslatorLastName} - {doc.TranslatorNumberPhone}
                    </p>
                  </>
                )}
                <p>
                  <strong>Type:</strong> {doc.Type_Name}
                </p>
                <p>
                  <strong>Original Language:</strong> {doc.OriginalLanguage}
                </p>
                <p>
                  <strong>Target Language:</strong> {doc.TargetLanguage}
                </p>
                <p>
                  <strong>Description:</strong> {doc.DocumentDescription}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={doc.Status}>
                    {doc.Status.replace(/_/g, " ")}
                  </StatusBadge>
                </p>
                <p>
                  <strong>Price:</strong> ${doc.Price}
                </p>
                <Button
                  bgColor="#10b981"
                  onClick={() => handleViewFile(doc.Original_File_Path)}
                >
                  View Original File
                </Button>
                {doc.Status === "completed" && (
                  <Button
                    bgColor="#10b981"
                    onClick={() => handleViewFile(doc.Translated_File_Path)}
                  >
                    View Tanslation File
                  </Button>
                )}
                {user.role === "admin" && doc.Status === "pending" && (
                  <>
                    <Button
                      onClick={() =>
                        handleStatusUpdate(doc.Id_Doc, "translator_assigned")
                      }
                    >
                      Assign Translator
                    </Button>
                    <Button
                      bgColor="#ff0000"
                      ml="10px"
                      onClick={() =>
                        handleStatusUpdate(doc.Id_Doc, "cancelled")
                      }
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {user.role === "translator" &&
                  doc.Status === "translator_assigned" && (
                    <>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            doc.Id_Doc,
                            "translation_in_progress"
                          )
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        bgColor="#ff0000"
                        ml="10px"
                        onClick={() =>
                          handleStatusUpdate(doc.Id_Doc, "cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                {user.role === "client" &&
                  (doc.Status === "pending" ||
                    doc.Status === "translator_assigned") && (
                    <Button
                      bgColor="#ff0000"
                      onClick={() =>
                        handleStatusUpdate(doc.Id_Doc, "cancelled")
                      }
                    >
                      Cancel
                    </Button>
                  )}
                {user.role === "translator" &&
                  doc.Status === "translation_in_progress" && (
                    <>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            doc.Id_Doc,
                            "translation_completed"
                          )
                        }
                      >
                        Complete
                      </Button>
                      <Button
                        bgColor="#ff0000"
                        ml="10px"
                        onClick={() =>
                          handleStatusUpdate(doc.Id_Doc, "cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                {user.role === "translator" &&
                  doc.Status === "translation_completed" && (
                    <Button onClick={() => handleOpenUploadModal(doc.Id_Doc)}>
                      Add the translation file
                    </Button>
                  )}
              </div>
            </RequestCard>
          ))
        ) : (
          <NoRequests>No requests found.</NoRequests>
        )}
      </RequestsList>

      <Pagination>
        {Array.from(
          { length: Math.ceil(requests.length / requestsPerPage) },
          (_, i) => (
            <PageNumber
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </PageNumber>
          )
        )}
      </Pagination>

      {uploadModalOpen && (
        <UploadTranslationModal
          onClose={() => setUploadModalOpen(false)}
          onSubmit={handleUploadTranslationFile}
          docId={selectedDocId}
        />
      )}
      {addRequest && <ModelDoc setAddRequest={setAddRequest} token={token} />}
    </Container>
  );
}

export default Requests;
