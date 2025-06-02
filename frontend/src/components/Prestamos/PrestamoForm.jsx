import React, { useState, useEffect } from 'react';
import { createPrestamo, updatePrestamo } from '../../services/prestamoService';
import { FaUser, FaBook, FaCalendarAlt, FaSave, FaTimes } from 'react-icons/fa';
import './PrestamoForm.css';

export default function PrestamoForm({
  prestamoEdit,
  libros,
  usuarios,
  onSave,
  onCancel,
  onUpdateSuccess,
  darkMode,
  isVisible
}) {
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_libro: '',
    fecha_prestamo: '',
    fecha_devolucion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [librosDisponibles, setLibrosDisponibles] = useState([]);

  useEffect(() => {
    if (prestamoEdit) {
      setFormData({
        id_usuario: prestamoEdit.id_usuario || '',
        id_libro: prestamoEdit.id_libro || '',
        fecha_prestamo: prestamoEdit.fecha_prestamo || '',
        fecha_devolucion: prestamoEdit.fecha_devolucion || ''
      });
    } else {
      // Para nuevos préstamos, establecer fecha actual
      const hoy = new Date().toISOString().split('T')[0];
      setFormData({
        id_usuario: '',
        id_libro: '',
        fecha_prestamo: hoy,
        fecha_devolucion: ''
      });
    }
  }, [prestamoEdit]);

  useEffect(() => {
    // Filtrar libros que tienen cantidad disponible > 0
    const disponibles = libros.filter(libro => libro.cantidad_disponible > 0);
    setLibrosDisponibles(disponibles);
  }, [libros]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.id_usuario) {
        throw new Error('Debe seleccionar un usuario');
      }
      if (!formData.id_libro) {
        throw new Error('Debe seleccionar un libro');
      }
      if (!formData.fecha_prestamo) {
        throw new Error('Debe especificar la fecha de préstamo');
      }

      // Validar que la fecha de devolución sea posterior a la de préstamo (si se especifica)
      if (formData.fecha_devolucion && formData.fecha_devolucion <= formData.fecha_prestamo) {
        throw new Error('La fecha de devolución debe ser posterior a la fecha de préstamo');
      }

      const dataToSend = {
        id_usuario: parseInt(formData.id_usuario),
        id_libro: parseInt(formData.id_libro),
        fecha_prestamo: formData.fecha_prestamo,
        fecha_devolucion: formData.fecha_devolucion || null
      };

      if (prestamoEdit) {
        await updatePrestamo(prestamoEdit.id_prestamo, dataToSend);
        onUpdateSuccess();
      } else {
        await createPrestamo(dataToSend);
        onSave();
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al procesar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  const getLibroInfo = (libroId) => {
    const libro = libros.find(l => l.id_libro === parseInt(libroId));
    if (!libro) return null;
    return {
      ...libro,
      autorNombre: libro.autor?.nombre || 'Autor desconocido',
      categoriaNombre: libro.categoria?.nombre_categoria || 'Sin categoría'
    };
  };

  const getUsuarioInfo = (usuarioId) => {
    const usuario = usuarios.find(u => u.id_usuario === parseInt(usuarioId));
    return usuario;
  };

  return (
    <div className={`prestamo-form ${darkMode ? 'dark' : ''}`}>
      <div className="form-header">
        <h3>
          {prestamoEdit ? 'Editar Préstamo' : 'Nuevo Préstamo'}
        </h3>
        <button
          type="button"
          className="btn-close"
          onClick={onCancel}
        >
          <FaTimes />
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="form-group">
            <label htmlFor="id_usuario">
              <FaUser className="form-icon" />
              Usuario *
            </label>
            <select
              id="id_usuario"
              name="id_usuario"
              value={formData.id_usuario}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccionar usuario...</option>
              {usuarios.map(usuario => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre} - {usuario.email}
                </option>
              ))}
            </select>
            {formData.id_usuario && (
              <div className="selected-info">
                {getUsuarioInfo(formData.id_usuario)?.nombre}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="id_libro">
              <FaBook className="form-icon" />
              Libro *
            </label>
            <select
              id="id_libro"
              name="id_libro"
              value={formData.id_libro}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccionar libro...</option>
              {librosDisponibles.map(libro => (
                <option key={libro.id_libro} value={libro.id_libro}>
                  {libro.titulo} (Disponibles: {libro.cantidad_disponible})
                </option>
              ))}
            </select>
            {formData.id_libro && (
              <div className="selected-info">
                {(() => {
                  const libro = getLibroInfo(formData.id_libro);
                  return libro ? `${libro.titulo} - ${libro.autorNombre}` : '';
                })()}
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_prestamo">
                <FaCalendarAlt className="form-icon" />
                Fecha de Préstamo *
              </label>
              <input
                type="date"
                id="fecha_prestamo"
                name="fecha_prestamo"
                value={formData.fecha_prestamo}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_devolucion">
                <FaCalendarAlt className="form-icon" />
                Fecha de Devolución
              </label>
              <input
                type="date"
                id="fecha_devolucion"
                name="fecha_devolucion"
                value={formData.fecha_devolucion}
                onChange={handleChange}
                disabled={loading}
                min={formData.fecha_prestamo}
              />
              <small className="form-text">
                Dejar vacío si el libro no ha sido devuelto
              </small>
            </div>
          </div>

          {formData.fecha_prestamo && !formData.fecha_devolucion && (
            <div className="fecha-limite-info">
              <FaCalendarAlt className="info-icon" />
              <span>
                Fecha límite de devolución: {' '}
                {new Date(new Date(formData.fecha_prestamo).getTime() + 14 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
              </span>
            </div>
          )}
        </div>

        <div className="form-footer">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            <FaTimes className="btn-icon" />
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-save"
            disabled={loading}
          >
            <FaSave className="btn-icon" />
            {loading ? 'Guardando...' : (prestamoEdit ? 'Actualizar' : 'Crear Préstamo')}
          </button>
        </div>
      </form>
    </div>
  );
}