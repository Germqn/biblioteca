import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './LibroForm.css';

const LibroForm = ({ initialLibro = {}, autores = [], categorias = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    id_autor: '',
    id_categoria: '',
    anio_publicacion: new Date().getFullYear(),
    cantidad_disponible: 1
  });

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (autores.length === 0 || categorias.length === 0) return;

    const isEditing = Boolean(initialLibro.id_libro);
    
    const defaultValues = {
      titulo: '',
      id_autor: autores[0]?.id_autor ? String(autores[0].id_autor) : '',
      id_categoria: categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : '',
      anio_publicacion: new Date().getFullYear(),
      cantidad_disponible: 1
    };

    setFormData(isEditing ? {
      titulo: initialLibro.titulo || defaultValues.titulo,
      id_autor: initialLibro.id_autor != null ? String(initialLibro.id_autor) : defaultValues.id_autor,
      id_categoria: initialLibro.id_categoria != null ? String(initialLibro.id_categoria) : defaultValues.id_categoria,
      anio_publicacion: initialLibro.anio_publicacion || defaultValues.anio_publicacion,
      cantidad_disponible: initialLibro.cantidad_disponible || defaultValues.cantidad_disponible
    } : defaultValues);

    if (process.env.NODE_ENV === 'development') {
      console.log(isEditing ? 'Datos iniciales de edición:' : 'Valores por defecto para nuevo libro:', 
        isEditing ? initialLibro : defaultValues);
    }
  }, [initialLibro, autores, categorias]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      alert('El título es requerido');
      return;
    }

    const dataToSave = {
      ...formData,
      id_autor: formData.id_autor ? Number(formData.id_autor) : null,
      id_categoria: formData.id_categoria ? Number(formData.id_categoria) : null
    };
    
    onSave(dataToSave);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: ['anio_publicacion', 'cantidad_disponible'].includes(name)
        ? Math.max(0, Number(value)) // Asegura números positivos
        : value
    }));
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Estado actual del formulario:', formData);
  }

  return (
    <form onSubmit={handleSubmit} className="libro-form-container">
      <div className="mb-3">
        <label className="form-label">Título *</label>
        <input
          type="text"
          className="form-control"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Autor</label>
        <select
          className="form-select"
          name="id_autor"
          value={formData.id_autor}
          onChange={handleChange}
          aria-label="Seleccionar autor"
        >
          <option value="">Seleccionar autor...</option>
          {autores.map(autor => (
            <option key={autor.id_autor} value={String(autor.id_autor)}>
              {autor.nombre} {autor.apellido}
            </option>
          ))}
        </select>
        {formData.id_autor && (
          <small className="text-muted">
            Autor seleccionado: {autores.find(a => String(a.id_autor) === formData.id_autor)?.nombre || 'N/A'}
          </small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          name="id_categoria"
          value={formData.id_categoria}
          onChange={handleChange}
          aria-label="Seleccionar categoría"
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={String(cat.id_categoria)}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>
        {formData.id_categoria && (
          <small className="text-muted">
            Categoría seleccionada: {categorias.find(c => String(c.id_categoria) === formData.id_categoria)?.nombre_categoria || 'N/A'}
          </small>
        )}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Año de publicación</label>
          <input
            type="number"
            className="form-control"
            name="anio_publicacion"
            value={formData.anio_publicacion}
            onChange={handleChange}
            min="1000"
            max={new Date().getFullYear()}
            aria-label="Año de publicación"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Cantidad disponible</label>
          <input
            type="number"
            className="form-control"
            name="cantidad_disponible"
            value={formData.cantidad_disponible}
            onChange={handleChange}
            min="0"
            aria-label="Cantidad disponible"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          aria-label="Cancelar"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-actualizar-guardar"
          aria-label={initialLibro.id_libro ? 'Actualizar libro' : 'Guardar libro'}
        >
          {initialLibro.id_libro ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

LibroForm.propTypes = {
  initialLibro: PropTypes.shape({
    id_libro: PropTypes.number,
    titulo: PropTypes.string,
    id_autor: PropTypes.number,
    id_categoria: PropTypes.number,
    anio_publicacion: PropTypes.number,
    cantidad_disponible: PropTypes.number
  }),
  autores: PropTypes.arrayOf(
    PropTypes.shape({
      id_autor: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired
    })
  ).isRequired,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id_categoria: PropTypes.number.isRequired,
      nombre_categoria: PropTypes.string.isRequired
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default LibroForm;