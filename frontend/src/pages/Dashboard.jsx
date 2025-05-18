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
  FaSignOutAlt
} from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#1a1a2e';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#f5f7fa';
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    if (isLoggingOut) return; // Prevenir múltiples clics
    
    try {
      setIsLoggingOut(true);
      
      // 1. Eliminar el token de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      console.log("Usuario desconectado");
      
      // 2. Redirigir al usuario a la página de inicio de sesión
      navigate('/'); // Redirigir a la página de login (raíz)
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Panel de RedBook</h1>
          <p className="dashboard-subtitle">
            Gestiona todos los aspectos de la biblioteca desde este panel central
          </p>
        </div>
        
        <div className="header-controls">
          <button 
            onClick={toggleDarkMode} 
            className="theme-toggle"
            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {darkMode ? (
              <>
                <FaSun className="theme-icon" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <FaMoon className="theme-icon" />
                <span>Modo Oscuro</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt className="logout-icon" />
            <span>{isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
          </button>
        </div>
      </header>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon-container">
            <FaBook className="card-icon" />
          </div>
          <div className="card-body">
            <h5 className="card-title">Libros</h5>
            <p className="card-text">
              Administra el catálogo completo de libros de la biblioteca, incluyendo 
              edición, eliminación y adición de nuevos ejemplares.
            </p>
            <Link to="/libros" className="card-link">
              Gestionar Libros
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon-container">
            <FaUserEdit className="card-icon" />
          </div>
          <div className="card-body">
            <h5 className="card-title">Autores</h5>
            <p className="card-text">
              Administra la lista de autores, sus biografías y la relación con 
              los libros que han escrito.
            </p>
            <Link to="/autores" className="card-link">
              Gestionar Autores
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon-container">
            <FaTags className="card-icon" />
          </div>
          <div className="card-body">
            <h5 className="card-title">Categorías</h5>
            <p className="card-text">
              Organiza los libros por categorías temáticas para facilitar su 
              clasificación y búsqueda.
            </p>
            <Link to="/categorias" className="card-link">
              Gestionar Categorías
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon-container">
            <FaUsers className="card-icon" />
          </div>
          <div className="card-body">
            <h5 className="card-title">Usuarios</h5>
            <p className="card-text">
              Administra los usuarios del sistema, sus permisos y datos personales.
            </p>
            <Link to="/usuarios" className="card-link">
              Gestionar Usuarios
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon-container">
            <FaExchangeAlt className="card-icon" />
          </div>
          <div className="card-body">
            <h5 className="card-title">Préstamos</h5>
            <p className="card-text">
              Controla los préstamos de libros, devoluciones y estado de los 
              ejemplares.
            </p>
            <Link to="/prestamos" className="card-link">
              Gestionar Préstamos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}