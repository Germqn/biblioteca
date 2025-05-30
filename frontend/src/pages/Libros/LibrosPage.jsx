import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LibroCard from '../../components/Libros/LibroCard';
import LibroForm from '../../components/Libros/LibroForm';
import LibrosCarrusel from '../../components/Libros/LibrosCarrusel';
import './LibrosPage.css';
import '../../components/Libros/LibroCard.css';
import '../../components/Libros/LibroForm.css';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [libroEdit, setLibroEdit] = useState(null);
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carruselKey, setCarruselKey] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const cargarDatos = async () => {
    try {
      const [librosRes, autoresRes, categoriasRes] = await Promise.all([
        axios.get('http://localhost:3001/api/libros'),
        axios.get('http://localhost:3001/api/autores'),
        axios.get('http://localhost:3001/api/categorias')
      ]);

      const librosProcesados = librosRes.data.map(libro => ({
        ...libro,
        id_autor: libro.id_autor ? Number(libro.id_autor) : null,
        id_categoria: libro.id_categoria ? Number(libro.id_categoria) : null,
        anio_publicacion: Number(libro.anio_publicacion),
        cantidad_disponible: Number(libro.cantidad_disponible)
      }));

      setLibros(librosProcesados);
      setAutores(autoresRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos: ' + (error.response?.data?.message || error.message));
    }
  };

  // Función para guardar la portada en la base de datos
  const handleSaveCover = async (libroId, coverUrl) => {
    try {
      // Actualizar solo el campo portada_url
      await axios.patch(`http://localhost:3001/api/libros/${libroId}`, {
        portada_url: coverUrl
      });
      
      // Actualizar el estado local
      setLibros(prevLibros => prevLibros.map(libro => 
        libro.id_libro === libroId ? { ...libro, portada_url: coverUrl } : libro
      ));
      
      // Forzar actualización del carrusel
      setCarruselKey(prev => prev + 1);
    } catch (error) {
      console.error("Error guardando portada en BD:", error);
      alert('Error al guardar la portada: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditarLibro = (libro) => {
    setLibroEdit({
      id_libro: libro.id_libro,
      titulo: libro.titulo || '',
      id_autor: libro.id_autor !== null && libro.id_autor !== undefined ? String(libro.id_autor) : '',
      id_categoria: libro.id_categoria !== null && libro.id_categoria !== undefined ? String(libro.id_categoria) : '',
      anio_publicacion: libro.anio_publicacion || new Date().getFullYear(),
      cantidad_disponible: libro.cantidad_disponible || 1,
      portada_url: libro.portada_url || '' // Asegurar que tenemos la portada
    });
    setMostrarFormulario(true);
  };

  const handleGuardar = async (formData) => {
    try {
      if (!formData.titulo.trim()) {
        alert('El título es requerido');
        return;
      }

      const libroData = {
        titulo: formData.titulo,
        id_autor: formData.id_autor ? Number(formData.id_autor) : null,
        id_categoria: formData.id_categoria ? Number(formData.id_categoria) : null,
        anio_publicacion: Number(formData.anio_publicacion),
        cantidad_disponible: Number(formData.cantidad_disponible),
        // Mantener la portada_url si existe
        portada_url: formData.portada_url || libroEdit?.portada_url || null
      };

      if (libroEdit) {
        await axios.put(
          `http://localhost:3001/api/libros/${libroEdit.id_libro}`,
          libroData
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/libros',
          libroData
        );
      }

      setMostrarFormulario(false);
      setLibroEdit(null);
      await cargarDatos();
      setCarruselKey(prev => prev + 1);
      alert(libroEdit ? 'Libro actualizado correctamente' : 'Libro creado correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      try {
        await axios.delete(`http://localhost:3001/api/libros/${id}`);
        await cargarDatos();
        setCarruselKey(prev => prev + 1);
        alert('Libro eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar libro:', error);
        alert('Error al eliminar el libro: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`libros-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="libros-header">
        <div className="header-title-container">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-back-visible"
          >
            <i className="bi bi-arrow-left"></i> Regresar
          </button>
          <h2>Gestión de Libros</h2>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
          {darkMode ? (
              <>
                <FaSun className="theme-icon" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <FaMoon className="theme-icon" />
                <span>Modo Oscuro</span>
              </>
            )}
          </button>
          <button
            className={'btn btn-nuevo-libro'}
            onClick={() => {
              setLibroEdit(null);
              setMostrarFormulario(true);
            }}
          >
            <i className="bi bi-plus-lg"></i> Nuevo Libro
          </button>
        </div>
      </div>

      <LibrosCarrusel
        key={`carrusel-${carruselKey}`}
        libros={libros}
        onEdit={handleEditarLibro}
        onDelete={handleEliminar}
        onSaveCover={handleSaveCover} // Pasamos la función al carrusel
        darkMode={darkMode}
      />

      {mostrarFormulario && (
        <div className="libro-form-overlay">
          <div className="libro-form-container">
            <LibroForm
              initialLibro={libroEdit || {}}
              autores={autores}
              categorias={categorias}
              onSave={handleGuardar}
              onCancel={() => {
                setMostrarFormulario(false);
                setLibroEdit(null);
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      <div className="libros-grid">
        {libros.length > 0 ? (
          libros.map(libro => (
            <div key={libro.id_libro} className="libro-item">
              <LibroCard
                libro={libro}
                onEdit={handleEditarLibro}
                onDelete={handleEliminar}
                onSaveCover={handleSaveCover} // Pasamos la función a cada tarjeta
                darkMode={darkMode}
              />
            </div>
          ))
        ) : (
          <div className="no-libros">
            <div className="alert alert-info">No se encontraron libros registrados</div>
          </div>
        )}
      </div>
    </div>
  );
}