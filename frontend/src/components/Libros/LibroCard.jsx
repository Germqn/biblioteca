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
          // Preparar términos de búsqueda
          const autorCompleto = libro.autor 
            ? `${libro.autor.nombre} ${libro.autor.apellido}`.trim()
            : '';

          // Intento con OpenLibrary API - búsqueda combinada
          let searchQuery = `title:${encodeURIComponent(libro.titulo)}`;
          
          if (autorCompleto) {
            searchQuery += `+author:${encodeURIComponent(autorCompleto)}`;
          }
          
          if (libro.anio_publicacion) {
            searchQuery += `+first_publish_year:${libro.anio_publicacion}`;
          }

          const openLibResponse = await fetch(
            `https://openlibrary.org/search.json?q=${searchQuery}&limit=5`
          );
          const openLibData = await openLibResponse.json();

          // Buscar la mejor coincidencia en OpenLibrary
          if (openLibData.docs?.length > 0) {
            let bestMatch = null;
            let bestScore = 0;

            for (const doc of openLibData.docs) {
              let score = 0;
              
              // Comparar título
              if (doc.title && doc.title.toLowerCase().includes(libro.titulo.toLowerCase())) {
                score += 3;
              }
              
              // Comparar autor
              if (autorCompleto && doc.author_name) {
                const docAuthors = doc.author_name.join(' ').toLowerCase();
                if (docAuthors.includes(autorCompleto.toLowerCase())) {
                  score += 2;
                }
              }
              
              // Comparar año
              if (libro.anio_publicacion && doc.first_publish_year) {
                if (Math.abs(doc.first_publish_year - parseInt(libro.anio_publicacion)) <= 1) {
                  score += 1;
                }
              }

              if (score > bestScore && doc.cover_i) {
                bestScore = score;
                bestMatch = doc;
              }
            }

            if (bestMatch && bestMatch.cover_i) {
              setImageUrl(`https://covers.openlibrary.org/b/id/${bestMatch.cover_i}-M.jpg`);
              return;
            }
          }

          // Si no hay en OpenLibrary, probamos con Google Books
          let googleQuery = `intitle:${encodeURIComponent(libro.titulo)}`;
          
          if (autorCompleto) {
            googleQuery += `+inauthor:${encodeURIComponent(autorCompleto)}`;
          }

          const googleResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${googleQuery}&maxResults=5`
          );
          const googleData = await googleResponse.json();

          // Buscar la mejor coincidencia en Google Books
          if (googleData.items?.length > 0) {
            let bestMatch = null;
            let bestScore = 0;

            for (const item of googleData.items) {
              const volumeInfo = item.volumeInfo;
              let score = 0;
              
              // Comparar título
              if (volumeInfo.title && volumeInfo.title.toLowerCase().includes(libro.titulo.toLowerCase())) {
                score += 3;
              }
              
              // Comparar autor
              if (autorCompleto && volumeInfo.authors) {
                const bookAuthors = volumeInfo.authors.join(' ').toLowerCase();
                if (bookAuthors.includes(autorCompleto.toLowerCase())) {
                  score += 2;
                }
              }
              
              // Comparar año
              if (libro.anio_publicacion && volumeInfo.publishedDate) {
                const bookYear = parseInt(volumeInfo.publishedDate);
                if (Math.abs(bookYear - parseInt(libro.anio_publicacion)) <= 1) {
                  score += 1;
                }
              }

              if (score > bestScore && volumeInfo.imageLinks?.thumbnail) {
                bestScore = score;
                bestMatch = volumeInfo;
              }
            }

            if (bestMatch && bestMatch.imageLinks?.thumbnail) {
              // Mejorar calidad de imagen de Google Books
              const thumbnail = bestMatch.imageLinks.thumbnail.replace('zoom=1', 'zoom=2');
              setImageUrl(thumbnail);
              return;
            }
          }

          // Si no se encuentra nada, usar placeholder
          setImageUrl('https://via.placeholder.com/150x200.png?text=No+Portada');
        } catch (error) {
          console.error("Error buscando portada:", error);
          setImageUrl('https://via.placeholder.com/150x200.png?text=Error+Cargando');
        } finally {
          setLoadingImage(false);
        }
      }
    };

    buscarPortadaLibro();
  }, [libro.titulo, libro.portada_url, libro.autor, libro.anio_publicacion]);

  const handleImageError = () => {
    if (!imageError) {
      setImageUrl('https://via.placeholder.com/150x200.png?text=No+Portada');
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