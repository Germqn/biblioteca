import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './LibroCard.css';

// Placeholder local como SVG en base64
const PLACEHOLDER_IMAGE = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200">
  <rect width="100%" height="100%" fill="#e0e0e0"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="12" 
    text-anchor="middle" 
    dominant-baseline="middle"
    fill="#666"
  >
    No Portada
  </text>
</svg>
`)}`;

// Función para convertir URLs relativas a absolutas
const getAbsoluteImageUrl = (url) => {
  if (!url) return url;
  
  // Si ya es una URL absoluta, retornar tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es una URL con protocolo relativo (//example.com)
  if (url.startsWith('//')) {
    return window.location.protocol + url;
  }
  
  // Si es una ruta relativa, convertir a absoluta
  if (url.startsWith('/')) {
    return window.location.origin + url;
  }
  
  // Para rutas sin slash inicial
  return window.location.origin + '/' + url;
};

const LibroCard = ({ libro, onEdit, onDelete, onSaveCover }) => {
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE);
  const [loadingImage, setLoadingImage] = useState(false);
  const [attemptedSearch, setAttemptedSearch] = useState(false);
  const [coverSaved, setCoverSaved] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      // 1. Intentar cargar portada_url si existe
      if (libro.portada_url) {
        const absoluteUrl = getAbsoluteImageUrl(libro.portada_url);
        
        try {
          setLoadingImage(true);
          await testImage(absoluteUrl);
          setImageUrl(absoluteUrl);
          setLoadingImage(false);
          return; // Salir si la carga es exitosa
        } catch (error) {
          console.warn("Error cargando portada_url:", absoluteUrl, error);
          // Continuar con búsqueda en APIs si falla
        }
      }
      
      // 2. Buscar en APIs externas solo si no se ha intentado antes
      if (!attemptedSearch) {
        searchCoverFromAPIs();
      }
    };

    // Función para probar carga de imágenes
    const testImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
        
        // Timeout para no bloquear indefinidamente
        setTimeout(() => {
          if (!img.complete) reject();
        }, 5000);
      });
    };

    // Guardar la portada en la base de datos
    const saveCoverToDatabase = async (coverUrl) => {
      if (!coverSaved && typeof onSaveCover === 'function') {
        try {
          await onSaveCover(libro.id_libro, coverUrl);
          setCoverSaved(true);
          console.log(`Portada guardada para libro ID ${libro.id_libro}`);
        } catch (error) {
          console.error("Error guardando portada en BD:", error);
        }
      }
    };

    // Buscar portada en APIs externas
    const searchCoverFromAPIs = async () => {
      setLoadingImage(true);
      setAttemptedSearch(true);
      
      try {
        // Preparar términos de búsqueda
        const searchTerms = [
          libro.titulo,
          libro.autor && `${libro.autor.nombre} ${libro.autor.apellido}`,
          libro.anio_publicacion
        ].filter(Boolean).join(' ');
        
        // Variable para guardar la URL encontrada
        let foundCoverUrl = null;
        
        // Intentar con OpenLibrary
        try {
          const openLibResponse = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerms)}&limit=1`
          );
          
          const openLibData = await openLibResponse.json();
          const firstBook = openLibData.docs?.[0];
          
          if (firstBook?.cover_i) {
            foundCoverUrl = `https://covers.openlibrary.org/b/id/${firstBook.cover_i}-M.jpg`;
            await testImage(foundCoverUrl);
          }
        } catch (openLibError) {
          console.warn("Error con OpenLibrary:", openLibError);
        }
        
        // Si no se encontró en OpenLibrary, intentar con Google Books
        if (!foundCoverUrl) {
          try {
            const googleResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerms)}&maxResults=1`
            );
            
            const googleData = await googleResponse.json();
            const firstItem = googleData.items?.[0];
            
            if (firstItem?.volumeInfo?.imageLinks?.thumbnail) {
              foundCoverUrl = firstItem.volumeInfo.imageLinks.thumbnail
                .replace('http://', 'https://')
                .replace('zoom=1', 'zoom=2');
              
              await testImage(foundCoverUrl);
            }
          } catch (googleError) {
            console.warn("Error con Google Books:", googleError);
          }
        }
        
        // Si encontramos una portada válida
        if (foundCoverUrl) {
          setImageUrl(foundCoverUrl);
          
          // Guardar la URL en la base de datos
          saveCoverToDatabase(foundCoverUrl);
        } else {
          // Si no se encontró portada, usar placeholder
          setImageUrl(PLACEHOLDER_IMAGE);
        }
      } catch (error) {
        console.error("Error en búsqueda de portada:", error);
        setImageUrl(PLACEHOLDER_IMAGE);
      } finally {
        setLoadingImage(false);
      }
    };

    loadImage();
  }, [libro, attemptedSearch, coverSaved, onSaveCover]);

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
            onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
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
  onDelete: PropTypes.func,
  onSaveCover: PropTypes.func // Nueva prop para guardar la portada
};

LibroCard.defaultProps = {
  onEdit: null,
  onDelete: null,
  onSaveCover: null
};

export default LibroCard;