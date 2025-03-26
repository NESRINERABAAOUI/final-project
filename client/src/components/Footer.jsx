import "../styles/Footer.scss";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <div className="footer-section">
      <img className="nav-logo" src={logo} alt="logo" />
      <div className="footer-content">
        <p>Translation Agency 2024</p>
        <p>Tous droits réservés.</p>
      </div>
      <div className="footer-social">
        <h5>Suivez-nous sur</h5>
        <div className="footer-icons">
          <a
            href="https://www.facebook.com"
            className="footer-icon"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.twitter.com"
            className="footer-icon"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com"
            className="footer-icon"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com"
            className="footer-icon"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
