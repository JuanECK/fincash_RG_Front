// import  React  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './pages/AdminLayout';        // 🔄 Sub-página 1
import { AdminDashboard } from './pages/AdminDashboard';  // 🔄 Sub-página 1
import { AdminHistorial } from './pages/AdminHistorial';  // 🔄 Sub-página 2
// import { UserHome } from './pages/UserDashboard';
import { AdminHistorialIndividual } from './pages/AdminHistorialIndividual';

import { vincularSeguridadConAxios } from './services/api'; // 🔄 1. Importamos el vinculador
import { useEffect, useState } from 'react';

// =============================================================================================
// PREVENIMOS QUE EL USUARIO SE SALGA AL LOGIN PULSANDO LA FLECHA DE RETROCESO DE CHROME
// =============================================================================================
// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user } = useAuth();

//   // 🛡️ Si el usuario ya está autenticado en React y entra al Login, lo regresamos a su Dashboard
//   if (user) {
//     const mapaRutas = {
//       1: '/admin/dashboard',
//       2: '/user/home'
//     };
//     return <Navigate to={mapaRutas[user.role]} replace />;
//   }

//   return <>{children}</>;
// };

// 🔌 COMPONENTE CONECTOR DE SEGURIDAD
const InicializadorSeguridadAxios: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();

  // Estados para controlar el modal flotante que solicitas
  const [errorMessageSesion, setErrorMessageSesion] = useState<string | null>(null);


  useEffect(() => {
    // ⚡ Vinculamos la función logout nativa de tu contexto global con el interceptor de Axios
    vincularSeguridadConAxios(
      logout,
      (mensaje) => setErrorMessageSesion(mensaje) // Al invocar esto en Axios, se activa el modal aquí
    );
  }, [logout]);

    // Se ejecuta al dar clic en "Entendido"
  const offSesion = () => {
    setErrorMessageSesion(null); // Apagamos el modal visual
    logout(); // Borramos el estado del AuthContext en la RAM del Front
    window.location.href = '/'; // Redirigimos de forma limpia a la raíz limpiando el historial
  };

  return <>
  {children}
        {/* ========================================================================= */}
      {/* 🪟 INTERFAZ DEL MODAL DE ADVERTENCIA CORPORATIVA SOLICITADO */}
      {/* ========================================================================= */}
      {errorMessageSesion && (

        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessageSesion}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => offSesion()}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
  </>;
};

// =============================================================================================
// ENRUTADOR NORMAL
// =============================================================================================
function App() {
  return (
    <AuthProvider>
       {/* Envolvemos el árbol para asegurar que Axios sepa cómo apagar el sistema ante un 403 */}
      <InicializadorSeguridadAxios>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={
            // PublicRoute reviene el retroceso al login vacio
            // <PublicRoute>
              <LoginPage />
            // </PublicRoute>
            } 
          />

         {/* 🔒 RUTAS ANIDADAS Y PROTEGIDAS PARA EL ROL 1 (ADMINS) */}
         <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AdminLayout /> {/* 🏢 El Layout se queda fijo en pantalla */}
              </ProtectedRoute>
            }
          >
            {/* Sub-rutas inyectadas dentro del <Outlet /> sin refrescar la página */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="historial" element={<AdminHistorial />} />
            <Route path="historialIndividual" element={<AdminHistorialIndividual />} />
            
            {/* Redirección interna por si entran a /admin a secas */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

         {/* ========================================================= */}
          {/* <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
            /> */}
            {/* ========================================================= */}

           {/* 🔒 Ruta del Rol 2 (Clientes) */}
            {/* <Route path="/user/home" element={<ProtectedRoute allowedRoles={[2]}><UserHome /></ProtectedRoute>} /> */}
            {/* ========================================================= */}
          {/* <Route 
            path="/user/home" 
            element={
              <ProtectedRoute allowedRoles={[2]}>
              <UserHome />
              </ProtectedRoute>
            } 
            /> */}
            {/* ========================================================= */}
          
          {/* Redirección por defecto si escriben cualquier otra cosa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </InicializadorSeguridadAxios>
    </AuthProvider>
  );
}

export default App;
