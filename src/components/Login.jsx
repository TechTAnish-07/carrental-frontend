// pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../components/Axios.jsx";
import "./Login.css";
const Login = () => {
  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setError("");
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignIn) {
        // 🔐 LOGIN
        const res = await api.post("/auth/login", { email, password });

        const { token, refreshToken } = res.data;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));

        localStorage.setItem("isLoggedIn", "true");
        const decoded = jwtDecode(token);
        const role = decoded.role;


        if (role === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }

      } else {
        // 📝 REGISTER
        const res = await fetch("https://carrentalbackend-h8b3.onrender.com/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Registration failed");
        }

        setError("Please check your email to verify your account.");
        setIsSignIn(true);
        setPassword("");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignIn ? "Sign In" : "Sign Up"}</h2>

      <form className="auth-form" onSubmit={handleSubmitButton}>
        {error && <div className="error-message">{error}</div>}

        {!isSignIn && (
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />


        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Please wait..." : isSignIn ? "Sign In" : "Sign Up"}
        </button>
        
      </form>
      
      <p className="warning-message">
        {isSignIn ? (
          <>
            🚨 Don't have an account?{" "}
            <button onClick={toggleForm}>Sign Up</button>
          </>
        ) : (
          <>
            🔐 Already have an account?{" "}
            <button onClick={toggleForm}>Sign In</button>
          </>
        )}
      </p>
      
    </div>
  );
};

export default Login;
