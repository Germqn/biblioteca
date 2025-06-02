// services/prestamoService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/prestamos';

export const getPrestamos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        throw error;
    }
};

export const getPrestamo = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener préstamo:', error);
        throw error;
    }
};

export const createPrestamo = async (prestamoData) => {
    try {
        const response = await axios.post(API_URL, prestamoData);
        return response.data;
    } catch (error) {
        console.error('Error al crear préstamo:', error);
        throw error;
    }
};

export const updatePrestamo = async (id, prestamoData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, prestamoData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar préstamo:', error);
        throw error;
    }
};

export const deletePrestamo = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar préstamo:', error);
        throw error;
    }
};

export const devolverLibro = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, {
            fecha_devolucion: new Date().toISOString().split('T')[0]
        });
        return response.data;
    } catch (error) {
        console.error('Error al devolver libro:', error);
        throw error;
    }
};