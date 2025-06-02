import React, { useState } from 'react';
import LibroModal from './LibroModal'; // Asegúrate de que la ruta sea correcta
import './CategoriaCard.css';

const CategoriaCard = ({ categoria, libros, onEdit, onDelete, darkMode }) => {
  const [selectedLibro, setSelectedLibro] = useState(null);

  const handleLibroClick = (libro) => {
    setSelectedLibro(libro);
  };

  const handleCloseModal = () => {
    setSelectedLibro(null);
  };
  // Logs para debugging
  console.log('=== CategoriaCard Debug ===');
  console.log('Categoria recibida:', categoria);
  console.log('ID de categoria:', categoria?.id_categoria);
  console.log('Nombre categoria:', categoria?.nombre_categoria);
  console.log('Libros recibidos:', libros);
  console.log('Cantidad de libros:', libros?.length || 0);
  console.log('Tipo de libros:', typeof libros, Array.isArray(libros));
  
  // Log de cada libro individual
  if (libros && libros.length > 0) {
    libros.forEach((libro, index) => {
      console.log(`Libro ${index + 1}:`, libro);
      console.log(`- ID libro: ${libro?.id_libro}`);
      console.log(`- Título: ${libro?.titulo}`);
      console.log(`- Autor objeto:`, libro?.autor);
      console.log(`- Autor nombre: ${libro?.autor?.nombre}`);
      console.log(`- Autor apellido: ${libro?.autor?.apellido}`);
      console.log(`- ID categoria del libro: ${libro?.categoria?.id_categoria}`);
    });
  }
  console.log('========================');

  return (
    <div className={`categoria-card ${darkMode ? 'dark-mode' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">{categoria.nombre_categoria}</h3>
      </div>
      
      <div className="card-body">
        <h4>Libros en esta categoría:</h4>
        {libros && libros.length > 0 ? (
          <ul className="libros-list">
            {libros.map(libro => (
              <li 
                key={libro.id_libro} 
                className="libro-item clickable"
                onClick={() => handleLibroClick(libro)}
                title="Clic para ver detalles del libro"
              >
                <span className="libro-title">{libro.titulo}</span>
                <span className="libro-author">
                  {libro.autor?.nombre} {libro.autor?.apellido}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p className="no-libros">No hay libros en esta categoría</p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button 
          className="btn-edit"
          onClick={onEdit}
          title="Editar categoría"
        >
          Editar
        </button>
        <button 
          className="btn-delete"
          onClick={onDelete}
          title="Eliminar categoría"
        >
          Eliminar
        </button>
      </div>

      {/* Modal del libro */}
      {selectedLibro && (
        <LibroModal 
          libro={selectedLibro}
          onClose={handleCloseModal}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default CategoriaCard;