import PropTypes from "prop-types";
import "../styles/DevisCard.scss";
import franceImg from "../assets/images/france.png";
import italienImg from "../assets/images/italy.png";
import englishImg from "../assets/images/usa.png";
import germanImg from "../assets/images/germany.png";

function DevisCard({ src, language, description }) {
  return (
    <div className="devisCard-container">
      <div>
        <h4 className="titre-devis">{language.toUpperCase()}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

DevisCard.propTypes = {
  src: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default DevisCard;
