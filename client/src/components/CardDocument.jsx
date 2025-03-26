import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function CardDocument({ src, title }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/devis")}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate("/devis");
        }
      }}
      role="button"
      tabIndex={0}
      className="document-card"
    >
      <img className="document-card-img" src={src} alt="title" />
      <h5 className="document-card-title">{title}</h5>
    </div>
  );
}

CardDocument.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CardDocument;
