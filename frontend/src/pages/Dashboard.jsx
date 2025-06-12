import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUserEdit,
  FaTags,
  FaUsers,
  FaExchangeAlt,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Dashboard.css"; // Importa el archivo CSS actualizado

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Guardar la preferencia cada vez que cambie
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Guardar inmediatamente la nueva preferencia
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const handleLogout = () => {
    if (isLoggingOut) return; // Prevenir múltiples clics

    setIsLoggingOut(true);

    try {
      // 1. Eliminar el token de autenticación y datos de usuario
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      // IMPORTANTE: NO eliminamos la preferencia de tema para mantenerla
      // localStorage.removeItem("darkMode"); // Esta línea NO se ejecuta

      console.log("Usuario desconectado");

      // 2. Limpiar las clases de tema del body antes de navegar
      document.body.classList.remove("dark-mode");

      // 3. Redirigir al usuario a la página de inicio de sesión
      navigate("/"); // Redirigir a la página de login (raíz)
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false); // Restablecer el estado de cierre de sesión
    }
  };

  const dashboardCards = [
    {
      title: "Libros",
      text: "Administra el catálogo completo de libros de la biblioteca, incluyendo edición, eliminación y adición de nuevos ejemplares.",
      icon: FaBook,
      link: "/libros",
      linkText: "Gestionar Libros",
    },
    {
      title: "Autores",
      text: "Administra la lista de autores, sus biografías y la relación con los libros que han escrito.",
      icon: FaUserEdit,
      link: "/autores",
      linkText: "Gestionar Autores",
    },
    {
      title: "Categorías",
      text: "Organiza los libros por categorías temáticas para facilitar su clasificación y búsqueda.",
      icon: FaTags,
      link: "/categorias",
      linkText: "Gestionar Categorías",
    },
    {
      title: "Usuarios",
      text: "Administra los usuarios del sistema, sus permisos y datos personales.",
      icon: FaUsers,
      link: "/usuarios",
      linkText: "Gestionar Usuarios",
    },
    {
      title: "Préstamos",
      text: "Controla los préstamos de libros, devoluciones y estado de los ejemplares.",
      icon: FaExchangeAlt,
      link: "/prestamos",
      linkText: "Gestionar Préstamos",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Panel de RedBook</h1>
            <p className="dashboard-subtitle">
              Gestiona todos los aspectos de la biblioteca desde este panel central con elegancia y estilo.
            </p>
          </div>

          <div className="header-controls">
            <button
              onClick={toggleDarkMode}
              className="btn-base theme-toggle"
              aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {darkMode ? (
                <>
                  <FaSun className="btn-icon" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <FaMoon className="btn-icon" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="btn-base logout-btn"
              disabled={isLoggingOut}
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt className="btn-icon" />
              <span>{isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
            </button>
          </div>
        </header>

        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <div className="dashboard-card" key={index}>
              <div className="card-icon-container">
                <card.icon className="card-icon" />
              </div>
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.text}</p>
                <Link to={card.link} className="card-link">
                  {card.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}