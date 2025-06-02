import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrestamos, deletePrestamo, devolverLibro } from '../../services/prestamoService';
import { getLibros } from '../../services/libroService';
import { getUsuarios } from '../../services/usuarioService';
import PrestamoCard from '../../components/Prestamos/PrestamoCard';
import PrestamoForm from '../../components/Prestamos/PrestamoForm';
import './PrestamosPage.css';
import { FaSun, FaMoon, FaBook, FaUsers, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [prestamoEdit, setPrestamoEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState('todos'); // todos, activos, vencidos, devueltos
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [prestamosData, librosData, usuariosData] = await Promise.all([
        getPrestamos(),
        getLibros(),
        getUsuarios()
      ]);

      setPrestamos(prestamosData);
      setLibros(librosData);
      setUsuarios(usuariosData);
      setError(null);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error cargando datos. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este préstamo?")) {
      try {
        await deletePrestamo(id);
        await cargarDatos();
        setSuccessMessage("Préstamo eliminado correctamente");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error("Error eliminando préstamo:", error);
        setError("Error eliminando préstamo");
      }
    }
  };

  const handleDevolucion = async (id) => {
    if (window.confirm("¿Confirmar devolución del libro?")) {
      try {
        await devolverLibro(id);
        await cargarDatos();
        setSuccessMessage("Libro devuelto correctamente");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error("Error en devolución:", error);
        setError("Error procesando devolución");
      }
    }
  };

  const handleUpdateSuccess = async () => {
    await cargarDatos();
    setPrestamoEdit(null);
    setShowModal(false);
    setSuccessMessage("Préstamo actualizado correctamente");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateSuccess = async () => {
    await cargarDatos();
    setShowModal(false);
    setSuccessMessage("Préstamo creado correctamente");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCancelForm = () => {
    setShowModal(false);
    setPrestamoEdit(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filtrar préstamos según el filtro seleccionado
  const prestamosFiltrados = prestamos.filter(prestamo => {
    const hoy = new Date();
    const fechaPrestamo = new Date(prestamo.fecha_prestamo);
    const fechaLimite = new Date(fechaPrestamo);
    fechaLimite.setDate(fechaLimite.getDate() + 14); // 14 días de préstamo

    switch (filtro) {
      case 'activos':
        return !prestamo.fecha_devolucion;
      case 'vencidos':
        return !prestamo.fecha_devolucion && hoy > fechaLimite;
      case 'devueltos':
        return prestamo.fecha_devolucion;
      default:
        return true;
    }
  });

  // Estadísticas
  const estadisticas = {
    total: prestamos.length,
    activos: prestamos.filter(p => !p.fecha_devolucion).length,
    vencidos: prestamos.filter(p => {
      if (p.fecha_devolucion) return false;
      const hoy = new Date();
      const fechaPrestamo = new Date(p.fecha_prestamo);
      const fechaLimite = new Date(fechaPrestamo);
      fechaLimite.setDate(fechaLimite.getDate() + 14);
      return hoy > fechaLimite;
    }).length,
    devueltos: prestamos.filter(p => p.fecha_devolucion).length
  };

  return (
    <div className={`prestamos-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>Regresar
        </button>

        <h1 className="page-title">Gestión de Préstamos</h1>

        <div className="header-actions">
          <button
            className="btn btn-dark-mode"
            onClick={toggleDarkMode}
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
            className="btn btn-add"
            onClick={() => {
              setPrestamoEdit(null);
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-lg me-2"></i>Nuevo Préstamo
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-container">
        <div className="estadistica-card">
          <FaBook className="estadistica-icon" />
          <div className="estadistica-info">
            <h3>{estadisticas.total}</h3>
            <p>Total Préstamos</p>
          </div>
        </div>
        <div className="estadistica-card active">
          <FaUsers className="estadistica-icon" />
          <div className="estadistica-info">
            <h3>{estadisticas.activos}</h3>
            <p>Préstamos Activos</p>
          </div>
        </div>
        <div className="estadistica-card warning">
          <FaExclamationTriangle className="estadistica-icon" />
          <div className="estadistica-info">
            <h3>{estadisticas.vencidos}</h3>
            <p>Préstamos Vencidos</p>
          </div>
        </div>
        <div className="estadistica-card success">
          <FaCalendarAlt className="estadistica-icon" />
          <div className="estadistica-info">
            <h3>{estadisticas.devueltos}</h3>
            <p>Libros Devueltos</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <button
          className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltro('todos')}
        >
          Todos ({estadisticas.total})
        </button>
        <button
          className={`filtro-btn ${filtro === 'activos' ? 'active' : ''}`}
          onClick={() => setFiltro('activos')}
        >
          Activos ({estadisticas.activos})
        </button>
        <button
          className={`filtro-btn warning ${filtro === 'vencidos' ? 'active' : ''}`}
          onClick={() => setFiltro('vencidos')}
        >
          Vencidos ({estadisticas.vencidos})
        </button>
        <button
          className={`filtro-btn success ${filtro === 'devueltos' ? 'active' : ''}`}
          onClick={() => setFiltro('devueltos')}
        >
          Devueltos ({estadisticas.devueltos})
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando préstamos...</p>
        </div>
      ) : prestamosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center">
          {filtro === 'todos' 
            ? "No hay préstamos registrados. Crea un nuevo préstamo para empezar."
            : `No hay préstamos ${filtro === 'activos' ? 'activos' : filtro === 'vencidos' ? 'vencidos' : 'devueltos'}.`
          }
        </div>
      ) : (
        <div className="prestamos-grid">
          {prestamosFiltrados.map((prestamo) => (
            <PrestamoCard
              key={prestamo.id_prestamo}
              prestamo={prestamo}
              onEdit={() => {
                setPrestamoEdit(prestamo);
                setShowModal(true);
              }}
              onDelete={() => handleDelete(prestamo.id_prestamo)}
              onDevolver={() => handleDevolucion(prestamo.id_prestamo)}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <PrestamoForm
              prestamoEdit={prestamoEdit}
              libros={libros}
              usuarios={usuarios}
              onSave={handleCreateSuccess}
              onCancel={handleCancelForm}
              onUpdateSuccess={handleUpdateSuccess}
              darkMode={darkMode}
              isVisible={showModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
