import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import "./Redbook.css"; 

export default function Redbook() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateLoginForm = () => {
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return false;
    }
    
    if (!formData.password.trim()) {
      setError("La contraseña es requerida");
      return false;
    }
    
    return true;
  };

  const validateRegisterForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    
    if (!formData.apellido.trim()) {
      setError("El apellido es requerido");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      
      const result = await register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Error al registrar usuario");
      }
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError("");
    setFormData(prev => ({
      ...prev,
      password: "",
      confirmPassword: ""
    }));
  };

  const themeClass = darkMode ? "dark" : "light";

  return (
    <div className={`redbook-container ${themeClass}`}>
      <motion.div
        className={`redbook-card ${themeClass}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: isLoginView ? "400px" : "450px" }}
      >
        <button
          onClick={handleThemeToggle}
          className={`mode-toggle-btn ${themeClass}`}
        >
          {darkMode ? "Modo Claro" : "Modo Oscuro"}
        </button>

        <h2 className={`redbook-title ${themeClass}`}>
          {isLoginView ? "Iniciar Sesión" : "Registro"}
        </h2>

        {error && (
          <motion.div
            className={`error-message ${themeClass}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={isLoginView ? handleLogin : handleRegister} className="redbook-form">
          {!isLoginView && (
            <>
              <div className="form-group">
                <label htmlFor="nombre" className={`form-label ${themeClass}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={`form-input ${themeClass}`}
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido" className={`form-label ${themeClass}`}>
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className={`form-input ${themeClass}`}
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email" className={`form-label ${themeClass}`}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`form-input ${themeClass}`}
              placeholder="tu-email@ejemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className={`form-label ${themeClass}`}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`form-input ${themeClass}`}
              placeholder={isLoginView ? "Ingresa tu contraseña" : "Mínimo 6 caracteres"}
              autoComplete={isLoginView ? "current-password" : "new-password"}
            />
          </div>

          {!isLoginView && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className={`form-label ${themeClass}`}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`form-input ${themeClass}`}
                placeholder="Repite tu contraseña"
              />
            </div>
          )}

          <motion.button
            type="submit"
            className={`submit-btn ${themeClass}`}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading 
              ? (isLoginView ? "Iniciando..." : "Registrando...") 
              : (isLoginView ? "Iniciar Sesión" : "Crear Cuenta")}
          </motion.button>
        </form>

        <div className={`auth-switch ${themeClass}`}>
          <p>
            {isLoginView 
              ? "¿No tienes una cuenta? " 
              : "¿Ya tienes una cuenta? "}
            <span 
              onClick={toggleView}
              className={`auth-link ${themeClass}`}
              role="button"
              tabIndex="0"
              onKeyPress={(e) => e.key === 'Enter' && toggleView()}
            >
              {isLoginView ? <strong>Regístrate</strong> : <strong>Iniciar Sesión</strong>}
            </span>
          </p>
        </div>

      </motion.div>
    </div>
  );
}