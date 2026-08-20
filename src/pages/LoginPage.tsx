import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto
import fa from 'zod/v4/locales/fa.cjs';

const loginSchema = z.object({
  email: z.email('Verifica tu escritura, correo electrónico no válido'),
  // password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
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

  //Verifica que la estructura del correo sea la correcta con el efecto onBlur
  const verificaEmail = () => {
    const validation = loginSchema.safeParse({ email });
    if (!validation.success) {
      setErrors({email:'Verifica tu escritura, correo electrónico no válido'});
      
      return;
    }
    setErrors({});

  }

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

      
      if (response.data.status !== 200) {
        //muestra una u otra respuesta de error debajo de los input
        switch (response.data.status){
          case 500:
            setServerError(response.data.error.message);
          case 401:
            response.data.error.code === '401-1' ? setErrors({email:response.data.error.message}) : setErrors({password:response.data.error.message})
        }
        setIsLoading(false);
        return;
      }

      const { user, redirectTo } = response.data;

      const perfilNumero = parseInt(user.idPerfil, 10);
      let userRole: 1 | 2 = 2; // Por defecto inicializa en el número 2
       if (perfilNumero === 1 || perfilNumero === 2) {
        userRole = 1; // 1 y 2 mapean al número 1
      } else if (perfilNumero === 3 || perfilNumero === 4) {
        userRole = 2; // 3 y 4 mapean al número 2
      }


      // const { idUsuario, idPerfil, nombreCompleto, Usuario } = response.data.user;
      // const { redirectTo } = response.data

      // 🗺️ DICCIONARIO DE TRADUCCIÓN: Convierte el número ID de SQL Server a Rol de Frontend
      // const mapaRoles: Record<string | number, 'superAdmin' | 'admin' | 'clienteApp' | 'capturista'> = {
      //   1: 'superAdmin',
      //   2: 'admin',
      //   3: 'clienteApp',
      //   4: 'capturista'
      // };

      const mapaRoles: Record< number, 1 | 2 > = {
        1:1,
        2:1,
        3:2,
        4:2
      }

      // Extraemos el rol. Si la BD manda algo raro por error, cae en 'clienteApp' por seguridad (Fallback)
      // const userRole = mapaRoles[idPerfil] || 'capturista';
      // const userRole = mapaRoles[user.idPerfil];
      
      // console.log({redirectTo:redirectTo}, idUsuario, idPerfil, nombreCompleto, Usuario)
      console.log('rold del usuario ',userRole)
      login({ role: userRole, idPerfil:user.idPerfil, Usuario: user.Usuario, idUsuario: user.idUsuario, nombreCompleto:user.nombreCompleto });
            // Guardamos la sesión en el contexto global
      // login({
      //   idUsuario,
      //   Usuario,
      //   role: userRole,
      //   nombreCompleto,
      // });
      console.log(redirectTo)

       setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 0);

      // navigate(redirectTo);
      // alert(`Redirigiendo a: ${redirectTo}`);
      
    } catch (error) {
      setServerError('problema de conexión con el servidor');
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
          <svg width="172" height="74" viewBox="0 0 172 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M68.5921 0H5.82399C2.61059 0 0 2.59599 0 5.79143V68.2039C0 71.404 2.61059 73.9953 5.82399 73.9953H68.5874C71.8055 73.9953 74.4114 71.3993 74.4114 68.2039V5.79143C74.4114 2.59127 71.8008 0 68.5874 0H68.5921ZM33.4488 65.5843L13.0245 49.9233L26.9223 39.2656L33.4488 44.2735V65.589V65.5843ZM33.4488 29.7312L26.9223 34.7391L13.0245 24.0814L33.4488 8.42046V29.7359V29.7312ZM40.972 65.5843V44.2688L47.4985 39.2609L61.3964 49.9186L40.972 65.5795V65.5843ZM47.4985 34.7391L40.972 29.7312V8.42046L61.3964 24.0814L47.4985 34.7391Z" fill="white"/>
            <path d="M111.434 8.12311C112.559 8.12311 113.2 8.68007 113.2 9.7987V11.951C113.2 13.0697 112.559 13.7069 111.434 13.7069H98.2769V34.2058H108.382C109.507 34.2058 110.148 34.7627 110.148 35.8814V38.0337C110.148 39.1523 109.507 39.7895 108.382 39.7895H98.2769V64.1211C98.2769 65.2397 97.6361 65.8769 96.5112 65.8769H93.3025C92.1776 65.8769 91.5368 65.2397 91.5368 64.1211V9.7987C91.5368 8.68007 92.1776 8.12311 93.3025 8.12311H111.434Z" fill="white"/>
            <path d="M133.491 39.5535L142.719 63.6443C143.117 64.6025 142.719 65.7967 141.356 65.8769H137.744C136.781 65.8769 136.221 65.4804 135.979 64.678L126.675 40.3465H123.547V64.1211C123.547 65.2397 122.907 65.8769 121.782 65.8769H118.573C117.448 65.8769 116.807 65.2397 116.807 64.1211V9.7987C116.807 8.68007 117.448 8.12311 118.573 8.12311H127.558C138.067 8.12311 140.872 12.6685 140.872 20.886V27.5883C140.872 33.9698 139.349 38.1186 133.491 39.5535ZM127.558 34.7675C133.012 34.7675 134.218 32.1337 134.218 27.5883V20.886C134.218 16.4208 133.012 13.7069 127.558 13.7069H123.547V34.7675H127.558Z" fill="white"/>
            <path d="M170.234 36.5233C171.359 36.5233 172 37.1605 172 38.2791V54.5536C172 62.1292 169.271 66.2781 159.645 66.2781C150.019 66.2781 147.29 62.1292 147.29 54.5536V19.4511C147.29 11.8755 150.019 7.72662 159.645 7.72662C169.271 7.72662 172 11.8755 172 19.4511V25.5918C172 26.7104 171.359 27.3476 170.234 27.3476H167.026C165.901 27.3476 165.26 26.7104 165.26 25.5918V19.4511C165.26 15.6232 164.216 13.3104 159.645 13.3104C155.074 13.3104 154.03 15.6232 154.03 19.4511V54.5489C154.03 58.3768 155.074 60.6896 159.645 60.6896C164.216 60.6896 165.26 58.3768 165.26 54.5489V42.1023H160.926C159.801 42.1023 159.241 41.5453 159.241 40.4267V38.2744C159.241 37.1558 159.801 36.5186 160.926 36.5186H170.23L170.234 36.5233Z" fill="white"/>
            <defs>
            <clipPath id="clip0_503_118">
            <rect width="172" height="74" fill="white"/>
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
            <div className=" flex items-center justify-center flex-shrink-0">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.48438 9.53613C1.1849 9.53613 0.924479 9.46777 0.703125 9.33105C0.481771 9.19759 0.309245 9.01855 0.185547 8.79395C0.061849 8.56934 0 8.32357 0 8.05664C0 7.79622 0.0667318 7.54883 0.200195 7.31445L3.96484 0.742188C4.10156 0.498047 4.28548 0.314128 4.5166 0.19043C4.74772 0.0634766 4.98861 0 5.23926 0C5.48991 0 5.72917 0.061849 5.95703 0.185547C6.1849 0.309245 6.37044 0.494792 6.51367 0.742188L10.2734 7.30957C10.3418 7.43001 10.3923 7.55371 10.4248 7.68066C10.4574 7.80436 10.4736 7.92969 10.4736 8.05664C10.4736 8.32357 10.4118 8.56934 10.2881 8.79395C10.1676 9.01855 9.99674 9.19759 9.77539 9.33105C9.55404 9.46777 9.29362 9.53613 8.99414 9.53613H1.48438ZM1.7041 8.34473H8.76953C8.89323 8.34473 8.99089 8.30404 9.0625 8.22266C9.13411 8.13802 9.16992 8.04036 9.16992 7.92969C9.16992 7.85482 9.15365 7.7832 9.12109 7.71484L5.57617 1.49414C5.54036 1.42904 5.49154 1.38184 5.42969 1.35254C5.36784 1.32324 5.30436 1.30859 5.23926 1.30859C5.17415 1.30859 5.10905 1.32324 5.04395 1.35254C4.9821 1.37858 4.93327 1.42415 4.89746 1.48926L1.35742 7.70508C1.33789 7.74089 1.32487 7.77995 1.31836 7.82227C1.31185 7.86133 1.30859 7.89714 1.30859 7.92969C1.30859 8.04036 1.3444 8.13802 1.41602 8.22266C1.48763 8.30404 1.58366 8.34473 1.7041 8.34473ZM5.24902 6.00586C4.91048 6.00586 4.73307 5.83822 4.7168 5.50293L4.64355 3.48145C4.63379 3.31217 4.68424 3.17383 4.79492 3.06641C4.90885 2.95573 5.05697 2.90039 5.23926 2.90039C5.4248 2.90039 5.57292 2.95573 5.68359 3.06641C5.79753 3.17383 5.84961 3.3138 5.83984 3.48633L5.76172 5.49805C5.7487 5.83659 5.5778 6.00586 5.24902 6.00586ZM5.24902 7.68066C5.06348 7.68066 4.90723 7.62695 4.78027 7.51953C4.65658 7.41211 4.59473 7.27051 4.59473 7.09473C4.59473 6.91895 4.65658 6.77734 4.78027 6.66992C4.90723 6.5625 5.06348 6.50879 5.24902 6.50879C5.43132 6.50879 5.58431 6.5625 5.70801 6.66992C5.83171 6.77734 5.89355 6.91895 5.89355 7.09473C5.89355 7.27051 5.83171 7.41211 5.70801 7.51953C5.58431 7.62695 5.43132 7.68066 5.24902 7.68066Z" fill="#08242A"/>
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
              type="text"
              value={email}
              onBlur={() => verificaEmail()}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'form-input-error' : ''} placeholder-gray-400`}
              placeholder="Email"
            />
            {/* Error de validacion de correo */}
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
