import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import AOS from "aos";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import "aos/dist/aos.css";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Devis = lazy(() => import("./pages/Devis"));
const Contact = lazy(() => import("./pages/Contact"));
const Traducteur = lazy(() => import("./pages/Traducteur"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
AOS.init();

function App() {
  const location = useLocation(); // Get current path

  // Hide Navbar & Footer on Dashboard
  const hideNavAndFooter = location.pathname.startsWith("/dashboard");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
      }}
    >
      {/* Show Navbar only if not in /dashboard */}
      {!hideNavAndFooter && <NavBar />}
      <div style={{ flex: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/traducteur" element={<Traducteur />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔐 Protected Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
      {/* Show Footer only if not in /dashboard */}
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

export default App;
