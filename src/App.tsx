// import  React  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserHome } from './pages/UserDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

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

          {/* 🔒 Rutas Protegidas Exclusivas para Super Administradores */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[1]}>
              {/* <ProtectedRoute allowedRoles={['superAdmin']}> */}
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 🔒 Rutas Protegidas para Administradores */}
          <Route 
            path="/user/home" 
            element={
              <ProtectedRoute allowedRoles={[2]}>
              {/* <ProtectedRoute allowedRoles={['clienteApp']}> */}
              <UserHome />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirección por defecto si escriben cualquier otra cosa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
