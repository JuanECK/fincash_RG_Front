import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutSession } from '../services/api';
import { ModalAgregarCentroNegocios } from '../modals/ModalGeneral';

export const AdminLayout: React.FC = () => {

    const [showModalAgregaCentroNegocio, setShowModalAgregaCentroNegocio] = useState(false);
    const [centroActivo, setCentroActivo] = useState("Xolos");
//   const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Sabe en qué URL estamos para pintar el botón activo

//   const handleLogout = async () => {
//     await logoutSession();
//     logout();
//     navigate('/', { replace: true });
//   };

  return (
    <div className="dashboard-layout">
      

        {/* 📁 BARRA LATERAL IZQUIERDA (Centros de Negocio) */}
        <aside className="sidebar-panel">
          <div>
            {/* Logo Corporativo FRG */}
            <div className="flex items-center justify-center gap-2 mb-6 px-2 ">
              <svg
                width="73"
                height="32"
                viewBox="0 0 73 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.1118 0H2.47181C1.10798 0 0 1.12259 0 2.5044V29.4936C0 30.8774 1.10798 31.998 2.47181 31.998H29.1098C30.4756 31.998 31.5816 30.8754 31.5816 29.4936V2.5044C31.5816 1.12055 30.4736 0 29.1098 0H29.1118ZM14.1963 28.3608L5.52783 21.5885L11.4263 16.9797L14.1963 19.1453V28.3628V28.3608ZM14.1963 12.8567L11.4263 15.0223L5.52783 10.4136L14.1963 3.64128V12.8588V12.8567ZM17.3893 28.3608V19.1433L20.1593 16.9777L26.0578 21.5864L17.3893 28.3587V28.3608ZM20.1593 15.0223L17.3893 12.8567V3.64128L26.0578 10.4136L20.1593 15.0223Z"
                  fill="white"
                />
                <path
                  d="M47.2948 3.51269C47.7722 3.51269 48.0442 3.75353 48.0442 4.23727V5.168C48.0442 5.65174 47.7722 5.92728 47.2948 5.92728H41.7106V14.7917H45.9995C46.4769 14.7917 46.7489 15.0325 46.7489 15.5163V16.447C46.7489 16.9307 46.4769 17.2063 45.9995 17.2063H41.7106V27.728C41.7106 28.2118 41.4386 28.4873 40.9612 28.4873H39.5993C39.1219 28.4873 38.8499 28.2118 38.8499 27.728V4.23727C38.8499 3.75353 39.1219 3.51269 39.5993 3.51269H47.2948Z"
                  fill="white"
                />
                <path
                  d="M56.6562 17.1042L60.5725 27.5219C60.7417 27.9362 60.5725 28.4526 59.9943 28.4873H58.4613C58.0523 28.4873 57.8146 28.3158 57.7119 27.9689L53.7634 17.4471H52.4358V27.728C52.4358 28.2118 52.1639 28.4873 51.6864 28.4873H50.3246C49.8472 28.4873 49.5752 28.2118 49.5752 27.728V4.23727C49.5752 3.75353 49.8472 3.51269 50.3246 3.51269H54.1381C58.5982 3.51269 59.7888 5.47824 59.7888 9.03176V11.9301C59.7888 14.6896 59.1422 16.4837 56.6562 17.1042ZM54.1381 15.0346C56.4528 15.0346 56.9645 13.8956 56.9645 11.9301V9.03176C56.9645 7.1009 56.4528 5.92728 54.1381 5.92728H52.4358V15.0346H54.1381Z"
                  fill="white"
                />
                <path
                  d="M72.2506 15.7938C72.7281 15.7938 73 16.0694 73 16.5531V23.5908C73 26.8667 71.8417 28.6608 67.7562 28.6608C63.6708 28.6608 62.5125 26.8667 62.5125 23.5908V8.41127C62.5125 5.13535 63.6708 3.34124 67.7562 3.34124C71.8417 3.34124 73 5.13535 73 8.41127V11.0667C73 11.5505 72.7281 11.826 72.2506 11.826H70.8888C70.4114 11.826 70.1394 11.5505 70.1394 11.0667V8.41127C70.1394 6.75596 69.6962 5.75583 67.7562 5.75583C65.8163 5.75583 65.3731 6.75596 65.3731 8.41127V23.5887C65.3731 25.244 65.8163 26.2442 67.7562 26.2442C69.6962 26.2442 70.1394 25.244 70.1394 23.5887V18.2064H68.3002C67.8227 18.2064 67.585 17.9656 67.585 17.4818V16.5511C67.585 16.0674 67.8227 15.7918 68.3002 15.7918H72.2486L72.2506 15.7938Z"
                  fill="white"
                />
                <defs>
                  <clipPath id="clip0_503_131">
                    <rect width="73" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="sidebar-title-btn">
              <div className="bg-(--DeepBlue) py-2 px-5 rounded-full flex items-center gap-1.5 font-light tracking-wider text-[12px]">
                <span>Centros de Negocio</span>
              </div>
              <div className="bg-(--DeepBlue)  rounded-full">
                {/* <button type="button" className="px-2 py-1.5 transition-transform duration-300 ease-in-out hover:scale-110 hover:animate-[pulse_1s_infinite]">+</button> */}
                <button
                  type="button"
                  onClick={()=> setShowModalAgregaCentroNegocio(true)}
                  className="text-[15px] font-bold cursor-pointer py-1.5 px-3"
                >
                  +
                </button>
              </div>
            </div>

            <nav className="sidebar-menu-list">
              {["Xolos", "Atlante", "América"].map((centro) => (
                <button
                  type="button"
                  key={centro}
                  onClick={() => setCentroActivo(centro)}
                  className={`sidebar-menu-item ${centroActivo === centro ? "active" : ""}`}
                >
                  {centro}
                </button>
              ))}
            </nav>
          </div>

          <button
            type="button"
            className="w-full text-center text-md font-bold text-(--GrisLight) hover:text-(--VerdeNeon) px-4 transition-colors cursor-pointer"
          >
            Editar
          </button>
        </aside>






      {/* 📁 BARRA LATERAL IZQUIERDA (Inmutable - Se queda fija siempre) */}
      {/*<aside className="sidebar-panel">
         <div>
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl flex items-center gap-1.5 font-bold tracking-wider text-sm text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]"></span>
              FRG
            </div>
          </div>

          <div className="sidebar-title-btn">
            <span>Centros de Negocio</span>
            <button className="text-[#00E5FF] text-lg font-bold">+</button>
          </div>

          <nav className="sidebar-menu-list">

            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`sidebar-menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              Xolos (Tarjetas)
            </button>
            <button
              onClick={() => navigate('/admin/historial')}
              className={`sidebar-menu-item ${location.pathname === '/admin/historial' ? 'active' : ''}`}
            >
              Historial General
            </button>
          </nav>
        </div>

        <button className="w-full text-left text-xs font-semibold text-slate-400 hover:text-white px-4">
          Editar
        </button> 
      </aside>*/}

      {/* 📊 PANEL OPERATIVO DINÁMICO */}
      <main className="main-content-panel">
        {/* Barra superior común */}
        {/* <div className="flex justify-between items-center w-full">
          <div className="top-bar-user">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Usuario: {user?.nombreCompleto || 'Christhian Hernández Lira'}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="bg-[#155A6F] border border-[#1e6f8a] p-2 rounded-xl text-slate-300 hover:text-[#00E5FF] transition-all flex items-center gap-1 text-xs font-bold"
            >
              🏠 <span className="pr-1 uppercase text-[10px] tracking-wider">Inicio</span>
            </button>
            <button onClick={handleLogout} className="bg-red-950/40 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-500 hover:text-white transition-all">
              Salir
            </button>
          </div>
        </div> */}

        {/* ⚡ AQUÍ SE RENDERIZAN LOS HIJOS (AdminDashboard o AdminHistorial) SIN PARPADEOS */}
        <Outlet context={{ centroActivo, setCentroActivo }}/>
      </main>
      <ModalAgregarCentroNegocios
        isOpen={showModalAgregaCentroNegocio}
        onCancel={()=> setShowModalAgregaCentroNegocio(false)}
        onConfirm={()=> setShowModalAgregaCentroNegocio(false)}
      />
    </div>
  );
};