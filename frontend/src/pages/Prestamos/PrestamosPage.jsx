import { useEffect, useState } from "react";
import { getPrestamos, deletePrestamo } from "../../services/prestamoService";
import PrestamoList from "../../components/Prestamos/PrestamoList";
import PrestamoForm from "../../components/Prestamos/PrestamoForm";

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [prestamoEdit, setPrestamoEdit] = useState(null);

  useEffect(() => {
    loadPrestamos();
  }, []);

  const loadPrestamos = async () => {
    const res = await getPrestamos();
    setPrestamos(res.data);
  };

  const handleDelete = async (id) => {
    await deletePrestamo(id);
    loadPrestamos();
  };

  return (
    <div className="container">
      <h1>Préstamos</h1>
      <div className="row">
        <div className="col-md-6">
          <PrestamoForm 
            prestamoEdit={prestamoEdit} 
            setPrestamoEdit={setPrestamoEdit} 
            loadPrestamos={loadPrestamos} 
          />
        </div>
        <div className="col-md-6">
          <PrestamoList 
            prestamos={prestamos} 
            handleDelete={handleDelete} 
            setPrestamoEdit={setPrestamoEdit} 
          />
        </div>
      </div>
    </div>
  );
}