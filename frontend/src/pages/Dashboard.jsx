import { Link } from "react-router-dom";
import { FaBook, FaUserEdit, FaTags, FaUsers, FaExchangeAlt } from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Panel de Administración</h1>
        <p className="dashboard-subtitle">
          Gestiona todos los aspectos de tu biblioteca desde este panel central
        </p>
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