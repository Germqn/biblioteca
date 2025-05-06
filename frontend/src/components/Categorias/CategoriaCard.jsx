import React from 'react';
import './CategoriaCard.css';

const CategoriaCard = ({ categoria, onEdit, onDelete }) => {
  return (
    <div className="categoria-card">
      <h3>{categoria.nombre_categoria}</h3>
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Eliminar</button>
    </div>
  );
};

export default CategoriaCard;
