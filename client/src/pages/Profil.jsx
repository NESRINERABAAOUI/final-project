import "../styles/Profile.scss";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import avatarImg from "../assets/images/profile.jpg";
import { useSelector } from "react-redux";

// Move Item component out of ProfileCard
function Item({ name, role }) {
  if (role && role.charAt(0) !== "T") {
    return null;
  }
  return <h4 className="langue">{name}</h4>;
}

// Adding PropTypes validation for the Item component
Item.propTypes = {
  name: PropTypes.string.isRequired, // Validate that name is a string and required
  role: PropTypes.string.isRequired, // Validate that role is a string and required
};

function ProfileCard() {
  const navigate = useNavigate();

  // Get user data from Redux state
  const { user } = useSelector((state) => state.auth);

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <img src={avatarImg} alt="Default Avatar" className="avatar" />
          <div className="profile-info">
            <h2>Your session is closed. Please log in again.</h2>
            <Link to="/login" className="edit-link">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getComplatedRole = () => {
    switch (user.roleUser) {
      case "C":
        return "Client";
      case "T":
        return "Traducteur";
      case "A":
        return "Administrateur";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={avatarImg}
          alt={`${user.firstName} ${user.lastName}`}
          className="avatar"
        />
        <div className="profile-info">
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <h4 className="email">{user.email}</h4>
          <h4 className="phone">Phone Number: {user.phoneNumber}</h4>
          <h4 className="role">{getComplatedRole()}</h4>
          {/* Pass data as props to Item component */}
          <Item name={user.language} role={user.roleUser} />
          <Link to="/modifProfile" className="edit-link">
            Edit My Data
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
