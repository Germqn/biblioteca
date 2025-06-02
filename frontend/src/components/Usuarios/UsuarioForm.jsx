import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUsuario, getUsuario, updateUsuario } from "../services/usuarioService";

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: ""
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  useEffect(() => {
    if (esEdicion) {
      getUsuario(id).then(setUsuario);
    }
  }, [id]);

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (esEdicion) {
      await updateUsuario(id, usuario);
    } else {
      await createUsuario(usuario);
    }
    navigate("/usuarios");
  };

  return (
    <div>
      <h2>{esEdicion ? "Editar Usuario" : "Crear Usuario"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar</button>
        <button type="button" onClick={() => navigate("/usuarios")}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default UsuarioForm;
