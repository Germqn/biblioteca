import React, { useState, useEffect } from 'react';
import './AutorCard.css';

export default function AutorCard({ autor, onEdit, onDelete }) {
  const [imageUrl, setImageUrl] = useState(autor.imagen);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const buscarImagenAutor = async () => {
      if (!autor.imagen || autor.imagen.includes('ui-avatars.com')) {
        setLoadingImage(true);
        try {
          // Primero intentamos con Wikipedia API
          const wikiResponse = await fetch(
            `https://es.wikipedia.org/w/api.php?action=query&titles=${autor.nombre}+${autor.apellido}&prop=pageimages&format=json&pithumbsize=200&origin=*`
          );
          const wikiData = await wikiResponse.json();
          const pages = wikiData.query?.pages;
          const pageId = Object.keys(pages)[0];
          const thumbnail = pages[pageId]?.thumbnail?.source;

          if (thumbnail) {
            setImageUrl(thumbnail);
            return;
          }

          // Si no hay en Wikipedia, probamos con Google Books API
          const googleResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${autor.nombre}+${autor.apellido}"&maxResults=1`
          );
          const googleData = await googleResponse.json();
          const authorImage = googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

          if (authorImage) {
            setImageUrl(authorImage);
          }
        } catch (error) {
          console.error("Error buscando imagen del autor:", error);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    buscarImagenAutor();
  }, [autor.nombre, autor.apellido, autor.imagen]);

  const handleImageError = (e) => {
    if (!e.target.src.includes('ui-avatars.com')) {
      e.target.src = `https://ui-avatars.com/api/?name=${autor.nombre.charAt(0)}+${autor.apellido.charAt(0)}&size=150`;
    }
  };

  return (
    <div className="autor-card">
      <div className="autor-avatar-container">
        {loadingImage ? (
          <div className="avatar-loading" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span>Cargando...</span>
          </div>
        ) : (
          <img
            className="autor-avatar"
            src={imageUrl}
            alt={`${autor.nombre} ${autor.apellido}`}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>

      <div className="autor-info">
        <h3 className="autor-name">{autor.nombre} {autor.apellido}</h3>
      </div>

      <div className="autor-actions">
        <button className="btn-edit" onClick={() => onEdit(autor)}>
          <i className="bi bi-pencil"></i> Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(autor.id_autor)}>
          <i className="bi bi-trash"></i> Eliminar
        </button>
      </div>
    </div>
  );
}