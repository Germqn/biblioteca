import React from 'react';
import './CategoriaCard.css';

const CategoriaCard = ({ categoria, libros, onEdit, onDelete }) => {
  // Filtrar libros que pertenecen a esta categoría
  const librosDeEstaCategoria = libros.filter(libro => 
    libro.id_categoria === categoria.id_categoria
  );

  return (
    <div className="categoria-card">
      <h3>{categoria.nombre_categoria}</h3>
      
      {/* Mostrar libros relacionados */}
      {librosDeEstaCategoria.length > 0 ? (
        <div className="libros-relacionados">
          <h4>Libros en esta categoría:</h4>
          <ul>
            {librosDeEstaCategoria.map(libro => (
              <li key={libro.id_libro}>{libro.titulo}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No hay libros en esta categoría</p>
      )}
      
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Eliminar</button>
    </div>
  );
};

export default CategoriaCard;