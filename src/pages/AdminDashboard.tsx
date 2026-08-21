import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutSession } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  // Mocks de Tarjetahabientes idénticos a la imagen para simular tu sp_obtener_tarjeta_IdCliente_app
  const mockTarjetahabientes = [
    { id: '1', nombre: 'Hugo Sánchez Márques', tarjeta: '4827 1936 7504 8612', vigencia: '25/12/2026', correo: 'usuario@fincashrg.com', clienteNo: '000005', asignada: '0000 0000 0000 0000' },
    { id: '2', nombre: 'Juan Pérez González', tarjeta: '9158 6042 3371 4289', vigencia: '25/12/2026', correo: 'juan@fincashrg.com', clienteNo: '000006', asignada: '1111 0000 2222 0000' },
    { id: '3', nombre: 'María López Hernández', tarjeta: '2764 8519 1043 6975', vigencia: '25/12/2026', correo: 'maria@fincashrg.com', clienteNo: '000007', asignada: '3333 4444 5555 6666' },
    { id: '4', nombre: 'Carlos Ramírez Torres', tarjeta: '6381 4725 9806 1537', vigencia: '24/12/2026', correo: 'carlos@fincashrg.com', clienteNo: '000008', asignada: '7777 8888 9999 0000' },
    { id: '5', nombre: 'Ana Martínez Sánchez', tarjeta: '7490 2816 5347 9201', vigencia: '24/12/2026', correo: 'ana@fincashrg.com', clienteNo: '000009', asignada: '1234 5678 9012 3456' },
  ];
  
  // PROVICIONALES A LAS CONSULTAS REALES
  const [selectedClient, setSelectedClient] = useState(mockTarjetahabientes[0]);
  const [centroActivo, setCentroActivo] = useState('Xolos');

// Mock de historial simula sp_historial_movimientos_app
const mockCompras = [
  { fecha: '12 Diciembre 2025', items: [{ desc: 'Carga de gasolina', precio: '$700.00' }, { desc: 'Limpiadores líquidos', precio: '$150.00' }, { desc: 'Limpiadores líquidos', precio: '$150.00' }] },
  { fecha: '7 Noviembre 2025', items: [{ desc: 'Carga de gasolina', precio: '$700.00' }, { desc: 'Limpiadores líquidos', precio: '$150.00' }, { desc: 'Carga de gasolina', precio: '$700.00' }, { desc: 'Limpiadores líquidos', precio: '$150.00' }] }
];


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
            <div className="flex flex-col items-center">
              <button type="button" className="bg-(--MediumBlue) px-6 py-2 rounded-xl transition-colors">
                <svg width="13" height="15" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.23828 11.3613V7.40039C8.23828 7.2793 8.20117 7.18359 8.12695 7.11328C8.05664 7.03906 7.96094 7.00195 7.83984 7.00195H5.67188C5.55078 7.00195 5.45117 7.03906 5.37305 7.11328C5.29883 7.18359 5.26172 7.2793 5.26172 7.40039V11.3613H8.23828ZM1.67578 10.8926V5.86523L6.39258 1.9043C6.63477 1.70117 6.87695 1.70117 7.11914 1.9043L11.8418 5.86523V10.8926C11.8418 11.2676 11.7363 11.5586 11.5254 11.7656C11.3145 11.9727 11.0195 12.0762 10.6406 12.0762H2.88281C2.50391 12.0762 2.20703 11.9727 1.99219 11.7656C1.78125 11.5586 1.67578 11.2676 1.67578 10.8926ZM0 5.57227C0 5.45117 0.0507812 5.34961 0.152344 5.26758L6.13477 0.246094C6.33008 0.0820312 6.53906 0 6.76172 0C6.98438 0 7.19336 0.0820312 7.38867 0.246094L13.3594 5.26758C13.457 5.34961 13.5059 5.45508 13.5059 5.58398C13.5059 5.68945 13.4688 5.77344 13.3945 5.83594C13.3203 5.89453 13.2324 5.92383 13.1309 5.92383C13.0684 5.92383 13.0117 5.91016 12.9609 5.88281C12.9102 5.85156 12.8633 5.81836 12.8203 5.7832L6.99023 0.890625C6.91211 0.820312 6.83398 0.787109 6.75586 0.791016C6.67773 0.791016 6.60352 0.824219 6.5332 0.890625L0.697266 5.7832C0.650391 5.81836 0.601562 5.85156 0.550781 5.88281C0.5 5.91016 0.443359 5.92383 0.380859 5.92383C0.263672 5.92383 0.169922 5.88867 0.0996094 5.81836C0.0332031 5.74414 0 5.66211 0 5.57227ZM10.5938 3.24609V1.60547C10.5938 1.5 10.627 1.41602 10.6934 1.35352C10.7598 1.29102 10.8438 1.25977 10.9453 1.25977H11.4961C11.5977 1.25977 11.6797 1.29102 11.7422 1.35352C11.8086 1.41602 11.8418 1.5 11.8418 1.60547V4.30078L10.5938 3.24609Z" fill="#D9D9D9"/>
                </svg>
              </button>
              <label htmlFor="inicio" className="font-light text-[12px]">Inicio</label>
            </div>
            <div className="flex flex-col items-center">
              <button type="button" onClick={handleLogout} className="bg-(--MediumBlue) px-6 py-2 rounded-xl hover:bg-(--DeepBlue) transition-all cursor-pointer">
                <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.416992 14.2324C0.30306 14.2324 0.205078 14.1914 0.123047 14.1094C0.0410156 14.0273 0 13.9294 0 13.8154V1.13477C0 0.792969 0.107096 0.519531 0.321289 0.314453C0.535482 0.104818 0.818034 0 1.16895 0H8.70215C9.05762 0 9.34245 0.104818 9.55664 0.314453C9.77083 0.519531 9.87793 0.792969 9.87793 1.13477V13.8154C9.87793 13.9294 9.83691 14.0273 9.75488 14.1094C9.67285 14.1914 9.57487 14.2324 9.46094 14.2324C9.33789 14.2324 9.23535 14.1914 9.15332 14.1094C9.07129 14.0273 9.03027 13.9294 9.03027 13.8154V1.20312C9.03027 0.961589 8.91634 0.84082 8.68848 0.84082H1.18945C0.961589 0.84082 0.847656 0.961589 0.847656 1.20312V13.8154C0.847656 13.9294 0.806641 14.0273 0.724609 14.1094C0.642578 14.1914 0.540039 14.2324 0.416992 14.2324ZM1.72949 14.0137C1.611 14.0137 1.55176 13.9544 1.55176 13.8359V1.72266C1.55176 1.59961 1.611 1.53809 1.72949 1.53809H8.14844C8.26693 1.53809 8.32617 1.59961 8.32617 1.72266V13.8359C8.32617 13.9544 8.26693 14.0137 8.14844 14.0137H1.72949ZM6.76074 8.36719C6.90202 8.36719 7.02051 8.31934 7.11621 8.22363C7.21191 8.12793 7.25977 8.00944 7.25977 7.86816C7.25977 7.72689 7.21191 7.6084 7.11621 7.5127C7.02051 7.41699 6.90202 7.36914 6.76074 7.36914C6.61947 7.36914 6.50098 7.41699 6.40527 7.5127C6.30957 7.6084 6.26172 7.72689 6.26172 7.86816C6.26172 8.00944 6.30957 8.12793 6.40527 8.22363C6.50098 8.31934 6.61947 8.36719 6.76074 8.36719Z" fill="#02FFA2"/>
                </svg>
              </button>
              <label htmlFor="inicio" className="font-light text-[12px]">Salir</label>
            </div>
          </div>
        </div>

        {/* Tarjeta de Métricas Globales del Centro */}
        <section className="stats-card-header"> 
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white tracking-tight pl-3">{centroActivo}</h1>
            <div className="flex ">
             <div className="relative px-5">
              <input type="text" placeholder="No. de tarjeta o nombre de tarjethabiente" className="search-input-box" />
              <span className="absolute right-8.5 top-3 text-slate-400 text-xs cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5.45508C0 4.70312 0.141276 3.99902 0.423828 3.34277C0.70638 2.68197 1.09831 2.10091 1.59961 1.59961C2.10091 1.09831 2.67969 0.70638 3.33594 0.423828C3.99674 0.141276 4.70312 0 5.45508 0C6.20703 0 6.91113 0.141276 7.56738 0.423828C8.22819 0.70638 8.80924 1.09831 9.31055 1.59961C9.81185 2.10091 10.2038 2.68197 10.4863 3.34277C10.7689 3.99902 10.9102 4.70312 10.9102 5.45508C10.9102 6.07943 10.8099 6.67188 10.6094 7.23242C10.4134 7.79297 10.14 8.30111 9.78906 8.75684L13.1318 12.1201C13.2048 12.193 13.2594 12.2773 13.2959 12.373C13.3369 12.4688 13.3574 12.5713 13.3574 12.6807C13.3574 12.8311 13.3232 12.9678 13.2549 13.0908C13.1911 13.2139 13.0999 13.3096 12.9814 13.3779C12.863 13.4508 12.7262 13.4873 12.5713 13.4873C12.4619 13.4873 12.3571 13.4668 12.2568 13.4258C12.1611 13.3893 12.0723 13.3324 11.9902 13.2549L8.62695 9.88477C8.18034 10.2038 7.68815 10.4544 7.15039 10.6367C6.61263 10.819 6.04753 10.9102 5.45508 10.9102C4.70312 10.9102 3.99674 10.7689 3.33594 10.4863C2.67969 10.2038 2.10091 9.81185 1.59961 9.31055C1.09831 8.80924 0.70638 8.23047 0.423828 7.57422C0.141276 6.91341 0 6.20703 0 5.45508ZM1.16895 5.45508C1.16895 6.04753 1.27832 6.60352 1.49707 7.12305C1.72038 7.63802 2.02799 8.09147 2.41992 8.4834C2.81641 8.87533 3.27214 9.18294 3.78711 9.40625C4.30664 9.62956 4.86263 9.74121 5.45508 9.74121C6.04753 9.74121 6.60124 9.62956 7.11621 9.40625C7.63574 9.18294 8.09147 8.87533 8.4834 8.4834C8.87533 8.09147 9.18294 7.63802 9.40625 7.12305C9.62956 6.60352 9.74121 6.04753 9.74121 5.45508C9.74121 4.86263 9.62956 4.30892 9.40625 3.79395C9.18294 3.27441 8.87533 2.81868 8.4834 2.42676C8.09147 2.03027 7.63574 1.72266 7.11621 1.50391C6.60124 1.2806 6.04753 1.16895 5.45508 1.16895C4.86263 1.16895 4.30664 1.2806 3.78711 1.50391C3.27214 1.72266 2.81641 2.03027 2.41992 2.42676C2.02799 2.81868 1.72038 3.27441 1.49707 3.79395C1.27832 4.30892 1.16895 4.86263 1.16895 5.45508Z" fill="#D9D9D9"/>
                </svg>
              </span>
            </div>
            <button type="button" className="rounded-full px-4 bg-(--MediumBlue) hover:bg-(--DeepBlue) transition-all cursor-pointer ">
                <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6.68359V4.88574H7.71094V6.68359H0ZM2.95312 9.54785V2.02148H4.75098V9.54785H2.95312Z" fill="#02FFA2"/>
                  <path d="M13.6914 9.55664H15.3662C15.5667 9.55664 15.7285 9.49512 15.8516 9.37207C15.9746 9.24902 16.0361 9.0918 16.0361 8.90039V7.63574C16.0361 7.43978 15.9746 7.28255 15.8516 7.16406C15.7285 7.04102 15.5667 6.97949 15.3662 6.97949H13.6914C13.4909 6.97949 13.3291 7.04102 13.2061 7.16406C13.083 7.28255 13.0215 7.43978 13.0215 7.63574V8.90039C13.0215 9.0918 13.083 9.24902 13.2061 9.37207C13.3291 9.49512 13.4909 9.55664 13.6914 9.55664ZM10.8955 4.30664H26.96V2.75488H10.8955V4.30664ZM13.042 11.6758C12.3265 11.6758 11.7887 11.498 11.4287 11.1426C11.0732 10.7917 10.8955 10.2653 10.8955 9.56348V2.11914C10.8955 1.41276 11.0732 0.884115 11.4287 0.533203C11.7887 0.177734 12.3265 0 13.042 0H24.8135C25.529 0 26.0645 0.177734 26.4199 0.533203C26.7799 0.888672 26.96 1.41732 26.96 2.11914V9.56348C26.96 10.2653 26.7799 10.7917 26.4199 11.1426C26.0645 11.498 25.529 11.6758 24.8135 11.6758H13.042Z" fill="#02FFA2"/>
                </svg>
            </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <div className="bg-(--MediumBlue) rounded-full px-5 py-3 font-semibold text-[14px]">
              <span>No. de tarjetas <samp className="pr-5"></samp> <strong className="text-white ">35</strong></span>
            </div>
           
            
            <div className="bg-(--MediumBlue) rounded-full text-right flex items-center justify-between px-5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-9 ">Cargos Globales</p>
              <p className="text-2xl font-black text-[#00E5FF] tracking-tight">$3,500,000.00</p>
            </div>
          </div>
        </section>
        {/* <section className="stats-card-header"> 
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight pl-3">{centroActivo}</h1>
            <div className="bg-(--MediumBlue) rounded-full px-5 py-3 mt-2 font-semibold text-[14px]">
              <span>No. de tarjetas <samp className="pr-5"></samp> <strong className="text-white ">35</strong></span>
            </div>
          </div>
          
          <div className="flex items-center flex-col gap-4">
            <div className="relative">
              <input type="text" placeholder="No. de tarjeta o nombre de tarjetahabiente" className="search-input-box" />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cargos Globales</p>
              <p className="text-2xl font-black text-[#00E5FF] tracking-tight">$3,500,000.00</p>
            </div>
          </div>
        </section> */}

        {/* Listado de Tarjetahabientes (Tabla) */}
        <section className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tarjetahabiente</th>
                <th>No. de Tarjeta</th>
                <th>Vigencia</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockTarjetahabientes.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedClient(item)}
                  className={selectedClient.id === item.id ? 'selected' : ''}
                >
                  <td className="font-bold text-white">{item.nombre}</td>
                  <td className="font-mono text-slate-300 tracking-wider">{item.tarjeta}</td>
                  <td>{item.vigencia}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button className="action-icon-btn">💳</button>
                      <button className="action-icon-btn">📊</button>
                      <button className="action-icon-btn">📄</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Componente de Paginación */}
          <div className="pagination-container">
            <button className="pagination-btn">‹</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">4</button>
            <button className="pagination-btn">5</button>
            <span>...</span>
            <button className="pagination-btn">12</button>
            <button className="pagination-btn">›</button>
          </div>
        </section>
      </main>

      {/* 💳 BARRA DE DETALLES DERECHA (Información del Tarjetahabiente Seleccionado) */}
      <aside className="details-panel">
        <div className="details-header">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Tarjetahabiente</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">Ficha de Cliente</span>
          </div>
          <button className="text-xs text-[#00E5FF] hover:underline font-semibold">Editar</button>
        </div>

        {/* Ficha técnica del Cliente seleccionado en la tabla */}
        <div className="space-y-4 border-b border-[#1a5f74] pb-5 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Nombre</p>
            <p className="font-bold text-white">{selectedClient.nombre}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Correo</p>
            <p className="text-slate-300 font-medium break-all">{selectedClient.correo}</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">No. de cliente</p>
              <p className="font-mono text-white font-bold">{selectedClient.clienteNo}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Vigencia</p>
              <p className="text-white font-bold">{selectedClient.vigencia}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">No. de tarjeta asignada</p>
            <p className="font-mono text-[#00E5FF] font-bold tracking-widest">{selectedClient.tarjeta}</p>
          </div>
        </div>
      </aside>

        {/* Historial de Movimientos de Compras del Cliente */}
    </div>

            )
};