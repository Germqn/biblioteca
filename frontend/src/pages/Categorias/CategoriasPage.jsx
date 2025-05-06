import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategorias, deleteCategoria } from "../../services/categoriaService";
import CategoriaCard from "../../components/Categorias/CategoriaCard";
import CategoriaForm from "../../components/Categorias/CategoriaForm";
import './CategoriasPage.css';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const res = await getCategorias();
      setCategorias(Array.isArray(res?.data) ? res.data : []);
      setError(null);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      setError("Error al cargar categorías");
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        await deleteCategoria(id);
        setCategorias(prev => prev.filter(cat => cat.id_categoria !== id));
      } catch (error) {
        console.error("Error eliminando categoría:", error);
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
  };

  const handleCreateSuccess = (newCategoria) => {
    setCategorias(prev => [...prev, newCategoria]);
  };

  return (
    <div className="container categorias-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i> Regresar
        </button>
        <h1 className="page-title mb-0">Categorías</h1>
        <div style={{ width: '160px' }}></div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <CategoriaForm 
            categoriaEdit={categoriaEdit}
            onSave={handleCreateSuccess}
            onCancel={() => setCategoriaEdit(null)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </div>
        <div className="col-md-6">
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando categorías...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : categorias.length === 0 ? (
            <div className="alert alert-info">No hay categorías registradas.</div>
          ) : (
            <div className="categorias-list">
              {categorias.map((categoria) => (
                <CategoriaCard 
                  key={categoria.id_categoria} 
                  categoria={categoria}
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