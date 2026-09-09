import React from 'react';

interface ModalAvisoProps {
    isOpen:boolean;
    mensaje?:string;

}

const ModalAvisoPopUp: React.FC<ModalAvisoProps> = ({
    isOpen,
    mensaje
}) => {
    if(!isOpen) return null;
    return(
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            {/* Contenedor del Modal */}
            <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
                
                {/* Título Dinámico */}
                <h2 className="text-2xl font-semibold text-white mb-4">{mensaje}</h2>

            </div>
        </div>
    )
}
export default ModalAvisoPopUp;