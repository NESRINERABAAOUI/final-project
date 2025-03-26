/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from "react";
import "../styles/Traducteur.scss";

import france from "../assets/images/france.png";
import italy from "../assets/images/italy.png";
import usa from "../assets/images/usa.png";
import germany from "../assets/images/germany.png";
import headerImg from "../assets/images/im1.jpg";
import permis from "../assets/images/documents/permis.png";
import diplome from "../assets/images/documents/diplome.jpg";
import naissance from "../assets/images/documents/naissance.jpg";
import note from "../assets/images/documents/note.jpg";
import famille from "../assets/images/documents/famille.jpg";
import medical from "../assets/images/documents/medical.jpg";
import CardDocument from "../components/CardDocument";
import image1 from "../assets/images/image1.jpeg";

export default function Traducteur() {
  const [traduction, setTraduction] = useState({
    from: "Francais",
    to: "Anglais",
    traducteur: 0,
    name: "Maitre Jenny Wilson",
  });

  const getFlag = (value) => {
    if (value === "Francais") {
      return france;
    }
    if (value === "Anglais") {
      return usa;
    }
    if (value === "Italien") {
      return italy;
    }
    if (value === "Allemand") {
      return germany;
    }
    return france;
  };

  return (
    <div className="traducteur-page">
      <section className="home-head-container">
        <img
          data-aos="fade-down"
          className="home-head-img"
          src={image1}
          alt="traduction"
        />
        <div className="trad-text-container">
          <h1 className="subtitle">
            Speaking together propose des services d’interprétariat
            professionnels aux entreprises opérant à l’échelle internationale.
          </h1>
          <p>
            Nous vous accompagnons lors de conférences, réunions de travail,
            programmes de formation, séminaires, salons ou autres événements.
            Grâce à notre solide réseau de collaborateurs, nous fournissons des
            services d’interprétariat dans plus de 150 langues. Nous
            sélectionnons les interprètes les plus qualifiés et adaptés à votre
            secteur d’activité, en mettant à profit notre expertise
            linguistique. Nous sommes spécialisés dans tous les types
            d’interprétariat :
            <ul>
              <li>Interprétation simultanée</li>
              <li>Interprétation consécutive</li>
              <li>Interprétation de liaison</li>
              <li>Chuchotage (interprétation chuchotée)</li>
              <li>Interprétation téléphonique</li>
            </ul>
          </p>
        </div>
      </section>
      <section className="home-devis-section-1">
        <h2>METTEZ-NOUS À L'ÉPREUVE</h2>
        <button
          className="home-traducteurs-button"
          type="button"
          onClick={() => {
            window.location.href = "/contact";
          }}
        >
          Contactez nous
        </button>
      </section>
      <section className="home-head-container">
        <div className="trad-text-container">
          <h1 className="subtitle">
            Obtenez une traduction certifiée fiable et rapide dès maintenant!
          </h1>
          <p>
            Besoin d'une traduction officielle reconnue par des institutions,
            des entreprises et des autorités légales dans le monde entier?
            Faites appel à notre service de traduction certifiée! Nos
            traducteurs assermentés, agréés ou accrédités garantissent
            l'exactitude et la fidélité de vos documents. Chaque traduction est
            accompagnée d'un cachet, d'une signature et d'une déclaration
            formelle pour une acceptation universelle. Ne perdez plus de temps,
            obtenez une traduction certifiée fiable et rapide dès maintenant!
          </p>
        </div>
        <img
          data-aos="fade-down"
          className="home-head-img"
          src={headerImg}
          alt="traduction"
        />
      </section>

      <section className="section-document">
        <div>
          <h1 className="subtitle">
            Nos services de traduction assermentée et certifiée
          </h1>
          <p>COMMANDEZ EN LIGNE SIMPLEMENT ET RAPIDEMENT</p>
        </div>
        <br />
        <div
          className="document-cards"
          data-aos="fade-up"
          data-aos-delay={1000}
        >
          <CardDocument src={permis} title=" PERMIS DE CONDUIRE" />
          <CardDocument src={diplome} title=" DIPLÔME" />
          <CardDocument src={naissance} title=" Acte de naissance" />
          <CardDocument src={note} title=" Bulletin de note" />
          <CardDocument src={famille} title=" Livret de famille" />
          <CardDocument src={medical} title=" Rapport médical" />
        </div>
      </section>
      <section className="home-traducteurs-section">
        <div className="home-traducteurs-div">
          <h1>Nos traducteurs certifiés</h1>
          <div style={{ display: "flex" }}>
            <select
              onChange={(e) =>
                setTraduction({ ...traduction, from: e.target.value })
              }
              id="country"
              className="home-select-traducteurs-left"
            >
              <option value="Francais">Francais</option>
              <option value="Anglais">Anglais</option>
              <option value="Italien">Italien</option>
              <option value="Allemand">Allemand</option>
            </select>
            <select
              onChange={(e) =>
                setTraduction({ ...traduction, to: e.target.value })
              }
              className="home-select-traducteurs-right"
            >
              <option value="Anglais">Anglais</option>
              <option value="Francais">Francais</option>
              <option value="Italien">Italien</option>
              <option value="Allemand">Allemand</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>De: </p>
            <img src={getFlag(traduction.from)} alt="img from" />
            <p>A: </p>
            <img src={getFlag(traduction.to)} alt="img from" />
          </div>

          <button
            onClick={() => {
              window.location.replace(`/login`);
            }}
            className="home-traducteurs-button"
            type="button"
          >
            Commencer Maintenant
          </button>
        </div>
      </section>
      {/*  */}
    </div>
  );
}
