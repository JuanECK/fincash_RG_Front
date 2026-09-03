import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  textCancel?: string;
  textConfirm?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

interface ModalAvisoProps {
    isOpen:boolean;
    title?:string;
    description?:string;
    textConfirm?:string;
    onConfirm:() => void;
}
interface ModalContrasenaProps {
  isOpen:boolean;
  title?:string;
  tarjetahabiente?:string;
  cta?:string;
  noCliente?:string;
  noOperacion?:string;
  textConfirm?:string;
  textCancel?:string;
  onConfirm:() => void;
  onCancel:() => void;
  icono?:React.ReactNode;
}
interface ModalTarjetahabienteProps {
  isOpen:boolean;
  title?:string;
  centroNegocio?:string;
  textConfirm?:string;
  textCancel?:string;
  onConfirm:() => void;
  onCancel:() => void;
  icono?:React.ReactNode;
}

 export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  title, 
  description,
  textCancel,
  textConfirm,
  onCancel, 
  onConfirm 
}) => {
  // Si el modal no está activo, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
        
        {/* Título Dinámico */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          {title}
        </h2>
        
        {/* Descripción Dinámica */}
        <p className="text-sm text-cyan-100/80 leading-relaxed mb-8 max-w-xs mx-auto">
          {description}
        </p>
        
        {/* Acciones del Modal */}
        <div className="flex flex-col gap-3">
          {/* Botón Cancelar */}
          <button   type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-xl bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {textCancel}
          </button>
          
          {/* Botón Confirmar */}
          <button   type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {textConfirm}
          </button>
        </div>

      </div>
    </div>
  );
};

export const ModalAviso: React.FC<ModalAvisoProps> = ({
    isOpen,
    title,
    description,
    textConfirm,
    onConfirm
}) => {
    if(!isOpen) return null;
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            {/* Contenedor del Modal */}
            <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
                
                {/* Título Dinámico */}
                <h2 className="text-2xl font-semibold text-white mb-4">
                {title}
                </h2>
                
                {/* Descripción Dinámica */}
                <p className="text-sm text-cyan-100/80 leading-relaxed mb-8 max-w-xs mx-auto">
                {description}
                </p>
                
                {/* Acciones del Modal */}
                <div className="flex flex-col gap-3">
                {/* Botón Confirmar */}
                <button   type="button"
                    onClick={onConfirm}
                    className="w-full py-3 px-4 rounded-xl bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                    {textConfirm}
                </button>
                </div>

            </div>
        </div>
    )
  }
  export const ModalContraseña: React.FC<ModalContrasenaProps> = ({
    isOpen,
    title,
    tarjetahabiente,
    cta,
    noCliente,
    textConfirm,
    textCancel,
    onConfirm,
    onCancel,
    icono,
  }) => {
    if(!isOpen) return null;
    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
        <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
            <div className="flex items-center justify-between">
              {/* Renderizado condicional del icono dinámico */}
              <div className="flex">
              {icono && (
                <div className="flex items-center justify-center mb-4">
                  {icono}
                </div>
              )}
              {/* Título Dinámico */}
              <h2 className="text-2xl font-semibold text-(--VerdeNeon) mb-4 ml-4">
                {title}
              </h2>
              </div>
                <button type="button" onClick={onCancel} className="mb-4 cursor-pointer">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z" fill="white"/>
                  </svg>
                </button>
            </div>
            <div className="flex flex-col justify-start ">
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Tarjethabiente: <span className="font-bold ">{tarjetahabiente}</span>
                </p>
                </div>
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Cta: <span className="font-bold ">{cta}</span>
                </p>
                </div>
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  No. Cliente: <span className="font-bold ">{noCliente}</span>
                </p>
                </div>
              
            </div>
            <div className="flex mt-5 ">
              <input type="text" placeholder="*Nueva contraseña" className="input-generico w-full" />
            </div>

            <div className="flex flex-row gap-3 mt-5 justify-end">
              {/* Botón Cancelar */}
              <button   type="button"
                onClick={onConfirm}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {textConfirm}
              </button>
              
              {/* Botón Confirmar */}
              <button   type="button"
                onClick={onCancel}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {textCancel}
              </button>
            </div>

        </div>
      </div>
    )
  }
  export const ModalAbono: React.FC<ModalContrasenaProps> = ({
    isOpen,
    title,
    tarjetahabiente,
    cta,
    noCliente,
    noOperacion,
    textConfirm,
    textCancel,
    onConfirm,
    onCancel,
    icono,
  }) => {
    if(!isOpen) return null;
    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 ">
        <div className="w-full max-w-xl rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
            <div className="flex items-center justify-between">
              {/* Renderizado condicional del icono dinámico */}
              <div className="flex">
              {icono && (
                <div className="flex items-center justify-center mb-4">
                  {icono}
                </div>
              )}
              {/* Título Dinámico */}
              <h2 className="text-2xl font-semibold text-(--VerdeNeon) mb-4 ml-4">
                {title}
              </h2>
              </div>
                <button type="button" onClick={onCancel} className="mb-4 cursor-pointer">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z" fill="white"/>
                  </svg>
                </button>
            </div>
            <div className="flex flex-col justify-start ">
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Tarjethabiente: <span className="font-bold ">{tarjetahabiente}</span>
                </p>
                </div>
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Cta: <span className="font-bold ">{cta}</span>
                </p>
                </div>
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  No. Cliente: <span className="font-bold ">{noCliente}</span>
                </p>
                </div>
                {!noOperacion ? (''):(
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  No. Operación: <span className="font-bold ">{noOperacion}</span>
                </p>
                </div>
                ) }
            </div>
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Monto" className="input-generico w-full min-w-24" />
              <input type="text" placeholder="*Fecha de abono" className="input-generico max-w-40" />
              <div className="py-1 px-5 rounded-full bg-(--blanco)">
                <button className="pt-2 cursor-pointer">
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z" fill="#1B687C"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-row gap-3 mt-5 justify-end">
              {/* Botón Cancelar */}
              <button   type="button"
                onClick={onConfirm}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {textConfirm}
              </button>
              
              {/* Botón Confirmar */}
              <button   type="button"
                onClick={onCancel}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {textCancel}
              </button>
            </div>

        </div>
      </div>
    )
  }
  export const ModalGasto : React.FC<ModalContrasenaProps> = ({
    isOpen,
    title,
    tarjetahabiente,
    cta,
    noCliente,
    noOperacion,
    textConfirm,
    textCancel,
    onConfirm,
    onCancel,
    icono,
  }) => {
    if(!isOpen) return null;
    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 ">
        <div className="w-full max-w-xl rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-md">
            <div className="flex items-center justify-between">
              {/* Renderizado condicional del icono dinámico */}
              <div className="flex">
              {icono && (
                <div className="flex items-center justify-center mb-4">
                  {icono}
                </div>
              )}
              {/* Título Dinámico */}
              <h2 className="text-2xl font-semibold text-(--VerdeNeon) mb-4 ml-4">
                {title}
              </h2>
              </div>
                <button type="button" onClick={onCancel} className="mb-4 cursor-pointer">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z" fill="white"/>
                  </svg>
                </button>
            </div>
            <div className="flex flex-col justify-start ">
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Tarjethabiente: <span className="font-bold ">{tarjetahabiente}</span>
                </p>
                </div>
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Cta: <span className="font-bold ">{cta}</span>
                </p>
                </div>
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  No. Cliente: <span className="font-bold ">{noCliente}</span>
                </p>
                </div>
                {!noCliente ? (''):(
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  No. de operación: <span className="font-bold ">{noCliente}</span>
                </p>
                </div>
                ) }
            </div>
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Monto" className="input-generico w-full min-w-40" />
              <input type="text" placeholder="*Fecha de abono" className="input-generico w-full min-w-40" />
            </div>
            
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Monto" className="input-generico w-full min-w-40" />
              <input type="text" placeholder="*Fecha de abono" className="input-generico w-full min-w-40" />
            </div>
            
              <div className="py-1 px-5 mt-5 rounded-full bg-(--blanco) text-(--DeepBlue) max-w-[49%]">
                <button className="cursor-pointer text-sm">
                  <div className="flex items-center gap-3">
                  Subir comprobante
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z" fill="#1B687C"/>
                  </svg>
                  </div>
                </button>
              </div>

            <div className="flex flex-row gap-3 mt-10 justify-end">
              {/* Botón Cancelar */}
              <button   type="button"
                onClick={onConfirm}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {textConfirm}
              </button>
              
              {/* Botón Confirmar */}
              <button   type="button"
                onClick={onCancel}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {textCancel}
              </button>
            </div>

        </div>
      </div>
    )
  }
  export const ModalTarjetahabiente : React.FC<ModalTarjetahabienteProps> = ({
    isOpen,
    title,
    centroNegocio,
    textConfirm,
    textCancel,  
    onConfirm,
    onCancel,
    icono,
  }) => {
    if(!isOpen) return null;
    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 ">
        <div className="w-full max-w-xl rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-md">
            <div className="flex items-center justify-between">
              {/* Renderizado condicional del icono dinámico */}
              <div className="flex">
              {icono && (
                <div className="flex items-center justify-center mb-4">
                  {icono}
                </div>
              )}
              {/* Título Dinámico */}
              <h2 className="text-2xl font-semibold text-(--VerdeNeon) mb-4 ml-4">
                {title}
              </h2>
              </div>
                <button type="button" onClick={onCancel} className="mb-4 cursor-pointer">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z" fill="white"/>
                  </svg>
                </button>
            </div>
            <div className="flex flex-col justify-start ">
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  Tarjethabiente: <span className="font-bold ">{centroNegocio}</span>
                </p>
                </div>
            </div>
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Monto" className="input-generico w-full min-w-40" />
              <input type="text" placeholder="*Fecha de abono" className="input-generico w-full min-w-40" />
            </div>
            
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Monto" className="input-generico w-full min-w-40" />
              <input type="text" placeholder="*Fecha de abono" className="input-generico w-full min-w-40" />
            </div>
            
              <div className="py-1 px-5 mt-5 rounded-full bg-(--blanco) text-(--DeepBlue) max-w-[49%]">
                <button className="cursor-pointer text-sm">
                  <div className="flex items-center gap-3">
                  Subir comprobante
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z" fill="#1B687C"/>
                  </svg>
                  </div>
                </button>
              </div>

            <div className="flex flex-row gap-3 mt-10 justify-end">
              {/* Botón Cancelar */}
              <button   type="button"
                onClick={onConfirm}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {textConfirm}
              </button>
              
              {/* Botón Confirmar */}
              <button   type="button"
                onClick={onCancel}
                className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {textCancel}
              </button>
            </div>

        </div>
      </div>
    )
  }
  