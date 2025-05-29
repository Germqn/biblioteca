import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCategorias, deleteCategoria } from "../../services/categoriaService";
import { getLibros } from "../../services/libroService";
import CategoriaCard from "../../components/Categorias/CategoriaCard";
import CategoriaForm from "../../components/Categorias/CategoriaForm";
import './CategoriasPage.css';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [libros, setLibros] = useState([]);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriasData, librosData] = await Promise.all([
          getCategorias(),
          getLibros()
        ]);
        
        setCategorias(Array.isArray(categoriasData?.data) ? categoriasData.data : []);
        setLibros(Array.isArray(librosData) ? librosData : []);
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
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoria(id);
        setCategorias(prev => prev.filter(cat => cat.id_categoria !== id));
        setSuccessMessage("Category deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Error deleting category");
      }
    }
  };

  const handleUpdateSuccess = (updatedCategoria) => {
    setCategorias(prev => 
      prev.map(cat => 
        cat.id_categoria === updatedCategoria.id_categoria ? updatedCategoria : cat
      )
    );
    setCategoriaEdit(null);
    setSuccessMessage("Category updated successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateSuccess = (newCategoria) => {
    setCategorias(prev => [...prev, newCategoria]);
    setSuccessMessage("Category created successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const librosPorCategoria = useMemo(() => {
    const map = new Map();
    libros.forEach(libro => {
      if (!map.has(libro.id_categoria)) {
        map.set(libro.id_categoria, []);
      }
      map.get(libro.id_categoria).push(libro);
    });
    return map;
  }, [libros]);

  return (
    <div className="container categorias-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>Regresar
        </button>
        <h1 className="page-title mb-0">Categories</h1>
        <div style={{ width: '160px' }}></div>
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

      <div className="row">
        <div className="col-lg-5">
          <CategoriaForm 
            categoriaEdit={categoriaEdit}
            onSave={handleCreateSuccess}
            onCancel={() => setCategoriaEdit(null)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </div>
        <div className="col-lg-7">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando categorias...</p>
            </div>
          ) : categorias.length === 0 ? (
            <div className="alert alert-info text-center">
              No categories found. Create your first category!
            </div>
          ) : (
            <div className="categorias-list">
              {categorias.map((categoria) => (
                <CategoriaCard 
                  key={categoria.id_categoria} 
                  categoria={categoria}
                  libros={librosPorCategoria.get(categoria.id_categoria) || []}
                  onEdit={() => setCategoriaEdit(categoria)}
                  onDelete={() => handleDelete(categoria.id_categoria)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}