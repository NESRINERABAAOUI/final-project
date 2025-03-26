import PropTypes from "prop-types";
import "../styles/Card.scss";

function Card({ img, name, type }) {
  return (
    <div>
      <img className="card-img" src={img} alt="img" />
      <div>
        <h3>{name}</h3>
        <p>{type}</p>
      </div>
    </div>
  );
}

Card.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Card;
