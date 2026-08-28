import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api, logoutSession } from '../services/api';

interface TarjetaUsuario {
  Cliente: string;
  correo: string;
  idTarjeta: number;
  noCliente: string;
  noTarjeta: string;
  telefono: string;
}
interface ItemHistorico {
  [key: string]: any; 
}
interface Historico {
  fecha: string;
  items: ItemHistorico[];
}

interface RespuestaBackend {
  usuario: TarjetaUsuario;
  historico: Historico[];
}

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [tarjetahabientes, setTarjetahabientes] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [detallesCliente, setDetallesCliente] = useState<RespuestaBackend | null>(null);
  const [montoTotalCargos, setMontoTotalCargos] = useState(0);
  const [idCentroN, setidCentroN] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [centroActivo, setCentroActivo] = useState('Xolos');
  const limitePorPagina = 15; // Cantidad de filas exactas por pantalla según tu diseño

// =============================================================================================

  const formatearAPesos = (numero:number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(numero);
  };

  const selecionaClienteTarjetabiente = async (idTarjeta:number, item:any) => {
    // idTarjeta = 200
    try {
      const response = await api.post('/admin/detalleCliente',{idTarjeta})
      if(response.status === 200){
        setSelectedClient(item)
        setDetallesCliente(response.data.data)
        console.log(response.data.data)

        return
      }
    } catch {
      
    }

  }

  // 🔄 EFFECT: Se ejecuta al cargar la página y cada vez que cambia 'paginaActual'
  useEffect(() => {
    const cargarDatosPaginados = async () => {
      setIsLoadingTable(true);
      try {
        // Hacemos la consulta parametrizada al Backend pasando la página actual
        const response = await api.get(`/admin/targetahabientes?idCentroN=${idCentroN}&page=${paginaActual}&limit=${limitePorPagina}`);
        
        if (response.data.status === 200) {
          const { tarjetahabientes, paginacion, MontoTotalCargos } = response.data.data;
          console.log(paginacion)
          
          setTarjetahabientes(tarjetahabientes);
          setTotalPaginas(paginacion.totalPaginas);
          setTotalRegistros(paginacion.totalRegistros);
          setMontoTotalCargos(MontoTotalCargos);

          // if (tarjetahabientes && tarjetahabientes.length > 0) {
          //   setSelectedClient(tarjetahabientes[0]); // 👈 Asegúrate de que tenga el [0]
          // } else {
          //   setSelectedClient(null);
          // }

          
          // Seleccionamos automáticamente el primer cliente de la nueva página por estética
          if (tarjetahabientes.length > 0) {
              setSelectedClient(tarjetahabientes);
            }
            // console.log(selectedClient)
        }
      } catch (error) {
        console.error('Error cargando la tabla paginada de red:', error);
      } finally {
        setIsLoadingTable(false);
      }
    };

    cargarDatosPaginados();
  }, [paginaActual]); // 👈 Escucha los cambios de página

// =============================================================================================
// PAGINACION INTELIGENTE
// =============================================================================================


  // 🔢 FUNCIÓN MAESTRA: Calcula qué números de página mostrar y dónde poner los puntos suspensivos
  const renderNumerosPaginacion = () => {
    const paginas: (number | string)[] = [];
    
    // Configuración de la ventana visible del paginador
    const rangoVisible = 1; // Cuántas páginas mostrar a la izquierda y derecha de la página actual
    const maxNumerosIniciales = 5; // Cuántos números mostrar seguidos antes de truncar por primera vez

    // CASO 1: Si hay 6 páginas o menos en total, mostramos todos los números sin truncar nada
    if (totalPaginas <= 6) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } 
    // CASO 2: Si hay más de 6 páginas, aplicamos las reglas de puntos suspensivos
    else {
      // Regla de inicio: Si estamos cerca de las primeras páginas
      if (paginaActual <= maxNumerosIniciales - 2) {
        // Mostramos del 1 al 4 seguidos
        for (let i = 1; i <= maxNumerosIniciales - 1; i++) {
          paginas.push(i);
        }
        paginas.push('...right'); // Puntos suspensivos a la derecha
        paginas.push(totalPaginas); // Siempre mostramos la última página al final
      } 
      // Regla de fin: Si estamos cerca de las últimas páginas (el número después del 2 se convierte en ...)
      else if (paginaActual >= totalPaginas - (maxNumerosIniciales - 3)) {
        paginas.push(1); // Siempre mostramos la primera página al inicio
        paginas.push('...left'); // Puntos suspensivos a la izquierda (el número después del 2 se esconde)
        
        // Mostramos las últimas 4 páginas seguidas
        for (let i = totalPaginas - (maxNumerosIniciales - 2); i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } 
      // Regla intermedia: Si estamos navegando por el centro de la lista (Puntos suspensivos a ambos lados)
      else {
        paginas.push(1);
        paginas.push('...left');
        
        // Bloque central dinámico que acompaña a la página actual
        for (let i = paginaActual - rangoVisible; i <= paginaActual + rangoVisible; i++) {
          paginas.push(i);
        }
        
        paginas.push('...right');
        paginas.push(totalPaginas);
      }
    }

    // Dibujamos los componentes en el HTML/JSX basándonos en el arreglo calculado arriba
    return paginas.map((pag, index) => {
      // Si el elemento es un string de puntos suspensivos, pintamos texto plano no cliqueable
      if (typeof pag === 'string') {
        return (
          <span key={`dots-${index}`} className="px-1 text-(--VerdeNeon) font-bold select-none tracking-widest">
            ...
          </span>
        );
      }

      // Si es un número, pintamos tu botón interactivo tradicional
      return (
        <button type="button"
          key={`page-${pag}`}
          onClick={() => setPaginaActual(pag)}
          className={`pagination-btn ${paginaActual === pag ? 'active' : ''}`}
        >
          {pag}
        </button>
      );
    });
  };

// =============================================================================================
// INICIAMOS EL CIERRE DE SESION SEGURA
// =============================================================================================
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // 1. Avisamos al backend para que limpie cookies y ejecute el SP de SQL Server
    await logoutSession();
    
    // 2. Limpiamos el estado global en el Frontend de React
    logout();
    
    // 3. Redirigimos al Login borrando el historial de navegación
    navigate('/', { replace: true });
  };

//   return (
//     <div className="login-page-container flex-col gap-6">
//       <div className="login-card text-center">
//         <h1 className="login-title mb-2">👑 Panel de Administración (Rol 1)</h1>
//         <p className="text-sm text-white mb-6">Bienvenido: {user?.nombreCompleto}</p>
        
//         <button 
//           type="button"
//           onClick={handleLogout} 
//           disabled={isLoggingOut}
//           className="btn-submit-secure"
//         >
//           {isLoggingOut ? <span className="spinner" /> : 'Cerrar Sistema de Forma Segura'}
//         </button>
//       </div>
//     </div>
//   );

return (
    <div className="dashboard-layout">
      
      {/* 📁 BARRA LATERAL IZQUIERDA (Centros de Negocio) */}
      <aside className="sidebar-panel">
        <div>
          {/* Logo Corporativo FRG */}
          <div className="flex items-center justify-center gap-2 mb-6 px-2 ">
            <svg width="73" height="32" viewBox="0 0 73 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.1118 0H2.47181C1.10798 0 0 1.12259 0 2.5044V29.4936C0 30.8774 1.10798 31.998 2.47181 31.998H29.1098C30.4756 31.998 31.5816 30.8754 31.5816 29.4936V2.5044C31.5816 1.12055 30.4736 0 29.1098 0H29.1118ZM14.1963 28.3608L5.52783 21.5885L11.4263 16.9797L14.1963 19.1453V28.3628V28.3608ZM14.1963 12.8567L11.4263 15.0223L5.52783 10.4136L14.1963 3.64128V12.8588V12.8567ZM17.3893 28.3608V19.1433L20.1593 16.9777L26.0578 21.5864L17.3893 28.3587V28.3608ZM20.1593 15.0223L17.3893 12.8567V3.64128L26.0578 10.4136L20.1593 15.0223Z" fill="white"/>
            <path d="M47.2948 3.51269C47.7722 3.51269 48.0442 3.75353 48.0442 4.23727V5.168C48.0442 5.65174 47.7722 5.92728 47.2948 5.92728H41.7106V14.7917H45.9995C46.4769 14.7917 46.7489 15.0325 46.7489 15.5163V16.447C46.7489 16.9307 46.4769 17.2063 45.9995 17.2063H41.7106V27.728C41.7106 28.2118 41.4386 28.4873 40.9612 28.4873H39.5993C39.1219 28.4873 38.8499 28.2118 38.8499 27.728V4.23727C38.8499 3.75353 39.1219 3.51269 39.5993 3.51269H47.2948Z" fill="white"/>
            <path d="M56.6562 17.1042L60.5725 27.5219C60.7417 27.9362 60.5725 28.4526 59.9943 28.4873H58.4613C58.0523 28.4873 57.8146 28.3158 57.7119 27.9689L53.7634 17.4471H52.4358V27.728C52.4358 28.2118 52.1639 28.4873 51.6864 28.4873H50.3246C49.8472 28.4873 49.5752 28.2118 49.5752 27.728V4.23727C49.5752 3.75353 49.8472 3.51269 50.3246 3.51269H54.1381C58.5982 3.51269 59.7888 5.47824 59.7888 9.03176V11.9301C59.7888 14.6896 59.1422 16.4837 56.6562 17.1042ZM54.1381 15.0346C56.4528 15.0346 56.9645 13.8956 56.9645 11.9301V9.03176C56.9645 7.1009 56.4528 5.92728 54.1381 5.92728H52.4358V15.0346H54.1381Z" fill="white"/>
            <path d="M72.2506 15.7938C72.7281 15.7938 73 16.0694 73 16.5531V23.5908C73 26.8667 71.8417 28.6608 67.7562 28.6608C63.6708 28.6608 62.5125 26.8667 62.5125 23.5908V8.41127C62.5125 5.13535 63.6708 3.34124 67.7562 3.34124C71.8417 3.34124 73 5.13535 73 8.41127V11.0667C73 11.5505 72.7281 11.826 72.2506 11.826H70.8888C70.4114 11.826 70.1394 11.5505 70.1394 11.0667V8.41127C70.1394 6.75596 69.6962 5.75583 67.7562 5.75583C65.8163 5.75583 65.3731 6.75596 65.3731 8.41127V23.5887C65.3731 25.244 65.8163 26.2442 67.7562 26.2442C69.6962 26.2442 70.1394 25.244 70.1394 23.5887V18.2064H68.3002C67.8227 18.2064 67.585 17.9656 67.585 17.4818V16.5511C67.585 16.0674 67.8227 15.7918 68.3002 15.7918H72.2486L72.2506 15.7938Z" fill="white"/>
            <defs>
            <clipPath id="clip0_503_131">
            <rect width="73" height="32" fill="white"/>
            </clipPath>
            </defs>
            </svg>
            {/* <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl flex items-center gap-1.5 font-bold tracking-wider text-sm text-white"> */}
              {/* <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse"></span> */}
              {/* FRG */}
            {/* </div> */}
          </div>

          <div className="sidebar-title-btn">
            <div className="bg-(--DeepBlue) py-2 px-5 rounded-full flex items-center gap-1.5 font-light tracking-wider text-[12px]">
            <span>Centros de Negocio</span>
            </div>
            <div className="bg-(--DeepBlue)  rounded-full">
              {/* <button type="button" className="px-2 py-1.5 transition-transform duration-300 ease-in-out hover:scale-110 hover:animate-[pulse_1s_infinite]">+</button> */}
              <button type="button" className="text-[15px] font-bold cursor-pointer py-1.5 px-3">+</button>
              {/* <button type="button" className="text-[15px] font-bold cursor-pointer origin-center hover:animate-ping transition-all py-1.5 px-3">+</button> */}
              {/* <button type="button" className="text-[15px] font-bold cursor-pointer py-1.5 px-3">
                <span className="relative origin-center flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping opacity-75">+</span>
                  <span className="relative inline-flex size-3">+</span>
                </span>
              </button> */}
            </div>
          </div>

          <nav className="sidebar-menu-list">
            {['Xolos', 'Atlante', 'América'].map((centro) => (
              <button
              type="button"
                key={centro}
                onClick={() => setCentroActivo(centro)}
                className={`sidebar-menu-item ${centroActivo === centro ? 'active' : ''}`}
              >
                {centro}
              </button>
            ))}
          </nav>
        </div>

        <button type="button" className="w-full text-center text-md font-bold text-(--GrisLight) hover:text-(--VerdeNeon) px-4 transition-colors cursor-pointer">
          Editar
        </button>
      </aside>

      {/* 📊 PANEL CENTRAL OPERATIVO */}
      <main className="main-content-panel">
        
        {/* Barra superior de Datos del Usuario Firmado */}
        <div className="flex justify-between items-center w-full pt-8">
          <div className="top-bar-user">
            {/* <span className="w-2 h-2 rounded-full bg-emerald-400"></span> */}
            <span>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.3125 20.625C8.89974 20.625 7.57161 20.3548 6.32812 19.8145C5.08464 19.2806 3.98763 18.5384 3.03711 17.5879C2.08659 16.6439 1.34115 15.5501 0.800781 14.3066C0.266927 13.0632 0 11.7318 0 10.3125C0 8.89974 0.266927 7.57161 0.800781 6.32812C1.34115 5.08464 2.08333 3.98763 3.02734 3.03711C3.97786 2.08659 5.07487 1.3444 6.31836 0.810547C7.56836 0.270182 8.89974 0 10.3125 0C11.7253 0 13.0534 0.270182 14.2969 0.810547C15.5469 1.3444 16.6439 2.08659 17.5879 3.03711C18.5384 3.98763 19.2839 5.08464 19.8242 6.32812C20.3646 7.57161 20.6348 8.89974 20.6348 10.3125C20.6348 11.7318 20.3646 13.0632 19.8242 14.3066C19.2839 15.5501 18.5384 16.6439 17.5879 17.5879C16.6439 18.5384 15.5501 19.2806 14.3066 19.8145C13.0632 20.3548 11.7318 20.625 10.3125 20.625ZM10.3125 18.0566C11.3867 18.0566 12.3926 17.8548 13.3301 17.4512C14.2676 17.054 15.0911 16.5039 15.8008 15.8008C16.5104 15.0911 17.0638 14.2676 17.4609 13.3301C17.8646 12.3926 18.0664 11.3867 18.0664 10.3125C18.0664 9.23828 17.8646 8.23568 17.4609 7.30469C17.0573 6.36719 16.5007 5.54362 15.791 4.83398C15.0879 4.12435 14.2676 3.57096 13.3301 3.17383C12.3926 2.77018 11.3867 2.56836 10.3125 2.56836C9.23828 2.56836 8.23242 2.77018 7.29492 3.17383C6.36393 3.57096 5.54362 4.12435 4.83398 4.83398C4.12435 5.54362 3.57096 6.36719 3.17383 7.30469C2.77669 8.23568 2.57812 9.23828 2.57812 10.3125C2.57812 11.3867 2.77669 12.3926 3.17383 13.3301C3.57096 14.2676 4.12435 15.0911 4.83398 15.8008C5.54362 16.5039 6.36719 17.054 7.30469 17.4512C8.24219 17.8548 9.24479 18.0566 10.3125 18.0566ZM10.3125 7.98828C9.84375 7.98828 9.44987 7.8125 9.13086 7.46094C8.81185 7.10938 8.64909 6.67643 8.64258 6.16211C8.64258 5.68034 8.80534 5.26367 9.13086 4.91211C9.45638 4.55404 9.85026 4.375 10.3125 4.375C10.7747 4.375 11.1654 4.55404 11.4844 4.91211C11.8099 5.26367 11.9727 5.68034 11.9727 6.16211C11.9727 6.67643 11.8132 7.10938 11.4941 7.46094C11.1751 7.8125 10.7812 7.98828 10.3125 7.98828ZM7.54883 11.6504C7.34701 11.6504 7.1875 11.5983 7.07031 11.4941C6.95964 11.39 6.9043 11.25 6.9043 11.0742C6.9043 10.8529 6.97917 10.6022 7.12891 10.3223C7.27865 10.0423 7.49674 9.77214 7.7832 9.51172C8.07617 9.2513 8.43424 9.03646 8.85742 8.86719C9.2806 8.69792 9.76562 8.61328 10.3125 8.61328C10.8594 8.61328 11.3411 8.69792 11.7578 8.86719C12.181 9.03646 12.5391 9.2513 12.832 9.51172C13.125 9.77214 13.3464 10.0423 13.4961 10.3223C13.6458 10.6022 13.7207 10.8529 13.7207 11.0742C13.7207 11.25 13.6654 11.39 13.5547 11.4941C13.444 11.5983 13.2845 11.6504 13.0762 11.6504H7.54883ZM6.55273 15.4688C6.39648 15.4688 6.25977 15.4134 6.14258 15.3027C6.0319 15.1921 5.97656 15.0553 5.97656 14.8926C5.97656 14.7363 6.0319 14.6029 6.14258 14.4922C6.25977 14.3815 6.39648 14.3262 6.55273 14.3262H6.62109V13.3984C6.62109 13.0859 6.70898 12.8418 6.88477 12.666C7.06055 12.4837 7.30794 12.3926 7.62695 12.3926H12.998C13.3236 12.3926 13.571 12.4837 13.7402 12.666C13.916 12.8418 14.0039 13.0859 14.0039 13.3984V14.3262H14.0723C14.2285 14.3262 14.362 14.3815 14.4727 14.4922C14.5898 14.6029 14.6484 14.7363 14.6484 14.8926C14.6484 15.0553 14.5898 15.1921 14.4727 15.3027C14.362 15.4134 14.2285 15.4688 14.0723 15.4688H6.55273ZM9.3457 14.3359H11.2793C11.3965 14.3359 11.4941 14.2969 11.5723 14.2188C11.6569 14.1406 11.6992 14.043 11.6992 13.9258C11.6992 13.8151 11.6569 13.7207 11.5723 13.6426C11.4941 13.5645 11.3965 13.5254 11.2793 13.5254H9.3457C9.22852 13.5254 9.13086 13.5645 9.05273 13.6426C8.97461 13.7207 8.93555 13.8151 8.93555 13.9258C8.93555 14.043 8.97461 14.1406 9.05273 14.2188C9.13086 14.2969 9.22852 14.3359 9.3457 14.3359Z" fill="#02FFA2"/>
              </svg>
            </span>
            Usuario:<span className="font-bold">{user?.nombreCompleto || 'Usuario Autenticado'}</span>
          </div>
          
          {/* Botones de Control de Sesión Superior */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center px-6 py-2">
              <div className="px-6 pb-1 pt-2 bg-(--MediumBlue) rounded-xl items-center">
                <button type="button" className="cursor-pointer">
                  <svg width="13" height="15" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.23828 11.3613V7.40039C8.23828 7.2793 8.20117 7.18359 8.12695 7.11328C8.05664 7.03906 7.96094 7.00195 7.83984 7.00195H5.67188C5.55078 7.00195 5.45117 7.03906 5.37305 7.11328C5.29883 7.18359 5.26172 7.2793 5.26172 7.40039V11.3613H8.23828ZM1.67578 10.8926V5.86523L6.39258 1.9043C6.63477 1.70117 6.87695 1.70117 7.11914 1.9043L11.8418 5.86523V10.8926C11.8418 11.2676 11.7363 11.5586 11.5254 11.7656C11.3145 11.9727 11.0195 12.0762 10.6406 12.0762H2.88281C2.50391 12.0762 2.20703 11.9727 1.99219 11.7656C1.78125 11.5586 1.67578 11.2676 1.67578 10.8926ZM0 5.57227C0 5.45117 0.0507812 5.34961 0.152344 5.26758L6.13477 0.246094C6.33008 0.0820312 6.53906 0 6.76172 0C6.98438 0 7.19336 0.0820312 7.38867 0.246094L13.3594 5.26758C13.457 5.34961 13.5059 5.45508 13.5059 5.58398C13.5059 5.68945 13.4688 5.77344 13.3945 5.83594C13.3203 5.89453 13.2324 5.92383 13.1309 5.92383C13.0684 5.92383 13.0117 5.91016 12.9609 5.88281C12.9102 5.85156 12.8633 5.81836 12.8203 5.7832L6.99023 0.890625C6.91211 0.820312 6.83398 0.787109 6.75586 0.791016C6.67773 0.791016 6.60352 0.824219 6.5332 0.890625L0.697266 5.7832C0.650391 5.81836 0.601562 5.85156 0.550781 5.88281C0.5 5.91016 0.443359 5.92383 0.380859 5.92383C0.263672 5.92383 0.169922 5.88867 0.0996094 5.81836C0.0332031 5.74414 0 5.66211 0 5.57227ZM10.5938 3.24609V1.60547C10.5938 1.5 10.627 1.41602 10.6934 1.35352C10.7598 1.29102 10.8438 1.25977 10.9453 1.25977H11.4961C11.5977 1.25977 11.6797 1.29102 11.7422 1.35352C11.8086 1.41602 11.8418 1.5 11.8418 1.60547V4.30078L10.5938 3.24609Z" fill="#D9D9D9"/>
                  </svg>
                </button>
              </div>
              <label htmlFor="inicio" className="font-light text-[12px]">Inicio</label>
            </div>
            <div className="flex flex-col items-center">
              <div className="px-6 pb-1 pt-2 bg-(--MediumBlue) rounded-xl items-center">
                <button type="button" onClick={handleLogout} className="bg-(--MediumBlue) transition-all cursor-pointer">
                  <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.416992 14.2324C0.30306 14.2324 0.205078 14.1914 0.123047 14.1094C0.0410156 14.0273 0 13.9294 0 13.8154V1.13477C0 0.792969 0.107096 0.519531 0.321289 0.314453C0.535482 0.104818 0.818034 0 1.16895 0H8.70215C9.05762 0 9.34245 0.104818 9.55664 0.314453C9.77083 0.519531 9.87793 0.792969 9.87793 1.13477V13.8154C9.87793 13.9294 9.83691 14.0273 9.75488 14.1094C9.67285 14.1914 9.57487 14.2324 9.46094 14.2324C9.33789 14.2324 9.23535 14.1914 9.15332 14.1094C9.07129 14.0273 9.03027 13.9294 9.03027 13.8154V1.20312C9.03027 0.961589 8.91634 0.84082 8.68848 0.84082H1.18945C0.961589 0.84082 0.847656 0.961589 0.847656 1.20312V13.8154C0.847656 13.9294 0.806641 14.0273 0.724609 14.1094C0.642578 14.1914 0.540039 14.2324 0.416992 14.2324ZM1.72949 14.0137C1.611 14.0137 1.55176 13.9544 1.55176 13.8359V1.72266C1.55176 1.59961 1.611 1.53809 1.72949 1.53809H8.14844C8.26693 1.53809 8.32617 1.59961 8.32617 1.72266V13.8359C8.32617 13.9544 8.26693 14.0137 8.14844 14.0137H1.72949ZM6.76074 8.36719C6.90202 8.36719 7.02051 8.31934 7.11621 8.22363C7.21191 8.12793 7.25977 8.00944 7.25977 7.86816C7.25977 7.72689 7.21191 7.6084 7.11621 7.5127C7.02051 7.41699 6.90202 7.36914 6.76074 7.36914C6.61947 7.36914 6.50098 7.41699 6.40527 7.5127C6.30957 7.6084 6.26172 7.72689 6.26172 7.86816C6.26172 8.00944 6.30957 8.12793 6.40527 8.22363C6.50098 8.31934 6.61947 8.36719 6.76074 8.36719Z" fill="#02FFA2"/>
                  </svg>
                </button>
              </div>
              <label htmlFor="inicio" className="font-light text-[12px]">Salir</label>
            </div>
          </div>
        </div>

        {/* Tarjeta de Métricas Globales del Centro */}
        <section className="stats-card-header"> 
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white tracking-tight pl-3">{centroActivo}</h1>
            <div className="flex ">
              <div className="rounded-full px-6 pb-1 pt-2.5 bg-(--MediumBlue)">
                <button type="button" className="cursor-pointer ">
                    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.14648 12.585C1.43099 12.585 0.893229 12.4072 0.533203 12.0518C0.177734 11.7008 0 11.1722 0 10.4658V2.11914C0 1.41276 0.177734 0.884115 0.533203 0.533203C0.893229 0.177734 1.43099 0 2.14648 0H11.4844C12.1999 0 12.7354 0.177734 13.0908 0.533203C13.4463 0.884115 13.624 1.41276 13.624 2.11914V6.02246C13.5374 6.00879 13.4486 5.99967 13.3574 5.99512C13.2663 5.99056 13.1751 5.98828 13.084 5.98828C12.9928 5.98828 12.9017 5.99284 12.8105 6.00195C12.7194 6.00651 12.6237 6.01335 12.5234 6.02246V4.08105C12.5234 3.7666 12.4414 3.52962 12.2773 3.37012C12.1133 3.20605 11.8786 3.12402 11.5732 3.12402H2.04395C1.74316 3.12402 1.51074 3.20605 1.34668 3.37012C1.18262 3.52962 1.10059 3.7666 1.10059 4.08105V10.5273C1.10059 10.8418 1.18262 11.0788 1.34668 11.2383C1.51074 11.4023 1.74316 11.4844 2.04395 11.4844H8.81836C8.86393 11.6803 8.92318 11.8695 8.99609 12.0518C9.07357 12.2386 9.16243 12.4163 9.2627 12.585H2.14648ZM5.47559 5.57812C5.3571 5.57812 5.27279 5.55762 5.22266 5.5166C5.17708 5.47103 5.1543 5.389 5.1543 5.27051V4.86719C5.1543 4.7487 5.17708 4.66667 5.22266 4.62109C5.27279 4.57552 5.3571 4.55273 5.47559 4.55273H5.87891C5.9974 4.55273 6.07943 4.57552 6.125 4.62109C6.17513 4.66667 6.2002 4.7487 6.2002 4.86719V5.27051C6.2002 5.389 6.17513 5.47103 6.125 5.5166C6.07943 5.55762 5.9974 5.57812 5.87891 5.57812H5.47559ZM7.75195 5.57812C7.62891 5.57812 7.5446 5.55762 7.49902 5.5166C7.45345 5.47103 7.43066 5.389 7.43066 5.27051V4.86719C7.43066 4.7487 7.45345 4.66667 7.49902 4.62109C7.5446 4.57552 7.62891 4.55273 7.75195 4.55273H8.14844C8.27148 4.55273 8.35579 4.57552 8.40137 4.62109C8.44694 4.66667 8.46973 4.7487 8.46973 4.86719V5.27051C8.46973 5.389 8.44694 5.47103 8.40137 5.5166C8.35579 5.55762 8.27148 5.57812 8.14844 5.57812H7.75195ZM10.0215 5.57812C9.89844 5.57812 9.81413 5.55762 9.76855 5.5166C9.72298 5.47103 9.7002 5.389 9.7002 5.27051V4.86719C9.7002 4.7487 9.72298 4.66667 9.76855 4.62109C9.81413 4.57552 9.89844 4.55273 10.0215 4.55273H10.4248C10.5433 4.55273 10.6253 4.57552 10.6709 4.62109C10.7165 4.66667 10.7393 4.7487 10.7393 4.86719V5.27051C10.7393 5.389 10.7165 5.47103 10.6709 5.5166C10.6253 5.55762 10.5433 5.57812 10.4248 5.57812H10.0215ZM3.20605 7.81348C3.08301 7.81348 2.9987 7.79297 2.95312 7.75195C2.90755 7.70638 2.88477 7.62435 2.88477 7.50586V7.10254C2.88477 6.98405 2.90755 6.9043 2.95312 6.86328C2.9987 6.81771 3.08301 6.79492 3.20605 6.79492H3.60938C3.72786 6.79492 3.8099 6.81771 3.85547 6.86328C3.90104 6.9043 3.92383 6.98405 3.92383 7.10254V7.50586C3.92383 7.62435 3.90104 7.70638 3.85547 7.75195C3.8099 7.79297 3.72786 7.81348 3.60938 7.81348H3.20605ZM5.47559 7.81348C5.3571 7.81348 5.27279 7.79297 5.22266 7.75195C5.17708 7.70638 5.1543 7.62435 5.1543 7.50586V7.10254C5.1543 6.98405 5.17708 6.9043 5.22266 6.86328C5.27279 6.81771 5.3571 6.79492 5.47559 6.79492H5.87891C5.9974 6.79492 6.07943 6.81771 6.125 6.86328C6.17513 6.9043 6.2002 6.98405 6.2002 7.10254V7.50586C6.2002 7.62435 6.17513 7.70638 6.125 7.75195C6.07943 7.79297 5.9974 7.81348 5.87891 7.81348H5.47559ZM7.75195 7.81348C7.62891 7.81348 7.5446 7.79297 7.49902 7.75195C7.45345 7.70638 7.43066 7.62435 7.43066 7.50586V7.10254C7.43066 6.98405 7.45345 6.9043 7.49902 6.86328C7.5446 6.81771 7.62891 6.79492 7.75195 6.79492H8.14844C8.27148 6.79492 8.35579 6.81771 8.40137 6.86328C8.44694 6.9043 8.46973 6.98405 8.46973 7.10254V7.50586C8.46973 7.62435 8.44694 7.70638 8.40137 7.75195C8.35579 7.79297 8.27148 7.81348 8.14844 7.81348H7.75195ZM3.20605 10.0557C3.08301 10.0557 2.9987 10.0329 2.95312 9.9873C2.90755 9.94173 2.88477 9.8597 2.88477 9.74121V9.33789C2.88477 9.2194 2.90755 9.13965 2.95312 9.09863C2.9987 9.05306 3.08301 9.03027 3.20605 9.03027H3.60938C3.72786 9.03027 3.8099 9.05306 3.85547 9.09863C3.90104 9.13965 3.92383 9.2194 3.92383 9.33789V9.74121C3.92383 9.8597 3.90104 9.94173 3.85547 9.9873C3.8099 10.0329 3.72786 10.0557 3.60938 10.0557H3.20605ZM5.47559 10.0557C5.3571 10.0557 5.27279 10.0329 5.22266 9.9873C5.17708 9.94173 5.1543 9.8597 5.1543 9.74121V9.33789C5.1543 9.2194 5.17708 9.13965 5.22266 9.09863C5.27279 9.05306 5.3571 9.03027 5.47559 9.03027H5.87891C5.9974 9.03027 6.07943 9.05306 6.125 9.09863C6.17513 9.13965 6.2002 9.2194 6.2002 9.33789V9.74121C6.2002 9.8597 6.17513 9.94173 6.125 9.9873C6.07943 10.0329 5.9974 10.0557 5.87891 10.0557H5.47559ZM7.75195 10.0557C7.62891 10.0557 7.5446 10.0329 7.49902 9.9873C7.45345 9.94173 7.43066 9.8597 7.43066 9.74121V9.33789C7.43066 9.2194 7.45345 9.13965 7.49902 9.09863C7.5446 9.05306 7.62891 9.03027 7.75195 9.03027H8.14844C8.27148 9.03027 8.35579 9.05306 8.40137 9.09863C8.44694 9.13965 8.46973 9.2194 8.46973 9.33789V9.74121C8.46973 9.8597 8.44694 9.94173 8.40137 9.9873C8.35579 10.0329 8.27148 10.0557 8.14844 10.0557H7.75195ZM13.084 13.8701C12.61 13.8701 12.1634 13.779 11.7441 13.5967C11.3249 13.4189 10.9557 13.1706 10.6367 12.8516C10.3177 12.5326 10.0671 12.1634 9.88477 11.7441C9.70247 11.3249 9.61133 10.876 9.61133 10.3975C9.61133 9.91895 9.70247 9.47233 9.88477 9.05762C10.0671 8.63835 10.3177 8.26921 10.6367 7.9502C10.9557 7.62663 11.3249 7.37598 11.7441 7.19824C12.1634 7.01595 12.61 6.9248 13.084 6.9248C13.5625 6.9248 14.0114 7.01595 14.4307 7.19824C14.8499 7.37598 15.2191 7.62435 15.5381 7.94336C15.8571 8.26237 16.1055 8.63151 16.2832 9.05078C16.4655 9.47005 16.5566 9.91895 16.5566 10.3975C16.5566 10.8714 16.4655 11.318 16.2832 11.7373C16.1009 12.1566 15.848 12.5257 15.5244 12.8447C15.2054 13.1637 14.8363 13.4144 14.417 13.5967C13.9977 13.779 13.5534 13.8701 13.084 13.8701ZM11.457 10.9307H13.1182C13.2367 10.9307 13.3346 10.8896 13.4121 10.8076C13.4941 10.7256 13.5352 10.6253 13.5352 10.5068V8.37402C13.5352 8.26009 13.4941 8.16439 13.4121 8.08691C13.3301 8.00488 13.2321 7.96387 13.1182 7.96387C12.9997 7.96387 12.8994 8.00488 12.8174 8.08691C12.7354 8.16439 12.6943 8.26009 12.6943 8.37402V10.0898H11.457C11.3431 10.0898 11.2428 10.1309 11.1562 10.2129C11.0742 10.2949 11.0332 10.3929 11.0332 10.5068C11.0332 10.6208 11.0742 10.721 11.1562 10.8076C11.2383 10.8896 11.3385 10.9307 11.457 10.9307Z" fill="#02FFA2"/>
                    </svg>
                </button>
              </div>
              <div className="rounded-full px-4 pb-1 pt-2.5 ml-3 bg-(--MediumBlue)">
                <button type="button" className="cursor-pointer ">
                    <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6.68359V4.88574H7.71094V6.68359H0ZM2.95312 9.54785V2.02148H4.75098V9.54785H2.95312Z" fill="#02FFA2"/>
                      <path d="M13.6914 9.55664H15.3662C15.5667 9.55664 15.7285 9.49512 15.8516 9.37207C15.9746 9.24902 16.0361 9.0918 16.0361 8.90039V7.63574C16.0361 7.43978 15.9746 7.28255 15.8516 7.16406C15.7285 7.04102 15.5667 6.97949 15.3662 6.97949H13.6914C13.4909 6.97949 13.3291 7.04102 13.2061 7.16406C13.083 7.28255 13.0215 7.43978 13.0215 7.63574V8.90039C13.0215 9.0918 13.083 9.24902 13.2061 9.37207C13.3291 9.49512 13.4909 9.55664 13.6914 9.55664ZM10.8955 4.30664H26.96V2.75488H10.8955V4.30664ZM13.042 11.6758C12.3265 11.6758 11.7887 11.498 11.4287 11.1426C11.0732 10.7917 10.8955 10.2653 10.8955 9.56348V2.11914C10.8955 1.41276 11.0732 0.884115 11.4287 0.533203C11.7887 0.177734 12.3265 0 13.042 0H24.8135C25.529 0 26.0645 0.177734 26.4199 0.533203C26.7799 0.888672 26.96 1.41732 26.96 2.11914V9.56348C26.96 10.2653 26.7799 10.7917 26.4199 11.1426C26.0645 11.498 25.529 11.6758 24.8135 11.6758H13.042Z" fill="#02FFA2"/>
                    </svg>
                </button>
              </div>
             <div className="relative pl-3">
              <input type="text" placeholder="No. de tarjeta o nombre de tarjethabiente" className="search-input-box" />
              <span className="absolute right-4 top-3 text-slate-400 text-xs cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5.45508C0 4.70312 0.141276 3.99902 0.423828 3.34277C0.70638 2.68197 1.09831 2.10091 1.59961 1.59961C2.10091 1.09831 2.67969 0.70638 3.33594 0.423828C3.99674 0.141276 4.70312 0 5.45508 0C6.20703 0 6.91113 0.141276 7.56738 0.423828C8.22819 0.70638 8.80924 1.09831 9.31055 1.59961C9.81185 2.10091 10.2038 2.68197 10.4863 3.34277C10.7689 3.99902 10.9102 4.70312 10.9102 5.45508C10.9102 6.07943 10.8099 6.67188 10.6094 7.23242C10.4134 7.79297 10.14 8.30111 9.78906 8.75684L13.1318 12.1201C13.2048 12.193 13.2594 12.2773 13.2959 12.373C13.3369 12.4688 13.3574 12.5713 13.3574 12.6807C13.3574 12.8311 13.3232 12.9678 13.2549 13.0908C13.1911 13.2139 13.0999 13.3096 12.9814 13.3779C12.863 13.4508 12.7262 13.4873 12.5713 13.4873C12.4619 13.4873 12.3571 13.4668 12.2568 13.4258C12.1611 13.3893 12.0723 13.3324 11.9902 13.2549L8.62695 9.88477C8.18034 10.2038 7.68815 10.4544 7.15039 10.6367C6.61263 10.819 6.04753 10.9102 5.45508 10.9102C4.70312 10.9102 3.99674 10.7689 3.33594 10.4863C2.67969 10.2038 2.10091 9.81185 1.59961 9.31055C1.09831 8.80924 0.70638 8.23047 0.423828 7.57422C0.141276 6.91341 0 6.20703 0 5.45508ZM1.16895 5.45508C1.16895 6.04753 1.27832 6.60352 1.49707 7.12305C1.72038 7.63802 2.02799 8.09147 2.41992 8.4834C2.81641 8.87533 3.27214 9.18294 3.78711 9.40625C4.30664 9.62956 4.86263 9.74121 5.45508 9.74121C6.04753 9.74121 6.60124 9.62956 7.11621 9.40625C7.63574 9.18294 8.09147 8.87533 8.4834 8.4834C8.87533 8.09147 9.18294 7.63802 9.40625 7.12305C9.62956 6.60352 9.74121 6.04753 9.74121 5.45508C9.74121 4.86263 9.62956 4.30892 9.40625 3.79395C9.18294 3.27441 8.87533 2.81868 8.4834 2.42676C8.09147 2.03027 7.63574 1.72266 7.11621 1.50391C6.60124 1.2806 6.04753 1.16895 5.45508 1.16895C4.86263 1.16895 4.30664 1.2806 3.78711 1.50391C3.27214 1.72266 2.81641 2.03027 2.41992 2.42676C2.02799 2.81868 1.72038 3.27441 1.49707 3.79395C1.27832 4.30892 1.16895 4.86263 1.16895 5.45508Z" fill="#D9D9D9"/>
                </svg>
              </span>
            </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <div className="bg-(--MediumBlue) rounded-full px-5 py-3 font-semibold text-[14px]">
              <span className="input-condensed">No. de tarjetas <samp className="pr-5"></samp> <strong className="text-white input-condensed">{totalRegistros}</strong></span>
            </div>
           
            
            <div className="bg-(--MediumBlue) rounded-full text-right flex items-center justify-between px-5">
              <p className="text-[15px] font-bold tracking-wider text-slate-400 pr-14 py-2">Cargos Globales</p>
              <p className="input-condensed text-2xl font-bold text-white tracking-tight py-1">{formatearAPesos(montoTotalCargos)}</p>
            </div>
          </div>
        </section>


        {/* Listado de Tarjetahabientes (Tabla) */}
        <section className="table-container">

        {isLoadingTable ? (
            <div className="flex-1 flex items-center justify-center"><span className="spinner" /></div>
          ) : (

            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarjetahabiente</th>
                  <th>No. de Tarjeta</th>
                  <th className="text-center">Vigencia</th>
                  <td className="w-3 p-0"></td>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tarjetahabientes.map((item) => (
                  <tr 
                    key={item.idTarjeta} 
                    onClick={() => selecionaClienteTarjetabiente(item.idTarjeta, item)}
                    // onClick={() => {setSelectedClient(item); console.log({idTarjeta:item.idTarjeta, cleinteSelec:selectedClient})}}
                    className={selectedClient.idTarjeta === item.idTarjeta ? 'selected ' : ''}
                  >
                    <td className="font-bold text-white rounded-tl-full rounded-bl-full">{item.Cliente}</td>
                    <td className="font-mono text-slate-300 tracking-wider">{item.noTarjeta}</td>
                    <td className="rounded-tr-full rounded-br-full text-center">{item.fechaVencimiento}</td>

                    <td className="w-3 p-0 bg-(--fondo)! [.selected>&]:bg-(--fondo)!"></td>

                    <td className="rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full ">
                      <div className="flex justify-center gap-2 ">
                        <button type="button" className="action-icon-btn">
                          <span>
                          <svg width="14" height="13" viewBox="0 0 14 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5312 2.0918C12.1406 2.0918 12.5996 2.24414 12.9082 2.54883C13.2168 2.84961 13.3711 3.30273 13.3711 3.9082V9.97266C13.3711 10.5781 13.2246 11.0312 12.9316 11.332C12.6387 11.6367 12.2305 11.7891 11.707 11.7891H6.24609C6.40625 11.5117 6.53125 11.2148 6.62109 10.8984C6.71094 10.582 6.75586 10.2539 6.75586 9.91406C6.75586 9.39453 6.65625 8.9082 6.45703 8.45508C6.26172 7.99805 5.99023 7.5957 5.64258 7.24805C5.29492 6.90039 4.89258 6.62891 4.43555 6.43359C3.97852 6.23438 3.49023 6.13477 2.9707 6.13477V3.9082C2.9707 3.30273 3.12305 2.84961 3.42773 2.54883C3.73633 2.24414 4.19727 2.0918 4.81055 2.0918H11.5312ZM5.85938 2.32031C5.85938 1.88672 5.96094 1.49609 6.16406 1.14844C6.36719 0.796875 6.64258 0.517578 6.99023 0.310547C7.33789 0.103516 7.73047 0 8.16797 0C8.60547 0 8.99805 0.103516 9.3457 0.310547C9.69727 0.517578 9.97461 0.796875 10.1777 1.14844C10.3809 1.49609 10.4824 1.88672 10.4824 2.32031L9.53906 2.32617C9.53906 2.04492 9.48047 1.79688 9.36328 1.58203C9.25 1.36719 9.08984 1.19922 8.88281 1.07812C8.67969 0.953125 8.44141 0.890625 8.16797 0.890625C7.89844 0.890625 7.66016 0.953125 7.45312 1.07812C7.25 1.19922 7.08984 1.36719 6.97266 1.58203C6.85938 1.79688 6.80273 2.04492 6.80273 2.32617L5.85938 2.32031ZM2.97656 12.8906C2.57031 12.8906 2.1875 12.8125 1.82812 12.6562C1.46875 12.5039 1.15234 12.291 0.878906 12.0176C0.605469 11.7441 0.390625 11.4277 0.234375 11.0684C0.078125 10.709 0 10.3242 0 9.91406C0 9.50391 0.078125 9.12109 0.234375 8.76562C0.390625 8.40625 0.605469 8.08984 0.878906 7.81641C1.15234 7.53906 1.46875 7.32422 1.82812 7.17188C2.1875 7.01562 2.57031 6.9375 2.97656 6.9375C3.38672 6.9375 3.77148 7.01562 4.13086 7.17188C4.49023 7.32422 4.80664 7.53711 5.08008 7.81055C5.35352 8.08398 5.56641 8.40039 5.71875 8.75977C5.875 9.11914 5.95312 9.50391 5.95312 9.91406C5.95312 10.3203 5.875 10.7031 5.71875 11.0625C5.5625 11.4219 5.3457 11.7383 5.06836 12.0117C4.79492 12.2852 4.47852 12.5 4.11914 12.6562C3.75977 12.8125 3.37891 12.8906 2.97656 12.8906ZM2.9707 11.7773C3.08008 11.7773 3.16602 11.7441 3.22852 11.6777C3.29492 11.6113 3.32812 11.5254 3.32812 11.4199V10.2715H4.47656C4.58203 10.2715 4.66797 10.2383 4.73438 10.1719C4.80078 10.1094 4.83398 10.0234 4.83398 9.91406C4.83398 9.80469 4.80078 9.71875 4.73438 9.65625C4.66797 9.58984 4.58203 9.55664 4.47656 9.55664H3.32812V8.4082C3.32812 8.30273 3.29492 8.2168 3.22852 8.15039C3.16602 8.08398 3.08008 8.05078 2.9707 8.05078C2.86133 8.05078 2.77344 8.08398 2.70703 8.15039C2.64453 8.2168 2.61328 8.30273 2.61328 8.4082V9.55664H1.46484C1.35938 9.55664 1.27344 9.58984 1.20703 9.65625C1.14062 9.71875 1.10742 9.80469 1.10742 9.91406C1.10742 10.0234 1.14062 10.1094 1.20703 10.1719C1.27344 10.2383 1.35938 10.2715 1.46484 10.2715H2.61328V11.4199C2.61328 11.5254 2.64453 11.6113 2.70703 11.6777C2.77344 11.7441 2.86133 11.7773 2.9707 11.7773Z"/>
                          </svg>
                          </span>
                        </button>
                        <button type="button" className="action-icon-btn">
                          <span>
                            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 9.2168V0.462891C0 0.322266 0.0429688 0.210938 0.128906 0.128906C0.214844 0.0429687 0.328125 0 0.46875 0H15.0059C15.1465 0 15.2578 0.0429687 15.3398 0.128906C15.4258 0.210938 15.4688 0.322266 15.4688 0.462891V9.2168C15.4688 9.35742 15.4258 9.4707 15.3398 9.55664C15.2578 9.64258 15.1465 9.68555 15.0059 9.68555H0.46875C0.328125 9.68555 0.214844 9.64258 0.128906 9.55664C0.0429688 9.4707 0 9.35742 0 9.2168ZM1.07227 8.25586C1.07227 8.49414 1.18945 8.61328 1.42383 8.61328H14.0449C14.2793 8.61328 14.3965 8.49414 14.3965 8.25586V1.42969C14.3965 1.19141 14.2793 1.07227 14.0449 1.07227H1.42383C1.18945 1.07227 1.07227 1.19141 1.07227 1.42969V8.25586ZM1.68164 7.86328V1.82227C1.68164 1.72852 1.72852 1.68164 1.82227 1.68164H6.39258C6.08789 1.99414 5.84961 2.42188 5.67773 2.96484C5.50586 3.50391 5.41992 4.12695 5.41992 4.83398C5.41992 5.54102 5.50586 6.16797 5.67773 6.71484C5.85352 7.25781 6.0957 7.6875 6.4043 8.00391H1.82227C1.72852 8.00391 1.68164 7.95703 1.68164 7.86328ZM6.12305 4.83398C6.12305 4.22461 6.1875 3.69141 6.31641 3.23438C6.44922 2.77734 6.63477 2.42188 6.87305 2.16797C7.11523 1.91406 7.39453 1.78711 7.71094 1.78711C8.03906 1.78711 8.32617 1.91406 8.57227 2.16797C8.82227 2.42188 9.01562 2.77734 9.15234 3.23438C9.28906 3.69141 9.35742 4.22461 9.35742 4.83398C9.35742 5.44336 9.28906 5.97656 9.15234 6.43359C9.01562 6.89062 8.82227 7.24805 8.57227 7.50586C8.32617 7.75977 8.03906 7.88672 7.71094 7.88672C7.39453 7.88672 7.11523 7.75977 6.87305 7.50586C6.63477 7.24805 6.44922 6.89062 6.31641 6.43359C6.1875 5.97656 6.12305 5.44336 6.12305 4.83398ZM9.05273 8.00391C9.36523 7.6875 9.60938 7.25781 9.78516 6.71484C9.96484 6.16797 10.0547 5.54102 10.0547 4.83398C10.0547 4.12695 9.9668 3.50391 9.79102 2.96484C9.61523 2.42188 9.37109 1.99414 9.05859 1.68164H13.6465C13.7402 1.68164 13.7871 1.72852 13.7871 1.82227V7.86328C13.7871 7.95703 13.7402 8.00391 13.6465 8.00391H9.05273Z"/>
                            </svg>
                          </span>
                        </button>
                        <button type="button" className="action-icon-btn">
                          <span>
                            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.83984 10.7871C1.23047 10.7871 0.771484 10.6348 0.462891 10.3301C0.154297 10.0293 0 9.57617 0 8.9707V1.81641C0 1.21094 0.154297 0.757812 0.462891 0.457031C0.771484 0.152344 1.23047 0 1.83984 0H9.84375C10.457 0 10.916 0.152344 11.2207 0.457031C11.5293 0.757812 11.6836 1.21094 11.6836 1.81641V2.49609C11.4805 2.44141 11.2793 2.41406 11.0801 2.41406C10.8926 2.41406 10.709 2.43945 10.5293 2.49023C10.3535 2.53711 10.1855 2.60742 10.0254 2.70117C9.98633 2.69336 9.94531 2.6875 9.90234 2.68359C9.86328 2.67969 9.82031 2.67773 9.77344 2.67773H1.75781C1.49609 2.67773 1.29492 2.74805 1.1543 2.88867C1.01367 3.02539 0.943359 3.22852 0.943359 3.49805V9.02344C0.943359 9.29297 1.01367 9.49609 1.1543 9.63281C1.29492 9.77344 1.49609 9.84375 1.75781 9.84375H6.79102C6.75977 9.99609 6.74609 10.1504 6.75 10.3066C6.75391 10.4668 6.78906 10.627 6.85547 10.7871H1.83984ZM4.69336 4.78125C4.5918 4.78125 4.52148 4.76367 4.48242 4.72852C4.44336 4.68945 4.42383 4.61914 4.42383 4.51758V4.17188C4.42383 4.07031 4.44336 4 4.48242 3.96094C4.52148 3.92188 4.5918 3.90234 4.69336 3.90234H5.03906C5.14453 3.90234 5.2168 3.92188 5.25586 3.96094C5.29492 4 5.31445 4.07031 5.31445 4.17188V4.51758C5.31445 4.61914 5.29492 4.68945 5.25586 4.72852C5.2168 4.76367 5.14453 4.78125 5.03906 4.78125H4.69336ZM6.64453 4.78125C6.53906 4.78125 6.4668 4.76367 6.42773 4.72852C6.38867 4.68945 6.36914 4.61914 6.36914 4.51758V4.17188C6.36914 4.07031 6.38867 4 6.42773 3.96094C6.4668 3.92188 6.53906 3.90234 6.64453 3.90234H6.98438C7.08984 3.90234 7.16211 3.92188 7.20117 3.96094C7.24023 4 7.25977 4.07031 7.25977 4.17188V4.51758C7.25977 4.61914 7.24023 4.68945 7.20117 4.72852C7.16211 4.76367 7.08984 4.78125 6.98438 4.78125H6.64453ZM2.74805 6.69727C2.64648 6.69727 2.57422 6.67969 2.53125 6.64453C2.49219 6.60547 2.47266 6.53516 2.47266 6.43359V6.08789C2.47266 5.98633 2.49219 5.91797 2.53125 5.88281C2.57422 5.84375 2.64648 5.82422 2.74805 5.82422H3.09375C3.19531 5.82422 3.26562 5.84375 3.30469 5.88281C3.34766 5.91797 3.36914 5.98633 3.36914 6.08789V6.43359C3.36914 6.53516 3.34766 6.60547 3.30469 6.64453C3.26562 6.67969 3.19531 6.69727 3.09375 6.69727H2.74805ZM4.69336 6.69727C4.5918 6.69727 4.52148 6.67969 4.48242 6.64453C4.44336 6.60547 4.42383 6.53516 4.42383 6.43359V6.08789C4.42383 5.98633 4.44336 5.91797 4.48242 5.88281C4.52148 5.84375 4.5918 5.82422 4.69336 5.82422H5.03906C5.14453 5.82422 5.2168 5.84375 5.25586 5.88281C5.29492 5.91797 5.31445 5.98633 5.31445 6.08789V6.43359C5.31445 6.53516 5.29492 6.60547 5.25586 6.64453C5.2168 6.67969 5.14453 6.69727 5.03906 6.69727H4.69336ZM6.64453 6.69727C6.53906 6.69727 6.4668 6.67969 6.42773 6.64453C6.38867 6.60547 6.36914 6.53516 6.36914 6.43359V6.08789C6.36914 5.98633 6.38867 5.91797 6.42773 5.88281C6.4668 5.84375 6.53906 5.82422 6.64453 5.82422H6.98438C7.08984 5.82422 7.16211 5.84375 7.20117 5.88281C7.24023 5.91797 7.25977 5.98633 7.25977 6.08789V6.43359C7.25977 6.53516 7.24023 6.60547 7.20117 6.64453C7.16211 6.67969 7.08984 6.69727 6.98438 6.69727H6.64453ZM2.74805 8.61914C2.64648 8.61914 2.57422 8.59961 2.53125 8.56055C2.49219 8.52148 2.47266 8.45117 2.47266 8.34961V8.00391C2.47266 7.90234 2.49219 7.83398 2.53125 7.79883C2.57422 7.75977 2.64648 7.74023 2.74805 7.74023H3.09375C3.19531 7.74023 3.26562 7.75977 3.30469 7.79883C3.34766 7.83398 3.36914 7.90234 3.36914 8.00391V8.34961C3.36914 8.45117 3.34766 8.52148 3.30469 8.56055C3.26562 8.59961 3.19531 8.61914 3.09375 8.61914H2.74805ZM4.69336 8.61914C4.5918 8.61914 4.52148 8.59961 4.48242 8.56055C4.44336 8.52148 4.42383 8.45117 4.42383 8.34961V8.00391C4.42383 7.90234 4.44336 7.83398 4.48242 7.79883C4.52148 7.75977 4.5918 7.74023 4.69336 7.74023H5.03906C5.14453 7.74023 5.2168 7.75977 5.25586 7.79883C5.29492 7.83398 5.31445 7.90234 5.31445 8.00391V8.34961C5.31445 8.45117 5.29492 8.52148 5.25586 8.56055C5.2168 8.59961 5.14453 8.61914 5.03906 8.61914H4.69336ZM6.64453 8.61914C6.53906 8.61914 6.4668 8.59961 6.42773 8.56055C6.38867 8.52148 6.36914 8.45117 6.36914 8.34961V8.00391C6.36914 7.90234 6.38867 7.83398 6.42773 7.79883C6.4668 7.75977 6.53906 7.74023 6.64453 7.74023H6.98438C7.08984 7.74023 7.16211 7.75977 7.20117 7.79883C7.24023 7.83398 7.25977 7.90234 7.25977 8.00391V8.34961C7.25977 8.45117 7.24023 8.52148 7.20117 8.56055C7.16211 8.59961 7.08984 8.61914 6.98438 8.61914H6.64453ZM8.58984 4.78125C8.48828 4.78125 8.41602 4.76367 8.37305 4.72852C8.33398 4.68945 8.31445 4.61914 8.31445 4.51758V4.17188C8.31445 4.07031 8.33398 4 8.37305 3.96094C8.41602 3.92188 8.48828 3.90234 8.58984 3.90234H8.8418C8.71289 4.17188 8.63477 4.46484 8.60742 4.78125H8.58984ZM8.58984 6.69727C8.48828 6.69727 8.41602 6.67969 8.37305 6.64453C8.33398 6.60547 8.31445 6.53516 8.31445 6.43359V6.08789C8.31445 5.98633 8.33398 5.91797 8.37305 5.88281C8.41602 5.84375 8.48828 5.82422 8.58984 5.82422H8.72461C8.75977 5.97656 8.80859 6.12305 8.87109 6.26367C8.9375 6.40039 9.01172 6.5293 9.09375 6.65039C9.07812 6.66992 9.05664 6.68359 9.0293 6.69141C9.00586 6.69531 8.97461 6.69727 8.93555 6.69727H8.58984ZM8.25 10.7812C8.02734 10.7812 7.85156 10.7324 7.72266 10.6348C7.59766 10.5371 7.53516 10.4004 7.53516 10.2246C7.53516 9.95117 7.61523 9.66602 7.77539 9.36914C7.93945 9.06836 8.17578 8.78711 8.48438 8.52539C8.79297 8.25977 9.16602 8.04492 9.60352 7.88086C10.041 7.7168 10.5332 7.63477 11.0801 7.63477C11.627 7.63477 12.1172 7.7168 12.5508 7.88086C12.9883 8.04492 13.3594 8.25977 13.6641 8.52539C13.9727 8.78711 14.209 9.06836 14.373 9.36914C14.5371 9.66602 14.6191 9.95117 14.6191 10.2246C14.6191 10.4004 14.5547 10.5371 14.4258 10.6348C14.3008 10.7324 14.127 10.7812 13.9043 10.7812H8.25ZM11.0801 6.88477C10.7793 6.88477 10.5 6.80273 10.2422 6.63867C9.98828 6.47461 9.7832 6.25391 9.62695 5.97656C9.4707 5.69531 9.39258 5.38086 9.39258 5.0332C9.39258 4.68945 9.4707 4.38086 9.62695 4.10742C9.7832 3.83008 9.98828 3.61328 10.2422 3.45703C10.5 3.29688 10.7793 3.2168 11.0801 3.2168C11.377 3.2168 11.6523 3.29492 11.9062 3.45117C12.1641 3.60742 12.3711 3.82227 12.5273 4.0957C12.6836 4.36914 12.7617 4.67773 12.7617 5.02148C12.7617 5.37305 12.6836 5.68945 12.5273 5.9707C12.375 6.25195 12.1699 6.47461 11.9121 6.63867C11.6582 6.80273 11.3809 6.88477 11.0801 6.88477Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 

          )}
          
          {/* Componente de Paginación */}

            <div className="pagination-container">
            {/* Botón Atrás (‹) - Se deshabilita si estás en la página 1 */}
            <button type="button"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              className="pagination-btn"
            >
              <span className={paginaActual === 1 ? 'text-(--VerdeNeonDisabled)':'text-(--VerdeNeon) hover:text-(--DeelBlue)'}>
                <svg width="7" height="11" viewBox="0 0 7 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.18362e-06 5.36719C0.00390741 5.21875 0.0332043 5.08398 0.0878917 4.96289C0.142579 4.83789 0.228517 4.7168 0.345704 4.59961L4.77539 0.263671C4.95508 0.0878896 5.17188 -1.02312e-06 5.42578 -1.06751e-06C5.59766 -1.09757e-06 5.75391 0.0429676 5.89453 0.128905C6.03906 0.210936 6.1543 0.322264 6.24023 0.462889C6.32617 0.603514 6.36914 0.759764 6.36914 0.931639C6.36914 1.19336 6.26758 1.42187 6.06445 1.61719L2.20313 5.36133L6.06445 9.11133C6.26758 9.31445 6.36914 9.54492 6.36914 9.80273C6.36914 9.97461 6.32617 10.1309 6.24024 10.2715C6.1543 10.4121 6.03906 10.5234 5.89453 10.6055C5.75391 10.6914 5.59766 10.7344 5.42578 10.7344C5.17188 10.7344 4.95508 10.6445 4.77539 10.4648L0.345704 6.12891C0.224611 6.01172 0.13672 5.89258 0.0820325 5.77148C0.027345 5.64648 1.20889e-06 5.51172 1.18362e-06 5.36719Z" />
                </svg>
              </span>
            </button>

            {/* Render de números (1, 2, 3...) calculados por el total de registros de SQL Server */}
            {renderNumerosPaginacion()}

            {/* Botón Siguiente (›) - Se deshabilita si estás en la última página */}
            <button type="button"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              className="pagination-btn"
            >
               <span className={paginaActual === totalPaginas ? 'text-(--VerdeNeonDisabled)':'text-(--VerdeNeon) hover:text-(--DeelBlue)'}
               >
                <svg width="7" height="11" viewBox="0 0 7 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.36914 5.36719C6.36523 5.51562 6.33594 5.65039 6.28125 5.77148C6.22656 5.89648 6.14063 6.01758 6.02344 6.13477L1.59375 10.4707C1.41406 10.6465 1.19727 10.7344 0.943359 10.7344C0.771484 10.7344 0.615235 10.6914 0.47461 10.6055C0.330078 10.5234 0.214844 10.4121 0.128906 10.2715C0.0429689 10.1309 1.89018e-07 9.97461 2.04043e-07 9.80273C2.26924e-07 9.54102 0.101563 9.3125 0.304688 9.11719L4.16602 5.37305L0.304688 1.62305C0.101563 1.41992 9.5704e-07 1.18945 9.79579e-07 0.93164C9.94605e-07 0.759765 0.0429698 0.603515 0.128907 0.46289C0.214845 0.322265 0.330079 0.210937 0.47461 0.128906C0.615235 0.0429682 0.771485 -5.48783e-07 0.94336 -5.33757e-07C1.19727 -5.1156e-07 1.41406 0.0898433 1.59375 0.269531L6.02344 4.60547C6.14453 4.72266 6.23242 4.8418 6.28711 4.96289C6.3418 5.08789 6.36914 5.22266 6.36914 5.36719Z" />
                </svg>
              </span>
            </button>
          </div>
          
        </section>
      </main>

    

      {/* 💳 BARRA DE DETALLES DERECHA (Información del Tarjetahabiente Seleccionado) */}
      <aside className="details-panel">

      {/* {!detallesCliente ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-medium">
            Selecciona un cliente de la lista para ver su ficha técnica.
          </div>
        ) : (
          <> */}
            <div>
              <div className="flex">
                <span className="">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.9023 49.8047C21.4681 49.8047 18.2454 49.1536 15.2344 47.8516C12.2233 46.5658 9.57845 44.7835 7.2998 42.5049C5.02116 40.2262 3.23079 37.5814 1.92871 34.5703C0.642904 31.5592 0 28.3366 0 24.9023C0 21.4681 0.642904 18.2454 1.92871 15.2344C3.23079 12.2233 5.02116 9.57845 7.2998 7.2998C9.57845 5.00488 12.2233 3.21452 15.2344 1.92871C18.2454 0.642904 21.4681 0 24.9023 0C28.3366 0 31.5592 0.642904 34.5703 1.92871C37.5814 3.21452 40.2262 5.00488 42.5049 7.2998C44.7835 9.57845 46.5658 12.2233 47.8516 15.2344C49.1536 18.2454 49.8047 21.4681 49.8047 24.9023C49.8047 28.3366 49.1536 31.5592 47.8516 34.5703C46.5658 37.5814 44.7835 40.2262 42.5049 42.5049C40.2262 44.7835 37.5814 46.5658 34.5703 47.8516C31.5592 49.1536 28.3366 49.8047 24.9023 49.8047ZM24.9023 45.6543C27.7669 45.6543 30.4525 45.1172 32.959 44.043C35.4655 42.9688 37.6709 41.4795 39.5752 39.5752C41.4795 37.6709 42.9688 35.4655 44.043 32.959C45.1172 30.4525 45.6543 27.7669 45.6543 24.9023C45.6543 22.0378 45.1172 19.3522 44.043 16.8457C42.9688 14.3229 41.4795 12.1175 39.5752 10.2295C37.6709 8.3252 35.4655 6.83594 32.959 5.76172C30.4525 4.6875 27.7669 4.15039 24.9023 4.15039C22.0378 4.15039 19.3522 4.6875 16.8457 5.76172C14.3392 6.83594 12.1338 8.3252 10.2295 10.2295C8.3252 12.1175 6.83594 14.3229 5.76172 16.8457C4.6875 19.3522 4.15039 22.0378 4.15039 24.9023C4.15039 27.7669 4.6875 30.4525 5.76172 32.959C6.83594 35.4655 8.3252 37.6709 10.2295 39.5752C12.1338 41.4795 14.3392 42.9688 16.8457 44.043C19.3522 45.1172 22.0378 45.6543 24.9023 45.6543ZM13.7207 37.2559C13.2324 37.2559 12.8662 37.1175 12.6221 36.8408C12.3942 36.5479 12.2803 36.1735 12.2803 35.7178C12.2803 35.0505 12.5326 34.1878 13.0371 33.1299C13.5579 32.0557 14.3311 30.9896 15.3564 29.9316C16.3981 28.8574 17.7083 27.9541 19.2871 27.2217C20.8659 26.4893 22.7295 26.123 24.8779 26.123C27.0264 26.123 28.89 26.4893 30.4688 27.2217C32.0475 27.9541 33.3496 28.8574 34.375 29.9316C35.4167 30.9896 36.1898 32.0557 36.6943 33.1299C37.2152 34.1878 37.4756 35.0505 37.4756 35.7178C37.4756 36.1735 37.3535 36.5479 37.1094 36.8408C36.8815 37.1175 36.5234 37.2559 36.0352 37.2559H13.7207ZM24.8779 24.1211C23.7223 24.1211 22.6644 23.82 21.7041 23.2178C20.7601 22.6156 20.0033 21.8018 19.4336 20.7764C18.8802 19.751 18.6035 18.5872 18.6035 17.2852C18.6035 16.0645 18.8802 14.9495 19.4336 13.9404C20.0033 12.915 20.7601 12.1012 21.7041 11.499C22.6644 10.8805 23.7223 10.5713 24.8779 10.5713C26.0335 10.5713 27.0833 10.8805 28.0273 11.499C28.9876 12.1012 29.7445 12.915 30.2979 13.9404C30.8675 14.9495 31.1523 16.0645 31.1523 17.2852C31.1523 18.5872 30.8675 19.7591 30.2979 20.8008C29.7445 21.8262 28.9876 22.64 28.0273 23.2422C27.0833 23.8444 26.0335 24.1374 24.8779 24.1211Z" fill="white"/>
                  </svg>
                </span>
                <h3 className="ml-2 input-condensed text-[36px] font-bold text-white tracking-tight">Tarjetahabiente</h3>
              </div>
              <div className="ml-15 flex ">
                <div className="flex items-center justify-center inline-flex rounded-full px-4 pb-2 pt-2 mt-2 bg-(--DeepBlue) text-(--fondo)">
                  <button type="button" disabled={selectedClient} className="cursor-pointer mx-3.5 ">
                    <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.97363 11.6689L4.49805 10.1514H13.2822C13.4919 10.1514 13.6696 10.2266 13.8154 10.377C13.9658 10.5273 14.041 10.7051 14.041 10.9102C14.041 11.1198 13.9658 11.2975 13.8154 11.4434C13.6696 11.5938 13.4919 11.6689 13.2822 11.6689H2.97363ZM2.14648 11.0264L0.4375 11.6758C0.328125 11.7214 0.227865 11.6963 0.136719 11.6006C0.0455729 11.5094 0.0227865 11.4069 0.0683594 11.293L0.745117 9.625L8.59961 1.77051L10.001 3.17871L2.14648 11.0264ZM10.6914 2.49512L9.2832 1.08691L10.0557 0.321289C10.2471 0.13444 10.4453 0.0341797 10.6504 0.0205078C10.86 0.00683594 11.0514 0.0888672 11.2246 0.266602L11.5186 0.560547C11.6963 0.738281 11.7806 0.929688 11.7715 1.13477C11.7624 1.33529 11.6621 1.53353 11.4707 1.72949L10.6914 2.49512Z" 
                      // fill="#02FFA2"
                      />
                    </svg>
                  </button>
                  <button type="button" className="cursor-pointer mx-3.5">
                    <svg width="16" height="13" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.5439 4.84668C12.0609 4.84668 11.8193 4.63932 11.8193 4.22461C11.8193 4.21094 11.8193 4.19954 11.8193 4.19043C11.8193 4.18132 11.8193 4.1722 11.8193 4.16309C11.8193 3.86686 11.8968 3.62533 12.0518 3.43848C12.2067 3.24707 12.4049 3.06706 12.6465 2.89844C12.929 2.70247 13.141 2.53841 13.2822 2.40625C13.4281 2.26953 13.501 2.09863 13.501 1.89355C13.501 1.68392 13.4212 1.51074 13.2617 1.37402C13.1068 1.2373 12.904 1.16895 12.6533 1.16895C12.5257 1.16895 12.4072 1.18945 12.2979 1.23047C12.193 1.26693 12.0928 1.32617 11.9971 1.4082C11.9059 1.48568 11.8239 1.58138 11.751 1.69531L11.6553 1.8252C11.5824 1.91634 11.498 1.98926 11.4023 2.04395C11.3112 2.09408 11.1995 2.11914 11.0674 2.11914C10.9079 2.11914 10.7689 2.06673 10.6504 1.96191C10.5365 1.85254 10.4795 1.71126 10.4795 1.53809C10.4795 1.47428 10.4863 1.41276 10.5 1.35352C10.5137 1.28971 10.5319 1.22591 10.5547 1.16211C10.6641 0.843099 10.9124 0.569661 11.2998 0.341797C11.6872 0.113932 12.1748 0 12.7627 0C13.1774 0 13.5579 0.0729167 13.9043 0.21875C14.2507 0.360026 14.5264 0.567383 14.7314 0.84082C14.9411 1.1097 15.0459 1.43327 15.0459 1.81152C15.0459 2.20345 14.9479 2.51562 14.752 2.74805C14.5605 2.97591 14.2939 3.2015 13.9521 3.4248C13.7425 3.56152 13.5739 3.69368 13.4463 3.82129C13.3232 3.94434 13.2549 4.09017 13.2412 4.25879C13.2412 4.27246 13.2389 4.28841 13.2344 4.30664C13.2344 4.32031 13.2344 4.33171 13.2344 4.34082C13.2161 4.4821 13.1455 4.60286 13.0225 4.70312C12.904 4.79883 12.7445 4.84668 12.5439 4.84668ZM12.5371 6.98633C12.3001 6.98633 12.0996 6.91341 11.9355 6.76758C11.7715 6.61719 11.6895 6.43034 11.6895 6.20703C11.6895 5.97917 11.7715 5.79232 11.9355 5.64648C12.0996 5.49609 12.3001 5.4209 12.5371 5.4209C12.7741 5.4209 12.9746 5.49382 13.1387 5.63965C13.3027 5.78548 13.3848 5.97461 13.3848 6.20703C13.3848 6.4349 13.3005 6.62174 13.1318 6.76758C12.9678 6.91341 12.7695 6.98633 12.5371 6.98633ZM1.27148 12.9062C0.875 12.9062 0.562826 12.8151 0.334961 12.6328C0.111654 12.4551 0 12.209 0 11.8945C0 11.457 0.13444 10.9967 0.40332 10.5137C0.672201 10.0306 1.05957 9.57943 1.56543 9.16016C2.07129 8.73633 2.67969 8.39225 3.39062 8.12793C4.10612 7.86361 4.90592 7.73145 5.79004 7.73145C6.67871 7.73145 7.47852 7.86361 8.18945 8.12793C8.90495 8.39225 9.51335 8.73633 10.0146 9.16016C10.5205 9.57943 10.9079 10.0306 11.1768 10.5137C11.4502 10.9967 11.5869 11.457 11.5869 11.8945C11.5869 12.209 11.473 12.4551 11.2451 12.6328C11.0218 12.8151 10.7119 12.9062 10.3154 12.9062H1.27148ZM5.79688 6.52832C5.29102 6.52832 4.82845 6.39388 4.40918 6.125C3.98991 5.85156 3.65267 5.48698 3.39746 5.03125C3.14681 4.57096 3.02148 4.05599 3.02148 3.48633C3.02148 2.9349 3.14681 2.43359 3.39746 1.98242C3.65267 1.52669 3.98991 1.16667 4.40918 0.902344C4.83301 0.633464 5.29557 0.499023 5.79688 0.499023C6.29818 0.499023 6.75846 0.631185 7.17773 0.895508C7.59701 1.15983 7.93424 1.51758 8.18945 1.96875C8.44466 2.41536 8.57227 2.91895 8.57227 3.47949C8.57227 4.04915 8.44466 4.56413 8.18945 5.02441C7.9388 5.4847 7.60156 5.85156 7.17773 6.125C6.75846 6.39388 6.29818 6.52832 5.79688 6.52832Z" 
                      // fill="#02FFA2"
                      />
                    </svg>
                  </button>
                  <button type="button"  className="cursor-pointer mx-3.5">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.82617 13.1797C4.67578 13.1797 4.55501 13.1364 4.46387 13.0498C4.37272 12.9587 4.32487 12.8402 4.32031 12.6943L4.11523 5.63965C4.11068 5.49382 4.15397 5.3776 4.24512 5.29102C4.33626 5.19987 4.45703 5.1543 4.60742 5.1543C4.75781 5.1543 4.87858 5.19987 4.96973 5.29102C5.06543 5.3776 5.11556 5.49154 5.12012 5.63281L5.3252 12.6875C5.3252 12.8333 5.27962 12.9518 5.18848 13.043C5.09733 13.1341 4.97656 13.1797 4.82617 13.1797ZM6.8291 13.1797C6.67871 13.1797 6.55566 13.1364 6.45996 13.0498C6.36882 12.9587 6.32324 12.8402 6.32324 12.6943V5.63965C6.32324 5.49382 6.36882 5.3776 6.45996 5.29102C6.55566 5.19987 6.67871 5.1543 6.8291 5.1543C6.98405 5.1543 7.1071 5.19987 7.19824 5.29102C7.29395 5.3776 7.3418 5.49382 7.3418 5.63965V12.6943C7.3418 12.8402 7.29395 12.9587 7.19824 13.0498C7.1071 13.1364 6.98405 13.1797 6.8291 13.1797ZM8.83887 13.1797C8.68392 13.1797 8.56087 13.1341 8.46973 13.043C8.37858 12.9518 8.33529 12.8333 8.33984 12.6875L8.54492 5.63965C8.54948 5.49382 8.59733 5.3776 8.68848 5.29102C8.77962 5.19987 8.90039 5.1543 9.05078 5.1543C9.20573 5.1543 9.3265 5.19987 9.41309 5.29102C9.50423 5.3776 9.54753 5.49382 9.54297 5.63965L9.34473 12.6943C9.34017 12.8402 9.29004 12.9587 9.19434 13.0498C9.10319 13.1364 8.9847 13.1797 8.83887 13.1797ZM3.64355 3.1582V1.70898C3.64355 1.17122 3.80762 0.751953 4.13574 0.451172C4.46842 0.150391 4.93099 0 5.52344 0H8.12793C8.72038 0 9.18066 0.150391 9.50879 0.451172C9.84147 0.751953 10.0078 1.17122 10.0078 1.70898V3.1582H8.61328V1.77051C8.61328 1.611 8.55859 1.4834 8.44922 1.3877C8.3444 1.28743 8.20312 1.2373 8.02539 1.2373H5.62598C5.44824 1.2373 5.30469 1.28743 5.19531 1.3877C5.09049 1.4834 5.03809 1.611 5.03809 1.77051V3.1582H3.64355ZM0.676758 4.05371C0.489909 4.05371 0.330404 3.98991 0.198242 3.8623C0.0660807 3.7347 0 3.5752 0 3.38379C0 3.19694 0.0660807 3.03971 0.198242 2.91211C0.330404 2.78451 0.489909 2.7207 0.676758 2.7207H12.9883C13.1751 2.7207 13.3324 2.78451 13.46 2.91211C13.5921 3.03516 13.6582 3.19238 13.6582 3.38379C13.6582 3.5752 13.5944 3.7347 13.4668 3.8623C13.3392 3.98991 13.1797 4.05371 12.9883 4.05371H0.676758ZM3.68457 15.5791C3.13314 15.5791 2.69336 15.4264 2.36523 15.1211C2.03711 14.8158 1.86165 14.3874 1.83887 13.8359L1.37402 3.91699H2.74805L3.20605 13.5625C3.21517 13.763 3.27669 13.9248 3.39062 14.0479C3.50911 14.1709 3.66178 14.2324 3.84863 14.2324H9.80273C9.99414 14.2324 10.1468 14.1709 10.2607 14.0479C10.3792 13.9294 10.443 13.7676 10.4521 13.5625L10.8965 3.91699H12.291L11.8262 13.8291C11.8034 14.3851 11.6257 14.8158 11.293 15.1211C10.9648 15.4264 10.5273 15.5791 9.98047 15.5791H3.68457Z" 
                      // fill="#02FFA2"
                      />
                    </svg>
                  </button>
                  <button type="button" className="cursor-pointer mx-3.5 pt-1">
                    <svg width="19" height="14" viewBox="0 0 19 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.36914 11.9629C7.60156 11.612 7.78158 11.2292 7.90918 10.8145C8.03678 10.3997 8.10059 9.96908 8.10059 9.52246C8.10059 8.87533 7.9707 8.26921 7.71094 7.7041C7.45573 7.139 7.10938 6.64909 6.67188 6.23438H15.8594C16.429 6.23438 16.9303 6.35514 17.3633 6.59668C17.8008 6.83822 18.1403 7.17546 18.3818 7.6084C18.6234 8.03678 18.7441 8.53353 18.7441 9.09863C18.7441 9.66374 18.6234 10.1628 18.3818 10.5957C18.1403 11.0241 17.8008 11.359 17.3633 11.6006C16.9303 11.8421 16.429 11.9629 15.8594 11.9629H7.36914ZM17.7871 5.63965C17.2083 5.33887 16.5658 5.18848 15.8594 5.18848H5.46191C5.37533 5.18848 5.28874 5.19303 5.20215 5.20215C5.11556 5.21126 5.03581 5.22493 4.96289 5.24316C4.78516 5.1748 4.60286 5.12012 4.41602 5.0791C4.22917 5.03809 4.0332 5.00846 3.82812 4.99023L5.26367 1.68848C5.49609 1.14616 5.83789 0.729167 6.28906 0.4375C6.74023 0.145833 7.28027 0 7.90918 0H13.4189C14.0479 0 14.5879 0.145833 15.0391 0.4375C15.4948 0.729167 15.8389 1.14616 16.0713 1.68848L17.7871 5.63965ZM14.916 9.09863C14.916 9.3584 15.0072 9.57943 15.1895 9.76172C15.3763 9.94401 15.5973 10.0329 15.8525 10.0283C16.1032 10.0238 16.3197 9.93262 16.502 9.75488C16.6842 9.57715 16.7754 9.3584 16.7754 9.09863C16.7754 8.85254 16.6842 8.63835 16.502 8.45605C16.3197 8.26921 16.1032 8.17578 15.8525 8.17578C15.5973 8.17578 15.3763 8.26921 15.1895 8.45605C15.0072 8.63835 14.916 8.85254 14.916 9.09863ZM3.55469 13.084C3.06706 13.084 2.60905 12.9906 2.18066 12.8037C1.75228 12.6169 1.37402 12.3594 1.0459 12.0312C0.722331 11.7077 0.467122 11.3317 0.280273 10.9033C0.0934245 10.4749 0 10.0169 0 9.5293C0 9.03711 0.0934245 8.5791 0.280273 8.15527C0.467122 7.72689 0.722331 7.34863 1.0459 7.02051C1.37402 6.69238 1.75228 6.43717 2.18066 6.25488C2.60905 6.06803 3.06706 5.97461 3.55469 5.97461C4.04232 5.97461 4.50033 6.06803 4.92871 6.25488C5.3571 6.43717 5.73535 6.69238 6.06348 7.02051C6.3916 7.34408 6.64681 7.72005 6.8291 8.14844C7.01139 8.57682 7.10254 9.03711 7.10254 9.5293C7.10254 10.0124 7.00911 10.4681 6.82227 10.8965C6.63997 11.3249 6.38477 11.7031 6.05664 12.0312C5.72852 12.3594 5.35026 12.6169 4.92188 12.8037C4.49349 12.9906 4.03776 13.084 3.55469 13.084ZM3.12402 11.4639C3.31543 11.4639 3.45898 11.3955 3.55469 11.2588L5.53027 8.56543C5.56673 8.5153 5.5918 8.46289 5.60547 8.4082C5.6237 8.35352 5.63281 8.30339 5.63281 8.25781C5.63281 8.10742 5.5804 7.9821 5.47559 7.88184C5.37077 7.78158 5.24544 7.73145 5.09961 7.73145C4.91732 7.73145 4.76921 7.8112 4.65527 7.9707L3.08301 10.1445L2.32422 9.30371C2.27865 9.24902 2.22168 9.20801 2.15332 9.18066C2.08952 9.15332 2.0166 9.13965 1.93457 9.13965C1.79329 9.13965 1.66797 9.1875 1.55859 9.2832C1.45378 9.37891 1.40137 9.50879 1.40137 9.67285C1.40137 9.73665 1.41504 9.80273 1.44238 9.87109C1.46973 9.9349 1.50846 9.99414 1.55859 10.0488L2.69336 11.2861C2.74805 11.3499 2.81413 11.3955 2.8916 11.4229C2.96908 11.4502 3.04655 11.4639 3.12402 11.4639Z" 
                      // fill="#02FFA2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Ficha técnica del Cliente seleccionado en la tabla */}
            <div className="space-y-4 border-b border-[#1a5f74] pb-3 text-xs">
              <div className="mb-1">
                <p className="text-[14px] text-(--TextoInactivo) font-normal mb-0.5">Nombre</p>
                <p className="text-[14px] text-white font-normal">{!detallesCliente ? '': detallesCliente.usuario.Cliente}</p>
              </div>
              <div className="mb-1">
                <p className="text-[14px] text-(--TextoInactivo) font-normal mb-0.5">Correo</p>
                <p className="text-[14px] text-white font-normal">{!detallesCliente ? '': detallesCliente.usuario.correo}</p>
              </div>
              <div className="mb-1">
                <p className="text-[14px] text-(--TextoInactivo) font-normal mb-0.5">No. de cliente</p>
                <p className="text-[14px] text-white font-normal">{!detallesCliente ? '': detallesCliente.usuario.noCliente}</p>
              </div>
              <div className="mb-1">
                <p className="text-[14px] text-(--TextoInactivo) font-normal mb-0.5">No. de tarjeta asignada</p>
                <p className="text-[14px] text-white font-normal">{!detallesCliente ? '' : detallesCliente.usuario.noTarjeta}</p>
              </div>
              <div>
                <p className="text-[14px] text-(--TextoInactivo) font-normal mb-0.5">Teléfono</p>
                <p className="text-[14px] text-white font-normal">{!detallesCliente ? '' : detallesCliente.usuario.telefono}</p>
              </div>
            </div>
          {/* </>
        )
      } */}

        {/* Historial de Movimientos de Compras del Cliente */}
        <div className="flex-1 flex flex-col min-h-[300px]">
          {/* Título de la Sección de Movimientos */}
          <div className="flex items-center justify-between pb-0">
            <h4 className="input-condensed text-[25px] font-bold text-white flex items-center gap-2">Compras</h4>
            {/* <span className="text-[10px] bg-[#155A6F] border border-[#1e6f8a] text-[#00E5FF] px-2 py-0.5 rounded-md font-bold font-mono">
              {mockCompras.reduce((acc, curr) => acc + curr.items.length, 0)} Movs
            </span> */}
          </div>
          
          {/* Contenedor con Scroll Interno para prevenir desbordamientos */}
          {/* ===============CONTINUAR DESDE AQUI================ */}
          <div className="purchase-history-box pr-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-[#155A6F] scrollbar-track-transparent">

          {detallesCliente?.historico.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-medium">
              Sin Historico a mostrar.
            </div>
          ) : (
          <>
            {detallesCliente?.historico.map((grupo:any, idx:any) => (
              <div key={idx} className="mb-5 last:mb-2">

                <div className="flex items-center gap-2 mb-0">
                  <p className="text-[13px] font-black text-white px-2.5 py-0.5">
                    {grupo.fecha}
                  </p>
                  <div className="h-[1px] bg-[#1a5f74]/40 flex-1"></div>
                </div>

             
                <div className="space-y-0 pl-1">
                  {grupo.items.map((compra:any, cIdx:any) => (
                    <div 
                      key={cIdx} 
                      className="purchase-item-row group hover:bg-[#155A6F]/20 p-2 rounded-lg transition-all border-b border-[#114E60]/30 last:border-0 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <span className={` font-normal tracking-wide transition-colors px-2 py-1 ${compra.precio.charAt(0) === '+' ? 'text-(--VerdeNeon)':'text-slate-200 group-hover:text-white'}`  }>
                          {compra.descr}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <span className={`input-condensed font-normal text-right px-2 py-1 transition-all ${compra.precio.charAt(0) === '+' ? 'text-(--VerdeNeon)':'text-slate-200 group-hover:text-white'}`}>
                          {compra.precio}
                        </span>
                        <button type="button"
                          title="Ver comprobante digital"
                          className="action-icon-btn !p-1 !bg-transparent border-0 opacity-40 group-hover:opacity-100 text-[#00E5FF] hover:scale-110 transition-all"
                        >
                          <span>
                            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.14062 10.5176C2.65234 10.5176 2.19922 10.3594 1.78125 10.043C1.36328 9.73047 1.00586 9.28711 0.708984 8.71289C0.416016 8.13867 0.208984 7.46484 0.0878906 6.69141C0.236328 6.91406 0.429688 7.08789 0.667969 7.21289C0.910156 7.33398 1.18555 7.39453 1.49414 7.39453C2.00586 7.39453 2.41602 7.23242 2.72461 6.9082C3.0332 6.58008 3.1875 6.14844 3.1875 5.61328C3.1875 5.08594 3.0332 4.66016 2.72461 4.33594C2.41602 4.00781 2.00586 3.84375 1.49414 3.84375C1.14648 3.84375 0.84375 3.91992 0.585938 4.07227C0.332031 4.22461 0.136719 4.43555 0 4.70508C0.0546875 3.76367 0.226562 2.94141 0.515625 2.23828C0.804688 1.53125 1.17773 0.982422 1.63477 0.591797C2.0918 0.197266 2.59375 0 3.14062 0C3.58203 0 3.99219 0.126953 4.37109 0.380859C4.75391 0.634766 5.08984 0.994141 5.37891 1.45898C5.66797 1.92383 5.89258 2.47852 6.05273 3.12305C6.2168 3.76367 6.29883 4.47461 6.29883 5.25586C6.29883 6.03711 6.2168 6.75 6.05273 7.39453C5.89258 8.03906 5.66797 8.59375 5.37891 9.05859C5.08984 9.52344 4.75391 9.88281 4.37109 10.1367C3.99219 10.3906 3.58203 10.5176 3.14062 10.5176ZM1.01367 5.40234C0.908203 5.38281 0.824219 5.32031 0.761719 5.21484C0.703125 5.10547 0.685547 4.98242 0.708984 4.8457C0.732422 4.71289 0.791016 4.60547 0.884766 4.52344C0.978516 4.44141 1.07617 4.41016 1.17773 4.42969C1.28711 4.44922 1.37109 4.51367 1.42969 4.62305C1.48828 4.73242 1.50391 4.85352 1.47656 4.98633C1.44922 5.11914 1.39062 5.22656 1.30078 5.30859C1.21484 5.39062 1.11914 5.42188 1.01367 5.40234ZM10.4473 10.5176C9.95508 10.5176 9.5 10.3594 9.08203 10.043C8.66406 9.73047 8.30859 9.28711 8.01562 8.71289C7.72266 8.13867 7.51562 7.46484 7.39453 6.69141C7.54297 6.91406 7.73633 7.08789 7.97461 7.21289C8.21289 7.33398 8.48633 7.39453 8.79492 7.39453C9.30664 7.39453 9.7168 7.23242 10.0254 6.9082C10.3379 6.58008 10.4941 6.14844 10.4941 5.61328C10.4941 5.08594 10.3379 4.66016 10.0254 4.33594C9.7168 4.00781 9.30664 3.84375 8.79492 3.84375C8.45117 3.84375 8.15039 3.91992 7.89258 4.07227C7.63867 4.22461 7.44336 4.43555 7.30664 4.70508C7.35742 3.76367 7.52734 2.94141 7.81641 2.23828C8.10938 1.53125 8.48242 0.982422 8.93555 0.591797C9.39258 0.197266 9.89648 0 10.4473 0C10.8848 0 11.2949 0.126953 11.6777 0.380859C12.0605 0.634766 12.3965 0.994141 12.6855 1.45898C12.9746 1.92383 13.1992 2.47852 13.3594 3.12305C13.5234 3.76367 13.6055 4.47461 13.6055 5.25586C13.6055 6.03711 13.5234 6.75 13.3594 7.39453C13.1992 8.03906 12.9746 8.59375 12.6855 9.05859C12.3965 9.52344 12.0605 9.88281 11.6777 10.1367C11.2949 10.3906 10.8848 10.5176 10.4473 10.5176ZM8.32031 5.40234C8.21094 5.37891 8.12695 5.31445 8.06836 5.20898C8.00977 5.10352 7.99219 4.98242 8.01562 4.8457C8.03906 4.71289 8.09766 4.60547 8.19141 4.52344C8.28516 4.44141 8.38281 4.41016 8.48438 4.42969C8.59375 4.44531 8.67578 4.50977 8.73047 4.62305C8.78906 4.73242 8.80664 4.85352 8.7832 4.98633C8.75586 5.11914 8.69727 5.22656 8.60742 5.30859C8.51758 5.39062 8.42188 5.42188 8.32031 5.40234Z" fill="#D9D9D9"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

            {/* ====================================================================== */}
            {/* {mockCompras.map((grupo, idx) => (
              <div key={idx} className="mb-5 last:mb-2">

                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest bg-[#155A6F]/30 border border-[#1e6f8a]/20 px-2.5 py-0.5 rounded-md">
                    {grupo.fecha}
                  </p>
                  <div className="h-[1px] bg-[#1a5f74]/40 flex-1"></div>
                </div>

             
                <div className="space-y-1.5 pl-1">
                  {grupo.items.map((compra, cIdx) => (
                    <div 
                      key={cIdx} 
                      className="purchase-item-row group hover:bg-[#155A6F]/20 p-2 rounded-lg transition-all border-b border-[#114E60]/30 last:border-0 flex justify-between items-center"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-200 font-bold tracking-wide group-hover:text-white transition-colors">
                          {compra.desc}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                          Cargo Procesado
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-white text-right tracking-tight bg-[#114E60]/50 px-2 py-1 rounded-md border border-[#1a5f74]/20 group-hover:border-[#00E5FF]/30 transition-all">
                          {compra.precio}
                        </span>
                        <button 
                          title="Ver comprobante digital"
                          className="action-icon-btn !p-1 !bg-transparent border-0 opacity-40 group-hover:opacity-100 text-[#00E5FF] hover:scale-110 transition-all"
                        >
                          📄
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))} */}
          </div>
        </div>


      </aside>

        
    </div>

            )
};