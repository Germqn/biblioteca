import { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario } from "../../services/usuarioService";
import UsuarioList from "../../components/Usuarios/UsuarioList";
import UsuarioForm from "../../components/Usuarios/UsuarioForm";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    const res = await getUsuarios();
    setUsuarios(res.data);
  };

  const handleDelete = async (id) => {
    await deleteUsuario(id);
    loadUsuarios();
  };

  return (
    <div className="container">
      <h1>Usuarios</h1>
      <div className="row">
        <div className="col-md-6">
          <UsuarioForm 
            usuarioEdit={usuarioEdit} 
            setUsuarioEdit={setUsuarioEdit} 
            loadUsuarios={loadUsuarios} 
          />
        </div>
        <div className="col-md-6">
          <UsuarioList 
            usuarios={usuarios} 
            handleDelete={handleDelete} 
            setUsuarioEdit={setUsuarioEdit} 
          />
        </div>
      </div>
    </div>
  );
}