import React from 'react';

interface ModalAvisoProps {
    isOpen:boolean;
    title?:string;
    description?:string;
    textCancel?:string;
    textConfirm?:string;
    onCancel:() => void;
    onConfirm:() => void;
}

const ModalAviso: React.FC<ModalAvisoProps> = ({
    isOpen,
    title,
    description,
    textCancel,
    textConfirm,
    onCancel,
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
    )
}
export default ModalAviso;