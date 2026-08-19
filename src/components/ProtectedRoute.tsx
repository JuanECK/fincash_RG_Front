import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    console.log('--- Comprobación del Guardián de Seguridad ---');
    console.log('Roles permitidos en esta pantalla:', allowedRoles);
    console.log('Usuario actual en el estado global:', user);
    console.log('Rol detectado del usuario:', user?.role);
    
    // 1. Si ni siquiera ha iniciado sesión, al login
    if (!user) {
        console.warn('⛔ Expulsado: No existe sesión en el estado global.');
        return <Navigate to="/" replace />;
    }
    
    // 2. Si inició sesión pero su rol no está autorizado para esta pantalla, al login
    if (!allowedRoles.includes(user.role)) {
        console.warn(`⛔ Expulsado: El rol [${user.role}] no tiene permiso para esta pantalla.`);
    return <Navigate to="/" replace />;
  }

  // Si pasa los filtros, renderiza la pantalla solicitada
  console.log('✅ Acceso Concedido.');
  return <>{children}</>;
};