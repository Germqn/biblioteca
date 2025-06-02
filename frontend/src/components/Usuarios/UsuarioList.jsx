import React, { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario } from "../services/usuarioService";
import { useNavigate } from "react-router-dom";

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      await deleteUsuario(id);
      cargarUsuarios(); // Recargar lista
    }
  };

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <button onClick={() => navigate("/usuarios/crear")}>Crear Usuario</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>
                <button onClick={() => navigate(`/usuarios/editar/${usuario.id_usuario}`)}>Editar</button>
                <button onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosList;
