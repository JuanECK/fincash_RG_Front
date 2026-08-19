import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="login-page-container flex-col gap-6">
      <div className="login-card text-center">
        <h1 className="login-title mb-2">👑 Panel de Administración</h1>
        <p className="login-subtitle mb-6">Datos financieros corporativos y control de riesgos.</p>
        <button onClick={logout} className="btn-submit-secure !bg-red-600 hover:!bg-red-500">Cerrar Sistema</button>
      </div>
    </div>
  );
};