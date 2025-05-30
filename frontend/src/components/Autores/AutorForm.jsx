import React, { useState } from 'react';
import './AutorForm.css';

const AutorForm = ({ initialAutor = {}, onSave, onCancel, isSubmitting = false, isVisible }) => {
  const [nombre, setNombre] = useState(initialAutor.nombre || '');
  const [apellido, setApellido] = useState(initialAutor.apellido || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) {
      setError('Por favor ingrese nombre y apellido del autor');
      return;
    }
    setError('');
    onSave({ nombre, apellido });
  };

  return (
    <div className={`autor-form-overlay ${isVisible ? 'show' : ''}`}>
      <div className="autor-form">
        <h3 className="autor-form-title">
          {initialAutor.id_autor ? 'Editar Autor' : 'Nuevo Autor'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Gabriel"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Apellido:</label>
            <input 
              type="text"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              placeholder="Ej: García Márquez"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-guardar"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Guardando...
                </>
              ) : (
                initialAutor.id_autor ? 'Actualizar' : 'Guardar'
              )}
            </button>
            
            {onCancel && (
              <button 
                type="button" 
                className="btn btn-cancelar"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutorForm;
