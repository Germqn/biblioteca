import { useState, useEffect } from "react";
import { createUsuario, updateUsuario } from "../../services/usuarioService";

export default function UsuarioForm({ usuarioEdit, setUsuarioEdit, loadUsuarios }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: ""
  });

  useEffect(() => {
    if (usuarioEdit) setFormData(usuarioEdit);
  }, [usuarioEdit]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (usuarioEdit) {
      await updateUsuario(usuarioEdit.id_usuario, formData);
    } else {
      await createUsuario(formData);
    }
    setUsuarioEdit(null);
    loadUsuarios();
    setFormData({ nombre: "", apellido: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
      <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">{usuarioEdit ? "Actualizar" : "Crear"}</button>
    </form>
  );
}
