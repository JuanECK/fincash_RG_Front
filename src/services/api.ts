import axios from 'axios';
import CryptoJS from 'crypto-js';

// En producción, esto vendría de un archivo .env del frontend (import.meta.env.VITE_API_URL)

const API_URL = import.meta.env.VITE_API_URL;
const HMAC_SECRET = import.meta.env.VITE_HMAC_SECRET;

// Pequeña validación defensiva en desarrollo para avisarte si olvidaste configurar el archivo
if (!HMAC_SECRET) {
  console.error("❌ ERROR CRÍTICO: No se encontró la variable VITE_HMAC_SECRET en el entorno.");
}

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

  if (HMAC_SECRET && config.data && (config.method === 'post' || config.method === 'put' || config.method === 'patch')) {
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

export const abrirVisorComprobantePdf = async (nombreArchivoUuid: string): Promise<boolean> => {
  try {
    // console.log(`[NETWORK] Solicitando flujo de bytes para el archivo: ${nombreArchivoUuid}`);
    
    // Solicitamos el archivo binario completo a AWS
    const response = await api.get(`/admin/visor-pdf/${nombreArchivoUuid}`, {
      responseType: 'blob', 
    });

    // Control de fallos por si el archivo fue borrado del disco duro
    if (response.data.type === 'application/json') {
      const textoError = await response.data.text();
      const objetoError = JSON.parse(textoError);
      alert(objetoError.error?.message || 'No se pudo abrir el comprobante.');
      return false;
    }

    // 🚀 PROCESO DE RENDERIZADO INTERACTIVO EN PESTAÑA NUEVA
    // 1. Convertimos los bytes recibidos de AWS en un objeto Blob de tipo PDF legítimo
    const archivoBlob = new Blob([response.data], { type: 'application/pdf' });
    
    // 2. Creamos una URL temporal en la memoria RAM apuntando al Blob
    const blobUrl = window.URL.createObjectURL(archivoBlob);
    
    // 3. 🪟 ¡LA MAGIA!: Abrimos una pestaña nueva en blanco en Chrome e inyectamos la URL del Blob
    // El navegador detectará que es 'application/pdf' y activará de forma automática 
    // su interfaz nativa con los botones de Descargar, Imprimir, Ajustar Zoom y Rotar.
    const nuevaPestana = window.open(blobUrl, '_blank');

    if (!nuevaPestana) {
      alert('El navegador bloqueó la ventana emergente. Por favor, permite los popups para esta página.');
      return false;
    }

    // 🧹 LIMPIEZA DE MEMORIA OPTIMIZADA:
    // Liberamos el espacio de la RAM un minuto después para dar tiempo a que el usuario termine de leer/imprimir
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error abriendo el visor de PDF:', error);
    alert('No se pudo establecer conexión con el servidor de AWS para visualizar el archivo.');
    return false;
  }
};
