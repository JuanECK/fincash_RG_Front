import React, { useEffect, useState, type HtmlHTMLAttributes } from "react";
import { api } from "../services/api";
import ModalAvisoPopUp from "./ModalAviso";
import { formToJSON } from "axios";
// import { ModalAviso } from './ModalAviso'

interface ModalProps {
  tipo: number | null;
  title?: string;
  description?: string;
  textCancel?: string;
  textConfirm?: string;
  noCliente?: string;
  idTarjeta?: number | null;
  idMovimiento?: number | null;
  // onCancel: () => void;
  onClose?: (resultado: "1" | "0") => void;
}

interface ModalAvisoProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  textConfirm?: string;
  onConfirm: () => void;
}

interface ModalContrasenaProps {
  // isOpen: boolean;
  title?: string;
  tarjetahabiente?: string;
  cta?: string;
  noCliente?: string;
  noOperacion?: string;
  textConfirm?: string;
  textCancel?: string;
  idTarjeta1?: number | null;
  idUsuario1?: number;
  idMovimientoVinculado1?: number | null;
// -------
  monto?:number | null;
  nomComercio?: string;
  concepto?: string;
  fechaCargo?: string;
  comprobante?: string;
  bajaPorEdicion1?:number | null;
  onClose?: (resultado: "1" | "0") => void;
  // onConfirm: () => void;
  // onCancel: () => void;
  icono?: React.ReactNode;
}

interface ModalTarjetahabienteProps {
  isOpen: boolean;
  title?: string;
  centroNegocio?: string;
  textConfirm?: string;
  textCancel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icono?: React.ReactNode;
}

interface ModalAgregarProps {
  // isOpen?: boolean;
  title?:string;
  CentroN?: number;
  usuarioData?: any;
  noCliente?: number;
  tipo?:string;
  onCancel?: () => void;
  onConfirm?: (data: any) => void;
  onClose?: (resultado: "1" | "0", centroN:'') => void;
  centroNegocio?: string;
}

interface DetalleGastoProps {
  isOpen: boolean;
  estatus?:boolean;
  monto?: string;
  nomComercio?: string;
  concepto?: string;
  fechaCargo?: string;
  noOperacion?: string;
  comprobante?: string;
  onEdit?: () => void;
  onCancel?: () => void;
}

// Interfaces Internas
interface busquedaCliente {
  noCliente: number;
  nombreCompleto: string;
}
interface EdicionTargetaCliente {
  apellidoP: string;
  apellidoM: string;
  correo: string;
  fechaVencimiento: string;
  idCentroN: number | null;
  idTarjeta: number | null;
  idCliente: number | null;
  noTarjeta: string;
  nombreCliente: string;
  telefono: string;
}

export const Modal: React.FC<ModalProps> = ({
  tipo = null,
  title,
  description,
  textCancel,
  textConfirm,
  noCliente,
  idTarjeta,
  idMovimiento,
  onClose,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const eliminarCerosIzquierda = (valor: string): number => {
    // Reemplaza todos los ceros al inicio (^0+) por nada, excepto si el número es exactamente "0"
    const num = valor.replace(/^0+/, "") || "0";
    return Number.parseInt(num as string, 10);
  };

  const handleEliminar = () => {
    switch (tipo) {
      case 1:
        handleSubmit("/admin/eliminarTarjetahabiente", {
          idCliente: eliminarCerosIzquierda(noCliente!),
        });
        break;
      case 2:
        handleSubmit("/admin/eliminarTarjeta", { idTarjeta: idTarjeta });
        break;
      case 3:
        handledCerrarAviso();
        break;
        case 4:
        handleSubmit("/admin/eliminaGastoAbono", {idMovimiento:idMovimiento})
        break
        // case 5:
        // handleSubmit("/admin/eliminaAbono")
        // break
    }
  };

  const handledCerrarAviso = () => {
    onClose!("1");
  };

  const handleSubmit = async (direccion?: string, tipoDato?: any) => {
    console.log(direccion, " ", tipoDato);
    try {
      // console.log({ data:eliminarCerosIzquierda(noCliente!)});
      const response = await api.post(direccion!, { data: tipoDato });
      console.log(response.data);
      if (response.data.status === 200) {
        onClose!("1");
        return;
      } else {
        setErrorMessage(response.data.error.message);
      }
    } catch (error) {
      console.log("Error del servidor", error);
    }
  };

  const handledClosed = () => {
    onClose!("0");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
        {/* Título Dinámico */}
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>

        {/* Descripción Dinámica */}
        <p className="text-sm text-cyan-100/80 leading-relaxed mb-8 max-w-xs mx-auto">
          {description}
        </p>

        {/* Acciones del Modal */}
        <div className="flex flex-col gap-3">
          {/* Botón Cancelar */}
          <button
            type="button"
            onClick={() => handledClosed()}
            className="w-full py-3 px-4 rounded-xl bg-(--DeepBlue) text-(--verdeSuccess) font-medium  cursor-pointer"
          >
            {textCancel}
          </button>

          {/* Botón Confirmar */}
          <button
            type="button"
            onClick={() => handleEliminar()}
            className="w-full py-3 px-4 rounded-xl bg-(--DeepBlue) text-(--rojoCancelar) font-medium  cursor-pointer"
          >
            {textConfirm}
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalAviso: React.FC<ModalAvisoProps> = ({
  isOpen,
  title,
  description,
  textConfirm,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
        {/* Título Dinámico */}
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>

        {/* Descripción Dinámica */}
        <p className="text-sm text-cyan-100/80 leading-relaxed mb-8 max-w-xs mx-auto">
          {description}
        </p>

        {/* Acciones del Modal */}
        <div className="flex flex-col gap-3">
          {/* Botón Confirmar */}
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {textConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ModalEditaTarjetahabiente: React.FC<ModalAgregarProps> = ({
  usuarioData,
  onClose,
  centroNegocio,
}) => {
  // Lógica de exclusión mutua: 'titular' o 'adicional'
  // const [tipoUsuario, setTipoUsuario] = useState<"titular" | "adicional">(
  //   "titular",
  // );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const eliminarCerosIzquierda = (valor: string): number => {
    // Reemplaza todos los ceros al inicio (^0+) por nada, excepto si el número es exactamente "0"
    const num = valor.replace(/^0+/, "") || "0";
    return Number.parseInt(num as string, 10);
  };
  const [titularForm, setTitularForm] = useState<EdicionTargetaCliente>({
    apellidoP: usuarioData?.apellidoP || "",
    apellidoM: usuarioData?.apellidoM || "",
    correo: usuarioData?.correo || "",
    fechaVencimiento: usuarioData?.fechaVencimiento || "",
    idCentroN: usuarioData?.idCentroN || null,
    idTarjeta: usuarioData?.idTarjeta || null,
    idCliente: eliminarCerosIzquierda(usuarioData?.noCliente) || null,
    noTarjeta: usuarioData?.noTarjeta || "",
    nombreCliente: usuarioData?.nombreCliente || "",
    telefono: usuarioData?.telefono || "",
  });

  // setTitularForm(usuarioData)
  // console.log(usuarioData)
  // Estados del Formulario (Tarjeta Adicional)
  // const [adicionalForm, setAdicionalForm] = useState({
  //   noTarjeta: "",
  //   saldo: "",
  //   fechaVencimiento: "",
  // });

  // useEffect(() => {
  //   if (tipoUsuario === "titular") {
  //     setAdicionalForm({
  //       noTarjeta: "",
  //       saldo: "",
  //       fechaVencimiento: "",
  //     });
  //   } else {
  //     setTitularForm({
  //       nombreCliente: "",
  //       apellidoP: "",
  //       apellidoM: "",
  //       correo: "",
  //       telefono: "",
  //       contrasenia: "",
  //       noTarjeta: "",
  //       saldo: "",
  //       fechaVencimiento:""
  //     });
  //   }
  // }, [tipoUsuario]);

  // if (!isOpen) return null;

  // Manejadores de cambios
  const handleTitularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitularForm({ ...titularForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      // const data = {
      //   ...titularForm,
      //   idCliente:noCliente,
      // };

      console.log("Datos a enviar:", titularForm);

      const response = await api.post("/admin/editaTarjetahabiente", {
        data: titularForm,
      });
      console.log(response);

      if (response.data.status === 200) {
        // console.log(response);
        // console.log('respuesta exitosa')
        onClose!("1", '');
        return;
      } else {
        setErrorMessage(response.data.error.message);
      }
    } catch (error) {
      console.log("Error del servidor", error);
    }
  };

  const handledClosed = () => {
    onClose!("0", '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-4xl min-w-md my-auto rounded-2xl bg-[#0d5c75] p-11 shadow-2xl border border-[#146f8c] text-white relative">
        {/* Botón Cerrar (X) */}
        <button
          onClick={() => handledClosed()}
          className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-1">
          <div className="text-emerald-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.9531 23.9062C10.3047 23.9062 8.75781 23.5938 7.3125 22.9688C5.86719 22.3516 4.59766 21.4961 3.50391 20.4023C2.41016 19.3086 1.55078 18.0391 0.925781 16.5938C0.308594 15.1484 0 13.6016 0 11.9531C0 10.3047 0.308594 8.75781 0.925781 7.3125C1.55078 5.86719 2.41016 4.59766 3.50391 3.50391C4.59766 2.40234 5.86719 1.54297 7.3125 0.925781C8.75781 0.308594 10.3047 0 11.9531 0C13.6016 0 15.1484 0.308594 16.5938 0.925781C18.0391 1.54297 19.3086 2.40234 20.4023 3.50391C21.4961 4.59766 22.3516 5.86719 22.9688 7.3125C23.5938 8.75781 23.9062 10.3047 23.9062 11.9531C23.9062 13.6016 23.5938 15.1484 22.9688 16.5938C22.3516 18.0391 21.4961 19.3086 20.4023 20.4023C19.3086 21.4961 18.0391 22.3516 16.5938 22.9688C15.1484 23.5938 13.6016 23.9062 11.9531 23.9062ZM11.9531 21.9141C13.3281 21.9141 14.6172 21.6562 15.8203 21.1406C17.0234 20.625 18.082 19.9102 18.9961 18.9961C19.9102 18.082 20.625 17.0234 21.1406 15.8203C21.6562 14.6172 21.9141 13.3281 21.9141 11.9531C21.9141 10.5781 21.6562 9.28906 21.1406 8.08594C20.625 6.875 19.9102 5.81641 18.9961 4.91016C18.082 3.99609 17.0234 3.28125 15.8203 2.76562C14.6172 2.25 13.3281 1.99219 11.9531 1.99219C10.5781 1.99219 9.28906 2.25 8.08594 2.76562C6.88281 3.28125 5.82422 3.99609 4.91016 4.91016C3.99609 5.81641 3.28125 6.875 2.76562 8.08594C2.25 9.28906 1.99219 10.5781 1.99219 11.9531C1.99219 13.3281 2.25 14.6172 2.76562 15.8203C3.28125 17.0234 3.99609 18.082 4.91016 18.9961C5.82422 19.9102 6.88281 20.625 8.08594 21.1406C9.28906 21.6562 10.5781 21.9141 11.9531 21.9141ZM6.58594 17.8828C6.35156 17.8828 6.17578 17.8164 6.05859 17.6836C5.94922 17.543 5.89453 17.3633 5.89453 17.1445C5.89453 16.8242 6.01562 16.4102 6.25781 15.9023C6.50781 15.3867 6.87891 14.875 7.37109 14.3672C7.87109 13.8516 8.5 13.418 9.25781 13.0664C10.0156 12.7148 10.9102 12.5391 11.9414 12.5391C12.9727 12.5391 13.8672 12.7148 14.625 13.0664C15.3828 13.418 16.0078 13.8516 16.5 14.3672C17 14.875 17.3711 15.3867 17.6133 15.9023C17.8633 16.4102 17.9883 16.8242 17.9883 17.1445C17.9883 17.3633 17.9297 17.543 17.8125 17.6836C17.7031 17.8164 17.5312 17.8828 17.2969 17.8828H6.58594ZM11.9414 11.5781C11.3867 11.5781 10.8789 11.4336 10.418 11.1445C9.96484 10.8555 9.60156 10.4648 9.32812 9.97266C9.0625 9.48047 8.92969 8.92188 8.92969 8.29688C8.92969 7.71094 9.0625 7.17578 9.32812 6.69141C9.60156 6.19922 9.96484 5.80859 10.418 5.51953C10.8789 5.22266 11.3867 5.07422 11.9414 5.07422C12.4961 5.07422 13 5.22266 13.4531 5.51953C13.9141 5.80859 14.2773 6.19922 14.543 6.69141C14.8164 7.17578 14.9531 7.71094 14.9531 8.29688C14.9531 8.92188 14.8164 9.48438 14.543 9.98438C14.2773 10.4766 13.9141 10.8672 13.4531 11.1562C13 11.4453 12.4961 11.5859 11.9414 11.5781Z"
                fill="#02FFA2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-(--VerdeNeon)">
            Editar tarjetahabiente
          </h2>
        </div>
        <p className="text-[16px] text-cyan-100/70 mb-6 font-light">
          Centro de negocio:{" "}
          <span className="text-white font-bold">{centroNegocio}</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete={"off"}
        >
          {/* ================= SECCIÓN TITULAR ================= */}
          <div className={`space-y-4 transition-opacity duration-300`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="nombreCliente"
                placeholder="*Nombre (s)"
                autoComplete={"off"}
                value={titularForm.nombreCliente}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                className="input-style"
              />
              <input
                type="text"
                name="apellidoP"
                placeholder="*Primer apellido"
                autoComplete={"off"}
                value={titularForm.apellidoP}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                className="input-style"
              />
              <input
                type="text"
                name="apellidoM"
                autoComplete={"off"}
                placeholder="Segundo apellido"
                value={titularForm.apellidoM}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                className="input-style"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="tel"
                name="telefono"
                placeholder="*Teléfono"
                autoComplete={"off"}
                value={titularForm.telefono}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                className="input-style"
                maxLength={10}
              />
              <div className="md:col-span-2">
                <input
                  type="email"
                  name="correo"
                  placeholder="*Correo"
                  autoComplete={"off"}
                  value={titularForm.correo}
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Campo obligatorio.",
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                  onChange={handleTitularChange}
                  className="input-style"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <div className="md:col-span-2">
              </div> */}
              <input
                type="text"
                name="noTarjeta"
                placeholder="*No. de Tarjeta (16 dígitos)"
                autoComplete={"off"}
                value={titularForm.noTarjeta}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                maxLength={16}
                className="input-style"
              />
              <input
                type="text"
                name="fechaVencimiento"
                placeholder="*Fecha de vencimiento (MM/AA)"
                value={titularForm.fechaVencimiento}
                onChange={handleTitularChange}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                className="input-style"
                maxLength={5}
              />
            </div>
          </div>

          <hr className="border-cyan-800/60 my-6" />

          {/* Botones de acción inferiores */}
          <div className="flex justify-end gap-3 mt-7">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => handledClosed()}
              className="px-8 py-2.5 rounded-full bg-[#083543] text-red-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalContraseña: React.FC<ModalContrasenaProps> = ({
  // isOpen,
  title,
  tarjetahabiente,
  cta,
  noCliente,
  textConfirm,
  textCancel,
  onClose,
  // onConfirm,
  // onCancel,
  icono,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    idCliente: null,
    contrasenia: "",
  });

  // Manejadores de cambios
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const eliminarCerosIzquierda = (valor: string): number => {
    // Reemplaza todos los ceros al inicio (^0+) por nada, excepto si el número es exactamente "0"
    const num = valor.replace(/^0+/, "") || "0";
    return Number.parseInt(num as string, 10);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    const llenaDatosAsincronos = {
      ...form,
      idCliente: eliminarCerosIzquierda(noCliente!),
    };

    try {
      e.preventDefault();

      // const data = {
      //   ...titularForm,
      //   idCliente:noCliente,
      // };

      console.log({ data: llenaDatosAsincronos });

      const response = await api.post("/admin/cambioContrasena", {
        data: llenaDatosAsincronos,
      });
      console.log(response.data);

      if (response.data.status === 200) {
        onClose!("1");
        return;
      } else {
        setErrorMessage(response.data.error.message);
      }
    } catch (error) {
      console.log("Error del servidor", error);
    }
  };

  const handledClosed = () => {
    onClose!("0");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-sm">
        <div className="flex items-center justify-between">
          {/* Renderizado condicional del icono dinámico */}
          <div className="flex">
            <div className="flex items-center justify-center mb-4">
              <svg
                width="27"
                height="24"
                viewBox="0 0 27 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.3999 8.65479C21.5373 8.65479 21.106 8.28451 21.106 7.54395C21.106 7.51953 21.106 7.49919 21.106 7.48291C21.106 7.46663 21.106 7.45036 21.106 7.43408C21.106 6.90511 21.2443 6.4738 21.521 6.14014C21.7977 5.79834 22.1517 5.47689 22.583 5.17578C23.0876 4.82585 23.466 4.53288 23.7183 4.29688C23.9787 4.05273 24.1089 3.74756 24.1089 3.38135C24.1089 3.007 23.9665 2.69775 23.6816 2.45361C23.4049 2.20947 23.0428 2.0874 22.5952 2.0874C22.3674 2.0874 22.1558 2.12402 21.9604 2.19727C21.7733 2.26237 21.5942 2.36816 21.4233 2.51465C21.2606 2.65299 21.1141 2.82389 20.9839 3.02734L20.813 3.25928C20.6828 3.42204 20.5322 3.55225 20.3613 3.6499C20.1986 3.73942 19.9992 3.78418 19.7632 3.78418C19.4784 3.78418 19.2301 3.69059 19.0186 3.50342C18.8151 3.30811 18.7134 3.05583 18.7134 2.74658C18.7134 2.63265 18.7256 2.52279 18.75 2.41699C18.7744 2.30306 18.807 2.18913 18.8477 2.0752C19.043 1.50553 19.4865 1.01725 20.1782 0.610352C20.87 0.203451 21.7407 0 22.7905 0C23.5311 0 24.2106 0.130208 24.8291 0.390625C25.4476 0.642904 25.9399 1.01318 26.3062 1.50146C26.6805 1.98161 26.8677 2.55941 26.8677 3.23486C26.8677 3.93473 26.6927 4.49219 26.3428 4.90723C26.001 5.31413 25.5249 5.71696 24.9146 6.11572C24.5402 6.35986 24.2391 6.59587 24.0112 6.82373C23.7915 7.04346 23.6694 7.30387 23.645 7.60498C23.645 7.62939 23.641 7.65788 23.6328 7.69043C23.6328 7.71484 23.6328 7.73519 23.6328 7.75146C23.6003 8.00374 23.4741 8.2194 23.2544 8.39844C23.0428 8.56934 22.758 8.65479 22.3999 8.65479ZM22.3877 12.4756C21.9645 12.4756 21.6064 12.3454 21.3135 12.085C21.0205 11.8164 20.874 11.4827 20.874 11.084C20.874 10.6771 21.0205 10.3434 21.3135 10.083C21.6064 9.81445 21.9645 9.68018 22.3877 9.68018C22.8109 9.68018 23.1689 9.81038 23.4619 10.0708C23.7549 10.3312 23.9014 10.6689 23.9014 11.084C23.9014 11.4909 23.7508 11.8245 23.4497 12.085C23.1567 12.3454 22.8027 12.4756 22.3877 12.4756ZM2.27051 23.0469C1.5625 23.0469 1.00505 22.8841 0.598145 22.5586C0.199382 22.2412 0 21.8018 0 21.2402C0 20.459 0.240072 19.637 0.720215 18.7744C1.20036 17.9118 1.89209 17.1061 2.79541 16.3574C3.69873 15.6006 4.78516 14.9862 6.05469 14.5142C7.33236 14.0422 8.76058 13.8062 10.3394 13.8062C11.9263 13.8062 13.3545 14.0422 14.624 14.5142C15.9017 14.9862 16.9881 15.6006 17.8833 16.3574C18.7866 17.1061 19.4784 17.9118 19.9585 18.7744C20.4468 19.637 20.6909 20.459 20.6909 21.2402C20.6909 21.8018 20.4875 22.2412 20.0806 22.5586C19.6818 22.8841 19.1284 23.0469 18.4204 23.0469H2.27051ZM10.3516 11.6577C9.44824 11.6577 8.62223 11.4176 7.87354 10.9375C7.12484 10.4492 6.52262 9.79818 6.06689 8.98438C5.6193 8.16243 5.39551 7.24284 5.39551 6.22559C5.39551 5.24089 5.6193 4.3457 6.06689 3.54004C6.52262 2.72624 7.12484 2.08333 7.87354 1.61133C8.63037 1.13118 9.45638 0.891113 10.3516 0.891113C11.2467 0.891113 12.0687 1.12712 12.8174 1.59912C13.5661 2.07113 14.1683 2.70996 14.624 3.51562C15.0798 4.31315 15.3076 5.2124 15.3076 6.21338C15.3076 7.23063 15.0798 8.15023 14.624 8.97217C14.1764 9.79411 13.5742 10.4492 12.8174 10.9375C12.0687 11.4176 11.2467 11.6577 10.3516 11.6577Z"
                  fill="#02FFA2"
                />
              </svg>
            </div>

            {/* Título Dinámico */}
            <h2 className="text-2xl font-semibold text-(--VerdeNeon) mb-4 ml-4">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose!("0")}
            className="mb-4 cursor-pointer"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col justify-start ">
          <div className="flex justify-start">
            <p className="text-sm  text-write  font-[200] text-[16px]">
              Tarjethabiente:{" "}
              <span className="font-bold ">{tarjetahabiente}</span>
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
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete={"off"}
        >
          <div className="flex mt-5 ">
            <input
              type="text"
              name="contrasenia"
              required
              autoComplete={"off"}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={handleFormChange}
              placeholder="*Nueva contraseña"
              className="input-generico w-full"
            />
          </div>

          <div className="flex justify-end gap-3 mt-7">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => handledClosed()}
              className="px-8 py-2.5 rounded-full bg-[#083543] text-red-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalAbono: React.FC<ModalContrasenaProps> = ({
  icono,
  title,
  tarjetahabiente,
  cta,
  noCliente,
  noOperacion,
  textConfirm,
  textCancel,
  idTarjeta1,
  idUsuario1,
  idMovimientoVinculado1,
  // ---
  monto,
  nomComercio,
  concepto,
  fechaCargo,
  comprobante,
  bajaPorEdicion1,
  onClose,
}) => {
      const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [form, setForm] = useState({
    idTarjeta: null,
    tipoMovimiento: "I", // -- 'I' (Abono) o 'E' (Cargo)
    monto: String(monto || '') || "",
    nombreNegocio: nomComercio || "",
    concepto: concepto || "",
    comprobante: comprobante || "",
    comprobanteFile: null as File | null,
    fechaMovimiento: fechaCargo || "",
    idUsuario: idUsuario1,
    idMovimientoVinculado: idMovimientoVinculado1,
    bajaPorEdicion:bajaPorEdicion1 

    // idTarjeta: null,
    // tipoMovimiento: "I", // -- 'I' (Abono) o 'E' (Cargo)
    // monto: String(monto || '') || "",
    // nombreNegocio:  "OnceCapital",
    // concepto: concepto || "",
    // comprobante: comprobante || "",
    // fechaMovimiento: fechaCargo || "",
    // idUsuario: idUsuario1,
    // idMovimientoVinculado: idMovimientoVinculado1,
    // bajaPorEdicion: bajaPorEdicion1 
  });

   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // const llenaDatosAsincronos = {
    //   ...form, idCliente: eliminarCerosIzquierda(noCliente!)
    // }
    e.preventDefault();
    try {

    const dataToSend = new FormData();

    // console.log(form)
    // Recorremos tu objeto 'form' de React y lo inyectamos al contenedor automáticamente
    dataToSend.append('idTarjeta', String(idTarjeta1));
    dataToSend.append('tipoMovimiento', form.tipoMovimiento);
    dataToSend.append('monto', form.monto);
    dataToSend.append('nombreNegocio', form.nombreNegocio);
    dataToSend.append('concepto', form.concepto);
    dataToSend.append('fechaMovimiento', form.fechaMovimiento);
    dataToSend.append('idUsuario', String(form.idUsuario));
    dataToSend.append('idMovimientoVinculado', String(idMovimientoVinculado1));
    dataToSend.append('bajaPorEdicion', String(form.bajaPorEdicion));
    
    // 🚨 LA LLAVE CRÍTICA: Adjuntamos el archivo binario PDF real.
    // 'comprobante' es el nombre exacto que espera Multer en uploadPdf.single('comprobante')
     if (form.comprobanteFile) {
      // 🚨 NOTA DE RED: El primer parámetro debe seguir siendo 'comprobante' 
      // para que encaje con el uploadPdf.single('comprobante') de tu Node.js en AWS
      dataToSend.append('comprobanteFile', form.comprobanteFile);
      
    }

      // const data = {
      //   ...form,
      //   idTarjeta:idTarjeta1,
      // };
  
      // console.log({ data: data });
  
      // const response = await api.post("/admin/agregaAbonoGasto", { data:data});
      // console.log(response.data)

            console.log({ data: Object.fromEntries(dataToSend) });
  
      // const response = await api.post("/admin/agregaAbonoGasto", { data:data});

      const response = await api.post("/admin/agregaAbonoGasto", dataToSend, {
        headers: {
        'Content-Type': 'multipart/form-data', // Avisa al navegador que van bytes y archivos
      },
      });
  
      if(response.data.status === 200){
        onClose!('1')
        return

      }else{
        setErrorMessage(response.data.error.message);
      }

    } catch (error) {
      console.log("Error del servidor", error);
    }
  };

  const handledClosed = () => {
    onClose!("0");
  };
  return (
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
          <button
            type="button"
            onClick={() => onClose!("0")}
            className="mb-4 cursor-pointer"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col justify-start ">
          <div className="flex justify-start">
            <p className="text-sm  text-write  font-[200] text-[16px]">
              Tarjethabiente:{" "}
              <span className="font-bold ">{tarjetahabiente}</span>
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
          {!noOperacion ? (
            ""
          ) : (
            <div className="flex justify-start">
              <p className="text-sm  text-write  font-[200] text-[16px]">
                No. Operación: <span className="font-bold ">{noOperacion}</span>
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              type="text"
              name="monto"
              required
              autoComplete={"off"}
              value={form.monto || ""}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={handleFormChange}
              placeholder="*Monto"
              className="input-generico w-full min-w-40"
            />
            {/* <input type="date" placeholder="*Fecha de la compra" className="input-generico w-full min-w-40" /> */}
            <div className="relative ">
              <input
                type="date"
                name="fechaMovimiento"
                required
                value={form.fechaMovimiento || ""}
                autoComplete={"off"}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleFormChange}
                className="input-date custom-date-input w-full w-full min-w-40"
              />

              {/* <!-- Icono de calendario con reloj integrado en SVG --> */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-white/80">
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.57617 10.3711C1.06055 10.3711 0.667969 10.2383 0.398438 9.97266C0.132812 9.70703 0 9.31641 0 8.80078V1.57617C0 1.05664 0.132812 0.664062 0.398438 0.398438C0.667969 0.132813 1.06055 0 1.57617 0H9.92578C10.4453 0 10.8379 0.134766 11.1035 0.404297C11.3691 0.673828 11.502 1.06445 11.502 1.57617V5.36133C11.4707 5.35742 11.4375 5.35547 11.4023 5.35547C11.3711 5.35547 11.3418 5.35547 11.3145 5.35547C11.2793 5.35547 11.2441 5.35742 11.209 5.36133C11.1738 5.36133 11.127 5.36133 11.0684 5.36133V3.65625C11.0684 3.28125 10.9688 2.99805 10.7695 2.80664C10.5742 2.61133 10.293 2.51367 9.92578 2.51367H1.57617C1.20117 2.51367 0.916016 2.61133 0.720703 2.80664C0.529297 2.99805 0.433594 3.28125 0.433594 3.65625V8.79492C0.433594 9.17383 0.529297 9.45898 0.720703 9.65039C0.916016 9.8418 1.20117 9.9375 1.57617 9.9375H8.19727C8.2207 10.0156 8.25 10.0898 8.28516 10.1602C8.32031 10.2344 8.35742 10.3047 8.39648 10.3711H1.57617ZM4.55859 4.56445C4.48047 4.56445 4.42969 4.55469 4.40625 4.53516C4.38672 4.51172 4.37695 4.46289 4.37695 4.38867V4.04883C4.37695 3.9707 4.38672 3.92188 4.40625 3.90234C4.42969 3.87891 4.48047 3.86719 4.55859 3.86719H4.9043C4.98242 3.86719 5.03125 3.87891 5.05078 3.90234C5.07422 3.92188 5.08594 3.9707 5.08594 4.04883V4.38867C5.08594 4.46289 5.07422 4.51172 5.05078 4.53516C5.03125 4.55469 4.98242 4.56445 4.9043 4.56445H4.55859ZM6.60352 4.56445C6.52148 4.56445 6.4707 4.55469 6.45117 4.53516C6.43164 4.51172 6.42188 4.46289 6.42188 4.38867V4.04883C6.42188 3.9707 6.43164 3.92188 6.45117 3.90234C6.4707 3.87891 6.52148 3.86719 6.60352 3.86719H6.94336C7.02148 3.86719 7.07031 3.87891 7.08984 3.90234C7.11328 3.92188 7.125 3.9707 7.125 4.04883V4.38867C7.125 4.46289 7.11328 4.51172 7.08984 4.53516C7.07031 4.55469 7.02148 4.56445 6.94336 4.56445H6.60352ZM8.64258 4.56445C8.56055 4.56445 8.50977 4.55469 8.49023 4.53516C8.4707 4.51172 8.46094 4.46289 8.46094 4.38867V4.04883C8.46094 3.9707 8.4707 3.92188 8.49023 3.90234C8.50977 3.87891 8.56055 3.86719 8.64258 3.86719H8.98828C9.0625 3.86719 9.10938 3.87891 9.12891 3.90234C9.15234 3.92188 9.16406 3.9707 9.16406 4.04883V4.38867C9.16406 4.46289 9.15234 4.51172 9.12891 4.53516C9.10938 4.55469 9.0625 4.56445 8.98828 4.56445H8.64258ZM2.51953 6.57422C2.44141 6.57422 2.39062 6.56445 2.36719 6.54492C2.34766 6.52148 2.33789 6.47266 2.33789 6.39844V6.05273C2.33789 5.97852 2.34766 5.93164 2.36719 5.91211C2.39062 5.89258 2.44141 5.88281 2.51953 5.88281H2.86523C2.93945 5.88281 2.98828 5.89258 3.01172 5.91211C3.03516 5.93164 3.04688 5.97852 3.04688 6.05273V6.39844C3.04688 6.47266 3.03516 6.52148 3.01172 6.54492C2.98828 6.56445 2.93945 6.57422 2.86523 6.57422H2.51953ZM4.55859 6.57422C4.48047 6.57422 4.42969 6.56445 4.40625 6.54492C4.38672 6.52148 4.37695 6.47266 4.37695 6.39844V6.05273C4.37695 5.97852 4.38672 5.93164 4.40625 5.91211C4.42969 5.89258 4.48047 5.88281 4.55859 5.88281H4.9043C4.98242 5.88281 5.03125 5.89258 5.05078 5.91211C5.07422 5.93164 5.08594 5.97852 5.08594 6.05273V6.39844C5.08594 6.47266 5.07422 6.52148 5.05078 6.54492C5.03125 6.56445 4.98242 6.57422 4.9043 6.57422H4.55859ZM6.60352 6.57422C6.52148 6.57422 6.4707 6.56445 6.45117 6.54492C6.43164 6.52148 6.42188 6.47266 6.42188 6.39844V6.05273C6.42188 5.97852 6.43164 5.93164 6.45117 5.91211C6.4707 5.89258 6.52148 5.88281 6.60352 5.88281H6.94336C7.02148 5.88281 7.07031 5.89258 7.08984 5.91211C7.11328 5.93164 7.125 5.97852 7.125 6.05273V6.39844C7.125 6.47266 7.11328 6.52148 7.08984 6.54492C7.07031 6.56445 7.02148 6.57422 6.94336 6.57422H6.60352ZM2.51953 8.58398C2.44141 8.58398 2.39062 8.57422 2.36719 8.55469C2.34766 8.53125 2.33789 8.48242 2.33789 8.4082V8.0625C2.33789 7.98828 2.34766 7.94141 2.36719 7.92188C2.39062 7.90234 2.44141 7.89258 2.51953 7.89258H2.86523C2.93945 7.89258 2.98828 7.90234 3.01172 7.92188C3.03516 7.94141 3.04688 7.98828 3.04688 8.0625V8.4082C3.04688 8.48242 3.03516 8.53125 3.01172 8.55469C2.98828 8.57422 2.93945 8.58398 2.86523 8.58398H2.51953ZM4.55859 8.58398C4.48047 8.58398 4.42969 8.57422 4.40625 8.55469C4.38672 8.53125 4.37695 8.48242 4.37695 8.4082V8.0625C4.37695 7.98828 4.38672 7.94141 4.40625 7.92188C4.42969 7.90234 4.48047 7.89258 4.55859 7.89258H4.9043C4.98242 7.89258 5.03125 7.90234 5.05078 7.92188C5.07422 7.94141 5.08594 7.98828 5.08594 8.0625V8.4082C5.08594 8.48242 5.07422 8.53125 5.05078 8.55469C5.03125 8.57422 4.98242 8.58398 4.9043 8.58398H4.55859ZM6.60352 8.58398C6.52148 8.58398 6.4707 8.57422 6.45117 8.55469C6.43164 8.53125 6.42188 8.48242 6.42188 8.4082V8.0625C6.42188 7.98828 6.43164 7.94141 6.45117 7.92188C6.4707 7.90234 6.52148 7.89258 6.60352 7.89258H6.94336C7.02148 7.89258 7.07031 7.90234 7.08984 7.92188C7.11328 7.94141 7.125 7.98828 7.125 8.0625V8.4082C7.125 8.48242 7.11328 8.53125 7.08984 8.55469C7.07031 8.57422 7.02148 8.58398 6.94336 8.58398H6.60352ZM11.3027 11.5254C10.916 11.5254 10.5508 11.4512 10.207 11.3027C9.86719 11.1543 9.56641 10.9492 9.30469 10.6875C9.04688 10.4297 8.84375 10.1289 8.69531 9.78516C8.54688 9.44531 8.47266 9.08203 8.47266 8.69531C8.47266 8.30859 8.54688 7.94531 8.69531 7.60547C8.84375 7.26562 9.04688 6.96484 9.30469 6.70312C9.56641 6.44141 9.86719 6.23633 10.207 6.08789C10.5508 5.93945 10.916 5.86523 11.3027 5.86523C11.6934 5.86523 12.0586 5.93945 12.3984 6.08789C12.7383 6.23633 13.0371 6.44141 13.2949 6.70312C13.5566 6.96094 13.7598 7.25977 13.9043 7.59961C14.0527 7.93945 14.127 8.30469 14.127 8.69531C14.127 9.08203 14.0527 9.44531 13.9043 9.78516C13.7598 10.1289 13.5566 10.4297 13.2949 10.6875C13.0332 10.9492 12.7305 11.1543 12.3867 11.3027C12.0469 11.4512 11.6855 11.5254 11.3027 11.5254ZM9.84375 9.10547H11.3086C11.3789 9.10547 11.4395 9.08008 11.4902 9.0293C11.541 8.97461 11.5664 8.91211 11.5664 8.8418V6.86133C11.5664 6.79492 11.541 6.73828 11.4902 6.69141C11.4434 6.64062 11.3828 6.61523 11.3086 6.61523C11.2383 6.61523 11.1797 6.64062 11.1328 6.69141C11.0859 6.73828 11.0625 6.79492 11.0625 6.86133V8.5957H9.84375C9.77344 8.5957 9.71289 8.62109 9.66211 8.67188C9.61523 8.71875 9.5918 8.77539 9.5918 8.8418C9.5918 8.91992 9.61523 8.98438 9.66211 9.03516C9.71289 9.08203 9.77344 9.10547 9.84375 9.10547Z"
                    fill="#D9D9D9"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <button type="button" className="cursor-pointer">
               <div className="flex justify-center items-center gap-3 py-2 px-5 rounded-full bg-(--blanco) text-(--DeepBlue)">
                Subir comprobante
                <svg
                  width="11"
                  height="13"
                  viewBox="0 0 11 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z"
                    fill="#1B687C"
                  />
                </svg>
              </div>
              </button>
            </div>
          </div>



        {/* <div className="flex mt-5 gap-3">
          <input
            type="text"
            placeholder="*Monto"
            className="input-generico w-full min-w-24"
          />
          <input
            type="text"
            placeholder="*Fecha de abono"
            className="input-generico max-w-40"
          />
          <div className="py-1 px-5 rounded-full bg-(--blanco)">
            <button className="pt-2 cursor-pointer">
              <svg
                width="11"
                height="13"
                viewBox="0 0 11 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z"
                  fill="#1B687C"
                />
              </svg>
            </button>
          </div>
        </div> */}

        <div className="flex flex-row gap-3 mt-5 justify-end">
          {/* Botón Cancelar */}
          <button
            type="submit"
            className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {textConfirm}
          </button>

          {/* Botón Confirmar */}
          <button
            type="button"
            onClick={handledClosed}
            className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {textCancel}
          </button>
        </div>
      </form>

      </div>
      {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalGasto: React.FC<ModalContrasenaProps> = ({
  // isOpen,
  title,
  tarjetahabiente,
  cta,
  noCliente,
  noOperacion,
  textConfirm,
  textCancel,
  idTarjeta1,
  idUsuario1,
  idMovimientoVinculado1,
  // ---
  monto,
  nomComercio,
  concepto,
  fechaCargo,
  comprobante,
  bajaPorEdicion1,
  onClose,
  // onConfirm,
  // onCancel,
  icono,
}) => {
  const [form, setForm] = useState({
    idTarjeta: null,
    tipoMovimiento: "E", // -- 'I' (Abono) o 'E' (Cargo)
    monto: String(monto || '') || "",
    nombreNegocio: nomComercio || "",
    concepto: concepto || "",
    comprobante: comprobante || "",
    comprobanteFile: null as File | null,
    fechaMovimiento: fechaCargo || "",
    idUsuario: idUsuario1,
    idMovimientoVinculado: idMovimientoVinculado1,
    bajaPorEdicion:bajaPorEdicion1 
  });

  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Manejadores de cambios
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    // Manejador de Cambio de Archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage('Solo se permiten archivos en formato PDF.');
        setFile(null);
        return;
      }
      console.log('entre ')
      setErrorMessage(null);
      // setForm({comprobanteFile:selectedFile})
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // const llenaDatosAsincronos = {
    //   ...form, idCliente: eliminarCerosIzquierda(noCliente!)
    // }
    e.preventDefault();
    try {

    const dataToSend = new FormData();

    // console.log(form)
    // Recorremos tu objeto 'form' de React y lo inyectamos al contenedor automáticamente
    dataToSend.append('idTarjeta', String(idTarjeta1));
    dataToSend.append('tipoMovimiento', form.tipoMovimiento);
    dataToSend.append('monto', form.monto);
    dataToSend.append('nombreNegocio', form.nombreNegocio);
    dataToSend.append('concepto', form.concepto);
    dataToSend.append('fechaMovimiento', form.fechaMovimiento);
    dataToSend.append('idUsuario', String(form.idUsuario));
    dataToSend.append('idMovimientoVinculado', String(idMovimientoVinculado1));
    dataToSend.append('bajaPorEdicion', String(form.bajaPorEdicion));
    
    // 🚨 LA LLAVE CRÍTICA: Adjuntamos el archivo binario PDF real.
    // 'comprobante' es el nombre exacto que espera Multer en uploadPdf.single('comprobante')
     if (file) {
      console.log('File ok')
      // 🚨 NOTA DE RED: El primer parámetro debe seguir siendo 'comprobante' 
      // para que encaje con el uploadPdf.single('comprobante') de tu Node.js en AWS
      dataToSend.append('comprobanteFile', file!);
      
    }

      // const data = {
      //   ...form,
      //   idTarjeta:idTarjeta1,
      // };
  
      // console.log({ data: form });
      console.log({ data: Object.fromEntries(dataToSend) });
  
      // const response = await api.post("/admin/agregaAbonoGasto", { data:data});

      const response = await api.post("/admin/agregaAbonoGasto", dataToSend 
      //   {
      //   headers: {
      //   'Content-Type': 'multipart/form-data', // Avisa al navegador que van bytes y archivos
      // },
      // }
    );

      console.log(response.data)
  
      if(response.data.status === 200){
        onClose!('1')
        return

      }else{
        setErrorMessage(response.data.error.message);
      }

    } catch (error) {
      console.log("Error del servidor", error);
    }
  };

  const handledClosed = () => {
    onClose!("0");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 ">
      <div className="w-full max-w-4xl rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c] min-w-md">
        <div className="flex items-center justify-between">
          {/* Renderizado condicional del icono dinámico */}
          <div className="flex">
            <div className="flex items-center justify-center mb-4">
              <svg
                width="27"
                height="26"
                viewBox="0 0 27 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.0625 4.18359C24.2812 4.18359 25.1992 4.48828 25.8164 5.09766C26.4336 5.69922 26.7422 6.60547 26.7422 7.81641V19.9453C26.7422 21.1562 26.4492 22.0625 25.8633 22.6641C25.2773 23.2734 24.4609 23.5781 23.4141 23.5781H12.4922C12.8125 23.0234 13.0625 22.4297 13.2422 21.7969C13.4219 21.1641 13.5117 20.5078 13.5117 19.8281C13.5117 18.7891 13.3125 17.8164 12.9141 16.9102C12.5234 15.9961 11.9805 15.1914 11.2852 14.4961C10.5898 13.8008 9.78516 13.2578 8.87109 12.8672C7.95703 12.4688 6.98047 12.2695 5.94141 12.2695V7.81641C5.94141 6.60547 6.24609 5.69922 6.85547 5.09766C7.47266 4.48828 8.39453 4.18359 9.62109 4.18359H23.0625ZM11.7188 4.64062C11.7188 3.77344 11.9219 2.99219 12.3281 2.29688C12.7344 1.59375 13.2852 1.03516 13.9805 0.621094C14.6758 0.207031 15.4609 0 16.3359 0C17.2109 0 17.9961 0.207031 18.6914 0.621094C19.3945 1.03516 19.9492 1.59375 20.3555 2.29688C20.7617 2.99219 20.9648 3.77344 20.9648 4.64062L19.0781 4.65234C19.0781 4.08984 18.9609 3.59375 18.7266 3.16406C18.5 2.73437 18.1797 2.39844 17.7656 2.15625C17.3594 1.90625 16.8828 1.78125 16.3359 1.78125C15.7969 1.78125 15.3203 1.90625 14.9062 2.15625C14.5 2.39844 14.1797 2.73437 13.9453 3.16406C13.7188 3.59375 13.6055 4.08984 13.6055 4.65234L11.7188 4.64062ZM5.95312 25.7812C5.14062 25.7812 4.375 25.625 3.65625 25.3125C2.9375 25.0078 2.30469 24.582 1.75781 24.0352C1.21094 23.4883 0.78125 22.8555 0.46875 22.1367C0.15625 21.418 0 20.6484 0 19.8281C0 19.0078 0.15625 18.2422 0.46875 17.5312C0.78125 16.8125 1.21094 16.1797 1.75781 15.6328C2.30469 15.0781 2.9375 14.6484 3.65625 14.3438C4.375 14.0312 5.14062 13.875 5.95312 13.875C6.77344 13.875 7.54297 14.0312 8.26172 14.3438C8.98047 14.6484 9.61328 15.0742 10.1602 15.6211C10.707 16.168 11.1328 16.8008 11.4375 17.5195C11.75 18.2383 11.9062 19.0078 11.9062 19.8281C11.9062 20.6406 11.75 21.4062 11.4375 22.125C11.125 22.8438 10.6914 23.4766 10.1367 24.0234C9.58984 24.5703 8.95703 25 8.23828 25.3125C7.51953 25.625 6.75781 25.7812 5.95312 25.7812ZM5.94141 23.5547C6.16016 23.5547 6.33203 23.4883 6.45703 23.3555C6.58984 23.2227 6.65625 23.0508 6.65625 22.8398V20.543H8.95312C9.16406 20.543 9.33594 20.4766 9.46875 20.3438C9.60156 20.2188 9.66797 20.0469 9.66797 19.8281C9.66797 19.6094 9.60156 19.4375 9.46875 19.3125C9.33594 19.1797 9.16406 19.1133 8.95312 19.1133H6.65625V16.8164C6.65625 16.6055 6.58984 16.4336 6.45703 16.3008C6.33203 16.168 6.16016 16.1016 5.94141 16.1016C5.72266 16.1016 5.54688 16.168 5.41406 16.3008C5.28906 16.4336 5.22656 16.6055 5.22656 16.8164V19.1133H2.92969C2.71875 19.1133 2.54688 19.1797 2.41406 19.3125C2.28125 19.4375 2.21484 19.6094 2.21484 19.8281C2.21484 20.0469 2.28125 20.2188 2.41406 20.3438C2.54688 20.4766 2.71875 20.543 2.92969 20.543H5.22656V22.8398C5.22656 23.0508 5.28906 23.2227 5.41406 23.3555C5.54688 23.4883 5.72266 23.5547 5.94141 23.5547Z"
                  fill="#02FFA2"
                />
              </svg>
            </div>
            {/* Título Dinámico */}
            <h2 className="text-2xl font-semibold text-(--VerdeNeon) mb-4 ml-4">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose!("0")}
            className="mb-4 cursor-pointer"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.375 12.625C0.223958 12.474 0.122396 12.2969 0.0703125 12.0938C0.0234375 11.8854 0.0260417 11.6823 0.078125 11.4844C0.130208 11.2812 0.226562 11.1094 0.367188 10.9688L4.82812 6.5L0.367188 2.03906C0.226562 1.89844 0.130208 1.72656 0.078125 1.52344C0.03125 1.32031 0.03125 1.11719 0.078125 0.914062C0.130208 0.710938 0.229167 0.533854 0.375 0.382812C0.526042 0.226562 0.703125 0.125 0.90625 0.078125C1.11458 0.03125 1.32031 0.03125 1.52344 0.078125C1.72656 0.125 1.90104 0.221354 2.04688 0.367188L6.50781 4.82031L10.9609 0.367188C11.1068 0.221354 11.2812 0.125 11.4844 0.078125C11.6875 0.0260417 11.888 0.0260417 12.0859 0.078125C12.2891 0.130208 12.4688 0.231771 12.625 0.382812C12.776 0.533854 12.8776 0.710938 12.9297 0.914062C12.9818 1.11719 12.9818 1.32031 12.9297 1.52344C12.8828 1.72135 12.7865 1.89583 12.6406 2.04688L8.1875 6.5L12.6406 10.9609C12.7865 11.1068 12.8828 11.2812 12.9297 11.4844C12.9766 11.6875 12.974 11.8906 12.9219 12.0938C12.875 12.2969 12.776 12.474 12.625 12.625C12.474 12.776 12.2969 12.875 12.0938 12.9219C11.8906 12.974 11.6875 12.9766 11.4844 12.9297C11.2812 12.8828 11.1068 12.7839 10.9609 12.6328L6.50781 8.17969L2.04688 12.6406C1.90104 12.7812 1.72656 12.875 1.52344 12.9219C1.32552 12.974 1.1224 12.974 0.914062 12.9219C0.710938 12.875 0.53125 12.776 0.375 12.625Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col justify-start ">
          <div className="flex justify-start">
            <p className="text-sm  text-write  font-[200] text-[16px]">
              Tarjethabiente:{" "}
              <span className="font-bold ">{tarjetahabiente}</span>
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
          {!noOperacion ? (
            ""
          ) : (
            <div className="flex justify-start">
              <p className="text-sm  text-write  font-[200] text-[16px]">
                No. Operación: <span className="font-bold ">{noOperacion}</span>
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="monto"
              required
              autoComplete={"off"}
              value={form.monto || ""}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={handleFormChange}
              placeholder="*Monto"
              className="input-generico w-full min-w-40"
            />
            {/* <input type="date" placeholder="*Fecha de la compra" className="input-generico w-full min-w-40" /> */}
            <div className="relative ">
              <input
                type="date"
                name="fechaMovimiento"
                required
                value={form.fechaMovimiento || ""}
                autoComplete={"off"}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleFormChange}
                className="input-date custom-date-input w-full w-full min-w-40"
              />

              {/* <!-- Icono de calendario con reloj integrado en SVG --> */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-white/80">
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.57617 10.3711C1.06055 10.3711 0.667969 10.2383 0.398438 9.97266C0.132812 9.70703 0 9.31641 0 8.80078V1.57617C0 1.05664 0.132812 0.664062 0.398438 0.398438C0.667969 0.132813 1.06055 0 1.57617 0H9.92578C10.4453 0 10.8379 0.134766 11.1035 0.404297C11.3691 0.673828 11.502 1.06445 11.502 1.57617V5.36133C11.4707 5.35742 11.4375 5.35547 11.4023 5.35547C11.3711 5.35547 11.3418 5.35547 11.3145 5.35547C11.2793 5.35547 11.2441 5.35742 11.209 5.36133C11.1738 5.36133 11.127 5.36133 11.0684 5.36133V3.65625C11.0684 3.28125 10.9688 2.99805 10.7695 2.80664C10.5742 2.61133 10.293 2.51367 9.92578 2.51367H1.57617C1.20117 2.51367 0.916016 2.61133 0.720703 2.80664C0.529297 2.99805 0.433594 3.28125 0.433594 3.65625V8.79492C0.433594 9.17383 0.529297 9.45898 0.720703 9.65039C0.916016 9.8418 1.20117 9.9375 1.57617 9.9375H8.19727C8.2207 10.0156 8.25 10.0898 8.28516 10.1602C8.32031 10.2344 8.35742 10.3047 8.39648 10.3711H1.57617ZM4.55859 4.56445C4.48047 4.56445 4.42969 4.55469 4.40625 4.53516C4.38672 4.51172 4.37695 4.46289 4.37695 4.38867V4.04883C4.37695 3.9707 4.38672 3.92188 4.40625 3.90234C4.42969 3.87891 4.48047 3.86719 4.55859 3.86719H4.9043C4.98242 3.86719 5.03125 3.87891 5.05078 3.90234C5.07422 3.92188 5.08594 3.9707 5.08594 4.04883V4.38867C5.08594 4.46289 5.07422 4.51172 5.05078 4.53516C5.03125 4.55469 4.98242 4.56445 4.9043 4.56445H4.55859ZM6.60352 4.56445C6.52148 4.56445 6.4707 4.55469 6.45117 4.53516C6.43164 4.51172 6.42188 4.46289 6.42188 4.38867V4.04883C6.42188 3.9707 6.43164 3.92188 6.45117 3.90234C6.4707 3.87891 6.52148 3.86719 6.60352 3.86719H6.94336C7.02148 3.86719 7.07031 3.87891 7.08984 3.90234C7.11328 3.92188 7.125 3.9707 7.125 4.04883V4.38867C7.125 4.46289 7.11328 4.51172 7.08984 4.53516C7.07031 4.55469 7.02148 4.56445 6.94336 4.56445H6.60352ZM8.64258 4.56445C8.56055 4.56445 8.50977 4.55469 8.49023 4.53516C8.4707 4.51172 8.46094 4.46289 8.46094 4.38867V4.04883C8.46094 3.9707 8.4707 3.92188 8.49023 3.90234C8.50977 3.87891 8.56055 3.86719 8.64258 3.86719H8.98828C9.0625 3.86719 9.10938 3.87891 9.12891 3.90234C9.15234 3.92188 9.16406 3.9707 9.16406 4.04883V4.38867C9.16406 4.46289 9.15234 4.51172 9.12891 4.53516C9.10938 4.55469 9.0625 4.56445 8.98828 4.56445H8.64258ZM2.51953 6.57422C2.44141 6.57422 2.39062 6.56445 2.36719 6.54492C2.34766 6.52148 2.33789 6.47266 2.33789 6.39844V6.05273C2.33789 5.97852 2.34766 5.93164 2.36719 5.91211C2.39062 5.89258 2.44141 5.88281 2.51953 5.88281H2.86523C2.93945 5.88281 2.98828 5.89258 3.01172 5.91211C3.03516 5.93164 3.04688 5.97852 3.04688 6.05273V6.39844C3.04688 6.47266 3.03516 6.52148 3.01172 6.54492C2.98828 6.56445 2.93945 6.57422 2.86523 6.57422H2.51953ZM4.55859 6.57422C4.48047 6.57422 4.42969 6.56445 4.40625 6.54492C4.38672 6.52148 4.37695 6.47266 4.37695 6.39844V6.05273C4.37695 5.97852 4.38672 5.93164 4.40625 5.91211C4.42969 5.89258 4.48047 5.88281 4.55859 5.88281H4.9043C4.98242 5.88281 5.03125 5.89258 5.05078 5.91211C5.07422 5.93164 5.08594 5.97852 5.08594 6.05273V6.39844C5.08594 6.47266 5.07422 6.52148 5.05078 6.54492C5.03125 6.56445 4.98242 6.57422 4.9043 6.57422H4.55859ZM6.60352 6.57422C6.52148 6.57422 6.4707 6.56445 6.45117 6.54492C6.43164 6.52148 6.42188 6.47266 6.42188 6.39844V6.05273C6.42188 5.97852 6.43164 5.93164 6.45117 5.91211C6.4707 5.89258 6.52148 5.88281 6.60352 5.88281H6.94336C7.02148 5.88281 7.07031 5.89258 7.08984 5.91211C7.11328 5.93164 7.125 5.97852 7.125 6.05273V6.39844C7.125 6.47266 7.11328 6.52148 7.08984 6.54492C7.07031 6.56445 7.02148 6.57422 6.94336 6.57422H6.60352ZM2.51953 8.58398C2.44141 8.58398 2.39062 8.57422 2.36719 8.55469C2.34766 8.53125 2.33789 8.48242 2.33789 8.4082V8.0625C2.33789 7.98828 2.34766 7.94141 2.36719 7.92188C2.39062 7.90234 2.44141 7.89258 2.51953 7.89258H2.86523C2.93945 7.89258 2.98828 7.90234 3.01172 7.92188C3.03516 7.94141 3.04688 7.98828 3.04688 8.0625V8.4082C3.04688 8.48242 3.03516 8.53125 3.01172 8.55469C2.98828 8.57422 2.93945 8.58398 2.86523 8.58398H2.51953ZM4.55859 8.58398C4.48047 8.58398 4.42969 8.57422 4.40625 8.55469C4.38672 8.53125 4.37695 8.48242 4.37695 8.4082V8.0625C4.37695 7.98828 4.38672 7.94141 4.40625 7.92188C4.42969 7.90234 4.48047 7.89258 4.55859 7.89258H4.9043C4.98242 7.89258 5.03125 7.90234 5.05078 7.92188C5.07422 7.94141 5.08594 7.98828 5.08594 8.0625V8.4082C5.08594 8.48242 5.07422 8.53125 5.05078 8.55469C5.03125 8.57422 4.98242 8.58398 4.9043 8.58398H4.55859ZM6.60352 8.58398C6.52148 8.58398 6.4707 8.57422 6.45117 8.55469C6.43164 8.53125 6.42188 8.48242 6.42188 8.4082V8.0625C6.42188 7.98828 6.43164 7.94141 6.45117 7.92188C6.4707 7.90234 6.52148 7.89258 6.60352 7.89258H6.94336C7.02148 7.89258 7.07031 7.90234 7.08984 7.92188C7.11328 7.94141 7.125 7.98828 7.125 8.0625V8.4082C7.125 8.48242 7.11328 8.53125 7.08984 8.55469C7.07031 8.57422 7.02148 8.58398 6.94336 8.58398H6.60352ZM11.3027 11.5254C10.916 11.5254 10.5508 11.4512 10.207 11.3027C9.86719 11.1543 9.56641 10.9492 9.30469 10.6875C9.04688 10.4297 8.84375 10.1289 8.69531 9.78516C8.54688 9.44531 8.47266 9.08203 8.47266 8.69531C8.47266 8.30859 8.54688 7.94531 8.69531 7.60547C8.84375 7.26562 9.04688 6.96484 9.30469 6.70312C9.56641 6.44141 9.86719 6.23633 10.207 6.08789C10.5508 5.93945 10.916 5.86523 11.3027 5.86523C11.6934 5.86523 12.0586 5.93945 12.3984 6.08789C12.7383 6.23633 13.0371 6.44141 13.2949 6.70312C13.5566 6.96094 13.7598 7.25977 13.9043 7.59961C14.0527 7.93945 14.127 8.30469 14.127 8.69531C14.127 9.08203 14.0527 9.44531 13.9043 9.78516C13.7598 10.1289 13.5566 10.4297 13.2949 10.6875C13.0332 10.9492 12.7305 11.1543 12.3867 11.3027C12.0469 11.4512 11.6855 11.5254 11.3027 11.5254ZM9.84375 9.10547H11.3086C11.3789 9.10547 11.4395 9.08008 11.4902 9.0293C11.541 8.97461 11.5664 8.91211 11.5664 8.8418V6.86133C11.5664 6.79492 11.541 6.73828 11.4902 6.69141C11.4434 6.64062 11.3828 6.61523 11.3086 6.61523C11.2383 6.61523 11.1797 6.64062 11.1328 6.69141C11.0859 6.73828 11.0625 6.79492 11.0625 6.86133V8.5957H9.84375C9.77344 8.5957 9.71289 8.62109 9.66211 8.67188C9.61523 8.71875 9.5918 8.77539 9.5918 8.8418C9.5918 8.91992 9.61523 8.98438 9.66211 9.03516C9.71289 9.08203 9.77344 9.10547 9.84375 9.10547Z"
                    fill="#D9D9D9"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <input
              type="text"
              name="concepto"
              required
              value={form.concepto || ""}
              autoComplete={"off"}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={handleFormChange}
              placeholder="*Concepto"
              className="input-generico w-full min-w-40"
            />
            <input
              type="text"
              name="nombreNegocio"
              required
              value={form.nombreNegocio || ""}
              autoComplete={"off"}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={handleFormChange}
              placeholder="*Establecimiento"
              className="input-generico w-full min-w-40"
            />
          </div>
          {/* grid grid-cols-1 md:grid-cols-2 */}
          {/* =========================================================================== */}

            {/* 📎 Input de Archivo PDF Customizado */}
              {/* <div>
                <label className="form-label !mb-1.5">Comprobante Digital (PDF)</label>
                <div className={`file-upload-wrapper ${file ? 'has-file' : ''}`}>
                  <span className="text-xl">{file ? '📄' : '📤'}</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {file ? file.name : 'Arrastra o selecciona el archivo PDF'}
                  </span>
                  {" "}
                  <span className="text-[10px] text-(--blanco)">Máximo 5MB</span>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange} 
                    className="hidden-file-input"
                  />
                </div>
              </div> */}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Agregamos 'relative' y 'overflow-hidden' al contenedor principal */}
                <div className={`relative overflow-hidden flex justify-center items-center gap-3 py-2 px-5 mt-5 rounded-full bg-(--blanco) ${file ? 'has-file' : ''}`}>
                  
                  <span className="text-sm font-[400] text-(--DeepBlue)">
                    {file ? file.name : 'Arrastra o selecciona el archivo PDF'}
                  </span>
                  <span>
                    <svg
                      width="11"
                      height="13"
                      viewBox="0 0 11 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      >
                      <path
                        d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z"
                        fill="#1B687C"
                        />
                    </svg>
                  </span>
                  
                  {/* Estilizamos el input para que ocupe SOLO este contenedor de forma invisible */}
                  <input 
                    type="file" 
                    title="Máximo 5MB"
                    accept="application/pdf" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                </div>
              </div>

        
            {/* <button type="button" className="cursor-pointer text-sm ">
              <div className="flex justify-center items-center gap-3 py-2 px-5 mt-5 rounded-full bg-(--blanco) text-(--DeepBlue)">
                 {file ? file.name : 'Subir comprobante'}
                                   <svg
                    width="11"
                    height="13"
                    viewBox="0 0 11 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                      d="M5.02734 11.168C5.16016 11.168 5.27539 11.123 5.37305 11.0332C5.4707 10.9434 5.51953 10.834 5.51953 10.7051V8.75977L5.4668 7.88086L5.91211 8.33789L6.39258 8.83008C6.43945 8.87305 6.49023 8.91016 6.54492 8.94141C6.60352 8.96875 6.66406 8.98242 6.72656 8.98242C6.85156 8.98242 6.95703 8.94336 7.04297 8.86523C7.12891 8.7832 7.17188 8.67969 7.17188 8.55469C7.17188 8.48438 7.1582 8.42188 7.13086 8.36719C7.10352 8.3125 7.06445 8.26172 7.01367 8.21484L5.39648 6.73242C5.33398 6.67383 5.27344 6.63086 5.21484 6.60352C5.15625 6.57617 5.09375 6.5625 5.02734 6.5625C4.95703 6.5625 4.89258 6.57617 4.83398 6.60352C4.77539 6.63086 4.71484 6.67383 4.65234 6.73242L3.04102 8.21484C2.99023 8.26172 2.95117 8.3125 2.92383 8.36719C2.89648 8.42188 2.88281 8.48438 2.88281 8.55469C2.88281 8.67969 2.92383 8.7832 3.00586 8.86523C3.08789 8.94336 3.19531 8.98242 3.32812 8.98242C3.38672 8.98242 3.44531 8.96875 3.50391 8.94141C3.5625 8.91016 3.61328 8.87305 3.65625 8.83008L4.13672 8.33789L4.58203 7.88086L4.53516 8.75977V10.7051C4.53516 10.834 4.58203 10.9434 4.67578 11.0332C4.77344 11.123 4.89062 11.168 5.02734 11.168ZM1.9043 12.6855C1.27539 12.6855 0.800781 12.5234 0.480469 12.1992C0.160156 11.875 0 11.3965 0 10.7637V1.92188C0 1.29297 0.160156 0.816406 0.480469 0.492188C0.800781 0.164062 1.27539 0 1.9043 0H4.57617V4.42969C4.57617 5.15625 4.93945 5.51953 5.66602 5.51953H10.0488V10.7637C10.0488 11.3926 9.88867 11.8691 9.56836 12.1934C9.24805 12.5215 8.77344 12.6855 8.14453 12.6855H1.9043ZM5.77148 4.66406C5.54883 4.66406 5.4375 4.55273 5.4375 4.33008V0.0585938C5.57031 0.0742188 5.70312 0.128906 5.83594 0.222656C5.97266 0.316406 6.11328 0.4375 6.25781 0.585938L9.45703 3.83203C9.60938 3.98828 9.73047 4.13281 9.82031 4.26562C9.91406 4.39844 9.96875 4.53125 9.98438 4.66406H5.77148Z"
                      fill="#1B687C"
                      />
                  </svg>
              </div>
            </button> */}

          {/* =========================================================================== */}

          <div className="flex flex-row gap-3 mt-10 justify-end">
            {/* Botón Cancelar */}
            <button
              type="submit"
              className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--verdeSuccess) font-medium  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {textConfirm}
            </button>

            {/* Botón Confirmar */}
            <button
              type="button"
              onClick={() => handledClosed()}
              className="w-[35%] py-2 px-2 rounded-full bg-(--DeepBlue) text-(--rojoCancelar) font-medium  focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              {textCancel}
            </button>
          </div>
        </form>
      </div>
            {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalAgregarTarjetahabiente: React.FC<ModalAgregarProps> = ({
  CentroN,
  onClose,
  centroNegocio,
}) => {
  // Lógica de exclusión mutua: 'titular' o 'adicional'
  const [tipoUsuario, setTipoUsuario] = useState<"titular" | "adicional">(
    "titular",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [ ClienteN, setClienteN ] = useState<number | null>(null)
  const [resultBusqueda, setResultBusqueda] = useState<busquedaCliente>({
    noCliente: 0,
    nombreCompleto: "",
  });

  const [busquedaInput, setBusquedaInput] = useState({
    IdCliente: "",
    tipo: "NoCliente",
  });

  // Estados del Formulario (Titular)
  const [titularForm, setTitularForm] = useState({
    nombreCliente: "",
    apellidoP: "",
    apellidoM: "",
    correo: "",
    telefono: "",
    contrasenia: "",
    noTarjeta: "",
    saldo: "",
    fechaVencimiento: "",
  });

  // Estados del Formulario (Tarjeta Adicional)
  const [adicionalForm, setAdicionalForm] = useState({
    noTarjeta: "",
    saldo: "",
    fechaVencimiento: "",
  });

  useEffect(() => {
    if (tipoUsuario === "titular") {
      setAdicionalForm({
        noTarjeta: "",
        saldo: "",
        fechaVencimiento: "",
      });
    } else {
      setTitularForm({
        nombreCliente: "",
        apellidoP: "",
        apellidoM: "",
        correo: "",
        telefono: "",
        contrasenia: "",
        noTarjeta: "",
        saldo: "",
        fechaVencimiento: "",
      });
    }
  }, [tipoUsuario]);

  // if (!isOpen) return null;

  // const busqueda = async () => {
  //   const datosActualizados = {
  //     ...busquedaInput,
  //     IdCentroN: CentroN!,
  //   };

  //   const response = await api.post("/admin/busqueda", {
  //     data: datosActualizados,
  //   });
  //   if (response.data.status === 200) {
  //     console.log(response.data.data );
  //     if(response.data.data === ''){
  //       console.log("error");
  //       setResultBusqueda({
  //         nombreCompleto: 'No Encontrado',
  //         noCliente: 0,
  //       });
  //       return
  //     }
  //     setResultBusqueda(response.data.data);
  //   } 
  // };

  const busqueda = async () => {
  const datosActualizados = {
    ...busquedaInput,
    IdCentroN: CentroN!,
  };

  try {
    const response = await api.post("/admin/busqueda", {
      data: datosActualizados,
    });

    console.log(response.data)

    if (response.data.status === 200) {
      const dataRecibida = response.data.data;

      // 1. Validamos si data es un string vacío, null, undefined, o un objeto sin propiedades {}
      const esDataVacia = !dataRecibida ||  dataRecibida === '' || (typeof dataRecibida === 'object' && Object.keys(dataRecibida).length === 0);

      if (esDataVacia) {
        console.log("Cliente no encontrado");
        setResultBusqueda({
          nombreCompleto: 'No Encontrado',
          noCliente: 0,
        });
        return; // Detenemos la ejecución aquí
      }

      // 2. Si tiene datos, rellenamos el estado con la respuesta de la API
      setResultBusqueda(dataRecibida.resultado);
    }
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
    // Opcional: Manejar el estado de error aquí si la API se cae (500, 404, etc.)
  }
};

  // Manejadores de cambios
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaInput({ ...busquedaInput, [e.target.name]: e.target.value });
  };

  const handleTitularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitularForm({ ...titularForm, [e.target.name]: e.target.value });
  };

  const handleAdicionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdicionalForm({ ...adicionalForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data =
        tipoUsuario === "titular"
          ? { tipo: "titular", idCentroN: CentroN, ...titularForm }
          : {
              tipo: "adicional",
              idCentroN: CentroN,
              idCliente: busquedaInput.IdCliente,
              ...adicionalForm,
            };

      console.log("Datos a enviar:", data);
      if (data.tipo === "titular") {
        const response = await api.post("/admin/agregatarjetahabiente", {
          data,
        });

        if (response.data.status === 200) {
          console.log(response);
          console.log("respuesta exitosa");
          onClose!("1",'');
          return;
        } else {
          setErrorMessage(response.data.error.message);
        }
      } else if (
        !busquedaInput.IdCliente ||
        busquedaInput.IdCliente.trim() === ""
      ) {
        setErrorMessage(
          "No se puede registrar una tarjeta adicional sin un Cliente.",
        );
      } else {
        const response = await api.post(
          "/admin/agregaTarjetahabienteAdicional",
          { data },
        );
        if (response.data.status === 200) {
          console.log(response);
          onClose!("1",'');
        } else {
          setErrorMessage(response.data.error.message);
        }
      }
    } catch (error) {
      console.log("Error del servidor", error);
    }
  };

  const handledClosed = () => {
    onClose!("0",'');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-4xl min-w-md my-auto rounded-2xl bg-[#0d5c75] p-11 shadow-2xl border border-[#146f8c] text-white relative">
        {/* Botón Cerrar (X) */}
        <button
          onClick={() => handledClosed()}
          className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-1">
          <div className="text-emerald-400">
            <svg
              width="33"
              height="21"
              viewBox="0 0 33 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 19.2017V0.964355C0 0.671387 0.0895182 0.439453 0.268555 0.268555C0.447591 0.0895182 0.683594 0 0.976562 0H31.2622C31.5552 0 31.7871 0.0895182 31.958 0.268555C32.137 0.439453 32.2266 0.671387 32.2266 0.964355V19.2017C32.2266 19.4946 32.137 19.7306 31.958 19.9097C31.7871 20.0887 31.5552 20.1782 31.2622 20.1782H0.976562C0.683594 20.1782 0.447591 20.0887 0.268555 19.9097C0.0895182 19.7306 0 19.4946 0 19.2017ZM2.23389 17.1997C2.23389 17.6961 2.47803 17.9443 2.96631 17.9443H29.2603C29.7485 17.9443 29.9927 17.6961 29.9927 17.1997V2.97852C29.9927 2.4821 29.7485 2.23389 29.2603 2.23389H2.96631C2.47803 2.23389 2.23389 2.4821 2.23389 2.97852V17.1997ZM3.50342 16.3818V3.79639C3.50342 3.60107 3.60107 3.50342 3.79639 3.50342H13.3179C12.6831 4.15446 12.1867 5.04557 11.8286 6.17676C11.4705 7.2998 11.2915 8.59782 11.2915 10.0708C11.2915 11.5438 11.4705 12.8499 11.8286 13.9893C12.1948 15.1204 12.6994 16.0156 13.3423 16.6748H3.79639C3.60107 16.6748 3.50342 16.5771 3.50342 16.3818ZM12.7563 10.0708C12.7563 8.80127 12.8906 7.69043 13.1592 6.73828C13.4359 5.78613 13.8224 5.04557 14.3188 4.5166C14.8234 3.98763 15.4053 3.72314 16.0645 3.72314C16.748 3.72314 17.3462 3.98763 17.8589 4.5166C18.3797 5.04557 18.7826 5.78613 19.0674 6.73828C19.3522 7.69043 19.4946 8.80127 19.4946 10.0708C19.4946 11.3403 19.3522 12.4512 19.0674 13.4033C18.7826 14.3555 18.3797 15.1001 17.8589 15.6372C17.3462 16.1662 16.748 16.4307 16.0645 16.4307C15.4053 16.4307 14.8234 16.1662 14.3188 15.6372C13.8224 15.1001 13.4359 14.3555 13.1592 13.4033C12.8906 12.4512 12.7563 11.3403 12.7563 10.0708ZM18.8599 16.6748C19.5109 16.0156 20.0195 15.1204 20.3857 13.9893C20.7601 12.8499 20.9473 11.5438 20.9473 10.0708C20.9473 8.59782 20.7642 7.2998 20.3979 6.17676C20.0317 5.04557 19.5231 4.15446 18.8721 3.50342H28.4302C28.6255 3.50342 28.7231 3.60107 28.7231 3.79639V16.3818C28.7231 16.5771 28.6255 16.6748 28.4302 16.6748H18.8599Z"
                fill="#02FFA2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-(--VerdeNeon)">
            Agregar tarjetahabiente
          </h2>
        </div>
        <p className="text-[16px] text-cyan-100/70 mb-6 font-light">
          Centro de negocio:{" "}
          <span className="text-white font-bold">{centroNegocio}</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete={"off"}
        >
          {/* ================= SECCIÓN TITULAR ================= */}
          <div
            className={`space-y-4 transition-opacity duration-300 ${tipoUsuario !== "titular" ? "opacity-40" : "opacity-100"}`}
          >
            <label className="flex items-center w-[50px] gap-2 font-semibold text-lg cursor-pointer select-none">
              {/* Opción: Titular */}
              <input
                type="radio"
                name="role"
                value="titular"
                checked={tipoUsuario === "titular"}
                onChange={() => setTipoUsuario("titular")}
                className="peer sr-only"
              />

              {/* El fondo del botón cambia usando el estado de React */}
              <div
                className={`flex items-center gap-2 text-white px-4 py-2 rounded-md font-semibold tracking-wide transition-colors`}
              >
                {/* Recuadro del check */}
                <div className="w-5 h-5 flex items-center justify-center border-2 border-[#81c5d4] rounded-md bg-transparent">
                  {/* Si está seleccionado, renderizamos el check de forma segura */}
                  {tipoUsuario === "titular" && (
                    <svg
                      className="w-3 h-3 text-[#81c5d4]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <span className="text-base font-bold">Titular</span>
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="nombreCliente"
                placeholder="*Nombre (s)"
                autoComplete={"off"}
                value={titularForm.nombreCliente}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
              <input
                type="text"
                name="apellidoP"
                placeholder="*Primer apellido"
                autoComplete={"off"}
                value={titularForm.apellidoP}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
              <input
                type="text"
                name="apellidoM"
                autoComplete={"off"}
                placeholder="Segundo apellido"
                value={titularForm.apellidoM}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                className="input-style"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="tel"
                name="telefono"
                placeholder="*Teléfono"
                autoComplete={"off"}
                value={titularForm.telefono}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
              <input
                type="email"
                name="correo"
                placeholder="*Correo"
                autoComplete={"off"}
                value={titularForm.correo}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
              <input
                type="text"
                name="contrasenia"
                placeholder="*Contraseña"
                autoComplete={"off"}
                value={titularForm.contrasenia}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <div className="md:col-span-2">
              </div> */}
              <input
                type="text"
                name="noTarjeta"
                placeholder="*No. de Tarjeta (16 dígitos)"
                autoComplete={"off"}
                value={titularForm.noTarjeta}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                maxLength={16}
                className="input-style"
              />
              <input
                type="number"
                name="saldo"
                placeholder="*Saldo"
                value={titularForm.saldo}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                autoComplete={"off"}
                onChange={handleTitularChange}
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
              <input
                type="text"
                name="fechaVencimiento"
                placeholder="*Fecha de vencimiento (MM/AA)"
                value={titularForm.fechaVencimiento}
                onChange={handleTitularChange}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                disabled={tipoUsuario !== "titular"}
                required={tipoUsuario === "titular"}
                className="input-style"
              />
            </div>
          </div>

          <hr className="border-cyan-800/60 my-6" />

          {/* ================= SECCIÓN TARJETA ADICIONAL ================= */}
          <div
            className={`space-y-4 transition-opacity duration-300 ${tipoUsuario !== "adicional" ? "opacity-40" : "opacity-100"}`}
          >
            <label className="flex items-center w-[200px] gap-2 font-semibold text-lg cursor-pointer select-none">
              <input
                type="radio"
                name="role"
                value="adicional"
                checked={tipoUsuario === "adicional"}
                onChange={() => setTipoUsuario("adicional")}
                className="peer sr-only"
              />
              <div
                className={`flex items-center gap-2 text-white px-4 py-2 rounded-md font-semibold tracking-wide transition-colors`}
              >
                <div className="w-5 h-5 flex items-center justify-center border-2 border-[#81c5d4] rounded-md bg-transparent">
                  {tipoUsuario === "adicional" && (
                    <svg
                      className="w-3 h-3 text-[#81c5d4]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-base font-bold">Tarjeta adicional</span>
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative max-w-xs">
                <input
                  type="text"
                  name="IdCliente"
                  placeholder="No. de Cliente"
                  // value={adicionalForm.}
                  // onChange={handleAdicionalChange}
                  disabled={tipoUsuario !== "adicional"}
                  // required={tipoUsuario === "adicional"}
                  className="input-style pr-10"
                  onChange={handleBusquedaChange}
                />
                <button
                  type="button"
                  onClick={() => {
                    busqueda();
                  }}
                >
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200/50 cursor-pointer">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <span className="text-sm">{resultBusqueda.nombreCompleto}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="noTarjeta"
                placeholder="*No. de Tarjeta (16 dígitos)"
                value={adicionalForm.noTarjeta}
                onChange={handleAdicionalChange}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                disabled={tipoUsuario !== "adicional"}
                required={tipoUsuario === "adicional"}
                maxLength={16}
                className="input-style"
              />
              <input
                type="number"
                name="saldo"
                placeholder="*Saldo"
                value={adicionalForm.saldo}
                onChange={handleAdicionalChange}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                disabled={tipoUsuario !== "adicional"}
                required={tipoUsuario === "adicional"}
                className="input-style"
              />

              <input
                type="text"
                name="fechaVencimiento"
                placeholder="*Fecha de vencimiento (MM/AA)"
                value={adicionalForm.fechaVencimiento}
                onChange={handleAdicionalChange}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Campo obligatorio.",
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
                disabled={tipoUsuario !== "adicional"}
                required={tipoUsuario === "adicional"}
                className="input-style"
              />
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="flex justify-end gap-3 mt-7">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={() => handledClosed()}
              className="px-8 py-2.5 rounded-full bg-[#083543] text-red-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalAgregarCentroNegocios: React.FC<ModalAgregarProps> = ({
  // isOpen,
  title,
  usuarioData,
  tipo,
  onClose,

  // =================================================
  // continuar desde aqui y ver porque no se rellenan los inputs
  // =================================================
}) => {
  const [titularForm, setTitularForm] = useState({
    nombreCentro:  usuarioData?.nombreCentro || "",
    nombreTitular: usuarioData?.nombreTitular || "",
    correoTitular: usuarioData?.correoTitular || "",
    telefonoTitular: usuarioData?.telefonoTitular || "",
    porcentaje: usuarioData?.porcentaje || null,
    idCentroN: usuarioData?.idCentroN || null,
    tipo:tipo || ''
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // if (!isOpen) return null;

  // Manejadores de cambios
  const handleTitularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitularForm({ ...titularForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const data = titularForm;
    const data = {
      ...titularForm,
      idCentroN: Number.parseFloat(titularForm.idCentroN as string)
    }
    // console.log({data});
    const response = await api.post("/admin/agregaCentroNegocios", { data });
    // console.log(response);

    if (response.data.status === 200) {
      // console.log('respuesta exitosa')
      // console.log(response);
      onClose!("1", titularForm.nombreCentro);
    } else {
      setErrorMessage(response.data.error.message);
    }
  };

  const handledClosed = () => {
    onClose!("0", '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-4xl min-w-md my-auto rounded-2xl bg-[#0d5c75] p-11 shadow-2xl border border-[#146f8c] text-white relative">
        {/* Botón Cerrar (X) */}
        <button
          onClick={handledClosed}
          className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-10">
          <div className="text-emerald-400">
            <svg
              width="23"
              height="28"
              viewBox="0 0 23 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9336 27.4219L14.9531 25.6289H20.3789C20.5977 25.6289 20.7578 25.5781 20.8594 25.4766C20.9688 25.375 21.0234 25.2148 21.0234 24.9961V8.05078C21.0234 7.83203 20.9688 7.67188 20.8594 7.57031C20.7578 7.46094 20.5977 7.40625 20.3789 7.40625H15.9375V5.625H20.9648C21.5273 5.625 21.9727 5.80859 22.3008 6.17578C22.6367 6.54297 22.8047 7.03516 22.8047 7.65234V25.4062C22.8047 26.0156 22.6367 26.5039 22.3008 26.8711C21.9727 27.2383 21.5273 27.4219 20.9648 27.4219H13.9336ZM15.9375 13.0312V10.5352H18.5742C18.832 10.5352 18.9609 10.6602 18.9609 10.9102V12.6562C18.9609 12.9062 18.832 13.0312 18.5742 13.0312H15.9375ZM15.9375 17.2852V14.7891H18.5742C18.832 14.7891 18.9609 14.9141 18.9609 15.1641V16.9102C18.9609 17.1602 18.832 17.2852 18.5742 17.2852H15.9375ZM15.9375 21.5273V19.043H18.5742C18.832 19.043 18.9609 19.168 18.9609 19.418V21.1641C18.9609 21.4062 18.832 21.5273 18.5742 21.5273H15.9375ZM1.83984 27.4219C1.27734 27.4219 0.828125 27.2383 0.492188 26.8711C0.164062 26.5039 0 26.0156 0 25.4062V2.01562C0 1.39844 0.164062 0.910156 0.492188 0.550781C0.828125 0.183594 1.27734 0 1.83984 0H15.0234C15.5938 0 16.043 0.183594 16.3711 0.550781C16.6992 0.910156 16.8633 1.39844 16.8633 2.01562V25.4062C16.8633 26.0156 16.6992 26.5039 16.3711 26.8711C16.043 27.2383 15.5938 27.4219 15.0234 27.4219H1.83984ZM2.42578 25.6289H14.4375C14.6562 25.6289 14.8164 25.5781 14.918 25.4766C15.0273 25.375 15.082 25.2148 15.082 24.9961V2.42578C15.082 2.20703 15.0273 2.04688 14.918 1.94531C14.8164 1.83594 14.6562 1.78125 14.4375 1.78125H2.42578C2.21484 1.78125 2.05469 1.83594 1.94531 1.94531C1.83594 2.04688 1.78125 2.20703 1.78125 2.42578V24.9961C1.78125 25.2148 1.83594 25.375 1.94531 25.4766C2.05469 25.5781 2.21484 25.6289 2.42578 25.6289ZM4.78125 8.23828C4.46875 8.23828 4.3125 8.07812 4.3125 7.75781V5.54297C4.3125 5.22266 4.46875 5.0625 4.78125 5.0625H7.05469C7.375 5.0625 7.53516 5.22266 7.53516 5.54297V7.75781C7.53516 8.07812 7.375 8.23828 7.05469 8.23828H4.78125ZM9.79688 8.23828C9.48438 8.23828 9.32812 8.07812 9.32812 7.75781V5.54297C9.32812 5.22266 9.48438 5.0625 9.79688 5.0625H12.0703C12.3906 5.0625 12.5508 5.22266 12.5508 5.54297V7.75781C12.5508 8.07812 12.3906 8.23828 12.0703 8.23828H9.79688ZM4.78125 12.8789C4.46875 12.8789 4.3125 12.7188 4.3125 12.3984V10.1836C4.3125 9.86328 4.46875 9.70312 4.78125 9.70312H7.05469C7.375 9.70312 7.53516 9.86328 7.53516 10.1836V12.3984C7.53516 12.7188 7.375 12.8789 7.05469 12.8789H4.78125ZM9.79688 12.8789C9.48438 12.8789 9.32812 12.7188 9.32812 12.3984V10.1836C9.32812 9.86328 9.48438 9.70312 9.79688 9.70312H12.0703C12.3906 9.70312 12.5508 9.86328 12.5508 10.1836V12.3984C12.5508 12.7188 12.3906 12.8789 12.0703 12.8789H9.79688ZM4.78125 17.5195C4.46875 17.5195 4.3125 17.3594 4.3125 17.0391V14.8242C4.3125 14.5039 4.46875 14.3438 4.78125 14.3438H7.05469C7.375 14.3438 7.53516 14.5039 7.53516 14.8242V17.0391C7.53516 17.3594 7.375 17.5195 7.05469 17.5195H4.78125ZM9.79688 17.5195C9.48438 17.5195 9.32812 17.3594 9.32812 17.0391V14.8242C9.32812 14.5039 9.48438 14.3438 9.79688 14.3438H12.0703C12.3906 14.3438 12.5508 14.5039 12.5508 14.8242V17.0391C12.5508 17.3594 12.3906 17.5195 12.0703 17.5195H9.79688ZM4.99219 26.4844V22.3359C4.99219 21.8594 5.09766 21.5078 5.30859 21.2812C5.52734 21.0469 5.86719 20.9297 6.32812 20.9297H10.5469C11.0078 20.9297 11.3438 21.0469 11.5547 21.2812C11.7734 21.5078 11.8828 21.8594 11.8828 22.3359V26.4844H10.4297V22.7461C10.4297 22.5117 10.3086 22.3945 10.0664 22.3945H6.80859C6.56641 22.3945 6.44531 22.5117 6.44531 22.7461V26.4844H4.99219Z"
                fill="#02FFA2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-(--VerdeNeon)">
            {title}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= PRINCIPAL ================= */}
          <div className="mb-3 ml-3">
            <span className="text-base font-bold">Titular</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombreTitular"
              autoComplete={"off"}
              value={titularForm.nombreTitular}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              required
              placeholder="*Nombre (s)"
              onChange={handleTitularChange}
              className="input-style"
            />
            <input
              type="text"
              name="correoTitular"
              placeholder="*Correo"
              autoComplete={"off"}
              value={titularForm.correoTitular}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              required
              onChange={handleTitularChange}
              className="input-style"
            />
            <input
              type="tel"
              name="telefonoTitular"
              autoComplete={"off"}
              value={titularForm.telefonoTitular}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              required
              placeholder="*No. de Teléfono del titular"
              onChange={handleTitularChange}
              className="input-style"
            />
          </div>

          <div className="mb-3 ml-3">
            <span className="text-base font-bold">Centro de negocios</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            <input
              type="text"
              name="nombreCentro"
              autoComplete={"off"}
              value={titularForm.nombreCentro}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              required
              placeholder="*Denominación del Centro de Negocios "
              onChange={handleTitularChange}
              className="input-style"
            />
            <input
              type="text"
              name="porcentaje"
              autoComplete={"off"}
              value={titularForm.porcentaje}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "Campo obligatorio.",
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              required
              placeholder="*Porcentaje de referencia"
              onChange={handleTitularChange}
              className="input-style"
            />
          </div>
          {/* Botones de acción inferiores */}
          <div className="flex justify-end gap-3 mt-7">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={handledClosed}
              className="px-8 py-2.5 rounded-full bg-[#083543] text-red-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-(--TextoInactivo) p-8 shadow-2xl text-center border border-[#146f8c]">
            <h2 className="text-2xl font-[200] text-white mb-4">
              {errorMessage}
            </h2>
            <button
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
              onClick={() => setErrorMessage(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalDetalleGasto: React.FC<DetalleGastoProps> = ({
  isOpen,
  estatus = true,
  monto,
  nomComercio,
  concepto,
  fechaCargo,
  noOperacion,
  comprobante,
  onCancel,
  onEdit,
}) => {
  // const [comprobanteEditar, setComprobanteEditar] = useState<string | undefined>('')
  // const [idDetalle, setIdDetalle] = useState<number>(0)

  if (!isOpen) return null;

  // setIdDetalle(id)
  // setComprobanteEditar(comprobante)

  const handlevisualizarTiket = () => {
    console.log("visualizando tiket");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-96 my-auto rounded-2xl bg-(--fondo) p-11 shadow-2xl border border-[#146f8c] text-white relative">
        {/* Botón Cerrar (X) */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ================= PRINCIPAL ================= */}
        <div className="flex flex-col items-center jusrify-center gap-0">
          {/* Encabezado */}
          <div className="flex items-center gap-3 mb-2">
            <div className="text-emerald-400">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1406 3.83496C22.2578 3.83496 23.0993 4.11426 23.665 4.67285C24.2308 5.22428 24.5137 6.05501 24.5137 7.16504V18.2832C24.5137 19.3932 24.2451 20.224 23.708 20.7754C23.1709 21.334 22.4225 21.6133 21.4629 21.6133H11.4512C11.7448 21.1048 11.974 20.5605 12.1387 19.9805C12.3034 19.4004 12.3857 18.7988 12.3857 18.1758C12.3857 17.2233 12.2031 16.3317 11.8379 15.501C11.4798 14.6631 10.9821 13.9255 10.3447 13.2881C9.70736 12.6507 8.96973 12.153 8.13184 11.7949C7.29395 11.4297 6.39876 11.2471 5.44629 11.2471V7.16504C5.44629 6.05501 5.72559 5.22428 6.28418 4.67285C6.84993 4.11426 7.69499 3.83496 8.81934 3.83496H21.1406ZM10.7422 4.25391C10.7422 3.45898 10.9284 2.74284 11.3008 2.10547C11.6732 1.46094 12.1781 0.948893 12.8154 0.569336C13.4528 0.189779 14.1725 0 14.9746 0C15.7767 0 16.4964 0.189779 17.1338 0.569336C17.7783 0.948893 18.2868 1.46094 18.6592 2.10547C19.0316 2.74284 19.2178 3.45898 19.2178 4.25391L17.4883 4.26465C17.4883 3.74902 17.3809 3.29427 17.166 2.90039C16.9583 2.50651 16.6647 2.19857 16.2852 1.97656C15.9128 1.7474 15.4759 1.63281 14.9746 1.63281C14.4805 1.63281 14.0436 1.7474 13.6641 1.97656C13.2917 2.19857 12.998 2.50651 12.7832 2.90039C12.5755 3.29427 12.4717 3.74902 12.4717 4.26465L10.7422 4.25391ZM5.45703 23.6328C4.71224 23.6328 4.01042 23.4896 3.35156 23.2031C2.69271 22.9238 2.11263 22.5335 1.61133 22.0322C1.11003 21.5309 0.716146 20.9508 0.429688 20.292C0.143229 19.6331 0 18.9277 0 18.1758C0 17.4238 0.143229 16.722 0.429688 16.0703C0.716146 15.4115 1.11003 14.8314 1.61133 14.3301C2.11263 13.8216 2.69271 13.4277 3.35156 13.1484C4.01042 12.862 4.71224 12.7188 5.45703 12.7188C6.20898 12.7188 6.91439 12.862 7.57324 13.1484C8.2321 13.4277 8.81217 13.818 9.31348 14.3193C9.81478 14.8206 10.2051 15.4007 10.4844 16.0596C10.7708 16.7184 10.9141 17.4238 10.9141 18.1758C10.9141 18.9206 10.7708 19.6224 10.4844 20.2812C10.1979 20.9401 9.80046 21.5202 9.29199 22.0215C8.79069 22.5228 8.21061 22.9167 7.55176 23.2031C6.8929 23.4896 6.19466 23.6328 5.45703 23.6328ZM5.44629 21.5918C5.64681 21.5918 5.80436 21.5309 5.91895 21.4092C6.04069 21.2874 6.10156 21.1299 6.10156 20.9365V18.8311H8.20703C8.40039 18.8311 8.55794 18.7702 8.67969 18.6484C8.80143 18.5339 8.8623 18.3763 8.8623 18.1758C8.8623 17.9753 8.80143 17.8177 8.67969 17.7031C8.55794 17.5814 8.40039 17.5205 8.20703 17.5205H6.10156V15.415C6.10156 15.2217 6.04069 15.0641 5.91895 14.9424C5.80436 14.8206 5.64681 14.7598 5.44629 14.7598C5.24577 14.7598 5.08464 14.8206 4.96289 14.9424C4.84831 15.0641 4.79102 15.2217 4.79102 15.415V17.5205H2.68555C2.49219 17.5205 2.33464 17.5814 2.21289 17.7031C2.09115 17.8177 2.03027 17.9753 2.03027 18.1758C2.03027 18.3763 2.09115 18.5339 2.21289 18.6484C2.33464 18.7702 2.49219 18.8311 2.68555 18.8311H4.79102V20.9365C4.79102 21.1299 4.84831 21.2874 4.96289 21.4092C5.08464 21.5309 5.24577 21.5918 5.44629 21.5918Z"
                  fill="#02FFA2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-(--VerdeNeon)">
              Detalle de Gasto
            </h2>
          </div>
          <p className="text-sm font-[100]">Monto</p>
          <h2 className="font-bold text-[30px] mb-2">{monto}</h2>
          <p className="text-sm font-[100]">Nombre del comercio</p>
          <h3 className="font-bold text-[17px] mb-2">{nomComercio}</h3>
          <p className="text-sm font-[100]">Concepto</p>
          <h3 className="font-bold text-[17px] mb-2">{concepto}</h3>
          <p className="text-sm font-[100]">Fecha de cargo</p>
          <h3 className="font-bold text-[17px] mb-2">{fechaCargo}</h3>
          <p className="text-sm font-[100]">No. de operación</p>
          <h3 className="font-bold text-[17px] mb-2">{noOperacion}</h3>
          <p className="text-sm font-[100]">Comprobante</p>
          <button
            type="button"
            onClick={() => handlevisualizarTiket()}
            className={`px-8 py-2.5 ${comprobante ? "cursor-pointer text-(--blanco)" : " cursor-not-allowed text-(--disabled) opacity-40"}`}
          >
            <svg
              width="19"
              height="24"
              viewBox="0 0 19 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.2168 12.1494C8.96615 12.1494 8.7513 12.2318 8.57227 12.3965C8.40039 12.5612 8.31445 12.7617 8.31445 12.998V16.5537L8.40039 18.165L7.58398 17.3271L6.70312 16.4355C6.62435 16.3568 6.53125 16.2923 6.42383 16.2422C6.31641 16.1849 6.20898 16.1562 6.10156 16.1562C5.85807 16.1562 5.66113 16.2314 5.51074 16.3818C5.36035 16.5251 5.28516 16.7113 5.28516 16.9404C5.28516 17.0693 5.31022 17.1839 5.36035 17.2842C5.41048 17.3844 5.4821 17.4775 5.5752 17.5635L8.5293 20.2812C8.64388 20.3887 8.75488 20.4674 8.8623 20.5176C8.96973 20.5677 9.08789 20.5928 9.2168 20.5928C9.33854 20.5928 9.45312 20.5677 9.56055 20.5176C9.66797 20.4674 9.77897 20.3887 9.89355 20.2812L12.8584 17.5635C12.9515 17.4775 13.0231 17.3844 13.0732 17.2842C13.1234 17.1839 13.1484 17.0693 13.1484 16.9404C13.1484 16.7113 13.0697 16.5251 12.9121 16.3818C12.7546 16.2314 12.5612 16.1562 12.332 16.1562C12.2174 16.1562 12.1064 16.1849 11.999 16.2422C11.8988 16.2923 11.8057 16.3568 11.7197 16.4355L10.8389 17.3271L10.0225 18.165L10.1191 16.5537V12.998C10.1191 12.7617 10.0296 12.5612 9.85059 12.3965C9.67155 12.2318 9.46029 12.1494 9.2168 12.1494ZM3.49121 23.2568C2.33822 23.2568 1.4681 22.9596 0.880859 22.3652C0.29362 21.7708 0 20.8936 0 19.7334V3.52344C0 2.37044 0.29362 1.49674 0.880859 0.902344C1.4681 0.300781 2.33822 0 3.49121 0H8.38965V8.12109C8.38965 9.45312 9.05566 10.1191 10.3877 10.1191H18.4229V19.7334C18.4229 20.8864 18.1292 21.7601 17.542 22.3545C16.9548 22.9561 16.0846 23.2568 14.9316 23.2568H3.49121ZM10.5811 8.55078C10.1729 8.55078 9.96875 8.34668 9.96875 7.93848V0.107422C10.2122 0.136068 10.4557 0.236328 10.6992 0.408203C10.9499 0.580078 11.2077 0.802083 11.4727 1.07422L17.3379 7.02539C17.6172 7.31185 17.8392 7.57682 18.0039 7.82031C18.1758 8.0638 18.276 8.30729 18.3047 8.55078H10.5811Z"
                // fill="white"
              />
            </svg>
          </button>

          {/* Botones de acción inferiores */}
        {estatus && (
          <div className="flex justify-end gap-3 mt-7">
            <button
              type="button"
              onClick={onEdit}
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Editar
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
export const ModalDetalleAbono : React.FC<DetalleGastoProps> = ({
  isOpen,
  estatus = true,
  monto,
  nomComercio,
  concepto,
  fechaCargo,
  noOperacion,
  comprobante,
  onCancel,
  onEdit,
}) => {
  // const [comprobanteEditar, setComprobanteEditar] = useState<string | undefined>('')
  // const [idDetalle, setIdDetalle] = useState<number>(0)

  if (!isOpen) return null;

  // setIdDetalle(id)
  // setComprobanteEditar(comprobante)

  const handlevisualizarTiket = () => {
    console.log("visualizando tiket");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-96 my-auto rounded-2xl bg-(--fondo) p-11 shadow-2xl border border-[#146f8c] text-white relative">
        {/* Botón Cerrar (X) */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-cyan-200 hover:text-white transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ================= PRINCIPAL ================= */}
        <div className="flex flex-col items-center jusrify-center gap-0">
          {/* Encabezado */}
          <div className="flex items-center gap-3 mb-2">
            <div className="text-emerald-400">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1406 3.83496C22.2578 3.83496 23.0993 4.11426 23.665 4.67285C24.2308 5.22428 24.5137 6.05501 24.5137 7.16504V18.2832C24.5137 19.3932 24.2451 20.224 23.708 20.7754C23.1709 21.334 22.4225 21.6133 21.4629 21.6133H11.4512C11.7448 21.1048 11.974 20.5605 12.1387 19.9805C12.3034 19.4004 12.3857 18.7988 12.3857 18.1758C12.3857 17.2233 12.2031 16.3317 11.8379 15.501C11.4798 14.6631 10.9821 13.9255 10.3447 13.2881C9.70736 12.6507 8.96973 12.153 8.13184 11.7949C7.29395 11.4297 6.39876 11.2471 5.44629 11.2471V7.16504C5.44629 6.05501 5.72559 5.22428 6.28418 4.67285C6.84993 4.11426 7.69499 3.83496 8.81934 3.83496H21.1406ZM10.7422 4.25391C10.7422 3.45898 10.9284 2.74284 11.3008 2.10547C11.6732 1.46094 12.1781 0.948893 12.8154 0.569336C13.4528 0.189779 14.1725 0 14.9746 0C15.7767 0 16.4964 0.189779 17.1338 0.569336C17.7783 0.948893 18.2868 1.46094 18.6592 2.10547C19.0316 2.74284 19.2178 3.45898 19.2178 4.25391L17.4883 4.26465C17.4883 3.74902 17.3809 3.29427 17.166 2.90039C16.9583 2.50651 16.6647 2.19857 16.2852 1.97656C15.9128 1.7474 15.4759 1.63281 14.9746 1.63281C14.4805 1.63281 14.0436 1.7474 13.6641 1.97656C13.2917 2.19857 12.998 2.50651 12.7832 2.90039C12.5755 3.29427 12.4717 3.74902 12.4717 4.26465L10.7422 4.25391ZM5.45703 23.6328C4.71224 23.6328 4.01042 23.4896 3.35156 23.2031C2.69271 22.9238 2.11263 22.5335 1.61133 22.0322C1.11003 21.5309 0.716146 20.9508 0.429688 20.292C0.143229 19.6331 0 18.9277 0 18.1758C0 17.4238 0.143229 16.722 0.429688 16.0703C0.716146 15.4115 1.11003 14.8314 1.61133 14.3301C2.11263 13.8216 2.69271 13.4277 3.35156 13.1484C4.01042 12.862 4.71224 12.7188 5.45703 12.7188C6.20898 12.7188 6.91439 12.862 7.57324 13.1484C8.2321 13.4277 8.81217 13.818 9.31348 14.3193C9.81478 14.8206 10.2051 15.4007 10.4844 16.0596C10.7708 16.7184 10.9141 17.4238 10.9141 18.1758C10.9141 18.9206 10.7708 19.6224 10.4844 20.2812C10.1979 20.9401 9.80046 21.5202 9.29199 22.0215C8.79069 22.5228 8.21061 22.9167 7.55176 23.2031C6.8929 23.4896 6.19466 23.6328 5.45703 23.6328ZM5.44629 21.5918C5.64681 21.5918 5.80436 21.5309 5.91895 21.4092C6.04069 21.2874 6.10156 21.1299 6.10156 20.9365V18.8311H8.20703C8.40039 18.8311 8.55794 18.7702 8.67969 18.6484C8.80143 18.5339 8.8623 18.3763 8.8623 18.1758C8.8623 17.9753 8.80143 17.8177 8.67969 17.7031C8.55794 17.5814 8.40039 17.5205 8.20703 17.5205H6.10156V15.415C6.10156 15.2217 6.04069 15.0641 5.91895 14.9424C5.80436 14.8206 5.64681 14.7598 5.44629 14.7598C5.24577 14.7598 5.08464 14.8206 4.96289 14.9424C4.84831 15.0641 4.79102 15.2217 4.79102 15.415V17.5205H2.68555C2.49219 17.5205 2.33464 17.5814 2.21289 17.7031C2.09115 17.8177 2.03027 17.9753 2.03027 18.1758C2.03027 18.3763 2.09115 18.5339 2.21289 18.6484C2.33464 18.7702 2.49219 18.8311 2.68555 18.8311H4.79102V20.9365C4.79102 21.1299 4.84831 21.2874 4.96289 21.4092C5.08464 21.5309 5.24577 21.5918 5.44629 21.5918Z"
                  fill="#02FFA2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-(--VerdeNeon)">
              Detalle de Abono
            </h2>
          </div>
          <p className="text-sm font-[100]">Monto</p>
          <h2 className="font-bold text-[30px] mb-2">{monto}</h2>
          {/* <p className="text-sm font-[100]">Registro</p>
          <h3 className="font-bold text-[17px] mb-2">{nomComercio}</h3> */}
          <p className="text-sm font-[100]">Registro</p>
          <h3 className="font-bold text-[17px] mb-2">{concepto}</h3>
          <p className="text-sm font-[100]">Fecha de abono</p>
          <h3 className="font-bold text-[17px] mb-2">{fechaCargo}</h3>
          <p className="text-sm font-[100]">No. de operación</p>
          <h3 className="font-bold text-[17px] mb-2">{noOperacion}</h3>
          <p className="text-sm font-[100]">Comprobante</p>
          <button
            type="button"
            onClick={() => handlevisualizarTiket()}
            className={`px-8 py-2.5 ${comprobante ? "cursor-pointer text-(--blanco)" : " cursor-not-allowed text-(--disabled) opacity-40"}`}
          >
            <svg
              width="19"
              height="24"
              viewBox="0 0 19 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.2168 12.1494C8.96615 12.1494 8.7513 12.2318 8.57227 12.3965C8.40039 12.5612 8.31445 12.7617 8.31445 12.998V16.5537L8.40039 18.165L7.58398 17.3271L6.70312 16.4355C6.62435 16.3568 6.53125 16.2923 6.42383 16.2422C6.31641 16.1849 6.20898 16.1562 6.10156 16.1562C5.85807 16.1562 5.66113 16.2314 5.51074 16.3818C5.36035 16.5251 5.28516 16.7113 5.28516 16.9404C5.28516 17.0693 5.31022 17.1839 5.36035 17.2842C5.41048 17.3844 5.4821 17.4775 5.5752 17.5635L8.5293 20.2812C8.64388 20.3887 8.75488 20.4674 8.8623 20.5176C8.96973 20.5677 9.08789 20.5928 9.2168 20.5928C9.33854 20.5928 9.45312 20.5677 9.56055 20.5176C9.66797 20.4674 9.77897 20.3887 9.89355 20.2812L12.8584 17.5635C12.9515 17.4775 13.0231 17.3844 13.0732 17.2842C13.1234 17.1839 13.1484 17.0693 13.1484 16.9404C13.1484 16.7113 13.0697 16.5251 12.9121 16.3818C12.7546 16.2314 12.5612 16.1562 12.332 16.1562C12.2174 16.1562 12.1064 16.1849 11.999 16.2422C11.8988 16.2923 11.8057 16.3568 11.7197 16.4355L10.8389 17.3271L10.0225 18.165L10.1191 16.5537V12.998C10.1191 12.7617 10.0296 12.5612 9.85059 12.3965C9.67155 12.2318 9.46029 12.1494 9.2168 12.1494ZM3.49121 23.2568C2.33822 23.2568 1.4681 22.9596 0.880859 22.3652C0.29362 21.7708 0 20.8936 0 19.7334V3.52344C0 2.37044 0.29362 1.49674 0.880859 0.902344C1.4681 0.300781 2.33822 0 3.49121 0H8.38965V8.12109C8.38965 9.45312 9.05566 10.1191 10.3877 10.1191H18.4229V19.7334C18.4229 20.8864 18.1292 21.7601 17.542 22.3545C16.9548 22.9561 16.0846 23.2568 14.9316 23.2568H3.49121ZM10.5811 8.55078C10.1729 8.55078 9.96875 8.34668 9.96875 7.93848V0.107422C10.2122 0.136068 10.4557 0.236328 10.6992 0.408203C10.9499 0.580078 11.2077 0.802083 11.4727 1.07422L17.3379 7.02539C17.6172 7.31185 17.8392 7.57682 18.0039 7.82031C18.1758 8.0638 18.276 8.30729 18.3047 8.55078H10.5811Z"
                // fill="white"
              />
            </svg>
          </button>

          {/* Botones de acción inferiores */}
          {estatus && (
          <div className="flex justify-end gap-3 mt-7">
            <button
              type="button"
              onClick={onEdit}
              className="px-8 py-2.5 rounded-full bg-[#083543] text-emerald-400 font-medium hover:bg-[#05242e] transition-colors border border-cyan-800"
            >
              Editar
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
