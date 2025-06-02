import React from 'react';
import { FaUser, FaBook, FaCalendarAlt, FaCalendarCheck, FaEdit, FaTrash, FaUndo, FaExclamationTriangle } from 'react-icons/fa';
import './PrestamoCard.css';

export default function PrestamoCard({ prestamo, onEdit, onDelete, onDevolver, darkMode }) {
  // Calcular si el préstamo está vencido
  const fechaPrestamo = new Date(prestamo.fecha_prestamo);
  const fechaLimite = new Date(fechaPrestamo);
  fechaLimite.setDate(fechaLimite.getDate() + 14); // 14 días de préstamo
  const hoy = new Date();
  const estaVencido = !prestamo.fecha_devolucion && hoy > fechaLimite;
  const estaDevuelto = !!prestamo.fecha_devolucion;

  // Calcular días restantes o días de retraso
  const diasDiferencia = Math.ceil((fechaLimite - hoy) / (1000 * 60 * 60 * 24));

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = () => {
    if (estaDevuelto) return 'status-devuelto';
    if (estaVencido) return 'status-vencido';
    if (diasDiferencia <= 3) return 'status-proximo-vencer';
    return 'status-activo';
  };

  const getStatusText = () => {
    if (estaDevuelto) return 'Devuelto';
    if (estaVencido) return `Vencido (${Math.abs(diasDiferencia)} días)`;
    if (diasDiferencia <= 3) return `Vence en ${diasDiferencia} días`;
    return `${diasDiferencia} días restantes`;
  };

  return (
    <div className={`prestamo-card ${darkMode ? 'dark' : ''} ${getStatusClass()}`}>
      <div className="prestamo-header">
        <div className="prestamo-status">
          {estaVencido && <FaExclamationTriangle className="status-icon warning" />}
          <span className="status-text">{getStatusText()}</span>
        </div>
        <div className="prestamo-actions">
          {!estaDevuelto && (
            <button
              className="btn-action btn-devolver"
              onClick={onDevolver}
              title="Devolver libro"
            >
              <FaUndo />
            </button>
          )}
          <button
            className="btn-action btn-edit"
            onClick={onEdit}
            title="Editar préstamo"
          >
            <FaEdit />
          </button>
          <button
            className="btn-action btn-delete"
            onClick={onDelete}
            title="Eliminar préstamo"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="prestamo-body">
        <div className="prestamo-info">
          <div className="info-item">
            <FaUser className="info-icon" />
            <div className="info-content">
              <label>Usuario:</label>
              <span>{prestamo.usuario?.nombre || 'Usuario no encontrado'}</span>
            </div>
          </div>

          <div className="info-item">
            <FaBook className="info-icon" />
            <div className="info-content">
              <label>Libro:</label>
              <span>{prestamo.libro?.titulo || 'Libro no encontrado'}</span>
            </div>
          </div>

          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <div className="info-content">
              <label>Fecha de Préstamo:</label>
              <span>{formatearFecha(prestamo.fecha_prestamo)}</span>
            </div>
          </div>

          <div className="info-item">
            <FaCalendarCheck className="info-icon" />
            <div className="info-content">
              <label>Fecha Límite:</label>
              <span className={estaVencido ? 'fecha-vencida' : ''}>
                {formatearFecha(fechaLimite)}
              </span>
            </div>
          </div>

          {prestamo.fecha_devolucion && (
            <div className="info-item">
              <FaCalendarCheck className="info-icon success" />
              <div className="info-content">
                <label>Fecha de Devolución:</label>
                <span className="fecha-devolucion">
                  {formatearFecha(prestamo.fecha_devolucion)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="prestamo-footer">
        <div className="prestamo-id">
          ID: {prestamo.id_prestamo}
        </div>
        {prestamo.libro?.autor?.nombre && (
          <div className="libro-autor">
            Autor: {prestamo.libro.autor.nombre}
          </div>
        )}
      </div>
    </div>
  );
}