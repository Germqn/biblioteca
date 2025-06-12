import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './UsuariosForm.css';

const UsuariosForm = ({
  usuarioEdit,
  onSave,
  onCancel,
  onUpdateSuccess,
  darkMode,
  isVisible
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  const nombreInputRef = useRef(null);

  // Manejar el scroll del body cuando el modal está abierto/cerrado
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('modal-open');
      // Focus en el primer input después de que se abra el modal
      setTimeout(() => {
        if (nombreInputRef.current) {
          nombreInputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isVisible]);

  // Cargar datos de usuario para edición
  useEffect(() => {
    if (usuarioEdit) {
      setFormData({
        nombre: usuarioEdit.nombre || '',
        apellido: usuarioEdit.apellido || '',
        email: usuarioEdit.email || ''
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: ''
      });
    }
    setErrors({});
  }, [usuarioEdit]);

  // Manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isVisible) return;

      switch (event.key) {
        case 'Escape':
          if (!isSubmitting) {
            handleClose();
          }
          break;
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleSubmit(event);
          }
          break;
        default:
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, isSubmitting, formData]);

  const validateForm = () => {
    const newErrors = {};
    const { nombre, apellido, email } = formData;

    // Validar nombre
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    // Validar apellido
    if (!apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    } else if (apellido.trim().length > 50) {
      newErrors.apellido = 'El apellido no puede exceder 50 caracteres';
    }

    // Validar email
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (email.trim().length > 100) {
      newErrors.email = 'El email no puede exceder 100 caracteres';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Ingrese un email válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim()
      };

      if (usuarioEdit) {
        const response = await axios.put(
          `http://localhost:3001/api/usuarios/${usuarioEdit.id_usuario}`,
          userData
        );

        // Mostrar mensaje de éxito
        onUpdateSuccess({
          ...response.data,
          message: 'Usuario actualizado exitosamente'
        });
      } else {
        const response = await axios.post('http://localhost:3001/api/usuarios', userData);

        // Mostrar mensaje de éxito
        onSave({
          ...response.data,
          message: 'Usuario creado exitosamente'
        });
      }

      // Cerrar modal con animación
      handleClose();

    } catch (error) {
      console.error('Error al guardar el usuario:', error);

      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        setErrors({ email: 'Ya existe un usuario con este email' });
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          // Si el servidor devuelve errores específicos por campo
          setErrors(errorData.errors);
        } else {
          setErrors({ general: 'Datos inválidos. Verifica la información ingresada' });
        }
      } else if (error.response?.status >= 500) {
        setErrors({ general: 'Error del servidor. Intenta nuevamente más tarde' });
      } else {
        setErrors({ general: 'Error al guardar el usuario. Intenta nuevamente' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setIsClosing(true);

    // Agregar un pequeño delay para la animación
    setTimeout(() => {
      setIsClosing(false);
      setErrors({});
      onCancel();
    }, 150);
  };

  const handleOverlayClick = (e) => {
    // Solo cerrar si se hace clic en el overlay, no en el modal
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name] && value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Verificar si el formulario es válido para habilitar/deshabilitar el botón
  const isFormValid = () => {
    const { nombre, apellido, email } = formData;
    return nombre.trim() && apellido.trim() && email.trim() && Object.keys(errors).length === 0;
  };

  if (!isVisible) return null;

  return (
    <div className={`usuarios-form-overlay ${isVisible && !isClosing ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="usuarios-form">
        <button
          className="usuarios-form-close"
          onClick={handleClose}
          type="button"
          disabled={isSubmitting}
          aria-label="Cerrar modal"
          title="Cerrar (Esc)"
        >
          ×
        </button>

        <h3 className="usuarios-form-title">
          {usuarioEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              ref={nombreInputRef}
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Juan, María, Carlos..."
              required
              disabled={isSubmitting}
              maxLength={50}
              autoComplete="given-name"
            />
            {errors.nombre && <div className="field-error-message">{errors.nombre}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Ej: García, López, Martínez..."
              required
              disabled={isSubmitting}
              maxLength={50}
              autoComplete="family-name"
            />
            {errors.apellido && <div className="field-error-message">{errors.apellido}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ej: usuario@ejemplo.com"
              required
              disabled={isSubmitting}
              maxLength={100}
              autoComplete="email"
            />
            {errors.email && <div className="field-error-message">{errors.email}</div>}
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-guardar"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  {usuarioEdit ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                usuarioEdit ? 'Actualizar' : 'Guardar'
              )}
            </button>

            <button
              type="button"
              className="btn btn-cancelar"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuariosForm;