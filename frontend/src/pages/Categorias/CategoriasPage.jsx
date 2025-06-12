import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCategorias, deleteCategoria } from "../../services/categoriaService";
import { getLibros } from "../../services/libroService";
import CategoriaCard from "../../components/Categorias/CategoriaCard";
import CategoriaForm from "../../components/Categorias/CategoriaForm";
import './CategoriasPage.css';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [libros, setLibros] = useState([]);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Cambio: usar mostrarFormulario

  // Inicializar darkMode igual que en LibrosPage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const navigate = useNavigate();

  // Efecto para aplicar el modo oscuro al body, igual que en LibrosPage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriasData, librosData] = await Promise.all([
          getCategorias(),
          getLibros()
        ]);

        // Logs para debugging
        console.log('=== DATOS CARGADOS ===');
        console.log('Raw categoriasData:', categoriasData);
        console.log('Raw librosData:', librosData);

        const processedCategorias = Array.isArray(categoriasData?.data) ? categoriasData.data : [];
        const processedLibros = Array.isArray(librosData) ? librosData : [];

        console.log('Categorías procesadas:', processedCategorias);
        console.log('Libros procesados:', processedLibros);
        console.log('Cantidad de categorías:', processedCategorias.length);
        console.log('Cantidad de libros:', processedLibros.length);

        // Log de estructura de datos
        if (processedCategorias.length > 0) {
          console.log('Estructura de primera categoría:', processedCategorias[0]);
          console.log('Claves de categoría:', Object.keys(processedCategorias[0]));
        }

        if (processedLibros.length > 0) {
          console.log('Estructura de primer libro:', processedLibros[0]);
          console.log('Claves de libro:', Object.keys(processedLibros[0]));
          console.log('TODAS LAS CLAVES DEL PRIMER LIBRO:', Object.keys(processedLibros[0]));
          console.log('VALORES DE TODAS LAS CLAVES:');
          Object.keys(processedLibros[0]).forEach(key => {
            console.log(`- ${key}:`, processedLibros[0][key], `(tipo: ${typeof processedLibros[0][key]})`);
          });
        }
        console.log('====================');

        setCategorias(processedCategorias);
        setLibros(processedLibros);
        setError(null);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error loading data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await deleteCategoria(id);
        setCategorias(prev => prev.filter(cat => cat.id_categoria !== id));
        setSuccessMessage("Categoría eliminada correctamente");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error("Error eliminando categoría:", error);
        setError("Error eliminando categoría");
      }
    }
  };

  // Función de guardado simplificada como en AutoresPage
  const handleGuardar = async (formData) => {
    try {
      if (categoriaEdit) {
        // Actualizar categoría existente
        setCategorias(prev =>
          prev.map(cat =>
            cat.id_categoria === categoriaEdit.id_categoria ? { ...cat, ...formData } : cat
          )
        );
        setSuccessMessage("Categoría actualizada correctamente");
      } else {
        // Crear nueva categoría
        const newCategoria = { ...formData, id_categoria: Date.now() }; // ID temporal
        setCategorias(prev => [...prev, newCategoria]);
        setSuccessMessage("Categoría creada correctamente");
      }
      
      setMostrarFormulario(false);
      setCategoriaEdit(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error guardando categoría:', error);
      setError('Error al guardar la categoría. Por favor intente nuevamente.');
    }
  };

  // Función para toggle del modo oscuro, igual que en LibrosPage
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const librosPorCategoria = useMemo(() => {
    console.log('=== CREANDO MAPA DE LIBROS ===');
    console.log('Libros para mapear:', libros);

    const map = new Map();

    libros.forEach((libro, index) => {
      console.log(`Procesando libro ${index + 1}:`, libro);
      console.log(`- Objeto categoria completo:`, libro.categoria);
      console.log(`- ID categoria del libro: ${libro.categoria?.id_categoria}`);
      console.log(`- Tipo de id_categoria:`, typeof libro.categoria?.id_categoria);

      const categoriaId = libro.categoria?.id_categoria;

      if (!map.has(categoriaId)) {
        map.set(categoriaId, []);
        console.log(`- Creada nueva entrada para categoría: ${categoriaId}`);
      }
      map.get(categoriaId).push(libro);
      console.log(`- Libro agregado a categoría: ${categoriaId}`);
    });

    console.log('Mapa final:', map);
    console.log('Claves del mapa:', Array.from(map.keys()));
    map.forEach((librosArray, categoriaId) => {
      console.log(`Categoría ${categoriaId} tiene ${librosArray.length} libros:`, librosArray);
    });
    console.log('=============================');

    return map;
  }, [libros]);

  return (
    <div className={`categorias-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>Regresar
        </button>

        <h1 className="page-title">Categorías</h1>

        <div className="header-actions">
          <button
            className="btn btn-dark-mode"
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
            className="btn btn-add"
            onClick={() => {
              setCategoriaEdit(null);
              setMostrarFormulario(true); // Cambio: usar mostrarFormulario
            }}
          >
            <i className="bi bi-plus-lg me-2"></i>Añadir Categoría
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Formulario simplificado como en AutoresPage */}
      <CategoriaForm
        initialCategoria={categoriaEdit || {}}
        onSave={handleGuardar}
        onCancel={() => {
          setMostrarFormulario(false);
          setCategoriaEdit(null);
        }}
        isVisible={mostrarFormulario} // Controla la visibilidad del formulario
        darkMode={darkMode}
      />

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando categorías...</p>
        </div>
      ) : categorias.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay categorías disponibles. Crea una nueva categoría para empezar.
        </div>
      ) : (
        <div className="categorias-grid">
          {categorias.map((categoria) => {
            const librosDeCategoria = librosPorCategoria.get(categoria.id_categoria) || [];

            // Log específico para cada categoría
            console.log(`=== RENDERIZANDO CATEGORIA ${categoria.nombre_categoria} ===`);
            console.log('ID de categoría:', categoria.id_categoria);
            console.log('Tipo de ID:', typeof categoria.id_categoria);
            console.log('Buscando en mapa con key:', categoria.id_categoria);
            console.log('Libros encontrados:', librosDeCategoria);
            console.log('Cantidad de libros:', librosDeCategoria.length);
            console.log('Todas las keys del mapa:', Array.from(librosPorCategoria.keys()));
            console.log('================================================');

            return (
              <CategoriaCard
                key={categoria.id_categoria}
                categoria={categoria}
                libros={librosDeCategoria}
                onEdit={() => {
                  setCategoriaEdit(categoria);
                  setMostrarFormulario(true); 
                }}
                onDelete={() => handleDelete(categoria.id_categoria)}
                darkMode={darkMode}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}