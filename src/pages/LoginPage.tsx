import React, { useState } from 'react';
import { z } from 'zod';
import { api } from '../services/api';

const loginSchema = z.object({
  email: z.email('Introduce un correo electrónico válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setIsLoading(true);

    const validation = loginSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.status === 'fail') {
        setServerError(response.data.error.message || 'Error de autenticación.');
        setIsLoading(false);
        return;
      }

      const { redirectTo } = response.data.data;
      alert(`Redirigiendo a: ${redirectTo}`);
      
    } catch (error) {
      setServerError('No se pudo establecer conexión con el servidor de seguridad.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        {/* Encabezado */}
        <div className="login-header">
          <div className="login-icon-box">
            <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="login-title">Fincash Security</h2>
          <p className="login-subtitle">Introduce tus credenciales para acceder a la plataforma</p>
        </div>

        {/* Alerta de Error */}
        {serverError && (
          <div className="login-error-alert">
            <svg xmlns="http://w3.org" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="nombre@empresa.com"
            />
            {errors.email && <p className="form-error-text">{errors.email}</p>}
          </div>

          <div>
            <div className="form-label-box">
              <label className="form-label">Contraseña</label>
              <a href="#forgot" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">¿La olvidaste?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="btn-submit-secure">
            {isLoading ? <span className="spinner" /> : 'Ingresar de forma segura'}
          </button>
        </form>
        
      </div>
    </div>
  );
};




// import React, { useState } from 'react';
// import { z } from 'zod';
// import { api } from '../services/api';

// // 🛡️ Esquema Zod idéntico al Backend para validar antes de consumir la red
// const loginSchema = z.object({
//   email: z.email('Introduce un correo electrónico válido.'),
//   password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
// });

// export const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setServerError(null);
//     setIsLoading(true);

//     // 1. Validar los datos localmente con Zod
//     const validation = loginSchema.safeParse({ email, password });
    
//     if (!validation.success) {
//       const fieldErrors: any = {};
//       validation.error.issues.forEach((err) => {
//         if (err.path[0]) fieldErrors[err.path[0]] = err.message;
//       });
//       setErrors(fieldErrors);
//       setIsLoading(false);
//       return;
//     }

//     // 2. Si pasa Zod, enviamos la petición a través de nuestro Axios protegido
//     try {
//       const response = await api.post('/auth/login', { email, password });
      
//       // Como nuestro Backend siempre responde HTTP 200, evaluamos la propiedad 'status' personalizada
//       if (response.data.status === 'fail') {
//         setServerError(response.data.error.message || 'Error de autenticación.');
//         setIsLoading(false);
//         return;
//       }

//       // 🚀 INICIO DE SESIÓN EXITOSO
//       const { user, redirectTo, dashboardData, profileData } = response.data.data;
//       console.log('Usuario autenticado:', user);
      
//       // Aquí guardarías los datos en un contexto global (AuthContext) y redirigirías
//       alert(`${response.data.data.user.role === 'admin' ? 'Bienvenido Administrador' : 'Bienvenido Cliente'}. Redirigiendo a: ${redirectTo}`);
      
//     } catch (error) {
//       // Manejo de errores por si el servidor físico está apagado
//       setServerError('No se pudo establecer conexión con el servidor de seguridad.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
//         {/* Encabezado */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 mb-3 border border-blue-500/20">
//             {/* Icono de Candado / Escudo Minimalista */}
//             <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-white tracking-tight">Fincash Security</h2>
//           <p className="text-sm text-slate-400 mt-1">Introduce tus credenciales para acceder a la plataforma</p>
//         </div>

//         {/* Alerta de Error del Servidor Enmascarada */}
//         {serverError && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-3">
//             <svg xmlns="http://w3.org" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//             <span>{serverError}</span>
//           </div>
//         )}

//         {/* Formulario */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo Electrónico</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors text-sm`}
//               placeholder="nombre@empresa.com"
//             />
//             {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Contraseña</label>
//               <a href="#forgot" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">¿La olvidaste?</a>
//             </div>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-800'} focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors text-sm`}
//               placeholder="••••••••"
//             />
//             {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none text-sm mt-2 flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             ) : (
//               'Ingresar de forma segura'
//             )}
//           </button>
//         </form>
        
//       </div>
//     </div>
//   );
// };