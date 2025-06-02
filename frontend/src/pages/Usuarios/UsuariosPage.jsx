import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Search as SearchIcon,
  X as XIcon,
  ArrowLeft as ArrowLeftIcon,
  Sun as SunIcon,
  Moon as MoonIcon
} from 'lucide-react';
import axios from 'axios';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar los usuarios: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingUser) {
        await axios.put(`http://localhost:3001/api/usuarios/${editingUser.id_usuario}`, formData);
        alert('Usuario actualizado correctamente');
      } else {
        await axios.post('http://localhost:3001/api/usuarios', formData);
        alert('Usuario creado correctamente');
      }

      setMostrarFormulario(false);
      setEditingUser(null);
      setFormData({ nombre: '', apellido: '', email: '' });
      await cargarUsuarios();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      setError(`Error: ${error.response?.data?.message || error.message}`);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarUsuario = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
        await cargarUsuarios();
        alert('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        setError('Error al eliminar el usuario: ' + (error.response?.data?.message || error.message));
        alert('Error al eliminar el usuario: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const cerrarModal = () => {
    setMostrarFormulario(false);
    setEditingUser(null);
    setFormData({ nombre: '', apellido: '', email: '' });
    setError(null); // Limpiar errores al cerrar modal
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className={`rounded-lg shadow-sm border p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Regresar</span>
              </button>
              <div className="flex items-center space-x-3">
                <UserIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Administra los usuarios del sistema</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {darkMode ? (
                  <>
                    <SunIcon className="h-5 w-5" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5" />
                    <span>Modo Oscuro</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ nombre: '', apellido: '', email: '' });
                  setError(null);
                  setMostrarFormulario(true);
                }}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de error global */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Búsqueda */}
        <div className={`rounded-lg shadow-sm border p-4 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando...</span>
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className={`overflow-x-auto rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <table className="min-w-full text-sm">
            <thead>
              <tr className={darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-100'}>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Apellido</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-2">{usuario.apellido}</td>
                  <td className="px-4 py-2">{usuario.email}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button 
                      onClick={() => handleEditarUsuario(usuario)} 
                      disabled={loading}
                      className="text-yellow-500 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleEliminar(usuario.id_usuario)} 
                      disabled={loading}
                      className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsuarios.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-4 text-gray-400">
                    {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulario modal */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button 
                  onClick={cerrarModal} 
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Error en el formulario */}
              {error && (
                <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    onClick={cerrarModal} 
                    disabled={loading}
                    className={`px-4 py-2 rounded hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleGuardar} 
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;