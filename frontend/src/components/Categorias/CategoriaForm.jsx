import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriaForm.css';

const CategoriaForm = ({ categoriaEdit, onSave, onCancel, onUpdateSuccess, darkMode, isVisible }) => {
  const [nombre, setNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre_categoria);
    } else {
      setNombre('');
    }
  }, [categoriaEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      if (categoriaEdit) {
        const response = await axios.put(
          `http://localhost:3001/api/categorias/${categoriaEdit.id_categoria}`, 
          { nombre_categoria: nombre }
        );
        onUpdateSuccess(response.data);
      } else {
        const response = await axios.post('http://localhost:3001/api/categorias', {
          nombre_categoria: nombre,
        });
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`categoria-form-overlay ${isVisible ? 'show' : ''}`}>
      <div className={`categoria-form-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="form-header">
        <h3 className="categoria-form-title">
          {categoriaEdit ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>
        <button 
          className="btn-close-form"
          onClick={onCancel}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre de la categoría</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Ciencia Ficción"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-crear-actualizar"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Procesando...
              </>
            ) : (
              categoriaEdit ? 'Actualizar' : 'Crear'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-cancelar"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CategoriaForm;