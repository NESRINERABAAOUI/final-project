import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice"; // Import Redux action
import "../styles/login.scss";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // tab3ath des actions lel store de Redux

  // Get auth state from Redux
  const { status, error } = useSelector((state) => state.auth); // extraire les données de la store Redux
  console.log("status en login", status);
  const onSubmit = async (e) => {
    e.preventDefault();

    // Dispatch login action with correct payload
    const result = await dispatch(
      loginUser({ Email: email, Password: password })
    );

    // Handle success and errors
    if (loginUser.fulfilled.match(result)) {
      console.info(result);
      toast.success("Login successful");
      // localStorage.setItem("token", result.payload.data.token); // ✅ Fixed payload
      navigate("/dashboard"); // ✅ Redirects correctly
    } else if (loginUser.rejected.match(result)) {
      toast.error(result.payload?.message || "Authentication failed");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <form className="login-form" onSubmit={onSubmit}>
        <h2 className="login-title">Login</h2>
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          id="email"
          required
        />
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id="password"
          required
        />

        <button
          className="submit-button"
          type="submit"
          disabled={status === "loading"} // Disable button during loading
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
