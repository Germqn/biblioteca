import React, { useState } from 'react';

const LibroForm = ({ initialLibro = {}, autores, categorias, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: initialLibro.titulo || '',
    id_autor: initialLibro.id_autor || '',
    id_categoria: initialLibro.id_categoria || '',
    anio_publicacion: initialLibro.anio_publicacion || '',
    cantidad_disponible: initialLibro.cantidad_disponible || 0,
    isbn: initialLibro.isbn || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      alert('El título es requerido');
      return;
    }
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_autor' || name === 'id_categoria' || name === 'cantidad_disponible' || name === 'anio_publicacion' 
        ? Number(value) || value 
        : value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Título *</label>
        <input
          type="text"
          className="form-control"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Autor</label>
        <select
          className="form-select"
          name="id_autor"
          value={formData.id_autor}
          onChange={handleChange}
        >
          <option value="">Seleccionar autor...</option>
          {autores.map(autor => (
            <option key={autor.id_autor} value={autor.id_autor}>
              {autor.nombre} {autor.apellido}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          name="id_categoria"
          value={formData.id_categoria}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>
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
          />
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary me-2">
          {initialLibro.id_libro ? 'Actualizar' : 'Guardar'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default LibroForm;