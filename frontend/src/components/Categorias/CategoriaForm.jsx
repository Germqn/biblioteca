import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CategoriaForm.css';

const CategoriaForm = ({
  categoriaEdit,
  onSave,
  onCancel,
  onUpdateSuccess,
  darkMode,
  isVisible
}) => {
  const [nombre, setNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const inputRef = useRef(null);

  // Manejar el scroll del body cuando el modal está abierto/cerrado
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('modal-open');
      // Focus en el input después de que se abra el modal
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isVisible]);

  // Cargar datos de categoría para edición
  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre_categoria);
    } else {
      setNombre('');
    }
    setError('');
  }, [categoriaEdit]);

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
  }, [isVisible, isSubmitting, nombre]);

  const validateForm = () => {
    if (!nombre.trim()) {
      setError('El nombre de la categoría es requerido');
      return false;
    }

    if (nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (nombre.trim().length > 100) {
      setError('El nombre no puede exceder 100 caracteres');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const nombreTrimmed = nombre.trim();

      if (categoriaEdit) {
        const response = await axios.put(
          `http://localhost:3001/api/categorias/${categoriaEdit.id_categoria}`,
          { nombre_categoria: nombreTrimmed }
        );

        // Mostrar mensaje de éxito
        onUpdateSuccess({
          ...response.data,
          message: 'Categoría actualizada exitosamente'
        });
      } else {
        const response = await axios.post('http://localhost:3001/api/categorias', {
          nombre_categoria: nombreTrimmed,
        });

        // Mostrar mensaje de éxito
        onSave({
          ...response.data,
          message: 'Categoría creada exitosamente'
        });
      }

      // Cerrar modal con animación
      handleClose();

    } catch (error) {
      console.error('Error al guardar la categoría:', error);

      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        setError('Ya existe una categoría con este nombre');
      } else if (error.response?.status === 400) {
        setError('Datos inválidos. Verifica la información ingresada');
      } else if (error.response?.status >= 500) {
        setError('Error del servidor. Intenta nuevamente más tarde');
      } else {
        setError('Error al guardar la categoría. Intenta nuevamente');
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
      setError('');
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
    const value = e.target.value;
    setNombre(value);

    // Limpiar error cuando el usuario empiece a escribir
    if (error && value.trim()) {
      setError('');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`categoria-form-overlay ${isVisible && !isClosing ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="categoria-form">
        <button
          className="categoria-form-close"
          onClick={handleClose}
          type="button"
          disabled={isSubmitting}
          aria-label="Cerrar modal"
          title="Cerrar (Esc)"
        >
          ×
        </button>

        <h3 className="categoria-form-title">
          {categoriaEdit ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la categoría:</label>
            <input
              ref={inputRef}
              type="text"
              value={nombre}
              onChange={handleInputChange}
              placeholder="Ej: Ciencia Ficción, Romance, Misterio..."
              required
              disabled={isSubmitting}
              maxLength={100}
              autoComplete="off"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-guardar"
              disabled={isSubmitting || !nombre.trim() || !!error}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  {categoriaEdit ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                categoriaEdit ? 'Actualizar' : 'Guardar'
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

export default CategoriaForm;