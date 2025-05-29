import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Redbook() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [buttonColor] = useState("#862630"); // 🔵 Color botón por defecto

  
  const { Redbook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Redbook(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  const colors = {
    light: {
      background: "#f5f7fa",
      cardBg: "#ffffff",
      text: "#2c3e50",
      inputBg: "#fff",
      inputBorder: "#ced4da",
      buttonText: "#fff",
      linkColor: "#0d6efd",
      errorBg: "#f8d7da",
      errorText: "#842029",
    },
    dark: {
      background: "#1a1a2e",
      cardBg: "#1e1e1e",
      text: "#e6e6e6",
      inputBg: "#2c2c2c",
      inputBorder: "#555",
      buttonText: "#fff",
      linkColor: "#0d6efd",
      errorBg: "#661919",
      errorText: "#f8d7da",
    },
  };

  const currentColors = darkMode ? colors.dark : colors.light;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: currentColors.background,
        transition: "background-color 0.3s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <motion.div
        className="card p-4"
        style={{
          width: "400px",
          backgroundColor: currentColors.cardBg,
          boxShadow: darkMode
            ? "0 0 15px rgba(255, 255, 255, 0.1)"
            : "0 0 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          color: currentColors.text,
          position: "relative",
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Botón de Dark/Light mode */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: buttonColor,
            color: currentColors.buttonText,
            border: "none",
            borderRadius: "20px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem",
            userSelect: "none",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          {darkMode ? "Modo Claro" : "Modo Oscuro"}
        </button>

        <h2 className="text-center mb-4" style={{ color: currentColors.text }}>
          Redbook
        </h2>
        {error && (
          <div
            style={{
              backgroundColor: currentColors.errorBg,
              color: currentColors.errorText,
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="email"
              style={{ color: currentColors.text }}
              className="form-label"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              style={{
                backgroundColor: currentColors.inputBg,
                color: currentColors.text,
                borderColor: currentColors.inputBorder,
              }}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              style={{ color: currentColors.text }}
              className="form-label"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              style={{
                backgroundColor: currentColors.inputBg,
                color: currentColors.text,
                borderColor: currentColors.inputBorder,
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: buttonColor,
              color: currentColors.buttonText,
              fontWeight: "600",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#084298"
                : "#0747a6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonColor;
            }}
          >
            Redbook
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: currentColors.text }}>
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              style={{
                color: currentColors.linkColor,
                textDecoration: "underline",
              }}
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
