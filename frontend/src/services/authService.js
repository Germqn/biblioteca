// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/';

// Crear instancia de axios con configuración base
const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// LOGIN
export const login = async (email, password) => {
  try {
    const response = await authAPI.post('login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al iniciar sesión');
  }
};

// REGISTER
export const register = async (userData) => {
  try {
    const response = await authAPI.post('register', {
      nombre: userData.nombre,
      apellido: userData.apellido, // Agregado el apellido
      email: userData.email,
      password: userData.password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al registrar usuario');
  }
};

// VERIFY TOKEN
export const verifyToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await authAPI.post('verify', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.valid && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    
    throw new Error('Token inválido');
  } catch (error) {
    logout();
    throw error;
  }
};

// GET PROFILE
export const getProfile = async () => {
  try {
    const response = await authAPI.get('profile');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al obtener perfil');
  }
};

// UPDATE PROFILE
export const updateProfile = async (profileData) => {
  try {
    const response = await authAPI.put('profile', {
      nombre: profileData.nombre,
      apellido: profileData.apellido,
      email: profileData.email
    });
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al actualizar perfil');
  }
};

// LOGOUT
export const logout = async () => {
  try {
    // Intentar hacer logout en el servidor
    await authAPI.post('logout');
  } catch (error) {
    console.warn('Error al hacer logout en el servidor:', error);
  } finally {
    // Siempre limpiar el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// UTILITY FUNCTIONS
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return token !== null && user !== null;
};

// Función para verificar si el token está próximo a expirar
export const isTokenExpiringSoon = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Considerar que expira pronto si quedan menos de 30 minutos
    return timeUntilExpiry < 1800;
  } catch (error) {
    return true;
  }
};

// INTERCEPTORS
// Interceptor para requests - agregar token automáticamente
authAPI.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores de autenticación
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Manejar diferentes tipos de errores de autenticación
      if (status === 401) {
        const message = data.message || 'Token inválido o expirado';
        
        // Solo hacer logout automático para ciertos errores
        if (message.includes('Token expirado') || 
            message.includes('Token inválido') || 
            message.includes('No token provided')) {
          logout();
          
          // Redirigir solo si no estamos ya en la página de login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      
      if (status === 403) {
        console.warn('Acceso denegado:', data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Aplicar interceptors también a la instancia global de axios
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.url && config.url.includes('localhost:3001')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url && error.config.url.includes('localhost:3001');
      if (isAuthRoute) {
        logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default {
  login,
  register,
  logout,
  verifyToken,
  getProfile,
  updateProfile,
  changePassword,
  getCurrentUser,
  getToken,
  isAuthenticated,
  isTokenExpiringSoon
};