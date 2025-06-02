import { useEffect, useState } from "react";
import { createPrestamo, updatePrestamo } from "../../services/prestamoService";
import { getLibros } from "../../services/libroService";
import { getUsuarios } from "../../services/usuarioService";

export default function PrestamoForm({ prestamoEdit, setPrestamoEdit, loadPrestamos }) {
  const [prestamo, setPrestamo] = useState({
    id_libro: "",       // Cambiado de libroId a id_libro
    id_usuario: "",     // Cambiado de usuarioId a id_usuario
    fecha_prestamo: "",
    fecha_devolucion: "",
  });

  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLibros();
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (prestamoEdit) {
      setPrestamo({
        id_libro: prestamoEdit.id_libro,
        id_usuario: prestamoEdit.id_usuario,
        fecha_prestamo: prestamoEdit.fecha_prestamo.split('T')[0],
        fecha_devolucion: prestamoEdit.fecha_devolucion?.split('T')[0] || ""
      });
    } else {
      setPrestamo({
        id_libro: "",
        id_usuario: "",
        fecha_prestamo: "",
        fecha_devolucion: ""
      });
    }
  }, [prestamoEdit]);

  const loadLibros = async () => {
    try {
      const res = await getLibros();
      setLibros(res.data);
    } catch (err) {
      setError("Error al cargar libros");
    }
  };

  const loadUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      setError("Error al cargar usuarios");
    }
  };

  const handleChange = (e) => {
    setPrestamo({ ...prestamo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      if (prestamoEdit) {
        await updatePrestamo(prestamoEdit.id, prestamo);
        setPrestamoEdit(null);
      } else {
        await createPrestamo(prestamo);
      }
      loadPrestamos();
    } catch (err) {
      setError("Error al guardar el préstamo: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{prestamoEdit ? "Editar Préstamo" : "Nuevo Préstamo"}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group mb-2">
        <label>Libro</label>
        <select 
          className="form-control" 
          name="id_libro" 
          value={prestamo.id_libro} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccione un libro</option>
          {libros.map((libro) => (
            <option key={libro.id} value={libro.id}>
              {libro.titulo}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-2">
        <label>Usuario</label>
        <select 
          className="form-control" 
          name="id_usuario" 
          value={prestamo.id_usuario} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-2">
        <label>Fecha de préstamo</label>
        <input 
          type="date" 
          className="form-control" 
          name="fecha_prestamo" 
          value={prestamo.fecha_prestamo} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group mb-3">
        <label>Fecha de devolución</label>
        <input 
          type="date" 
          className="form-control" 
          name="fecha_devolucion" 
          value={prestamo.fecha_devolucion} 
          onChange={handleChange} 
        />
      </div>

      <button className="btn btn-primary" type="submit">
        {prestamoEdit ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}