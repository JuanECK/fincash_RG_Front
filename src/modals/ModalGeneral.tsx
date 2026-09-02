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
interface ModalContraseñaProps {
  isOpen:boolean;
  title?:string;
  tarjetahabiente?:string;
  cta?:string;
  noCliente?:string;
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
      <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
        
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
            <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
                
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
  export const ModalContraseña: React.FC<ModalContraseñaProps> = ({
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
        <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <div className="flex items-center justify-start">
              {/* Renderizado condicional del icono dinámico */}
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
            <div className="flex flex-col justify-start ">
              <div>
                <p className="text-sm  text-write mx-auto font-[200] text-[16px]">
                  Tarjethabiente: <span className="font-bold ">{tarjetahabiente}</span>
                </p>
                </div>
                <div>
                <p className="text-sm  text-write mx-auto font-[200] text-[16px]">
                  Cta: <span className="font-bold ">{tarjetahabiente}</span>
                </p>
                </div>
                <div>
                <p className="text-sm  text-write mx-auto font-[200] text-[16px]">
                  No. Cliente: <span className="font-bold ">{tarjetahabiente}</span>
                </p>
                </div>
              
            </div>
        </div>
      </div>
    )
  }
  