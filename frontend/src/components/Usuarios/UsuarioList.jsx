export default function UsuarioList({ usuarios, handleDelete, setUsuarioEdit }) {
  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id_usuario}>
            {usuario.nombre} {usuario.apellido}
            <button onClick={() => setUsuarioEdit(usuario)}>Editar</button>
            <button onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
