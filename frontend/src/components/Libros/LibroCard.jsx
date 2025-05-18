import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './LibroCard.css';

const LibroCard = ({ libro, onEdit, onDelete }) => {
  const [imageUrl, setImageUrl] = useState(libro.portada_url);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const buscarPortadaLibro = async () => {
      if (!libro.portada_url) {
        setLoadingImage(true);
        try {
          // Intento con OpenLibrary API
          const openLibResponse = await fetch(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(libro.titulo)}&limit=1`
          );
          const openLibData = await openLibResponse.json();

          if (openLibData.docs?.length > 0) {
            const coverId = openLibData.docs[0].cover_i;
            if (coverId) {
              setImageUrl(`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`);
              return;
            }
          }

          // Si no hay en OpenLibrary, probamos con Google Books
          if (libro.isbn) {
            const googleResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=isbn:${libro.isbn}`
            );
            const googleData = await googleResponse.json();

            const thumbnail = googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
            if (thumbnail) {
              setImageUrl(thumbnail);
              return;
            }
          }

          setImageUrl('https://via.placeholder.com/150x200?text=No+Portada');
        } catch (error) {
          console.error("Error buscando portada:", error);
          setImageUrl('https://via.placeholder.com/150x200?text=Error+Cargando');
        } finally {
          setLoadingImage(false);
        }
      }
    };

    buscarPortadaLibro();
  }, [libro.titulo, libro.portada_url, libro.isbn]);

  const handleImageError = () => {
    if (!imageError) {
      setImageUrl('https://via.placeholder.com/150x200?text=No+Portada');
      setImageError(true);
    }
  };

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      if (window.confirm(`¿Eliminar "${libro.titulo}"?`)) {
        onDelete(libro.id_libro);
      }
    }
  };

  return (
    <div className="libro-card">
      <div className="libro-portada-container">
        {loadingImage ? (
          <div className="portada-loading">
            <span>Cargando portada...</span>
          </div>
        ) : (
          <img
            className="libro-portada"
            src={imageUrl}
            alt={`Portada de ${libro.titulo}`}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>

      <div className="libro-info">
        <h3 className="libro-titulo">{libro.titulo}</h3>

        {libro.autor && (
          <p className="libro-autor">
            {libro.autor.nombre} {libro.autor.apellido}
          </p>
        )}

        {libro.categoria && (
          <p className="libro-categoria">{libro.categoria.nombre_categoria}</p>
        )}

        <div className="libro-detalles">
          <span>Año: {libro.anio_publicacion || 'Desconocido'}</span>
          <span>Disponibles: {libro.cantidad_disponible}</span>
        </div>
      </div>

      <div className="libro-actions">
        {onEdit && (
          <button
            className="btn-edit"
            onClick={() => onEdit(libro)}
            aria-label="Editar libro"
          >
            <i className="bi bi-pencil"></i> Editar
          </button>
        )}
        {onDelete && (
          <button
            className="btn-delete"
            onClick={handleDelete}
            aria-label="Eliminar libro"
          >
            <i className="bi bi-trash"></i> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

LibroCard.propTypes = {
  libro: PropTypes.shape({
    id_libro: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    titulo: PropTypes.string.isRequired,
    portada_url: PropTypes.string,
    isbn: PropTypes.string,
    autor: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string
    }),
    categoria: PropTypes.shape({
      nombre_categoria: PropTypes.string
    }),
    anio_publicacion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cantidad_disponible: PropTypes.number
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

LibroCard.defaultProps = {
  onEdit: null,
  onDelete: null
};

export default LibroCard;