import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto

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
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // 👈 Controla la transición de opacidad
  const navigate = useNavigate(); // 🔄 Instancia del navegador
  const { login } = useAuth();    // 🔄 Instancia del contexto global

  const handleToggle = () => setShowPassword((prev) => !prev);

  const isButtonDisabled = email.trim() === '' || password.trim() === '' || isLoading;

    // ⏱️ EFECTO PARA EL POPUP DE 4 SEGUNDOS CON TRANSICIÓN SUAVE
  useEffect(() => {
    if (serverError) {
      // 1. Aparece suavemente al cambiar a true
      setIsVisible(true);

      // 2. Después de 3.5 segundos, iniciamos el desvanecimiento de 0.5s para cumplir los 4s totales
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      // 3. Borramos el texto del estado de error una vez terminada la animación (a los 4s)
      const clearTimer = setTimeout(() => {
        setServerError(null);
      }, 5000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [serverError]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setIsLoading(true);

    // validacion Zod para mostrar en cada input el error deacuerdo a su causa
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
      // console.log(response.data)
      
      if (response.data.status !== 200) {
        setServerError(response.data.error.message || 'Error de autenticación.');
        setIsLoading(false);

        return;
      }

      // const { user, redirectTo } = response.data;
      const { idUsuario, idPerfil, nombreCompleto, Usuario } = response.data.user;
      const { redirectTo } = response.data

      // 🗺️ DICCIONARIO DE TRADUCCIÓN: Convierte el número ID de SQL Server a Rol de Frontend
      const mapaRoles: Record<string | number, 'superAdmin' | 'admin' | 'clienteApp' | 'capturista'> = {
        1: 'superAdmin',
        2: 'admin',
        3: 'clienteApp',
        4: 'capturista'
      };

      // Extraemos el rol. Si la BD manda algo raro por error, cae en 'clienteApp' por seguridad (Fallback)
      const userRole = mapaRoles[idPerfil] || 'capturista';
      
      // console.log({redirectTo:redirectTo}, idUsuario, idPerfil, nombreCompleto, Usuario)
      // login({ idPerfil: user.idPerfil, Usuario: user.Usuario, idUsuario: user.idUsuario, nombreCompleto:user.nombreCompleto });
            // Guardamos la sesión en el contexto global
      login({
        idUsuario,
        Usuario,
        role: userRole,
        nombreCompleto,
      });
       setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 0);
      // navigate(redirectTo);
      // alert(`Redirigiendo a: ${redirectTo}`);
      
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
            <svg width="229" height="56" viewBox="0 0 229 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              
              <path d="M43.3407 0H8.13624C3.64128 0 0 3.59502 0 8.03288V42.7902C0 47.228 3.64128 50.823 8.13624 50.823H43.3407C47.8357 50.823 51.477 47.228 51.477 42.7902V8.03288C51.477 3.59502 47.8357 0 43.3407 0ZM23.138 45.0431L9.00962 34.2872L18.6234 26.9675L23.138 30.4069V45.0464V45.0431ZM23.138 20.4193L18.6234 23.8588L9.00962 16.539L23.138 5.78316V20.4226V20.4193ZM28.3422 45.0431V30.4037L32.8569 26.9643L42.4706 34.284L28.3422 45.0399V45.0431ZM32.8569 23.8588L28.3422 20.4193V5.78316L42.4706 16.539L32.8569 23.8588Z" fill="white"/>
              <path d="M79.241 5.37794C80.0191 5.37794 80.4624 5.76046 80.4624 6.52874V8.00695C80.4624 8.77522 80.0191 9.21285 79.241 9.21285H70.1394V23.2915H77.1297C77.9079 23.2915 78.3512 23.674 78.3512 24.4423V25.9205C78.3512 26.6887 77.9079 27.1264 77.1297 27.1264H70.1394V43.8372C70.1394 44.6055 69.6961 45.0431 68.918 45.0431H66.6984C65.9202 45.0431 65.477 44.6055 65.477 43.8372V6.52874C65.477 5.76046 65.9202 5.37794 66.6984 5.37794H79.241Z" fill="white"/>
              <path d="M85.0657 5.15752C86.6745 5.15752 87.7843 6.2532 87.7843 7.84163C87.7843 9.43005 86.6745 10.4706 85.0657 10.4706C83.4568 10.4706 82.4028 9.37494 82.4028 7.84163C82.4028 6.30831 83.5126 5.15752 85.0657 5.15752ZM87.2327 43.8372C87.2327 44.6055 86.7894 45.0431 86.0113 45.0431H84.1791C83.401 45.0431 82.9577 44.6055 82.9577 43.8372V15.7319C82.9577 14.9636 83.401 14.5811 84.1791 14.5811H86.0113C86.7894 14.5811 87.2327 14.9636 87.2327 15.7319V43.8372Z" fill="white"/>
              <path d="M105.544 43.8923C105.544 44.6055 105.157 45.0431 104.379 45.0431H102.491C101.712 45.0431 101.325 44.6055 101.325 43.8923V20.9931C101.325 18.6915 100.658 17.9265 98.8297 17.9265C97.0008 17.9265 95.9435 18.912 95.9435 21.2136V43.8956C95.9435 44.6087 95.5003 45.0464 94.7221 45.0464H92.89C92.1118 45.0464 91.6686 44.6087 91.6686 43.8956V15.7319C91.6686 14.9636 92.1118 14.5811 92.89 14.5811H94.7221C95.5003 14.5811 95.9435 14.9636 95.9435 15.7319V16.445C97.3324 15.0771 99.2729 14.3088 100.993 14.3088C103.436 14.3088 105.544 15.8421 105.544 19.3496V43.8923Z" fill="white"/>
              <path d="M123.856 25.1554C123.856 25.9237 123.468 26.3062 122.69 26.3062H120.802C120.024 26.3062 119.636 25.9237 119.636 25.1554V20.8829C119.636 18.5262 118.803 17.8163 116.918 17.8163C115.033 17.8163 114.255 18.5294 114.255 20.8829V38.7445C114.255 41.0461 115.089 41.8112 116.918 41.8112C118.747 41.8112 119.636 41.0429 119.636 38.7445V34.472C119.636 33.7037 120.024 33.2661 120.802 33.2661H122.69C123.468 33.2661 123.856 33.7037 123.856 34.472V38.7997C123.856 43.0171 122.303 45.3187 116.918 45.3187C111.533 45.3187 109.98 43.0171 109.98 38.7997V20.831C109.98 16.6136 111.533 14.312 116.918 14.312C122.303 14.312 123.856 16.6136 123.856 20.831V25.1587V25.1554Z" fill="white"/>
              <path d="M137.948 27.9498V20.8829C137.948 18.5262 137.114 17.8163 135.229 17.8163C133.345 17.8163 132.566 18.5294 132.566 20.8829V23.2396C132.566 24.0079 132.123 24.3904 131.345 24.3904H129.513C128.735 24.3904 128.292 24.0079 128.292 23.2396V20.8278C128.292 16.6104 129.845 14.3088 135.229 14.3088C140.614 14.3088 142.111 16.6104 142.167 20.8278V43.8923C142.167 44.6055 141.78 45.0431 141.002 45.0431H139.114C138.335 45.0431 137.948 44.6055 137.948 43.8923V43.1792C136.507 44.5472 134.563 45.3154 132.842 45.3154C130.399 45.3154 128.292 43.7821 128.292 40.2746V34.4655C128.292 30.2481 129.845 27.9465 135.229 27.9465H137.948V27.9498ZM135.229 31.4021C133.397 31.4021 132.566 32.1704 132.566 34.4688V38.5792C132.566 40.9359 133.177 41.6459 135.009 41.6459C136.841 41.6459 137.951 40.7155 137.951 38.4139V31.4021H135.233H135.229Z" fill="white"/>
              <path d="M153.432 45.3154C148.051 45.3154 146.495 43.0138 146.495 38.7964V35.2889C146.495 34.5206 146.882 34.083 147.66 34.083H149.548C150.326 34.083 150.714 34.5206 150.714 35.2889V38.7413C150.714 41.0429 151.548 41.8079 153.432 41.8079C155.317 41.8079 156.095 41.0397 156.095 38.7413C156.095 35.344 155.652 35.0717 153.652 33.0976L149.437 29.0422C147.44 27.1231 146.495 25.4796 146.495 20.8246C146.495 16.6071 148.048 14.3055 153.432 14.3055C158.817 14.3055 160.37 16.6071 160.37 20.8246V24.3321C160.37 25.1003 159.927 25.4828 159.149 25.4828H157.317C156.539 25.4828 156.095 25.1003 156.095 24.3321V20.8797C156.095 18.523 155.261 17.813 153.432 17.813C151.604 17.813 150.714 18.5262 150.714 20.8797C150.714 24.2769 151.157 24.4974 153.157 26.5234L157.373 30.5788C159.369 32.4978 160.37 34.1414 160.37 38.7964C160.37 43.0138 158.761 45.3154 153.432 45.3154Z" fill="white"/>
              <path d="M178.514 43.8923C178.514 44.6055 178.127 45.0431 177.349 45.0431H175.461C174.682 45.0431 174.295 44.6055 174.295 43.8923V20.9931C174.295 18.6915 173.629 17.9265 171.8 17.9265C169.971 17.9265 168.914 18.912 168.914 21.2135V43.8956C168.914 44.6087 168.47 45.0464 167.692 45.0464H165.86C165.082 45.0464 164.639 44.6087 164.639 43.8956V2.36318C164.639 1.59491 165.082 1.21239 165.86 1.21239H167.692C168.47 1.21239 168.914 1.59491 168.914 2.36318V16.4418C170.302 15.0738 172.243 14.3055 173.963 14.3055C176.406 14.3055 178.514 15.8388 178.514 19.3463V43.8891V43.8923Z" fill="white"/>
              <path d="M205.205 26.9643L211.588 43.5098C211.864 44.1679 211.588 44.988 210.645 45.0431H208.147C207.48 45.0431 207.093 44.7708 206.925 44.2197L200.49 27.5089H198.326V43.834C198.326 44.6023 197.883 45.0399 197.105 45.0399H194.885C194.107 45.0399 193.664 44.6023 193.664 43.834V6.52874C193.664 5.76046 194.107 5.37794 194.885 5.37794H201.101C208.37 5.37794 210.311 8.49968 210.311 14.1434V18.7466C210.311 23.1294 209.257 25.9788 205.205 26.9643ZM201.097 23.6772C204.87 23.6772 205.704 21.8684 205.704 18.7466V14.1434C205.704 11.0768 204.87 9.21285 201.097 9.21285H198.323V23.6772H201.097Z" fill="white"/>
              <path d="M228.622 48.9331C228.622 53.4812 226.957 56 221.129 56H218.411C217.633 56 217.189 55.6175 217.189 54.8492V53.6984C217.189 52.9301 217.633 52.4925 218.411 52.4925H221.129C223.736 52.4925 224.403 51.1764 224.403 48.878V43.1792C222.961 44.5472 221.018 45.3154 219.297 45.3154C216.854 45.3154 214.746 43.7821 214.746 40.2746V19.3496C214.746 15.8421 216.854 14.3088 219.297 14.3088C221.018 14.3088 222.958 15.0771 224.403 16.445V15.7319C224.403 14.9636 224.79 14.5811 225.569 14.5811H227.456C228.235 14.5811 228.622 14.9636 228.622 15.7319V48.9331ZM219.021 38.5792C219.021 40.9359 219.632 41.6459 221.464 41.6459C223.296 41.6459 224.406 40.7155 224.406 38.4139V21.2103C224.406 18.9087 223.352 17.9232 221.464 17.9232C219.576 17.9232 219.021 18.6915 219.021 20.9899V38.576V38.5792Z" fill="white"/>
             
              <defs>
              <clipPath id="clip0_192_515">
              <rect width="229" height="56" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </div>
        </div>

        {/* POPUP FLOTANTE SUPERIOR CON TRANSICIÓN SUAVE */}
        {serverError && (

        <div 
          className={`content-message-error transition-all duration-500 ease-in-out ${
          // className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isVisible ? 'max-h-24 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="login-error-alert ">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
              <svg xmlns="http://w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="font-medium">{serverError || ''}</span>
          </div>
        </div>
          
        // ================================================================================================================================================
        // alerta estilo POPUP en la parte superior de la pantralla
        // <div 
        //   className={`login-error-alert ${isVisible ? 'opacity-100 translate-y-0 scale-100' : '-translate-y-4 scale-95 pointer-events-none'}`}
        // >
        //   <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
        //     <svg xmlns="http://w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        //       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        //     </svg>
        //   </div>
        //   <span className="font-medium">{serverError}</span>
        // </div>
        // ================================================================================================================================================
        
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            {/* <label className="form-label">Correo Electrónico</label> */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'form-input-error' : ''} placeholder-gray-400`}
              placeholder="Email"
            />
            {errors.email && <p className="form-error-text">{errors.email}</p>}
          </div>

          <div>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`placeholder-gray-400 w-full bg-white rounded-full px-4 py-3 pr-12 focus:outline-none transition-colors text-sm ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={handleToggle}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
    
                <img src={showPassword ? '/img/1.png':'/img/2.png'} alt="" />
                
              </button>

            </div>
            {errors.password && <p className="form-error-text">{errors.password}</p>}
            <div className="form-label-box">
              {/* <label className="form-label">Contraseña</label> */}
              <a href="#forgot" className="olvidaste-Contrasena">Olvidé mi contraseña</a>
            </div>
          </div>

          <button type="submit" disabled={isButtonDisabled} className={  "btn-submit-secure"}>
            {isLoading ? <span className="spinner" /> : 'INICIAR SESIÓN'}
          </button>
        </form>
        
      </div>
    </div>
  );
};
