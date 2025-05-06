import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AutorCard from '../../components/Autores/AutorCard';
import AutorForm from '../../components/Autores/AutorForm';
import './AutoresPage.css';

export default function AutoresPage() {
  const [autores, setAutores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [autorEdit, setAutorEdit] = useState(null);
  const navigate = useNavigate();

  const cargarAutores = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/autores');
      const autoresConImagen = res.data.map(autor => ({
        ...autor,
        imagen: `https://ui-avatars.com/api/?name=${encodeURIComponent(autor.nombre)}+${encodeURIComponent(autor.apellido)}&background=random&size=150`
      }));
      setAutores(autoresConImagen);
    } catch (error) {
      console.error('Error cargando autores:', error);
    }
  };

  const handleGuardar = async (formData) => {
    try {
      if (autorEdit) {
        await axios.put(`http://localhost:3001/api/autores/${autorEdit.id_autor}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/autores', formData);
      }
      setMostrarFormulario(false);
      setAutorEdit(null);
      cargarAutores();
    } catch (error) {
      console.error('Error guardando autor:', error);
      alert('Error al guardar el autor. Por favor intente nuevamente.');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este autor?')) {
      try {
        await axios.delete(`http://localhost:3001/api/autores/${id}`);
        cargarAutores();
      } catch (error) {
        console.error('Error eliminando autor:', error);
        alert('Error al eliminar el autor.');
      }
    }
  };

  useEffect(() => {
    cargarAutores();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline-secondary me-2"
          >
          <i className="bi bi-arrow-left"></i> Regresar 
          </button>
          <h2 className="d-inline-block ms-2">Autores</h2>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setAutorEdit(null);
            setMostrarFormulario(true);
          }}
        >
          <i className="bi bi-plus-lg"></i> Agregar Autor
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card mb-4">
          <div className="card-body">
            <AutorForm 
              initialAutor={autorEdit || {}}
              onSave={handleGuardar}
              onCancel={() => {
                setMostrarFormulario(false);
                setAutorEdit(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="row">
        {autores.length > 0 ? (
          autores.map(autor => (
            <div key={autor.id_autor} className="col-md-6 col-lg-4 mb-4">
              <AutorCard
                autor={autor}
                onEdit={(autor) => {
                  setAutorEdit(autor);
                  setMostrarFormulario(true);
                }}
                onDelete={handleEliminar}
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No hay autores registrados</div>
          </div>
        )}
      </div>
    </div>
  );
}