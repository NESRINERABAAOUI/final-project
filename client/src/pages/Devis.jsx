import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Devis.scss";
import france from "../assets/images/france.png";
import italy from "../assets/images/italy.png";
import usa from "../assets/images/usa.png";
import germany from "../assets/images/germany.png";
import { createDevis } from "../services/devis";
import DevisCard from "../components/DevisCard";
import { getTranslators } from "../services/trasnlators";
import TranslationEstimator from "../components/TranslationEstimator";
import { useNavigate } from "react-router-dom";

// Helper function to get the flag image based on language
const getFlag = (value) => {
  switch (value) {
    case "Français":
      return france;
    case "Anglais":
      return usa;
    case "Italien":
      return italy;
    case "Allemand":
      return germany;
    default:
      return france;
  }
};

// Simulated function to copy file to uploads folder (Server-side handling needed in real use)
const copyFileToUploads = async (file) => {
  const uploadPath = `/uploads/${file.name}`;
  return uploadPath;
};

function Devis() {
  const [traduction, setTraduction] = useState({
    from: "Français",
    to: "Anglais",
    traducteur:
      "/src/assets/images/2.jpg" ||
      JSON.parse(window.localStorage.getItem("trad"))?.img,
    traducteurName:
      "Maître Leslie Alexander" ||
      JSON.parse(window.localStorage.getItem("trad"))?.name,
  });

  const [devisData, setDevisData] = useState({
    Email: "",
    Id_Translator: 1,
    FirstClientName: "",
    LastClientName: "",
    Language_Doc: "Anglais",
    FileType: "",
    FilePath: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [translators, setTranslators] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    const getTranslatorsList = async () => {
      try {
        const translatorsData = await getTranslators();
        if (translatorsData) {
          setTranslators(translatorsData);
        }
      } catch (error) {
        console.error("Failed to fetch translators:", error);
      }
    };
    getTranslatorsList();
  }, []);

  useEffect(() => {
    const getData = () => {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      const to = params.get("to");

      const traducteurNameAndImg = JSON.parse(
        window.localStorage.getItem("trad")
      );

      if (from && to) {
        setTraduction((prevTraduction) => ({
          ...prevTraduction,
          from,
          to,
        }));

        if (traducteurNameAndImg?.img && traducteurNameAndImg?.name) {
          setTraduction((prevTraduction) => ({
            ...prevTraduction,
            traducteurName: traducteurNameAndImg.name,
            traducteur: traducteurNameAndImg.img,
          }));
        }
      }
    };

    getData();
  }, []);

  const notify = (message) => toast(message);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileType = file.type;

      try {
        const filePath = await copyFileToUploads(file); // Copy file and get the new path

        // Update the devisData state with the new file path and file type
        setDevisData((prevData) => ({
          ...prevData,
          FileType: fileType,
          FilePath: filePath,
        }));
      } catch (error) {
        console.error("Error copying file:", error);
        notify("Failed to copy the file");
      }
    }
  };

  const handleSendDevis = async () => {
    if (!selectedFile) {
      notify("Please upload a file before submitting");
      return;
    }
    try {
      const response = await createDevis(devisData);
      if (response.data) {
        notify(`Devis: ${response.data.devis}`);
      } else {
        notify("Error: Unable to create devis");
      }
    } catch (error) {
      console.error("Error: ", error);
      notify("An error occurred while sending the devis");
    }
  };

  return (
    <div className="devis-main-container">
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2%",
            marginBottom: "2%",
          }}
        >
          <DevisCard
            src="frensh"
            language="traduction juridique"
            description=" 
							Notre agence de traduction juridique est spécialisée dans la traduction de documents officiels et légaux, garantissant précision, rigueur et conformité aux systèmes juridiques concernés. Nous mettons à votre disposition des traducteurs experts, maîtrisant le vocabulaire juridique et certifiés pour la traduction de contrats, décisions de justice, statuts d’entreprise, actes notariés et autres documents légaux."
          />
          <DevisCard
            src="english"
            language="traduction médicale"
            description=" 
							  Notre agence de traduction médicale se spécialise dans la traduction précise et rigoureuse de documents liés au domaine de la santé et des sciences médicales. Nous collaborons avec des traducteurs experts, maîtrisant parfaitement la terminologie médicale et les exigences réglementaires de chaque pays. Que ce soit pour des rapports médicaux, des études cliniques, des notices de médicaments ou des documents de recherche."
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2%",
            marginBottom: "2%",
          }}
        >
          <DevisCard
            src="italien"
            language=" la traduction de documents personnels et officiels"
            description=" 
							Notre agence de traduction offre des services professionnels pour la traduction de documents personnels et officiels, garantissant précision, confidentialité et conformité aux exigences administratives. Nous traduisons une large gamme de documents, tels que actes de naissance, diplômes, contrats, passeports, certificats de mariage et jugements légaux, en assurant une fidélité parfaite au texte original."
          />
          <DevisCard
            src={france}
            language="traduction technique"
            description=" 
							Notre agence de traduction est spécialisée dans la traduction technique, financière, économique et marketing, offrant des services de haute précision adaptés aux besoins des entreprises et des professionnels.Que ce soit pour des rapports financiers, études de marché, documents techniques ou contenus publicitaires."
          />
        </div>
      </section>
      <section className="devis-head-section">
        <div>
          <h1 className="devis-title">La traduction certifiée</h1>
          <h2 className="devis-subtitle">
            Obtenez une traduction certifiée fiable et rapide dès MAINTENANT!
          </h2>
          <p className="devis-description">
            Ne perdez plus de temps, obtenez une traduction certifiée fiable et
            rapide dès maintenant!
          </p>
          <button
            type="button"
            className="devis-button"
            onClick={() => nav("/login")}
          >
            Commencer maintenant
          </button>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
}

export default Devis;
