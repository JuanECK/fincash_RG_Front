import axios from 'axios';
import CryptoJS from 'crypto-js';

// En producción, esto vendría de un archivo .env del frontend (import.meta.env.VITE_API_URL)
const API_URL = 'https://appfrg.mx/api/v1';
// const API_URL = 'http://localhost:3000/api/v1';
const HMAC_SECRET = 'FincashRG2026!';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🍪 OBLIGATORIO: Permite el intercambio automático de cookies HttpOnly
});

// Función idéntica al Backend para ordenar el objeto JSON antes de firmar
const sortObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  return Object.keys(obj).sort().reduce<Record<string, any>>((result, key) => {
    result[key] = sortObject(obj[key]);
    return result;
  }, {});
};

// 🔐 Interceptor de Axios: Firma automáticamente cada petición antes de salir a la red
api.interceptors.request.use((config) => {
  if (config.data && (config.method === 'post' || config.method === 'put' || config.method === 'patch')) {
    try {
      const orderedBody = sortObject(config.data);
      const cleanBody = JSON.stringify(orderedBody);
      
      // Generamos el Hash HMAC idéntico al backend
      const hash = CryptoJS.HmacSHA256(cleanBody, HMAC_SECRET).toString(CryptoJS.enc.Hex);
      
      // Inyectamos la cabecera de seguridad
      config.headers['x-signature'] = hash;
    } catch (error) {
      console.error('Error generando la firma criptográfica de la petición', error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const logoutSession = async (): Promise<boolean> => {
  try {
    // Al ser un método POST, el interceptor generará automáticamente la firma HMAC obligatoria
    const response = await api.post('/auth/logout');
    return response.data.status === 200;
  } catch (error) {
    console.error('Error en el proceso de cierre de sesión de red:', error);
    return false;
  }
};