import React, { useState, useEffect } from 'react';
import './LibroForm.css';

const LibroForm = ({ initialLibro = {}, autores = [], categorias = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    id_autor: '',
    id_categoria: '',
    anio_publicacion: new Date().getFullYear(),
    cantidad_disponible: 1
  });

  // Efecto para cargar datos iniciales al editar
  useEffect(() => {
    if (initialLibro.id_libro && autores.length > 0 && categorias.length > 0) {
      setFormData({
        titulo: initialLibro.titulo || '',
        id_autor: initialLibro.id_autor !== null && initialLibro.id_autor !== undefined
          ? String(initialLibro.id_autor)
          : '',
        id_categoria: initialLibro.id_categoria !== null && initialLibro.id_categoria !== undefined
          ? String(initialLibro.id_categoria)
          : '',
        anio_publicacion: initialLibro.anio_publicacion || new Date().getFullYear(),
        cantidad_disponible: initialLibro.cantidad_disponible || 1
      });
      console.log('Datos iniciales de edición:', initialLibro);
    } else if (!initialLibro.id_libro && autores.length > 0 && categorias.length > 0) {
      // Si es un nuevo libro, selecciona el primero por defecto si existen
      setFormData({
        titulo: '',
        id_autor: autores.length > 0 ? String(autores[0].id_autor) : '',
        id_categoria: categorias.length > 0 ? String(categorias[0].id_categoria) : '',
        anio_publicacion: new Date().getFullYear(),
        cantidad_disponible: 1
      });
      console.log('Valores por defecto para nuevo libro:', {
        id_autor: autores.length > 0 ? String(autores[0].id_autor) : '',
        id_categoria: categorias.length > 0 ? String(categorias[0].id_categoria) : ''
      });
    }
  }, [initialLibro, autores, categorias]);

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
      [name]: ['anio_publicacion', 'cantidad_disponible'].includes(name)
        ? Number(value)
        : value
    }));
  };

  console.log('Estado actual del formulario:', formData);

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
            <option key={autor.id_autor} value={String(autor.id_autor)}> {/* Asegúrate de que el value sea string */}
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
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={String(cat.id_categoria)}> {/* Asegúrate de que el value sea string */}
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