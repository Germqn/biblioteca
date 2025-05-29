import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Redbook.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UsuariosPage from "./pages/Usuarios/UsuariosPage.jsx";
import AutoresPage from "./pages/Autores/AutoresPage.jsx";
import CategoriasPage from "./pages/Categorias/CategoriasPage.jsx";
import PrestamosPage from "./pages/Prestamos/PrestamosPage.jsx";
import LibrosPage from "./pages/Libros/LibrosPage.jsx";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
                }   
            />
            <Route
                path="/usuarios"
                element={
                <PrivateRoute>
                    <UsuariosPage />
                </PrivateRoute>
                }
            />
            <Route
                path="/libros"
                element={
                    <PrivateRoute>
                    <LibrosPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/autores"
                element={
                <PrivateRoute>
                    <AutoresPage />
                </PrivateRoute>
                }
            />
            <Route
                path="/categorias"
                element={
                <PrivateRoute>
                    <CategoriasPage />
                </PrivateRoute>
                }
            />
            <Route
                path="/prestamos"
                element={
                <PrivateRoute>
                    <PrestamosPage />
                </PrivateRoute>
                }
            />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;