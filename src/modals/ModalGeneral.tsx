import React , { useEffect, useState } from 'react';

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
                {!noOperacion ? (''):(
                <div className="flex justify-start">
                <p className="text-sm  text-write  font-[200] text-[16px]">
                  No. Operación: <span className="font-bold ">{noOperacion}</span>
                </p>
                </div>
                ) }
            </div>
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Monto" className="input-generico w-full min-w-40" />
              {/* <input type="date" placeholder="*Fecha de la compra" className="input-generico w-full min-w-40" /> */}
              <div className="relative ">
                <input 
                  type="date" 
                  className="input-date custom-date-input w-full w-full min-w-40"
                />
                
                {/* <!-- Icono de calendario con reloj integrado en SVG --> */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-white/80">
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.57617 10.3711C1.06055 10.3711 0.667969 10.2383 0.398438 9.97266C0.132812 9.70703 0 9.31641 0 8.80078V1.57617C0 1.05664 0.132812 0.664062 0.398438 0.398438C0.667969 0.132813 1.06055 0 1.57617 0H9.92578C10.4453 0 10.8379 0.134766 11.1035 0.404297C11.3691 0.673828 11.502 1.06445 11.502 1.57617V5.36133C11.4707 5.35742 11.4375 5.35547 11.4023 5.35547C11.3711 5.35547 11.3418 5.35547 11.3145 5.35547C11.2793 5.35547 11.2441 5.35742 11.209 5.36133C11.1738 5.36133 11.127 5.36133 11.0684 5.36133V3.65625C11.0684 3.28125 10.9688 2.99805 10.7695 2.80664C10.5742 2.61133 10.293 2.51367 9.92578 2.51367H1.57617C1.20117 2.51367 0.916016 2.61133 0.720703 2.80664C0.529297 2.99805 0.433594 3.28125 0.433594 3.65625V8.79492C0.433594 9.17383 0.529297 9.45898 0.720703 9.65039C0.916016 9.8418 1.20117 9.9375 1.57617 9.9375H8.19727C8.2207 10.0156 8.25 10.0898 8.28516 10.1602C8.32031 10.2344 8.35742 10.3047 8.39648 10.3711H1.57617ZM4.55859 4.56445C4.48047 4.56445 4.42969 4.55469 4.40625 4.53516C4.38672 4.51172 4.37695 4.46289 4.37695 4.38867V4.04883C4.37695 3.9707 4.38672 3.92188 4.40625 3.90234C4.42969 3.87891 4.48047 3.86719 4.55859 3.86719H4.9043C4.98242 3.86719 5.03125 3.87891 5.05078 3.90234C5.07422 3.92188 5.08594 3.9707 5.08594 4.04883V4.38867C5.08594 4.46289 5.07422 4.51172 5.05078 4.53516C5.03125 4.55469 4.98242 4.56445 4.9043 4.56445H4.55859ZM6.60352 4.56445C6.52148 4.56445 6.4707 4.55469 6.45117 4.53516C6.43164 4.51172 6.42188 4.46289 6.42188 4.38867V4.04883C6.42188 3.9707 6.43164 3.92188 6.45117 3.90234C6.4707 3.87891 6.52148 3.86719 6.60352 3.86719H6.94336C7.02148 3.86719 7.07031 3.87891 7.08984 3.90234C7.11328 3.92188 7.125 3.9707 7.125 4.04883V4.38867C7.125 4.46289 7.11328 4.51172 7.08984 4.53516C7.07031 4.55469 7.02148 4.56445 6.94336 4.56445H6.60352ZM8.64258 4.56445C8.56055 4.56445 8.50977 4.55469 8.49023 4.53516C8.4707 4.51172 8.46094 4.46289 8.46094 4.38867V4.04883C8.46094 3.9707 8.4707 3.92188 8.49023 3.90234C8.50977 3.87891 8.56055 3.86719 8.64258 3.86719H8.98828C9.0625 3.86719 9.10938 3.87891 9.12891 3.90234C9.15234 3.92188 9.16406 3.9707 9.16406 4.04883V4.38867C9.16406 4.46289 9.15234 4.51172 9.12891 4.53516C9.10938 4.55469 9.0625 4.56445 8.98828 4.56445H8.64258ZM2.51953 6.57422C2.44141 6.57422 2.39062 6.56445 2.36719 6.54492C2.34766 6.52148 2.33789 6.47266 2.33789 6.39844V6.05273C2.33789 5.97852 2.34766 5.93164 2.36719 5.91211C2.39062 5.89258 2.44141 5.88281 2.51953 5.88281H2.86523C2.93945 5.88281 2.98828 5.89258 3.01172 5.91211C3.03516 5.93164 3.04688 5.97852 3.04688 6.05273V6.39844C3.04688 6.47266 3.03516 6.52148 3.01172 6.54492C2.98828 6.56445 2.93945 6.57422 2.86523 6.57422H2.51953ZM4.55859 6.57422C4.48047 6.57422 4.42969 6.56445 4.40625 6.54492C4.38672 6.52148 4.37695 6.47266 4.37695 6.39844V6.05273C4.37695 5.97852 4.38672 5.93164 4.40625 5.91211C4.42969 5.89258 4.48047 5.88281 4.55859 5.88281H4.9043C4.98242 5.88281 5.03125 5.89258 5.05078 5.91211C5.07422 5.93164 5.08594 5.97852 5.08594 6.05273V6.39844C5.08594 6.47266 5.07422 6.52148 5.05078 6.54492C5.03125 6.56445 4.98242 6.57422 4.9043 6.57422H4.55859ZM6.60352 6.57422C6.52148 6.57422 6.4707 6.56445 6.45117 6.54492C6.43164 6.52148 6.42188 6.47266 6.42188 6.39844V6.05273C6.42188 5.97852 6.43164 5.93164 6.45117 5.91211C6.4707 5.89258 6.52148 5.88281 6.60352 5.88281H6.94336C7.02148 5.88281 7.07031 5.89258 7.08984 5.91211C7.11328 5.93164 7.125 5.97852 7.125 6.05273V6.39844C7.125 6.47266 7.11328 6.52148 7.08984 6.54492C7.07031 6.56445 7.02148 6.57422 6.94336 6.57422H6.60352ZM2.51953 8.58398C2.44141 8.58398 2.39062 8.57422 2.36719 8.55469C2.34766 8.53125 2.33789 8.48242 2.33789 8.4082V8.0625C2.33789 7.98828 2.34766 7.94141 2.36719 7.92188C2.39062 7.90234 2.44141 7.89258 2.51953 7.89258H2.86523C2.93945 7.89258 2.98828 7.90234 3.01172 7.92188C3.03516 7.94141 3.04688 7.98828 3.04688 8.0625V8.4082C3.04688 8.48242 3.03516 8.53125 3.01172 8.55469C2.98828 8.57422 2.93945 8.58398 2.86523 8.58398H2.51953ZM4.55859 8.58398C4.48047 8.58398 4.42969 8.57422 4.40625 8.55469C4.38672 8.53125 4.37695 8.48242 4.37695 8.4082V8.0625C4.37695 7.98828 4.38672 7.94141 4.40625 7.92188C4.42969 7.90234 4.48047 7.89258 4.55859 7.89258H4.9043C4.98242 7.89258 5.03125 7.90234 5.05078 7.92188C5.07422 7.94141 5.08594 7.98828 5.08594 8.0625V8.4082C5.08594 8.48242 5.07422 8.53125 5.05078 8.55469C5.03125 8.57422 4.98242 8.58398 4.9043 8.58398H4.55859ZM6.60352 8.58398C6.52148 8.58398 6.4707 8.57422 6.45117 8.55469C6.43164 8.53125 6.42188 8.48242 6.42188 8.4082V8.0625C6.42188 7.98828 6.43164 7.94141 6.45117 7.92188C6.4707 7.90234 6.52148 7.89258 6.60352 7.89258H6.94336C7.02148 7.89258 7.07031 7.90234 7.08984 7.92188C7.11328 7.94141 7.125 7.98828 7.125 8.0625V8.4082C7.125 8.48242 7.11328 8.53125 7.08984 8.55469C7.07031 8.57422 7.02148 8.58398 6.94336 8.58398H6.60352ZM11.3027 11.5254C10.916 11.5254 10.5508 11.4512 10.207 11.3027C9.86719 11.1543 9.56641 10.9492 9.30469 10.6875C9.04688 10.4297 8.84375 10.1289 8.69531 9.78516C8.54688 9.44531 8.47266 9.08203 8.47266 8.69531C8.47266 8.30859 8.54688 7.94531 8.69531 7.60547C8.84375 7.26562 9.04688 6.96484 9.30469 6.70312C9.56641 6.44141 9.86719 6.23633 10.207 6.08789C10.5508 5.93945 10.916 5.86523 11.3027 5.86523C11.6934 5.86523 12.0586 5.93945 12.3984 6.08789C12.7383 6.23633 13.0371 6.44141 13.2949 6.70312C13.5566 6.96094 13.7598 7.25977 13.9043 7.59961C14.0527 7.93945 14.127 8.30469 14.127 8.69531C14.127 9.08203 14.0527 9.44531 13.9043 9.78516C13.7598 10.1289 13.5566 10.4297 13.2949 10.6875C13.0332 10.9492 12.7305 11.1543 12.3867 11.3027C12.0469 11.4512 11.6855 11.5254 11.3027 11.5254ZM9.84375 9.10547H11.3086C11.3789 9.10547 11.4395 9.08008 11.4902 9.0293C11.541 8.97461 11.5664 8.91211 11.5664 8.8418V6.86133C11.5664 6.79492 11.541 6.73828 11.4902 6.69141C11.4434 6.64062 11.3828 6.61523 11.3086 6.61523C11.2383 6.61523 11.1797 6.64062 11.1328 6.69141C11.0859 6.73828 11.0625 6.79492 11.0625 6.86133V8.5957H9.84375C9.77344 8.5957 9.71289 8.62109 9.66211 8.67188C9.61523 8.71875 9.5918 8.77539 9.5918 8.8418C9.5918 8.91992 9.61523 8.98438 9.66211 9.03516C9.71289 9.08203 9.77344 9.10547 9.84375 9.10547Z" fill="#D9D9D9"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex mt-5 gap-3">
              <input type="text" placeholder="*Concepto" className="input-generico w-full min-w-40" />
              <input type="text" placeholder="*Establecimiento" className="input-generico w-full min-w-40" />
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

  interface ModalAgregarProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (data: any) => void;
  centroNegocio?: string;
}

export const ModalAgregarTarjetahabiente: React.FC<ModalAgregarProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  centroNegocio
}) => {
  // Lógica de exclusión mutua: 'titular' o 'adicional'
  const [tipoUsuario, setTipoUsuario] = useState<'titular' | 'adicional'>('titular');

  // Estados del Formulario (Titular)
  const [titularForm, setTitularForm] = useState({
    nombre: '', primerApellido: '', segundoApellido: '',
    telefono: '', correo: '', contrasena: '',
    noTarjeta: '', saldo: ''
  });

  // Estados del Formulario (Tarjeta Adicional)
  const [adicionalForm, setAdicionalForm] = useState({
    noCliente: '', noTarjeta: '', saldo: '', fechaVencimiento: ''
  });

  useEffect(()=>{

    if( tipoUsuario === 'titular' ){
      setAdicionalForm({
        noCliente: '', noTarjeta: '', saldo: '', fechaVencimiento: ''
      })
    } else{
      setTitularForm({
        nombre: '', primerApellido: '', segundoApellido: '',
        telefono: '', correo: '', contrasena: '',
        noTarjeta: '', saldo: ''
      })
    }

  },[tipoUsuario])

  if (!isOpen) return null;


  // Manejadores de cambios
  const handleTitularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitularForm({ ...titularForm, [e.target.name]: e.target.value });
  };

  const handleAdicionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdicionalForm({ ...adicionalForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataFinal = tipoUsuario === 'titular' ? { tipo: 'titular', ...titularForm } : { tipo: 'adicional', ...adicionalForm };
    onConfirm(dataFinal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-4xl my-auto rounded-2xl bg-[#0d5c75] p-11 shadow-2xl border border-[#146f8c] text-white relative">
        
        {/* Botón Cerrar (X) */}
        <button onClick={onCancel} className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-1">
          <div className="text-emerald-400">
            <svg width="33" height="21" viewBox="0 0 33 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 19.2017V0.964355C0 0.671387 0.0895182 0.439453 0.268555 0.268555C0.447591 0.0895182 0.683594 0 0.976562 0H31.2622C31.5552 0 31.7871 0.0895182 31.958 0.268555C32.137 0.439453 32.2266 0.671387 32.2266 0.964355V19.2017C32.2266 19.4946 32.137 19.7306 31.958 19.9097C31.7871 20.0887 31.5552 20.1782 31.2622 20.1782H0.976562C0.683594 20.1782 0.447591 20.0887 0.268555 19.9097C0.0895182 19.7306 0 19.4946 0 19.2017ZM2.23389 17.1997C2.23389 17.6961 2.47803 17.9443 2.96631 17.9443H29.2603C29.7485 17.9443 29.9927 17.6961 29.9927 17.1997V2.97852C29.9927 2.4821 29.7485 2.23389 29.2603 2.23389H2.96631C2.47803 2.23389 2.23389 2.4821 2.23389 2.97852V17.1997ZM3.50342 16.3818V3.79639C3.50342 3.60107 3.60107 3.50342 3.79639 3.50342H13.3179C12.6831 4.15446 12.1867 5.04557 11.8286 6.17676C11.4705 7.2998 11.2915 8.59782 11.2915 10.0708C11.2915 11.5438 11.4705 12.8499 11.8286 13.9893C12.1948 15.1204 12.6994 16.0156 13.3423 16.6748H3.79639C3.60107 16.6748 3.50342 16.5771 3.50342 16.3818ZM12.7563 10.0708C12.7563 8.80127 12.8906 7.69043 13.1592 6.73828C13.4359 5.78613 13.8224 5.04557 14.3188 4.5166C14.8234 3.98763 15.4053 3.72314 16.0645 3.72314C16.748 3.72314 17.3462 3.98763 17.8589 4.5166C18.3797 5.04557 18.7826 5.78613 19.0674 6.73828C19.3522 7.69043 19.4946 8.80127 19.4946 10.0708C19.4946 11.3403 19.3522 12.4512 19.0674 13.4033C18.7826 14.3555 18.3797 15.1001 17.8589 15.6372C17.3462 16.1662 16.748 16.4307 16.0645 16.4307C15.4053 16.4307 14.8234 16.1662 14.3188 15.6372C13.8224 15.1001 13.4359 14.3555 13.1592 13.4033C12.8906 12.4512 12.7563 11.3403 12.7563 10.0708ZM18.8599 16.6748C19.5109 16.0156 20.0195 15.1204 20.3857 13.9893C20.7601 12.8499 20.9473 11.5438 20.9473 10.0708C20.9473 8.59782 20.7642 7.2998 20.3979 6.17676C20.0317 5.04557 19.5231 4.15446 18.8721 3.50342H28.4302C28.6255 3.50342 28.7231 3.60107 28.7231 3.79639V16.3818C28.7231 16.5771 28.6255 16.6748 28.4302 16.6748H18.8599Z" fill="#02FFA2"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-(--VerdeNeon)">Agregar tarjetahabiente</h2>
        </div>
        <p className="text-[16px] text-cyan-100/70 mb-6 font-light">Centro de negocio: <span className="text-white font-bold">{centroNegocio}</span></p>

        <form onSubmit={handleSubmit} className="space-y-6" >
          
          {/* ================= SECCIÓN TITULAR ================= */}
          <div className={`space-y-4 transition-opacity duration-300 ${tipoUsuario !== 'titular' ? 'opacity-40' : 'opacity-100'}`}>
            <label className="flex items-center w-[50px] gap-2 font-semibold text-lg cursor-pointer select-none">
               {/* Opción: Titular */}
              <input
                type="radio"
                name="role"
                value="titular"
                checked={tipoUsuario === 'titular'}
                onChange={() => setTipoUsuario('titular')}
                className="peer sr-only"
              />
              
              {/* El fondo del botón cambia usando el estado de React */}
              <div className={`flex items-center gap-2 text-white px-4 py-2 rounded-md font-semibold tracking-wide transition-colors`}>
                
                {/* Recuadro del check */}
                <div className="w-5 h-5 flex items-center justify-center border-2 border-[#81c5d4] rounded-md bg-transparent">
                  {/* Si está seleccionado, renderizamos el check de forma segura */}
                  {tipoUsuario === 'titular' && (
                    <svg 
                      className="w-3 h-3 text-[#81c5d4]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                <span className="text-base font-bold">Titular</span>
              </div>
              
            </label> 

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="nombre" placeholder="*Nombre (s)" value={titularForm.nombre} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} className="input-style" />
              <input type="text" name="primerApellido" placeholder="*Primer apellido" value={titularForm.primerApellido} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} className="input-style" />
              <input type="text" name="segundoApellido" placeholder="Segundo apellido" value={titularForm.segundoApellido} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} className="input-style" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="tel" name="telefono" placeholder="*Teléfono" value={titularForm.telefono} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} className="input-style" />
              <input type="email" name="correo" placeholder="*Correo" value={titularForm.correo} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} className="input-style" />
              <input type="password" name="contrasena" placeholder="*Contraseña" value={titularForm.contrasena} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} className="input-style" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input type="text" name="noTarjeta" placeholder="*No. de Tarjeta (16 dígitos)" value={titularForm.noTarjeta} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} maxLength={16} className="input-style" />
              </div>
              <input type="number" name="saldo" placeholder="*Saldo" value={titularForm.saldo} onChange={handleTitularChange} disabled={tipoUsuario !== 'titular'} required={tipoUsuario === 'titular'} className="input-style" />
            </div>
          </div>

          <hr className="border-cyan-800/60 my-6" />

          {/* ================= SECCIÓN TARJETA ADICIONAL ================= */}
          <div className={`space-y-4 transition-opacity duration-300 ${tipoUsuario !== 'adicional' ? 'opacity-40' : 'opacity-100'}`}>
            <label className="flex items-center w-[200px] gap-2 font-semibold text-lg cursor-pointer select-none">
                <input
                  type="radio"
                  name="role"
                  value="adicional"
                  checked={tipoUsuario === 'adicional'}
                  onChange={() => setTipoUsuario('adicional')}
                  className="peer sr-only"
                />
                <div className={`flex items-center gap-2 text-white px-4 py-2 rounded-md font-semibold tracking-wide transition-colors`}>
                  <div className="w-5 h-5 flex items-center justify-center border-2 border-[#81c5d4] rounded-md bg-transparent">
                    {tipoUsuario === 'adicional' && (
                      <svg 
                        className="w-3 h-3 text-[#81c5d4]" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth="3.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-bold">Tarjeta adicional</span>
                </div>
            </label>

            <div className="relative max-w-xs">
              <input type="text" name="noCliente" placeholder="No. de Cliente" value={adicionalForm.noCliente} onChange={handleAdicionalChange} disabled={tipoUsuario !== 'adicional'} required={tipoUsuario === 'adicional'} className="input-style pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200/50">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="noTarjeta" placeholder="*No. de Tarjeta (16 dígitos)" value={adicionalForm.noTarjeta} onChange={handleAdicionalChange} disabled={tipoUsuario !== 'adicional'} required={tipoUsuario === 'adicional'} maxLength={16} className="input-style" />
              <input type="number" name="saldo" placeholder="*Saldo" value={adicionalForm.saldo} onChange={handleAdicionalChange} disabled={tipoUsuario !== 'adicional'} required={tipoUsuario === 'adicional'} className="input-style" />
              <input type="text" name="fechaVencimiento" placeholder="*Fecha de vencimiento (MM/AA)" value={adicionalForm.fechaVencimiento} onChange={handleAdicionalChange} disabled={tipoUsuario !== 'adicional'} required={tipoUsuario === 'adicional'} className="input-style" />
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="flex justify-end gap-3 mt-7">
            <button type="submit" className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800">
              Agregar
            </button>
            <button type="button" onClick={onCancel} className="px-8 py-2.5 rounded-full bg-[#083543] text-red-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export const ModalAgregarCentroNegocios: React.FC<ModalAgregarProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
   const [titularForm, setTitularForm] = useState({
    nombre: '', telefono: '', correo: '', DCN:'', porcentaje:''
  });
  
  if (!isOpen) return null;

    // Manejadores de cambios
  const handleTitularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitularForm({ ...titularForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();


  };
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-4xl my-auto rounded-2xl bg-[#0d5c75] p-11 shadow-2xl border border-[#146f8c] text-white relative">
        {/* Botón Cerrar (X) */}
        <button onClick={onCancel} className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-10">
          <div className="text-emerald-400">
            <svg width="23" height="28" viewBox="0 0 23 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.9336 27.4219L14.9531 25.6289H20.3789C20.5977 25.6289 20.7578 25.5781 20.8594 25.4766C20.9688 25.375 21.0234 25.2148 21.0234 24.9961V8.05078C21.0234 7.83203 20.9688 7.67188 20.8594 7.57031C20.7578 7.46094 20.5977 7.40625 20.3789 7.40625H15.9375V5.625H20.9648C21.5273 5.625 21.9727 5.80859 22.3008 6.17578C22.6367 6.54297 22.8047 7.03516 22.8047 7.65234V25.4062C22.8047 26.0156 22.6367 26.5039 22.3008 26.8711C21.9727 27.2383 21.5273 27.4219 20.9648 27.4219H13.9336ZM15.9375 13.0312V10.5352H18.5742C18.832 10.5352 18.9609 10.6602 18.9609 10.9102V12.6562C18.9609 12.9062 18.832 13.0312 18.5742 13.0312H15.9375ZM15.9375 17.2852V14.7891H18.5742C18.832 14.7891 18.9609 14.9141 18.9609 15.1641V16.9102C18.9609 17.1602 18.832 17.2852 18.5742 17.2852H15.9375ZM15.9375 21.5273V19.043H18.5742C18.832 19.043 18.9609 19.168 18.9609 19.418V21.1641C18.9609 21.4062 18.832 21.5273 18.5742 21.5273H15.9375ZM1.83984 27.4219C1.27734 27.4219 0.828125 27.2383 0.492188 26.8711C0.164062 26.5039 0 26.0156 0 25.4062V2.01562C0 1.39844 0.164062 0.910156 0.492188 0.550781C0.828125 0.183594 1.27734 0 1.83984 0H15.0234C15.5938 0 16.043 0.183594 16.3711 0.550781C16.6992 0.910156 16.8633 1.39844 16.8633 2.01562V25.4062C16.8633 26.0156 16.6992 26.5039 16.3711 26.8711C16.043 27.2383 15.5938 27.4219 15.0234 27.4219H1.83984ZM2.42578 25.6289H14.4375C14.6562 25.6289 14.8164 25.5781 14.918 25.4766C15.0273 25.375 15.082 25.2148 15.082 24.9961V2.42578C15.082 2.20703 15.0273 2.04688 14.918 1.94531C14.8164 1.83594 14.6562 1.78125 14.4375 1.78125H2.42578C2.21484 1.78125 2.05469 1.83594 1.94531 1.94531C1.83594 2.04688 1.78125 2.20703 1.78125 2.42578V24.9961C1.78125 25.2148 1.83594 25.375 1.94531 25.4766C2.05469 25.5781 2.21484 25.6289 2.42578 25.6289ZM4.78125 8.23828C4.46875 8.23828 4.3125 8.07812 4.3125 7.75781V5.54297C4.3125 5.22266 4.46875 5.0625 4.78125 5.0625H7.05469C7.375 5.0625 7.53516 5.22266 7.53516 5.54297V7.75781C7.53516 8.07812 7.375 8.23828 7.05469 8.23828H4.78125ZM9.79688 8.23828C9.48438 8.23828 9.32812 8.07812 9.32812 7.75781V5.54297C9.32812 5.22266 9.48438 5.0625 9.79688 5.0625H12.0703C12.3906 5.0625 12.5508 5.22266 12.5508 5.54297V7.75781C12.5508 8.07812 12.3906 8.23828 12.0703 8.23828H9.79688ZM4.78125 12.8789C4.46875 12.8789 4.3125 12.7188 4.3125 12.3984V10.1836C4.3125 9.86328 4.46875 9.70312 4.78125 9.70312H7.05469C7.375 9.70312 7.53516 9.86328 7.53516 10.1836V12.3984C7.53516 12.7188 7.375 12.8789 7.05469 12.8789H4.78125ZM9.79688 12.8789C9.48438 12.8789 9.32812 12.7188 9.32812 12.3984V10.1836C9.32812 9.86328 9.48438 9.70312 9.79688 9.70312H12.0703C12.3906 9.70312 12.5508 9.86328 12.5508 10.1836V12.3984C12.5508 12.7188 12.3906 12.8789 12.0703 12.8789H9.79688ZM4.78125 17.5195C4.46875 17.5195 4.3125 17.3594 4.3125 17.0391V14.8242C4.3125 14.5039 4.46875 14.3438 4.78125 14.3438H7.05469C7.375 14.3438 7.53516 14.5039 7.53516 14.8242V17.0391C7.53516 17.3594 7.375 17.5195 7.05469 17.5195H4.78125ZM9.79688 17.5195C9.48438 17.5195 9.32812 17.3594 9.32812 17.0391V14.8242C9.32812 14.5039 9.48438 14.3438 9.79688 14.3438H12.0703C12.3906 14.3438 12.5508 14.5039 12.5508 14.8242V17.0391C12.5508 17.3594 12.3906 17.5195 12.0703 17.5195H9.79688ZM4.99219 26.4844V22.3359C4.99219 21.8594 5.09766 21.5078 5.30859 21.2812C5.52734 21.0469 5.86719 20.9297 6.32812 20.9297H10.5469C11.0078 20.9297 11.3438 21.0469 11.5547 21.2812C11.7734 21.5078 11.8828 21.8594 11.8828 22.3359V26.4844H10.4297V22.7461C10.4297 22.5117 10.3086 22.3945 10.0664 22.3945H6.80859C6.56641 22.3945 6.44531 22.5117 6.44531 22.7461V26.4844H4.99219Z" fill="#02FFA2"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-(--VerdeNeon)">Agregar Centro de Negocios</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" >
          
          {/* ================= PRINCIPAL ================= */}
            <div className="mb-3 ml-3">
              <span className="text-base font-bold">Titular</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="nombre" placeholder="*Nombre (s)" onChange={handleTitularChange} className="input-style" />
              <input type="text" name="correo" placeholder="*Correo" onChange={handleTitularChange} className="input-style" />
              <input type="tel" name="telefono" placeholder="*No. de Teléfono del titular" onChange={handleTitularChange} className="input-style" />
            </div>

            <div className="mb-3 ml-3">
            <span className="text-base font-bold">Centro de negocios</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <input type="text" name="DCN" placeholder="*Denominación del Centro de Negocios " onChange={handleTitularChange} className="input-style" />
              <input type="text" name="porcentaje" placeholder="*Porcentaje de referencia" onChange={handleTitularChange} className="input-style" />
            </div>
            {/* Botones de acción inferiores */}
            <div className="flex justify-end gap-3 mt-7">
              <button type="submit" className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800">
                Agregar
              </button>
              <button type="button" onClick={onCancel} className="px-8 py-2.5 rounded-full bg-[#083543] text-red-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800">
                Cancelar
              </button>
            </div>

        </form>

      </div>
    </div>
)
};