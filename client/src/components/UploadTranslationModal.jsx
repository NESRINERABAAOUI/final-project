import { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const FileInput = styled.input`
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

function UploadTranslationModal({ onClose, onSubmit, docId }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit(docId, file);
      onClose();
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Upload Translation File</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <FileInput type="file" onChange={handleFileChange} />
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default UploadTranslationModal;
