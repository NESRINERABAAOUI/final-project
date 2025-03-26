import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice"; // Import Redux action
import "../styles/NavBar.scss";
import logo from "../assets/images/logo.png";
import burgerIcon from "../assets/images/burger.jpg";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth); // Redux auth state

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="nav-bar">
      <img className="nav-logo" src={logo} alt="logo" />

      <nav ref={menuRef}>
        <button
          type="button"
          aria-label="burgerMenu"
          className="burgerMenu"
          onClick={toggleMenu}
        >
          <img
            className={`burger-bar ${menuOpen ? "clicked" : "unclicked"}`}
            src={burgerIcon}
            alt="Burger Icon"
          />
        </button>
        <ul className={`menu ${menuOpen ? "visible" : "hidden"}`}>
          <img className="phone-menu-logo" src={logo} alt="logo" />

          <li>
            <Link to="/" onClick={toggleMenu} aria-label="Home">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/traducteur" onClick={toggleMenu} aria-label="Service">
              Service
            </Link>
          </li>
          <li>
            <Link to="/devis" onClick={toggleMenu} aria-label="Estimation">
              Devis
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleMenu} aria-label="Contact">
              Contact
            </Link>
          </li>

          {/* Auth Dropdown Button */}
          <li className="nav-auth" ref={dropdownRef}>
            {token ? (
              <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  Mon Compte ▼
                </button>
                <div
                  className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}
                >
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                    📊 Dashboard
                  </Link>
                  <button onClick={handleLogout}>🚪 Déconnexion</button>
                </div>
              </div>
            ) : (
              <button
                className="nav-auth-btn"
                onClick={() => navigate("/login")}
              >
                Connexion
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
