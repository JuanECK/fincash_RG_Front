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

// ===========================================
// 🔄 INYECCIÓN DE INTERCEPTOR DE RESPUESTA (RESPONSE) GLOBAL
// Variable auxiliar tipo callback que guardará la función logout del contexto
export let logoutGlobalCallback: (() => void) | null = null;
let abrirModalErrorCallback: ((mensaje: string) => void) | null = null;

// Función puente actualizada que enlazará el App.tsx con este archivo
export const vincularSeguridadConAxios = (
  logoutFn: () => void,
  abrirModalFn: (mensaje: string) => void
) => {
  logoutGlobalCallback = logoutFn;
  abrirModalErrorCallback = abrirModalFn;
};


api.interceptors.response.use(
  (response) => {
    // 🛡️ DETECTOR ADAPTATIVO PARA RESPUESTAS ENMASCARADAS (HTTP 200 con Status Interno)
    // Evaluamos si el backend envió el código de expulsión dentro del cuerpo del JSON
    // console.log(response)

     // 🔍 AUDITORÍA DE RUTA: Obtenemos la URL de la petición actual
    const urlPeticion = response.config.url || '';

    // 🛡️ LISTA BLANCA (Exclusiones de Seguridad):
    // Definimos las rutas que TIENEN permitido responder con 401/403 sin tirar el sistema.
    // Al cargar la página, /auth/me responderá 401 de forma natural si no hay cookies, y eso está BIEN.
    const esRutaExcluida = urlPeticion.includes('/auth/login') || urlPeticion.includes('/auth/me');

    if (response.data && (response.data.status === 403 || response.data.status === 401)) {
      
      // 🚨 CORTOCIRCUITO: Si la ruta está en la lista blanca, dejamos pasar el error limpiamente
      // hacia el componente (para que el LoginPage apague el cargando o no te auto-redirija)
      if (esRutaExcluida) {
        return response;
      }
      
       // 🚷 Si NO es una ruta excluida (ej: estás dentro del Dashboard e intentas consultar /admin/tarjetahabientes),
      // significa que tu sesión expiró de verdad o te revocaron los permisos en AWS. Ejecutamos la expulsión:
      console.warn(`⛔ [SEGURIDAD FRONT] Detectado Status Interno ${response.data.status}. Expulsando usuario...`);

      // 1. Limpiamos el estado global en la memoria RAM de React
      // if (logoutGlobalCallback) {
      //   logoutGlobalCallback();
      // }
      
      // 2. Sacamos al usuario a la raíz borrando el historial de navegación
      // window.location.href = '/';

      // 🚨 ENCIENDE EL MODAL COMPARTIDO EN LUGAR DE REFRESCAR LA PÁGINA
      if (abrirModalErrorCallback) {
        const mensajeServidor = response.data.error?.message || 'Tu sesión ha caducado por inactividad o seguridad.';
        abrirModalErrorCallback(mensajeServidor);
      }
      
      // Cancelamos el flujo de la petición retornando una promesa rechazada
      // para que el componente de React no intente renderizar datos corruptos
      return Promise.reject(new Error(`Acceso denegado: Código ${response.data.status}`));
    }

    // Si el status interno es 'success' o correcto, dejamos pasar la respuesta intacta
    return response;
  },
  (error) => {
    // Este bloque queda únicamente como respaldo por si el servidor de AWS sufriera 
    // una caída total de red (HTTP 500 o 502), la cual sí arrojaría un error nativo
    return Promise.reject(error);
  }
);
// ===========================================

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
