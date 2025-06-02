export default function PrestamoList({ prestamos, handleDelete, setPrestamoEdit }) {
  return (
    <div>
      <h2>Lista de Préstamos</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => (
            <tr key={prestamo.id}>
              <td>{prestamo.id}</td>
              <td>{prestamo.Libro?.titulo || "N/A"}</td>
              <td>{prestamo.Usuario?.nombre || "N/A"}</td>
              <td>{prestamo.fecha_prestamo?.slice(0, 10)}</td>
              <td>{prestamo.fecha_devolucion?.slice(0, 10) || "Pendiente"}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => setPrestamoEdit(prestamo)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prestamo.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
