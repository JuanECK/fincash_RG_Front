import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutSession } from '../services/api';

export const UserHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

// =============================================================================================
// INICIAMOS EL CIERRE DE SESION SEGURA
// =============================================================================================
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    await logoutSession();
    logout();
    
    navigate('/', { replace: true });
  };

  return (
    <div className="login-page-container flex-col gap-6">
      <div className="login-card text-center">
        <h1 className="login-title mb-2">👤 Mi Banca Fincash (Rol 2)</h1>
        <p className="text-sm text-white mb-6">Bienvenido: {user?.nombreCompleto}</p>
        
        <button 
        type="button"
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="btn-submit-secure"
        >
          {isLoggingOut ? <span className="spinner" /> : 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  );
};