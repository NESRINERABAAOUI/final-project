import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import "../styles/dash-side.scss";
import Languages from "../components/Languages";
import Categories from "../components/Categories";
import Profile from "../components/Profile";
import Requests from "../components/Requests";
import TranslatorTariffs from "../components/TranslatorTariffs";
import GeneralInfo from "../components/GeneralInfo";

function AdminDashboard() {
  const [content, setContent] = useState(0);
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/" />;

  if (user === null) return <div>Loading user information...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar setContent={setContent} content={content} />

      <div className="main-content">
        <div className="dashboard-content">
          {content === 0 && <Requests />}
          {content === 1 && <Users />}
          {content === 2 && <Profile />}
          {content === 3 && <Languages />}
          {content === 4 && <TranslatorTariffs />}
          {content === 5 && <Categories />}
          {content === 6 && <GeneralInfo />}
          {/* Add other content here */}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
