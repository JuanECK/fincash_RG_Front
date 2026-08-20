// import  React  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserHome } from './pages/UserDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LoginPage />} />

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
          
          {/* 🔒 Rutas Protegidas para Clientes Regulares */}
          {/* <Route 
            path="/user/home" 
            element={
              <ProtectedRoute allowedRoles={['clienteApp']}>
                <UserHome />
              </ProtectedRoute>
            } 
          /> */}

          {/* Redirección por defecto si escriben cualquier otra cosa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
