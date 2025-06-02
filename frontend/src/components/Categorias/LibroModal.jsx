import React from 'react';
import { createPortal } from 'react-dom';
import './LibroModal.css';

const LibroModal = ({ libro, onClose, darkMode }) => {
  if (!libro) return null;

  // Crear portal para renderizar fuera del componente padre
  const modalRoot = document.getElementById('modal-root') || document.body;

  const modalContent = (
    <div className="libro-modal-backdrop fullscreen" onClick={onClose}>
      <div
        className={`libro-modal-content fullscreen ${darkMode ? 'dark-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="libro-modal-header">
          <h2 className="libro-modal-title">{libro.titulo}</h2>
          <button
            className="libro-modal-close"
            onClick={onClose}
            title="Cerrar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="libro-modal-body fullscreen">
          <div className="libro-info-grid fullscreen">
            <div className="libro-portada-container fullscreen">
              {libro.portada_url ? (
                <img
                  src={libro.portada_url}
                  alt={`Portada de ${libro.titulo}`}
                  className="libro-portada fullscreen"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="libro-portada-placeholder fullscreen" style={{ display: libro.portada_url ? 'none' : 'flex' }}>
                <i className="bi bi-book"></i>
                <span>Sin portada</span>
              </div>
            </div>

            <div className="libro-details fullscreen">
              <div className="libro-detail-item">
                <span className="detail-label">
                  <i className="bi bi-person-fill"></i>
                  Autor:
                </span>
                <span className="detail-value">
                  {libro.autor?.nombre} {libro.autor?.apellido}
                </span>
              </div>

              <div className="libro-detail-item">
                <span className="detail-label">
                  <i className="bi bi-calendar-fill"></i>
                  Año de publicación:
                </span>
                <span className="detail-value">
                  {libro.anio_publicacion}
                </span>
              </div>

              <div className="libro-detail-item">
                <span className="detail-label">
                  <i className="bi bi-tag-fill"></i>
                  Categoría:
                </span>
                <span className="detail-value">
                  {libro.categoria?.nombre_categoria}
                </span>
              </div>

              <div className="libro-detail-item">
                <span className="detail-label">
                  <i className="bi bi-stack"></i>
                  Cantidad disponible:
                </span>
                <span className={`detail-value ${libro.cantidad_disponible === 0 ? 'unavailable' : 'available'}`}>
                  {libro.cantidad_disponible}
                  {libro.cantidad_disponible === 0 ? ' (No disponible)' :
                    libro.cantidad_disponible === 1 ? ' ejemplar' : ' ejemplares'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="libro-modal-footer">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default LibroModal;