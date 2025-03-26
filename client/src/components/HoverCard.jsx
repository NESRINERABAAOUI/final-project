import PropTypes from "prop-types";
import "../styles/HoverCard.scss";

function HoverCard({ image, title, texts = ["a"] }) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt="Card" />
      </div>
      <div className="card-text">
        <h3 style={{ color: "#8338ec" }}>{title}</h3>
        {texts.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </div>
  );
}

HoverCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HoverCard;
