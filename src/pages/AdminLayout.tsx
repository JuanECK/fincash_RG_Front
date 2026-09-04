import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutSession } from '../services/api';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Sabe en qué URL estamos para pintar el botón activo

  const handleLogout = async () => {
    await logoutSession();
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      
      {/* 📁 BARRA LATERAL IZQUIERDA (Inmutable - Se queda fija siempre) */}
      <aside className="sidebar-panel">
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
            {/* El botón cambia su estilo dinámicamente según la sub-ruta activa sin refrescar */}
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
      </aside>

      {/* 📊 PANEL OPERATIVO DINÁMICO */}
      <main className="main-content-panel">
        {/* Barra superior común */}
        <div className="flex justify-between items-center w-full">
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
        </div>

        {/* ⚡ AQUÍ SE RENDERIZAN LOS HIJOS (AdminDashboard o AdminHistorial) SIN PARPADEOS */}
        <Outlet />
      </main>

    </div>
  );
};