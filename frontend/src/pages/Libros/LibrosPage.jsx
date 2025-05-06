import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LibroCard from '../../components/Libros/LibroCard';
import LibroForm from '../../components/Libros/LibroForm';
import LibrosCarrusel from '../../components/Libros/LibrosCarrusel';

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [libroEdit, setLibroEdit] = useState(null);
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carruselKey, setCarruselKey] = useState(0); // Añadido para forzar recarga
  const navigate = useNavigate();

  const cargarDatos = async () => {
    try {
      const [librosRes, autoresRes, categoriasRes] = await Promise.all([
        axios.get('http://localhost:3001/api/libros'),
        axios.get('http://localhost:3001/api/autores'),
        axios.get('http://localhost:3001/api/categorias')
      ]);
      
      setLibros(librosRes.data);
      setAutores(autoresRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    }
  };


  const handleGuardar = async (formData) => {
    try {
      if (!formData.titulo) {
        alert('El título es requerido');
        return;
      }
  

      const libroData = {
        titulo: formData.titulo,
        id_autor: formData.id_autor || null,
        id_categoria: formData.id_categoria || null,
        anio_publicacion: formData.anio_publicacion || new Date().getFullYear(),
        cantidad_disponible: formData.cantidad_disponible ?? 1, 
        portada_url: formData.portada_url || null
      };
  
      console.log('Sending data:', libroData);
  
      let response;
      if (libroEdit) {
        response = await axios.put(`http://localhost:3001/api/libros/${libroEdit.id_libro}`, libroData, {
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: (status) => status < 500
        });
        console.log('Update response:', response.data);
      } else {
        response = await axios.post('http://localhost:3001/api/libros', libroData, {
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: (status) => status < 500
        });
        console.log('Create response:', response.data);
      }
  
      if (response.status >= 400) {

        throw new Error(response.data?.message || 'Error al guardar el libro');
      }
  
      setMostrarFormulario(false);
      setLibroEdit(null);
      await cargarDatos();
      setCarruselKey(prev => prev + 1);
      

      alert(libroEdit ? 'Libro actualizado correctamente' : 'Libro creado correctamente');
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join('\n') || 
                          error.message;
      
      alert(`Error: ${errorMessage}`);
    }
  };
  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este libro?')) {
      try {
        await axios.delete(`http://localhost:3001/api/libros/${id}`);
        await cargarDatos();
        setCarruselKey(prev => prev + 1); // Forzar recarga del carrusel
      } catch (error) {
        console.error('Error eliminando libro:', error);
        alert('Error al eliminar el libro');
      }
    }
  };

  useEffect(() => {
    cargarDatos();
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
          <h2 className="d-inline-block ms-2">Libros</h2>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setLibroEdit(null);
            setMostrarFormulario(true);
          }}
        >
          <i className="bi bi-plus-lg"></i> Agregar Libro
        </button>
      </div>

      {/* Carrusel con key única que cambia al actualizar */}
      <LibrosCarrusel 
        key={`carrusel-${carruselKey}`}
        libros={libros}
        onEdit={(libro) => {
          setLibroEdit(libro);
          setMostrarFormulario(true);
        }}
        onDelete={handleEliminar}
      />

      {mostrarFormulario && (
        <div className="card mb-4">
          <div className="card-body">
            <LibroForm 
              initialLibro={libroEdit || {}}
              autores={autores}
              categorias={categorias}
              onSave={handleGuardar}
              onCancel={() => {
                setMostrarFormulario(false);
                setLibroEdit(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="row">
        {libros.length > 0 ? (
          libros.map(libro => (
            <div key={libro.id_libro} className="col-md-6 col-lg-4 mb-4">
              <LibroCard
                libro={libro}
                onEdit={(libro) => {
                  setLibroEdit(libro);
                  setMostrarFormulario(true);
                }}
                onDelete={handleEliminar}
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No hay libros registrados</div>
          </div>
        )}
      </div>
    </div>
  );
}