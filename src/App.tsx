// import  React  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './pages/AdminLayout';        // 🔄 Sub-página 1
import { AdminDashboard } from './pages/AdminDashboard';  // 🔄 Sub-página 1
import { AdminHistorial } from './pages/AdminHistorial';  // 🔄 Sub-página 2
import { UserHome } from './pages/UserDashboard';

// =============================================================================================
// PREVENIMOS QUE EL USUARIO SE SALGA AL LOGIN PULSANDO LA FLECHA DE RETROCESO DE CHROME
// =============================================================================================
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // 🛡️ Si el usuario ya está autenticado en React y entra al Login, lo regresamos a su Dashboard
  if (user) {
    const mapaRutas = {
      1: '/admin/dashboard',
      2: '/user/home'
    };
    return <Navigate to={mapaRutas[user.role]} replace />;
  }

  return <>{children}</>;
};

// =============================================================================================
// ENRUTADOR NORMAL
// =============================================================================================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={
            // PublicRoute reviene el retroceso al login vacio
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
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
            <Route path="/user/home" element={<ProtectedRoute allowedRoles={[2]}><UserHome /></ProtectedRoute>} />
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
    </AuthProvider>
  );
}

export default App;
