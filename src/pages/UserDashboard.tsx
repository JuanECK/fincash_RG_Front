import React from 'react';
import { useAuth } from '../context/AuthContext';

export const UserHome: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="login-page-container flex-col gap-6">
      <div className="login-card text-center">
        <h1 className="login-title mb-2">👤 Mi Banca Fincash</h1>
        <p className="login-subtitle mb-6">Bienvenido a tu espacio financiero personal.</p>
        <button onClick={logout} className="btn-submit-secure">Cerrar Sesión</button>
      </div>
    </div>
  );
};