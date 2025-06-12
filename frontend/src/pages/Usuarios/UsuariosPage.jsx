import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Plus,
  X,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import UsuariosForm from '../../components/Usuarios/UsuariosForm';
import UsuariosList from '../../components/Usuarios/UsuariosList';
import './UsuariosPage.css';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Lógica corregida para el tema - igual que en Dashboard
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Guardar la preferencia cada vez que cambie
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Función para cargar usuarios de la API
  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios: ' + err.message);
      
      // Fallback a datos de ejemplo si falla la API
      const usuariosEjemplo = [
        { id: 1, id_usuario: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com' },
        { id: 2, id_usuario: 2, nombre: 'María', apellido: 'García', email: 'maria.garcia@email.com' },
        { id: 3, id_usuario: 3, nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@email.com' },
        { id: 4, id_usuario: 4, nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@email.com' }
      ];
      setUsuarios(usuariosEjemplo);
      setFilteredUsuarios(usuariosEjemplo);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    const filtered = usuarios.filter(usuario =>
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm]);

  // Función para manejar cuando se guarda un nuevo usuario
  const handleSave = (usuarioData) => {
    setUsuarios(prev => [...prev, usuarioData]);
    setSuccessMessage(usuarioData.message || 'Usuario creado exitosamente');
    setMostrarFormulario(false);
    setEditingUser(null);
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Función para manejar cuando se actualiza un usuario
  const handleUpdateSuccess = (usuarioData) => {
    const updatedUsuarios = usuarios.map(usuario =>
      usuario.id === editingUser.id || usuario.id_usuario === editingUser.id_usuario 
        ? { ...usuario, ...usuarioData } 
        : usuario
    );
    setUsuarios(updatedUsuarios);
    setSuccessMessage(usuarioData.message || 'Usuario actualizado exitosamente');
    setMostrarFormulario(false);
    setEditingUser(null);
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      setUsuarios(usuarios.filter(usuario => 
        usuario.id !== id && usuario.id_usuario !== id
      ));
      setSuccessMessage('Usuario eliminado exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('Error al eliminar usuario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setEditingUser(null);
    setError(null);
  };

  // Función corregida para cambiar tema - igual que en Dashboard
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Guardar inmediatamente la nueva preferencia
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const closeError = () => {
    setError(null);
  };

  const closeSuccessMessage = () => {
    setSuccessMessage('');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setMostrarFormulario(true);
  };

  return (
    <div className={`usuarios-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="usuarios-content">
        {/* Header */}
        <header className="usuarios-header">
          <div className="header-left">
            <button 
              onClick={handleGoBack}
              className="btn-wine btn-back"
              title="Volver"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="header-title-group">
              <User className="header-icon" />
              <div className="header-text">
                <h1>Gestión de Usuarios</h1>
                <p>Administra los usuarios del sistema</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              onClick={toggleDarkMode}
              className="btn-wine btn-theme"
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleAddUser}
              className="btn-wine btn-add"
              disabled={loading}
            >
              <Plus size={18} />
              Agregar Usuario
            </button>
          </div>
        </header>

        {/* Debug Panel */}
        <div className="debug-panel">
          <strong>Estado de la aplicación:</strong><br />
          Usuarios cargados: {usuarios.length} | 
          Filtrados: {filteredUsuarios.length} | 
          Término de búsqueda: "{searchTerm}" | 
          Modo: {darkMode ? 'Oscuro' : 'Claro'} | 
          API URL: {API_BASE_URL} | 
          Tema guardado: {localStorage.getItem("darkMode")} |
          Modal abierto: {mostrarFormulario ? 'Sí' : 'No'}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-alert">
            <span>{successMessage}</span>
            <button onClick={closeSuccessMessage} className="success-close">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <span>{error}</span>
            <button onClick={closeError} className="error-close">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Lista de Usuarios */}
        <UsuariosList
          filteredUsuarios={filteredUsuarios}
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={handleSearchChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Formulario de Usuario Modal */}
        <UsuariosForm
          usuarioEdit={editingUser}
          onSave={handleSave}
          onCancel={handleCancel}
          onUpdateSuccess={handleUpdateSuccess}
          darkMode={darkMode}
          isVisible={mostrarFormulario}
        />
      </div>
    </div>
  );
};

export default UsuariosPage;