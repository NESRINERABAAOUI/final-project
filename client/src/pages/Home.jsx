/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-unresolved */
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import card1Img from "../assets/images/card1.png";
import card2Img from "../assets/images/card2.jpg";
import card3Img from "../assets/images/card3.jpg";
import swiper1 from "../assets/images/documents/1.jpg";
import swiper2 from "../assets/images/documents/2.png";
import swiper3 from "../assets/images/documents/3.png";
import swiper4 from "../assets/images/documents/4.png";

import homeHeader1 from "../assets/images/home.png";
import homeHeader2 from "../assets/images/home1.png";
import HoverCard from "../components/HoverCard";
import "../styles/Home.scss";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="home-header-section">
        <div data-aos="fade-right" data-aos-delay={400}>
          <h3 className="subtitle">
            Des Services de Traduction et d'Interprétariat de Qualité Supérieure
          </h3>
          <h1 className="home-header-section-title">
            Finalisez votre Traduction dés MAINTENANT
          </h1>
          <p className="home-header-section-subtitle">
            Déposez vos documents en toute simplicité et recevez des traductions
            professionnelles dans les meilleurs délais.
          </p>
          <div className="home-header-section-btns">
            <button
              className="home-header-section-btn1"
              type="button"
              onClick={() => window.location.replace("/devis")}
            >
              Essayer Maintenant
            </button>
            <button
              className="home-header-section-btn2"
              type="button"
              onClick={() => navigate("/contact")}
            >
              Contacter un specialiste
            </button>
          </div>
        </div>
        <div className="home-header-section-imgs">
          <div className="home-header-section-img1-container">
            <img
              data-aos="fade-down"
              data-aos-delay={400}
              src={homeHeader1}
              alt=""
              className="header-img1"
            />
          </div>
          <div className="home-header-section-img2-container">
            <img
              data-aos="fade-up"
              data-aos-delay={400}
              src={homeHeader2}
              alt=""
              className="header-img2"
            />
          </div>
        </div>
      </section>

      <section className="home-video-section">
        <Swiper
          modules={[Navigation]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <img
              style={{
                height: "60dvh",
                width: "100%",
                objectFit: "cover",
              }}
              src={swiper1}
              alt="Slide 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              style={{
                height: "60dvh",
                width: "100%",
                objectFit: "fill",
              }}
              src={swiper2}
              alt="Slide 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              style={{
                height: "60dvh",
                width: "100%",
                objectFit: "fill",
              }}
              src={swiper3}
              alt="Slide 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              style={{
                height: "60dvh",
                width: "100%",
                objectFit: "fill",
              }}
              src={swiper4}
              alt="Slide 4"
            />
          </SwiperSlide>
        </Swiper>
        <div className="home-video-section-text">
          <h3>Qui sommes nous ?</h3>
          <p style={{ textAlign: "center" }}>
            Nous sommes une entreprise dédiée à fournir des services de
            traduction et d'interprétariat de haute qualité. Que vous ayez
            besoin de traduire des documents techniques, juridiques, ou
            marketing, notre équipe de traducteurs professionnels est là pour
            vous aider. nous garantissons des traductions précises et adaptées à
            vos besoins spécifiques.
          </p>
          <button onClick={() => navigate("/contact")} type="button">
            Contactez nous➡️
          </button>
        </div>
      </section>
      <section className="home-last-cards-section">
        <div>
          <h3>Notre mission :</h3>
          <p>
            Traductions professionnelles et contenu linguistique pour tous vos{" "}
            <br />
            besoins Dans un monde de plus en plus interconnecté, comprendre et{" "}
            <br />
            faire comprendre est essentiel Nous proposons d'excellents services{" "}
            <br />
            de traduction , combinant l'expérience de locuteurs natifs experts{" "}
            <br />
            et de traducteurs certifiés avec les technologies les plus modernes{" "}
            <br />. Notre objectif est de connecter les cultures et d’assurer
            une <br />
            communication claire et précise sans malentendus. La qualité est au{" "}
            <br />
            cœur de ce que nous faisons : chaque traduction reflète <br />
            l' exactitude , la compétence et la passion de nos professionnels.
            Nous proposons des <br />
            solutions linguistiques qui dépassent les attentes, vous aidant à{" "}
            <br />
            aller droit au but dans tous les contextes. Chez nous, les barrières{" "}
            <br />
            linguistiques deviennent des ponts de compréhension. <br />
          </p>
          <button
            onClick={() => navigate("/traducteur")}
            className="home-header-section-btn1"
            type="button"
          >
            Voir nos services ➡️
          </button>
        </div>
        <div className="home-last-cards">
          <div className="home-last-cards-groupe">
            <HoverCard
              className="home-hover-card"
              image={card1Img}
              title="interprétation professionnel"
              texts={[
                "Interprétation Simultanée",
                "Traduction de Rapports d'Activité",
              ]}
            />
            <HoverCard
              className="home-hover-card"
              image={card2Img}
              title="interprétation professionnel"
              texts={["Traduction de Campagnes de Sensibilisation"]}
            />
          </div>
          <HoverCard
            className="home-hover-card"
            image={card3Img}
            title="interprétation professionnel"
            texts={["Traduction de Contenu Humanitaire"]}
          />
        </div>
      </section>
    </div>
  );
}
