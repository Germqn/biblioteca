import React from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import './UsuariosList.css'; // Asegúrate de tener un archivo CSS para estilos

const UsuariosList = ({
  filteredUsuarios,
  searchTerm,
  loading,
  onSearchChange,
  onEdit,
  onDelete
}) => {
  return (
    <>
      {/* Search */}
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Cargando...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="table-container">
          <table className="usuarios-table">
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
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => onEdit(usuario)}
                          className="btn-action btn-edit"
                          disabled={loading}
                          title="Editar usuario"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(usuario.id)}
                          className="btn-action btn-delete"
                          disabled={loading}
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-table-message">
                    {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UsuariosList;