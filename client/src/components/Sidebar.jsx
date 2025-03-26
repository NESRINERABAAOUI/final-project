import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  FaUser,
  FaCog,
  FaHome,
  FaLanguage,
  FaDollarSign,
  FaArrowLeft,
} from "react-icons/fa";
import { TbCategory2 } from "react-icons/tb";

import { Link, useNavigate } from "react-router-dom";
import "../styles/dash-side.scss";
import {
  getAdmin,
  getClientByID,
  getTranslatorById,
} from "../services/usersData";
import { logout } from "../store/authSlice";

function Sidebar({ setContent, content }) {
  const { user, token } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkScreenWidth = useCallback(() => {
    if (window.innerWidth < 768) setOpen(false);
  }, []);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, [checkScreenWidth]);
  useEffect(() => {
    async function fetchUserData() {
      try {
        let userdata;
        switch (user.role) {
          case "admin":
            userdata = await getAdmin(user.userId, token);
            break;
          case "client":
            userdata = await getClientByID(user.userId, token);
            break;
          case "translator":
            userdata = await getTranslatorById(user.userId, token);
            break;
          default:
            userdata = {};
            break;
        }
        setUserData(userdata);
        console.info(userdata);
      } catch (Error) {
        console.error("Failed to fetch user data:", Error);
      }
    }
    fetchUserData();
  }, [token, user]);
  const menus = useMemo(
    () => [
      { name: "Home", icon: <FaHome />, link: "/" },
      { name: "General Info", icon: <FaHome />, roles: ["admin"], content: 6 },
      { name: "Users", icon: <FaUser />, roles: ["admin"], content: 1 },
      {
        name: "Requests",
        icon: <FaCog />,
        roles: ["admin", "client", "translator"],
        content: 0,
      },
      {
        name: "Profile",
        icon: <FaUser />,
        roles: ["admin", "client", "translator"],
        content: 2,
      },
      { name: "Languages", icon: <FaLanguage />, roles: ["admin"], content: 3 },
      {
        name: "Tarifs",
        icon: <FaDollarSign />,
        roles: ["translator"],
        content: 4,
      },
      {
        name: "Categories",
        icon: <TbCategory2 />,
        roles: ["admin"],
        content: 5,
      },
    ],
    []
  );

  const filteredMenus = useMemo(
    () =>
      menus.filter((menu) => !menu.roles || menu.roles.includes(user?.role)),
    [menus, user?.role]
  );

  const handleMenuClick = (menuContent) => setContent(menuContent);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className={`sidebar ${open ? "" : "closed"}`}>
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu" // Add an ARIA label
      >
        <HiMenuAlt3 />
      </button>

      <div className="profile">
        <div className="profile-pic">
          <img
            src={
              userData.ImagePath
                ? `http://localhost:3310/uploads/${userData.ImagePath}`
                : ""
            }
            alt="Profile"
          />
        </div>
        <h4>
          {userData.FirstName} {userData.LastName}
        </h4>
        <span className="uppercaseText">{user?.role}</span>
      </div>

      <ul className="menu">
        {filteredMenus.map((menu) => (
          <li key={menu.name}>
            <Link
              to={menu.link}
              onClick={() => handleMenuClick(menu.content)}
              className={content === menu.content ? "active" : ""}
            >
              {menu.icon}
              {open && <span>{menu.name}</span>}
            </Link>
          </li>
        ))}
        <li>
          <Link onClick={handleLogout}>
            <FaArrowLeft />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  setContent: PropTypes.func.isRequired,
  content: PropTypes.number.isRequired,
};

export default Sidebar;
