import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { api, logoutSession } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Modal, ModalAbono, ModalDetalleAbono, ModalDetalleGasto, ModalGasto } from "../modals/ModalGeneral";

interface AdminContextType {
  centroActivo: string;
  centroId:number;
  idUsuario: string;
}
interface movimientoSelec {
  movimiento:string;
  estatus:boolean;
}
interface selectCliente {
  concepto: string;
  estatus:boolean;
  fechaMovimiento: string;
  idMovimiento: string;
  monto_formateado: string;
  nombreNegocio: string;
  tipoMovimiento: string;
}

interface DetalleGastos{
  Fecha:string;
  comprobante:string;
  concepto:string;
  idMovimiento:string;
  nombreNegocio:string;
  precio:string;
  tipoMovimiento:string;
}
interface InputTarjetahabiente {
  apellidoP: string;
  apellidoM: string;
  correo: string;
  fechaVencimiento: string;
  idCentroN: number | null;
  idTarjeta: number | null;
  noTarjeta: string;
  nombreCliente: string;
  telefono: string;
  noCliente: string;
}

export const AdminHistorialIndividual: React.FC = () => {
  const { centroActivo, centroId, idUsuario } = useOutletContext<AdminContextType>();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [tarjetahabientes, setTarjetahabientes] = useState<any[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  // const [idMovimiento, setIdMovimiento] = useState("");
  const [totalRegistros, setTotalRegistros] = useState(1);
  const [selectedClient, setSelectedClient] = useState<selectCliente>({
    concepto: "",
    estatus: false,
    fechaMovimiento: "",
    idMovimiento: "",
    monto_formateado: "",
    nombreNegocio: "",
    tipoMovimiento: "",
  });
  const [detalleClienteSelecionado, setDetalleClienteSelecionado] = useState<DetalleGastos>({
    Fecha:'',
    comprobante:'',
    concepto:'',
    idMovimiento:'',
    nombreNegocio:'',
    precio:'',
    tipoMovimiento:'',
  });
  const [ seleccionMovimiento, setSeleccionMovimiento ] = useState<movimientoSelec>({movimiento:'', estatus:true})
  const [showModalDetalleAbono, setShowModalDetalleAbono] = useState(false);
  const [showModalDetalleGasto, setShowModalDetalleGasto] = useState(false);
  const [showEditaModalGasto, setShowEditaModalGasto] = useState(false);
  
  const [showEditaModalAbono, setShowEditaModalAbono] = useState(false);
  // const [showModalAbono, setShowModalAbono] = useState(false);
  // const [showModalGasto, setShowModalGasto] = useState(false);
  const [idMovimientoEdicion, setIdMovimientoEdicion] = useState<string>('')
  const [showModalEliminaGasto, setShowModalEliminaGasto] = useState(false);
  const [showModalEliminaAbono, setShowModalEliminaAbono] = useState(false);
  const [showRestaurarGasto, setShowRestaurarGasto] = useState(false);
  const [showRestaurarAbono, setShowRestaurarAbono] = useState(false);
  const [showAgregaModalGasto, setShowAgregaModalGasto] = useState(false);
  const [showAgregaModalAbono, setShowAgregaModalAbono] = useState(false);

  const [busquedaPaginacion, setBusquedaPaginacion] = useState(false);
  const [tipoDatoBusqueda, setTipoDatoBusqueda] = useState(false)
  const [busquedaInput, setBusquedaInput] = useState({
    tipo:"Dashboard",
    IdCentroN:"",
    noTarjeta:null,
    busquedaCliente: null,
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
    const [dataInputs, getDataInput] = useState<InputTarjetahabiente>({
    apellidoP: "",   
    apellidoM: "",      
    correo: "",           
    fechaVencimiento:"",
    idCentroN: null,
    idTarjeta:null,          
    noTarjeta: "",       
    nombreCliente: "",  
    telefono: "",
    noCliente:""
    
  });
   const { data } = location.state || {};
  //  if(!location.state){
  // }else{
    //  }
    
  useEffect(()=>{
    console.log(data)
      getDataInput(data)
  },[data])

   const limitePorPagina = 15; // Cantidad de filas exactas por pantalla según tu diseño

  const busquedaRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  useEffect(()=>{
    cargarDatosPaginados();
  },[data, centroActivo])

  // 🔄 EFFECT: Se ejecuta al cargar la página y cada vez que cambia 'paginaActual'
  const cargarDatosPaginados = async () => {
    setIsLoadingTable(true);
    try {
      // Hacemos la consulta parametrizada al Backend pasando la página actual
      // console.log({datosUsuario:data})
      // console.log({Datos:{centroId:centroId, idTarjeta:data?.idTarjeta, idMovimiento:data}})
      const response = await api.get(
        `/admin/cargaHistoricoIndividualTarjeta?idCentroN=${centroId}&idTarjeta=${data.idTarjeta}&idMovimiento=${data.idMovimiento}&page=${paginaActual}&limit=${limitePorPagina}`,
      );
      // const response = await api.post("/admin/cargaHistoricoIndividualTarjeta", { idTarjeta:data.idTarjeta, idMovimiento:data.idMovimiento});
      console.log(response.data);

      if (response.data.status === 200) {
        const { tarjetahabientes, paginacion } = response.data.data;

        setTarjetahabientes(tarjetahabientes);
        setTotalPaginas(paginacion.totalPaginas);
        setTotalRegistros(paginacion.totalRegistros);

        if (tarjetahabientes.length > 0) {
          setSelectedClient(tarjetahabientes);
          setBusquedaPaginacion(false)
        }else{
          setBusquedaPaginacion(true)
        }
        return;
      }
      console.log("sesion caducada: ", response.data.status);
      endSessionCockie();
    } catch (error) {
      console.error("Error cargando la tabla paginada de red:", error);
    } finally {
      setIsLoadingTable(false);
    }
  };

    // 🔢 FUNCIÓN MAESTRA: Calcula qué números de página mostrar y dónde poner los puntos suspensivos
  const renderNumerosPaginacion = () => {
    const paginas: (number | string)[] = [];

    // Configuración de la ventana visible del paginador
    const rangoVisible = 1; // Cuántas páginas mostrar a la izquierda y derecha de la página actual
    const maxNumerosIniciales = 5; // Cuántos números mostrar seguidos antes de truncar por primera vez

    // CASO 1: Si hay 6 páginas o menos en total, mostramos todos los números sin truncar nada
    if (totalPaginas <= 6) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    }
    // CASO 2: Si hay más de 6 páginas, aplicamos las reglas de puntos suspensivos
    else {
      // Regla de inicio: Si estamos cerca de las primeras páginas
      if (paginaActual <= maxNumerosIniciales - 2) {
        // Mostramos del 1 al 4 seguidos
        for (let i = 1; i <= maxNumerosIniciales - 1; i++) {
          paginas.push(i);
        }
        paginas.push("...right"); // Puntos suspensivos a la derecha
        paginas.push(totalPaginas); // Siempre mostramos la última página al final
      }
      // Regla de fin: Si estamos cerca de las últimas páginas (el número después del 2 se convierte en ...)
      else if (paginaActual >= totalPaginas - (maxNumerosIniciales - 3)) {
        paginas.push(1); // Siempre mostramos la primera página al inicio
        paginas.push("...left"); // Puntos suspensivos a la izquierda (el número después del 2 se esconde)

        // Mostramos las últimas 4 páginas seguidas
        for (
          let i = totalPaginas - (maxNumerosIniciales - 2);
          i <= totalPaginas;
          i++
        ) {
          paginas.push(i);
        }
      }
      // Regla intermedia: Si estamos navegando por el centro de la lista (Puntos suspensivos a ambos lados)
      else {
        paginas.push(1);
        paginas.push("...left");

        // Bloque central dinámico que acompaña a la página actual
        for (
          let i = paginaActual - rangoVisible;
          i <= paginaActual + rangoVisible;
          i++
        ) {
          paginas.push(i);
        }

        paginas.push("...right");
        paginas.push(totalPaginas);
      }
    }

    // Dibujamos los componentes en el HTML/JSX basándonos en el arreglo calculado arriba
    return paginas.map((pag, index) => {
      // Si el elemento es un string de puntos suspensivos, pintamos texto plano no cliqueable
      if (typeof pag === "string") {
        return (
          <span
            key={`dots-${index}`}
            className="px-1 text-(--VerdeNeon) font-bold select-none tracking-widest"
          >
            ...
          </span>
        );
      }

      // Si es un número, pintamos tu botón interactivo tradicional
      return (
        <button
          type="button"
          key={`page-${pag}`}
          onClick={() => setPaginaActual(pag)}
          className={`pagination-btn ${paginaActual === pag ? "active" : ""}`}
        >
          {pag}
        </button>
      );
    });
  };

  const cancelarBusqueda = () => {
    busquedaRef.current!.value = "";
    setBusquedaPaginacion(false)
    cargarDatosPaginados()
  }

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorStr = e.target.value ;
    setTipoDatoBusqueda(false)
    
    // Expresión regular para validar si contiene solo números
    const esNumero = /^\d+$/.test(valorStr);

    setBusquedaInput((prev:any) => {
      // 1. Si es número y no supera los 16 dígitos, se guarda en noTarjeta
      if (esNumero) {
        setTipoDatoBusqueda(true)
        // if(valorStr.length === 16){
          return {
            ...prev,
            // paramBusqueda: valorStr,
            noTarjeta: valorStr,
            busquedaCliente: null, // Limpiamos el otro campo
          };
        
      } 
      // 2. Si es string (o un número que excede los 16 dígitos), se guarda en busquedaCliente
      return {
        ...prev,
        // paramBusqueda: valorStr,
        noTarjeta: null, // Limpiamos el otro campo
        busquedaCliente: valorStr === '' ? null:valorStr,
      };
    });
  };

      const busqueda = async () => {
      // console.log({datosBusqueda:busquedaInput})
      
      if(busquedaInput.noTarjeta === null && busquedaInput.busquedaCliente === null ) return

      // console.log('pase el filtro')
      if(tipoDatoBusqueda){
       const longitud = String(busquedaInput.noTarjeta).length;
      //  console.log(longitud)
        if(longitud !== 16){
          setErrorMessage("Para buscar por número de tarjeta debe de tener 16 dígitos");
          return
        }
      }

    const datosCompletos = {
      ...busquedaInput,
      IdCentroN:centroId
    }

    // console.log({data:datosCompletos})
    const response = await api.post("/admin/busqueda", {
      data: datosCompletos,
    });
    // console.log(response.data.data);
    if (response.data.data.resultado[2].length !== 0) {
      // console.log(response.data.data.resultado[0][0].TotalRegistros);
      setBusquedaPaginacion(true)
      setTarjetahabientes(response.data.data.resultado[2])
      setTotalRegistros(response.data.data.resultado[0][0].TotalRegistros);
      return
    } 
    setBusquedaPaginacion(false)

  };

  const selecionaClienteHistorico = (mov:string, estatus:boolean) => {
    setSeleccionMovimiento(
      {
        movimiento:mov,
        estatus: estatus
      }
    )
  }

  const handleEditarGasto = () => {
    console.log("Editando detalle de Gasto");
    setShowModalDetalleGasto(false);
    setIdMovimientoEdicion(detalleClienteSelecionado?.idMovimiento)
    setShowEditaModalGasto(true)
  };
  const handleEditarAbono = () => {
    console.log("Editando detalle de Abono");
    setShowModalDetalleAbono(false);
    setIdMovimientoEdicion(detalleClienteSelecionado?.idMovimiento)
    setShowEditaModalAbono(true)
  };
  const handleDetalleMovimientoGasto = async ( id:number ) => {
    try{
      const response = await api.post("/admin/detalleGastos", { id });

      if( response.data.status === 200 ){
        console.log(response.data.data.datos)
       setShowModalDetalleGasto(true); 
       setDetalleClienteSelecionado(response.data.data.datos)
       return
      }
    
      // console.log("sesion caducada: ", response.data.status);
      // endSessionCockie();

    } catch (error) {
      console.error("Error cargando los detalles del tarjetahabiente:", error);
    }
  }

  const handleDetalleMovimientoAbono = async ( id:number ) => {
    try{
      const response = await api.post("/admin/detalleGastos", { id });

      if( response.data.status === 200 ){
        // console.log('abono')
        console.log(response.data.data)
       setShowModalDetalleAbono(true); 
       setDetalleClienteSelecionado(response.data.data.datos)
       return
      }
    
      // console.log("sesion caducada: ", response.data.status);
      // endSessionCockie();

    } catch (error) {
      console.error("Error cargando los detalles del tarjetahabiente:", error);
    }
  }

  const handleEliminaGasto = (resultado: '1' | '0') => {
    setShowModalEliminaGasto(false); // Cerramos el modal

    // 3. Si se cumple la condición del "ok", se ejecuta la API aquí mismo
    if (resultado === '1') {
      console.log('Se Elimino la tarjeta correctamente' )
      // setBtnTarjetahabientes(true)
      // setDetallesCliente(null)
       if(busquedaPaginacion){
          busquedaRef.current!.value = "";
          setBusquedaPaginacion(false)
        }
      cargarDatosPaginados();
    }
    
  };
  const handleEliminaAbono = (resultado: '1' | '0') => {
    setShowModalEliminaAbono(false); // Cerramos el modal

    // 3. Si se cumple la condición del "ok", se ejecuta la API aquí mismo
    if (resultado === '1') {
      console.log('Se Elimino la tarjeta correctamente' )
      // setBtnTarjetahabientes(true)
      // setDetallesCliente(null)
       if(busquedaPaginacion){
          busquedaRef.current!.value = "";
          setBusquedaPaginacion(false)
        }
      cargarDatosPaginados();
    }
    
  };

  const handledRestaurarGasto = async (resultado: '1' | '0') => {
    setShowRestaurarGasto(false);
    
    if (resultado === '0') {
      console.log('registro Restaurado: ',limpiarANumero(seleccionMovimiento.movimiento) )
      const response = await api.post("/admin/reactivaGastoAbono", { data:{idMovimiento:limpiarANumero(seleccionMovimiento.movimiento)} });
      console.log(response)
      if( response.data.status === 200 ){
        console.log('respuesta bien 2')
        // setBtnTarjetahabientes(true)
        // setDetallesCliente(null)
        // if(busquedaPaginacion){
          //   busquedaRef.current!.value = "";
          //   setBusquedaPaginacion(false)
          // }
          cargarDatosPaginados();
        }
      }
    };
    const handledRestaurarAbono = async (resultado: '1' | '0') => {
      setShowRestaurarAbono(false);
      
      if (resultado === '0') {
        console.log('registro Restaurado: ',limpiarANumero(seleccionMovimiento.movimiento) )
        const response = await api.post("/admin/reactivaGastoAbono", { data:{idMovimiento:limpiarANumero(seleccionMovimiento.movimiento)} });
        console.log(response)
        if( response.data.status === 200 ){
          console.log('respuesta bien 1')
          // setBtnTarjetahabientes(true)
        // setDetallesCliente(null)
        // if(busquedaPaginacion){
        //   busquedaRef.current!.value = "";
        //   setBusquedaPaginacion(false)
        // }
        cargarDatosPaginados();
      }
    }
  };

    const handleAgregaAbono = (resultado: '1' | '0') => {
    
    showEditaModalAbono ? ( setShowEditaModalAbono(false) ):( setShowAgregaModalAbono(false) )
        
        setIdMovimientoEdicion('')
    // 3. Si se cumple la condición del "ok", se ejecuta la API aquí mismo
    if (resultado === '1') {
      console.log('Se agrego gasto correctamente' )
      // detalleClienteGastoAbono(dataInputs?.idTarjeta)
      cargarDatosPaginados()
      

    }
    
  };

    const handleAgregaGasto = (resultado: '1' | '0') => {
      showEditaModalGasto ? (setShowEditaModalGasto(false)):(setShowAgregaModalGasto(false))
    // setShowModalGasto(false); 
    //     setShowEditaModalGasto(false)
    //     setIdMovimientoEdicion('')
    // 3. Si se cumple la condición del "ok", se ejecuta la API aquí mismo
    if (resultado === '1') {
      console.log('Se agrego gasto correctamente' )
      // cargosGlobales(centroId)
      // detalleClienteGastoAbono(dataInputs?.idTarjeta)
      cargarDatosPaginados()

    }
    
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // 1. Avisamos al backend para que limpie cookies y ejecute el SP de SQL Server
    await logoutSession();

    // 2. Limpiamos el estado global en el Frontend de React
    logout();

    // 3. Redirigimos al Login borrando el historial de navegación
    navigate("/", { replace: true });
  };

  const endSessionCockie = () => {
    setIsLoggingOut(true);
    // 2. Limpiamos el estado global en el Frontend de React
    logout();
    // 3. Redirigimos al Login borrando el historial de navegación
    navigate("/", { replace: true });
  };

    function limpiarANumero(textoMoneda: string): number {
    // 1. Quitar todo lo que NO sea un número o un punto decimal
    const numeroLimpio = textoMoneda.replace(/[^\d.]/g, '');
  
    // 2. Convertir a número con decimales (eliminamos Math.round)
    return parseFloat(numeroLimpio);
  }

   const formatDigitoBancarios = (tarjeta: string): string => {
    return tarjeta
      .replace(/\D/g, "")       // 1. Elimina todo lo que no sea número
      .slice(0, 16)             // 2. Limita a un máximo de 16 dígitos
      .replace(/(.{4})/g, "$1 ") // 3. Agrupa de 4 en 4 dejando un espacio
      .trim();                  // 4. Quita el espacio final sobrante
  };

  const formatearParaInput = (fechaString: string): string => {
    // 1. Dividir el string "19/09/2026" por sus barras diagonales
    const [dia, mes, anio] = fechaString.split('/');

    // 2. Crear el objeto Date nativo (Restamos 1 al mes porque en JS los meses van de 0 a 11)
    const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));

    // 3. Extraer los componentes asegurando que tengan dos dígitos (ej: "09")
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');

    // 4. Retornar el formato "YYYY-MM-DD" que requiere el <input type="date">
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <>
    <div className="flex flex-col gap-4 w-full h-full pr-6">
      <div className="flex flex-col w-full pt-2">
        <div className="top-bar-user-historial">
          {/* <span className="w-2 h-2 rounded-full bg-emerald-400"></span> */}
            <div className="top-bar-user">
                <span>
                    <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M10.3125 20.625C8.89974 20.625 7.57161 20.3548 6.32812 19.8145C5.08464 19.2806 3.98763 18.5384 3.03711 17.5879C2.08659 16.6439 1.34115 15.5501 0.800781 14.3066C0.266927 13.0632 0 11.7318 0 10.3125C0 8.89974 0.266927 7.57161 0.800781 6.32812C1.34115 5.08464 2.08333 3.98763 3.02734 3.03711C3.97786 2.08659 5.07487 1.3444 6.31836 0.810547C7.56836 0.270182 8.89974 0 10.3125 0C11.7253 0 13.0534 0.270182 14.2969 0.810547C15.5469 1.3444 16.6439 2.08659 17.5879 3.03711C18.5384 3.98763 19.2839 5.08464 19.8242 6.32812C20.3646 7.57161 20.6348 8.89974 20.6348 10.3125C20.6348 11.7318 20.3646 13.0632 19.8242 14.3066C19.2839 15.5501 18.5384 16.6439 17.5879 17.5879C16.6439 18.5384 15.5501 19.2806 14.3066 19.8145C13.0632 20.3548 11.7318 20.625 10.3125 20.625ZM10.3125 18.0566C11.3867 18.0566 12.3926 17.8548 13.3301 17.4512C14.2676 17.054 15.0911 16.5039 15.8008 15.8008C16.5104 15.0911 17.0638 14.2676 17.4609 13.3301C17.8646 12.3926 18.0664 11.3867 18.0664 10.3125C18.0664 9.23828 17.8646 8.23568 17.4609 7.30469C17.0573 6.36719 16.5007 5.54362 15.791 4.83398C15.0879 4.12435 14.2676 3.57096 13.3301 3.17383C12.3926 2.77018 11.3867 2.56836 10.3125 2.56836C9.23828 2.56836 8.23242 2.77018 7.29492 3.17383C6.36393 3.57096 5.54362 4.12435 4.83398 4.83398C4.12435 5.54362 3.57096 6.36719 3.17383 7.30469C2.77669 8.23568 2.57812 9.23828 2.57812 10.3125C2.57812 11.3867 2.77669 12.3926 3.17383 13.3301C3.57096 14.2676 4.12435 15.0911 4.83398 15.8008C5.54362 16.5039 6.36719 17.054 7.30469 17.4512C8.24219 17.8548 9.24479 18.0566 10.3125 18.0566ZM10.3125 7.98828C9.84375 7.98828 9.44987 7.8125 9.13086 7.46094C8.81185 7.10938 8.64909 6.67643 8.64258 6.16211C8.64258 5.68034 8.80534 5.26367 9.13086 4.91211C9.45638 4.55404 9.85026 4.375 10.3125 4.375C10.7747 4.375 11.1654 4.55404 11.4844 4.91211C11.8099 5.26367 11.9727 5.68034 11.9727 6.16211C11.9727 6.67643 11.8132 7.10938 11.4941 7.46094C11.1751 7.8125 10.7812 7.98828 10.3125 7.98828ZM7.54883 11.6504C7.34701 11.6504 7.1875 11.5983 7.07031 11.4941C6.95964 11.39 6.9043 11.25 6.9043 11.0742C6.9043 10.8529 6.97917 10.6022 7.12891 10.3223C7.27865 10.0423 7.49674 9.77214 7.7832 9.51172C8.07617 9.2513 8.43424 9.03646 8.85742 8.86719C9.2806 8.69792 9.76562 8.61328 10.3125 8.61328C10.8594 8.61328 11.3411 8.69792 11.7578 8.86719C12.181 9.03646 12.5391 9.2513 12.832 9.51172C13.125 9.77214 13.3464 10.0423 13.4961 10.3223C13.6458 10.6022 13.7207 10.8529 13.7207 11.0742C13.7207 11.25 13.6654 11.39 13.5547 11.4941C13.444 11.5983 13.2845 11.6504 13.0762 11.6504H7.54883ZM6.55273 15.4688C6.39648 15.4688 6.25977 15.4134 6.14258 15.3027C6.0319 15.1921 5.97656 15.0553 5.97656 14.8926C5.97656 14.7363 6.0319 14.6029 6.14258 14.4922C6.25977 14.3815 6.39648 14.3262 6.55273 14.3262H6.62109V13.3984C6.62109 13.0859 6.70898 12.8418 6.88477 12.666C7.06055 12.4837 7.30794 12.3926 7.62695 12.3926H12.998C13.3236 12.3926 13.571 12.4837 13.7402 12.666C13.916 12.8418 14.0039 13.0859 14.0039 13.3984V14.3262H14.0723C14.2285 14.3262 14.362 14.3815 14.4727 14.4922C14.5898 14.6029 14.6484 14.7363 14.6484 14.8926C14.6484 15.0553 14.5898 15.1921 14.4727 15.3027C14.362 15.4134 14.2285 15.4688 14.0723 15.4688H6.55273ZM9.3457 14.3359H11.2793C11.3965 14.3359 11.4941 14.2969 11.5723 14.2188C11.6569 14.1406 11.6992 14.043 11.6992 13.9258C11.6992 13.8151 11.6569 13.7207 11.5723 13.6426C11.4941 13.5645 11.3965 13.5254 11.2793 13.5254H9.3457C9.22852 13.5254 9.13086 13.5645 9.05273 13.6426C8.97461 13.7207 8.93555 13.8151 8.93555 13.9258C8.93555 14.043 8.97461 14.1406 9.05273 14.2188C9.13086 14.2969 9.22852 14.3359 9.3457 14.3359Z"
                        fill="#02FFA2"
                    />
                    </svg>
                </span>
                Usuario:
                <span className="font-bold">
                    {user?.nombreCompleto || "Usuario Autenticado"}
                </span>
            </div>

            {/* Botones de Control de Sesión Superior */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center pl-2 py-1">
                    <div className="px-6 pb-1 pt-2 bg-(--MediumBlue) rounded-xl items-center">
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        <svg
                        width="13"
                        height="15"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M8.23828 11.3613V7.40039C8.23828 7.2793 8.20117 7.18359 8.12695 7.11328C8.05664 7.03906 7.96094 7.00195 7.83984 7.00195H5.67188C5.55078 7.00195 5.45117 7.03906 5.37305 7.11328C5.29883 7.18359 5.26172 7.2793 5.26172 7.40039V11.3613H8.23828ZM1.67578 10.8926V5.86523L6.39258 1.9043C6.63477 1.70117 6.87695 1.70117 7.11914 1.9043L11.8418 5.86523V10.8926C11.8418 11.2676 11.7363 11.5586 11.5254 11.7656C11.3145 11.9727 11.0195 12.0762 10.6406 12.0762H2.88281C2.50391 12.0762 2.20703 11.9727 1.99219 11.7656C1.78125 11.5586 1.67578 11.2676 1.67578 10.8926ZM0 5.57227C0 5.45117 0.0507812 5.34961 0.152344 5.26758L6.13477 0.246094C6.33008 0.0820312 6.53906 0 6.76172 0C6.98438 0 7.19336 0.0820312 7.38867 0.246094L13.3594 5.26758C13.457 5.34961 13.5059 5.45508 13.5059 5.58398C13.5059 5.68945 13.4688 5.77344 13.3945 5.83594C13.3203 5.89453 13.2324 5.92383 13.1309 5.92383C13.0684 5.92383 13.0117 5.91016 12.9609 5.88281C12.9102 5.85156 12.8633 5.81836 12.8203 5.7832L6.99023 0.890625C6.91211 0.820312 6.83398 0.787109 6.75586 0.791016C6.67773 0.791016 6.60352 0.824219 6.5332 0.890625L0.697266 5.7832C0.650391 5.81836 0.601562 5.85156 0.550781 5.88281C0.5 5.91016 0.443359 5.92383 0.380859 5.92383C0.263672 5.92383 0.169922 5.88867 0.0996094 5.81836C0.0332031 5.74414 0 5.66211 0 5.57227ZM10.5938 3.24609V1.60547C10.5938 1.5 10.627 1.41602 10.6934 1.35352C10.7598 1.29102 10.8438 1.25977 10.9453 1.25977H11.4961C11.5977 1.25977 11.6797 1.29102 11.7422 1.35352C11.8086 1.41602 11.8418 1.5 11.8418 1.60547V4.30078L10.5938 3.24609Z"
                            fill="#D9D9D9"
                        />
                        </svg>
                    </button>
                    </div>
                    <label htmlFor="inicio" className="font-light text-(--blanco) text-[12px]">
                    Inicio
                    </label>
                </div>
                <div className="flex flex-col items-center">
                    <div className="px-6 pb-1 pt-2 bg-(--MediumBlue) rounded-xl items-center">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-(--MediumBlue) transition-all cursor-pointer"
                    >
                        <svg
                        width="10"
                        height="15"
                        viewBox="0 0 10 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M0.416992 14.2324C0.30306 14.2324 0.205078 14.1914 0.123047 14.1094C0.0410156 14.0273 0 13.9294 0 13.8154V1.13477C0 0.792969 0.107096 0.519531 0.321289 0.314453C0.535482 0.104818 0.818034 0 1.16895 0H8.70215C9.05762 0 9.34245 0.104818 9.55664 0.314453C9.77083 0.519531 9.87793 0.792969 9.87793 1.13477V13.8154C9.87793 13.9294 9.83691 14.0273 9.75488 14.1094C9.67285 14.1914 9.57487 14.2324 9.46094 14.2324C9.33789 14.2324 9.23535 14.1914 9.15332 14.1094C9.07129 14.0273 9.03027 13.9294 9.03027 13.8154V1.20312C9.03027 0.961589 8.91634 0.84082 8.68848 0.84082H1.18945C0.961589 0.84082 0.847656 0.961589 0.847656 1.20312V13.8154C0.847656 13.9294 0.806641 14.0273 0.724609 14.1094C0.642578 14.1914 0.540039 14.2324 0.416992 14.2324ZM1.72949 14.0137C1.611 14.0137 1.55176 13.9544 1.55176 13.8359V1.72266C1.55176 1.59961 1.611 1.53809 1.72949 1.53809H8.14844C8.26693 1.53809 8.32617 1.59961 8.32617 1.72266V13.8359C8.32617 13.9544 8.26693 14.0137 8.14844 14.0137H1.72949ZM6.76074 8.36719C6.90202 8.36719 7.02051 8.31934 7.11621 8.22363C7.21191 8.12793 7.25977 8.00944 7.25977 7.86816C7.25977 7.72689 7.21191 7.6084 7.11621 7.5127C7.02051 7.41699 6.90202 7.36914 6.76074 7.36914C6.61947 7.36914 6.50098 7.41699 6.40527 7.5127C6.30957 7.6084 6.26172 7.72689 6.26172 7.86816C6.26172 8.00944 6.30957 8.12793 6.40527 8.22363C6.50098 8.31934 6.61947 8.36719 6.76074 8.36719Z"
                            fill="#02FFA2"
                        />
                        </svg>
                    </button>
                    </div>
                    <label htmlFor="inicio" className="font-light text-(--blanco) text-[12px]">
                    Salir
                    </label>
                </div>
{/* ========================================================================================================= */}
                <div className="flex flex-col items-center pl-7 py-1">
                    <div className="px-6 pb-1 pt-2 bg-(--MediumBlue) rounded-xl items-center">
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={()=>setShowAgregaModalAbono(true)}
                    >
                      <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6.68359V4.88574H7.71094V6.68359H0ZM2.95312 9.54785V2.02148H4.75098V9.54785H2.95312Z" fill="#02FFA2"/>
                      <path d="M13.6914 9.55664H15.3662C15.5667 9.55664 15.7285 9.49512 15.8516 9.37207C15.9746 9.24902 16.0361 9.0918 16.0361 8.90039V7.63574C16.0361 7.43978 15.9746 7.28255 15.8516 7.16406C15.7285 7.04102 15.5667 6.97949 15.3662 6.97949H13.6914C13.4909 6.97949 13.3291 7.04102 13.2061 7.16406C13.083 7.28255 13.0215 7.43978 13.0215 7.63574V8.90039C13.0215 9.0918 13.083 9.24902 13.2061 9.37207C13.3291 9.49512 13.4909 9.55664 13.6914 9.55664ZM10.8955 4.30664H18.9277H26.96V2.75488H10.8955V4.30664ZM13.042 11.6758C12.3265 11.6758 11.7887 11.498 11.4287 11.1426C11.0732 10.7917 10.8955 10.2653 10.8955 9.56348V2.11914C10.8955 1.41276 11.0732 0.884115 11.4287 0.533203C11.7887 0.177734 12.3265 0 13.042 0H24.8135C25.529 0 26.0645 0.177734 26.4199 0.533203C26.7799 0.888672 26.96 1.41732 26.96 2.11914V9.56348C26.96 10.2653 26.7799 10.7917 26.4199 11.1426C26.0645 11.498 25.529 11.6758 24.8135 11.6758H13.042Z" fill="#02FFA2"/>
                      </svg>
                    </button>
                    </div>
                    <label htmlFor="inicio" className="font-light text-(--blanco) text-[12px]">
                    Abono
                    </label>
                </div>
                <div className="flex flex-col items-center">
                    <div className="px-6 pb-1 pt-2 bg-(--MediumBlue) rounded-xl items-center">
                    <button
                        type="button"
                        className="bg-(--MediumBlue) transition-all cursor-pointer"
                        onClick={()=>setShowAgregaModalGasto(true)}
                    >
                      <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.8828 2.44043C23.5938 2.44043 24.1292 2.61816 24.4893 2.97363C24.8493 3.32454 25.0293 3.85319 25.0293 4.55957V11.6348C25.0293 12.3411 24.8584 12.8698 24.5166 13.2207C24.1748 13.5762 23.6986 13.7539 23.0879 13.7539H16.7168C16.9036 13.4303 17.0495 13.084 17.1543 12.7148C17.2591 12.3457 17.3115 11.9629 17.3115 11.5664C17.3115 10.9603 17.1953 10.3929 16.9629 9.86426C16.735 9.33105 16.4183 8.86165 16.0127 8.45605C15.6071 8.05046 15.1377 7.73372 14.6045 7.50586C14.0713 7.27344 13.5016 7.15723 12.8955 7.15723V4.55957C12.8955 3.85319 13.0732 3.32454 13.4287 2.97363C13.7887 2.61816 14.3265 2.44043 15.042 2.44043H22.8828ZM16.2656 2.70703C16.2656 2.20117 16.3841 1.74544 16.6211 1.33984C16.8581 0.929688 17.1794 0.603841 17.585 0.362305C17.9906 0.120768 18.4486 0 18.959 0C19.4694 0 19.9274 0.120768 20.333 0.362305C20.7432 0.603841 21.0667 0.929688 21.3037 1.33984C21.5407 1.74544 21.6592 2.20117 21.6592 2.70703L20.5586 2.71387C20.5586 2.38574 20.4902 2.09635 20.3535 1.8457C20.2214 1.59505 20.0345 1.39909 19.793 1.25781C19.556 1.11198 19.278 1.03906 18.959 1.03906C18.6445 1.03906 18.3665 1.11198 18.125 1.25781C17.888 1.39909 17.7012 1.59505 17.5645 1.8457C17.4323 2.09635 17.3662 2.38574 17.3662 2.71387L16.2656 2.70703ZM12.9023 15.0391C12.4284 15.0391 11.9818 14.9479 11.5625 14.7656C11.1432 14.5879 10.7741 14.3395 10.4551 14.0205C10.1361 13.7015 9.88542 13.3324 9.70312 12.9131C9.52083 12.4938 9.42969 12.0449 9.42969 11.5664C9.42969 11.0879 9.52083 10.6413 9.70312 10.2266C9.88542 9.80729 10.1361 9.43815 10.4551 9.11914C10.7741 8.79557 11.1432 8.54492 11.5625 8.36719C11.9818 8.1849 12.4284 8.09375 12.9023 8.09375C13.3809 8.09375 13.8298 8.1849 14.249 8.36719C14.6683 8.54492 15.0374 8.79329 15.3564 9.1123C15.6755 9.43132 15.9238 9.80046 16.1016 10.2197C16.2839 10.639 16.375 11.0879 16.375 11.5664C16.375 12.0404 16.2839 12.487 16.1016 12.9062C15.9193 13.3255 15.6663 13.6947 15.3428 14.0137C15.0238 14.3327 14.6546 14.5833 14.2354 14.7656C13.8161 14.9479 13.3717 15.0391 12.9023 15.0391ZM11.1387 11.9834H14.6523C14.7663 11.9834 14.8643 11.9401 14.9463 11.8535C15.0329 11.7715 15.0762 11.6758 15.0762 11.5664C15.0762 11.457 15.0329 11.3613 14.9463 11.2793C14.8643 11.1927 14.7663 11.1494 14.6523 11.1494H11.1387C11.0247 11.1494 10.9268 11.1927 10.8447 11.2793C10.7627 11.3613 10.7217 11.457 10.7217 11.5664C10.7217 11.6758 10.7627 11.7715 10.8447 11.8535C10.9268 11.9401 11.0247 11.9834 11.1387 11.9834Z" fill="#02FFA2"/>
                      <path d="M0 8.72949V6.93164H7.71094V8.72949H0ZM2.95312 11.5938V4.06738H4.75098V11.5938H2.95312Z" fill="#02FFA2"/>
                      </svg>
                    </button>
                    </div>
                    <label htmlFor="inicio" className="font-light text-(--blanco) text-[12px]">
                    Gasto
                    </label>
                </div>
            </div>
        </div>


        {/* Tarjeta de Métricas Globales del Centro */}
        <section className="pt-1 pb-0 flex flex-col">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight pl-4">
                Historial individual de operaciones
              </h1>
              <div className="flex flex-col justify-start pl-4 pt-2">
                <div className="flex justify-start">
                  <p className="text-sm  text-write  font-[200] text-[16px]">
                    Tarjethabiente:{" "}
                    <span className="font-bold ">{`${dataInputs?.nombreCliente} ${dataInputs.apellidoP} ${dataInputs.apellidoM}`}</span>
                  </p>
                </div>
                <div className="flex justify-start">
                  <p className="text-sm  text-write  font-[200] text-[16px]">
                    Cta:{" "}
                    <span className="font-bold ">{dataInputs?.noTarjeta}</span>
                  </p>
                </div>
                <div className="flex justify-start">
                  <p className="text-sm  text-write  font-[200] text-[16px]">
                    No. Cliente:{" "}
                    <span className="font-bold ">{dataInputs?.noCliente}</span>
                  </p>
                </div>
              </div>
            </div>

              <div className="relative max-w-xl pl-3">
                <input
                  type="text"
                  name="paramBusqueda"
                  autoComplete={"off"}
                  placeholder="No. de Cliente"
                  className="pr-10 search-input-box"
                  ref={busquedaRef}
                  onChange={handleBusquedaChange}
                />
                {busquedaPaginacion ? (
                <button
                  type="button"
                  onClick={() => {
                    cancelarBusqueda();
                  }}
                  >
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200/50 cursor-pointer">
                    <svg
                      className="h-5 w-5"
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
                  </span>
                </button>
                ) : (
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

                ) }


              </div>


            {/* <div className="flex ">
              <div className="relative pl-3">
                <input
                  type="text"
                  placeholder="No. de tarjeta o nombre de tarjethabiente"
                  className="search-input-box"
                />
                <span className="absolute right-4 top-3 text-slate-400 text-xs cursor-pointer">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 5.45508C0 4.70312 0.141276 3.99902 0.423828 3.34277C0.70638 2.68197 1.09831 2.10091 1.59961 1.59961C2.10091 1.09831 2.67969 0.70638 3.33594 0.423828C3.99674 0.141276 4.70312 0 5.45508 0C6.20703 0 6.91113 0.141276 7.56738 0.423828C8.22819 0.70638 8.80924 1.09831 9.31055 1.59961C9.81185 2.10091 10.2038 2.68197 10.4863 3.34277C10.7689 3.99902 10.9102 4.70312 10.9102 5.45508C10.9102 6.07943 10.8099 6.67188 10.6094 7.23242C10.4134 7.79297 10.14 8.30111 9.78906 8.75684L13.1318 12.1201C13.2048 12.193 13.2594 12.2773 13.2959 12.373C13.3369 12.4688 13.3574 12.5713 13.3574 12.6807C13.3574 12.8311 13.3232 12.9678 13.2549 13.0908C13.1911 13.2139 13.0999 13.3096 12.9814 13.3779C12.863 13.4508 12.7262 13.4873 12.5713 13.4873C12.4619 13.4873 12.3571 13.4668 12.2568 13.4258C12.1611 13.3893 12.0723 13.3324 11.9902 13.2549L8.62695 9.88477C8.18034 10.2038 7.68815 10.4544 7.15039 10.6367C6.61263 10.819 6.04753 10.9102 5.45508 10.9102C4.70312 10.9102 3.99674 10.7689 3.33594 10.4863C2.67969 10.2038 2.10091 9.81185 1.59961 9.31055C1.09831 8.80924 0.70638 8.23047 0.423828 7.57422C0.141276 6.91341 0 6.20703 0 5.45508ZM1.16895 5.45508C1.16895 6.04753 1.27832 6.60352 1.49707 7.12305C1.72038 7.63802 2.02799 8.09147 2.41992 8.4834C2.81641 8.87533 3.27214 9.18294 3.78711 9.40625C4.30664 9.62956 4.86263 9.74121 5.45508 9.74121C6.04753 9.74121 6.60124 9.62956 7.11621 9.40625C7.63574 9.18294 8.09147 8.87533 8.4834 8.4834C8.87533 8.09147 9.18294 7.63802 9.40625 7.12305C9.62956 6.60352 9.74121 6.04753 9.74121 5.45508C9.74121 4.86263 9.62956 4.30892 9.40625 3.79395C9.18294 3.27441 8.87533 2.81868 8.4834 2.42676C8.09147 2.03027 7.63574 1.72266 7.11621 1.50391C6.60124 1.2806 6.04753 1.16895 5.45508 1.16895C4.86263 1.16895 4.30664 1.2806 3.78711 1.50391C3.27214 1.72266 2.81641 2.03027 2.41992 2.42676C2.02799 2.81868 1.72038 3.27441 1.49707 3.79395C1.27832 4.30892 1.16895 4.86263 1.16895 5.45508Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                </span>
              </div>
            </div> */}
          </div>
        </section>
      </div>

      <section className="table-container">
        {isLoadingTable ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="spinner" />
          </div>
          ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Operación</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Comercio</th>
                <th>Concepto</th>
                <th></th>
                <th className="w-[0px]">Detalle</th>
                <th></th>
                <th className="w-[0px]">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {tarjetahabientes.map((mov, idx) => (
                <tr 
                key={idx}
                onClick={()=>selecionaClienteHistorico(mov.idMovimiento, mov.estatus)}
                className={`group ${seleccionMovimiento.movimiento === mov.idMovimiento ? "selected" : ""}`}
                >
                  <td className={`font-mono rounded-tl-full rounded-bl-full font-bold 
                  ${mov.tipoMovimiento === 'I' ? mov.estatus ? "text-(--VerdeNeon)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth)"  : mov.estatus ? "text-(--GrisLight)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth) " }`}
                  >{mov.idMovimiento}
                  </td>
                  <td className={`font-semibold 
                    ${mov.tipoMovimiento === 'I' ? mov.estatus ? "text-(--VerdeNeon)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth)"  : mov.estatus ? "text-(--GrisLight)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth) " }`}
                  >{mov.tipoMovimiento === 'I'? 'Abono':'Compra'}</td>
                  <td
                    className={`font-mono 
                    ${mov.tipoMovimiento === 'I' ? mov.estatus ? "text-(--VerdeNeon)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth)"  : mov.estatus ? "text-(--GrisLight)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth) " }`}
                  >
                    {mov.monto_formateado}
                  </td>

                  <td className={`
                    ${mov.tipoMovimiento === 'I' ? mov.estatus ? "text-(--VerdeNeon)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth)"  : mov.estatus ? "text-(--GrisLight)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth) " }`}
                  >{mov.fecha}</td> 
                  <td className={`font-bold 
                    ${mov.tipoMovimiento === 'I' ? mov.estatus ? "text-(--VerdeNeon)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth)"  : mov.estatus ? "text-(--GrisLight)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth) " }`}
                    >{mov.comercio}</td>
                  <td className={`rounded-tr-full rounded-br-full 
                    ${mov.tipoMovimiento === 'I' ? mov.estatus ? "text-(--VerdeNeon)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth)"  : mov.estatus ? "text-(--GrisLight)" : "text-(--DeepBlue) group-[.selected]:text-(--GrisLightHigth) " }`}
                  >{mov.concepto}</td>
                  
                  <td className="w-3 p-0 bg-(--fondo)! [.selected>&]:bg-(--fondo)!"></td>
                  <td className="rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full ">
                    <div className="flex justify-center gap-2 ">
                      <button 
                        type="button"  
                        onClick={mov.monto_formateado.charAt(0) === "+" ? (()=>{handleDetalleMovimientoAbono(mov.idMovimiento)}): (()=>{handleDetalleMovimientoGasto(mov.idMovimiento)}) }
                        className="action-icon-btn" 
                        title="Agregar gasto">
                        <span>
                          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.94531 9.96094C7.17188 9.96094 6.43945 9.86719 5.74805 9.67969C5.05664 9.49219 4.41602 9.24414 3.82617 8.93555C3.23633 8.62695 2.70508 8.28711 2.23242 7.91602C1.76367 7.54102 1.36133 7.16797 1.02539 6.79688C0.693359 6.42188 0.439453 6.07422 0.263672 5.75391C0.0878906 5.43359 0 5.17578 0 4.98047C0 4.78125 0.0878906 4.52344 0.263672 4.20703C0.439453 3.88672 0.693359 3.53906 1.02539 3.16406C1.36133 2.78906 1.76367 2.41602 2.23242 2.04492C2.70508 1.67383 3.23633 1.33398 3.82617 1.02539C4.41602 0.716797 5.05664 0.46875 5.74805 0.28125C6.43945 0.09375 7.17188 0 7.94531 0C8.72656 0 9.46289 0.09375 10.1543 0.28125C10.8496 0.46875 11.4922 0.716797 12.082 1.02539C12.6719 1.33398 13.2012 1.67383 13.6699 2.04492C14.1387 2.41602 14.5371 2.78906 14.8652 3.16406C15.1973 3.53906 15.4492 3.88672 15.6211 4.20703C15.7969 4.52344 15.8848 4.78125 15.8848 4.98047C15.8848 5.17578 15.7969 5.43359 15.6211 5.75391C15.4492 6.07422 15.1973 6.42188 14.8652 6.79688C14.5371 7.16797 14.1387 7.54102 13.6699 7.91602C13.2051 8.28711 12.6777 8.62695 12.0879 8.93555C11.498 9.24414 10.8555 9.49219 10.1602 9.67969C9.46484 9.86719 8.72656 9.96094 7.94531 9.96094ZM7.94531 8.25586C8.39453 8.25586 8.81641 8.17188 9.21094 8.00391C9.60938 7.83203 9.95898 7.5957 10.2598 7.29492C10.5605 6.99414 10.7949 6.64648 10.9629 6.25195C11.1348 5.85742 11.2207 5.43359 11.2207 4.98047C11.2207 4.52734 11.1348 4.10352 10.9629 3.70898C10.7949 3.31445 10.5605 2.9668 10.2598 2.66602C9.95898 2.36523 9.60938 2.13086 9.21094 1.96289C8.81641 1.79102 8.39453 1.70508 7.94531 1.70508C7.49219 1.70508 7.06836 1.79102 6.67383 1.96289C6.2793 2.13086 5.93164 2.36523 5.63086 2.66602C5.33008 2.9668 5.09375 3.31445 4.92188 3.70898C4.75391 4.10352 4.66992 4.52734 4.66992 4.98047C4.66992 5.43359 4.75391 5.85742 4.92188 6.25195C5.09375 6.64648 5.33008 6.99414 5.63086 7.29492C5.93164 7.5957 6.2793 7.83203 6.67383 8.00391C7.06836 8.17188 7.49219 8.25586 7.94531 8.25586ZM7.94531 6.17578C7.61328 6.17578 7.33008 6.06055 7.0957 5.83008C6.86523 5.5957 6.75 5.3125 6.75 4.98047C6.75 4.64844 6.86523 4.36719 7.0957 4.13672C7.33008 3.90234 7.61328 3.78516 7.94531 3.78516C8.27344 3.78516 8.55469 3.90234 8.78906 4.13672C9.02344 4.36719 9.14062 4.64844 9.14062 4.98047C9.14062 5.3125 9.02344 5.5957 8.78906 5.83008C8.55469 6.06055 8.27344 6.17578 7.94531 6.17578Z" fill="white"/>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="w-3 p-0 bg-(--fondo)! [.selected>&]:bg-(--fondo)!"></td>

                  <td className="rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full ">
                    { mov.estatus !== true ? 
                      <div className="flex justify-center gap-2 ">
                        <button 
                        type="button" 
                        className="action-icon-btn" 
                        title="Agregar gasto"
                        onClick={mov.monto_formateado.charAt(0) === "+" ? (()=> setShowRestaurarAbono(true)) : ( () => setShowRestaurarGasto(true)) }
                        >
                          <span>
                            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.15234 14.9639C5.30469 14.9639 4.50716 14.8044 3.75977 14.4854C3.01693 14.1663 2.36296 13.7243 1.79785 13.1592C1.2373 12.5941 0.797526 11.9401 0.478516 11.1973C0.159505 10.4544 0 9.6569 0 8.80469C0 8.59505 0.0729167 8.41732 0.21875 8.27148C0.369141 8.12109 0.546875 8.0459 0.751953 8.0459C0.966146 8.0459 1.14616 8.12109 1.29199 8.27148C1.44238 8.41732 1.51758 8.59505 1.51758 8.80469C1.51758 9.44271 1.63607 10.042 1.87305 10.6025C2.11458 11.1631 2.44727 11.6553 2.87109 12.0791C3.29948 12.5029 3.79395 12.8356 4.35449 13.0771C4.91504 13.3187 5.51432 13.4395 6.15234 13.4395C6.79492 13.4395 7.39421 13.3187 7.9502 13.0771C8.51074 12.8356 9.00293 12.5029 9.42676 12.0791C9.85514 11.6553 10.1878 11.1631 10.4248 10.6025C10.6663 10.042 10.7871 9.44271 10.7871 8.80469C10.7871 8.16667 10.6663 7.56738 10.4248 7.00684C10.1878 6.44629 9.85514 5.9541 9.42676 5.53027C9.00293 5.10189 8.51074 4.76921 7.9502 4.53223C7.39421 4.29069 6.79492 4.16992 6.15234 4.16992C5.88802 4.16992 5.62826 4.19271 5.37305 4.23828C5.1224 4.2793 4.8763 4.3431 4.63477 4.42969C4.48438 4.48438 4.32943 4.49121 4.16992 4.4502C4.01497 4.40918 3.88281 4.32715 3.77344 4.2041C3.66406 4.08105 3.6071 3.92155 3.60254 3.72559C3.60254 3.52051 3.66406 3.35872 3.78711 3.24023C3.91016 3.12174 4.04004 3.03743 4.17676 2.9873C4.4821 2.88249 4.80111 2.80046 5.13379 2.74121C5.46647 2.68197 5.80599 2.65234 6.15234 2.65234C7.00456 2.65234 7.80208 2.81185 8.54492 3.13086C9.28776 3.44987 9.93945 3.89193 10.5 4.45703C11.0651 5.02214 11.5072 5.67611 11.8262 6.41895C12.1452 7.16178 12.3047 7.95703 12.3047 8.80469C12.3047 9.6569 12.1452 10.4544 11.8262 11.1973C11.5072 11.9401 11.0651 12.5941 10.5 13.1592C9.93945 13.7243 9.28776 14.1663 8.54492 14.4854C7.80208 14.8044 7.00456 14.9639 6.15234 14.9639ZM4.44336 3.58887L6.84277 5.96777C6.91113 6.03158 6.96354 6.10677 7 6.19336C7.03646 6.27539 7.05469 6.36654 7.05469 6.4668C7.05469 6.67643 6.98177 6.85417 6.83594 7C6.69466 7.14128 6.52148 7.21191 6.31641 7.21191C6.11589 7.21191 5.94271 7.14355 5.79688 7.00684L2.99414 4.17676C2.91667 4.09928 2.85742 4.01497 2.81641 3.92383C2.77995 3.82812 2.76172 3.72786 2.76172 3.62305C2.76172 3.41341 2.83919 3.22884 2.99414 3.06934L5.79688 0.225586C5.94271 0.0751953 6.11589 0 6.31641 0C6.52604 0 6.7015 0.0751953 6.84277 0.225586C6.98405 0.371419 7.05469 0.549154 7.05469 0.758789C7.05469 0.859049 7.03646 0.952474 7 1.03906C6.96354 1.12109 6.91341 1.19629 6.84961 1.26465L4.44336 3.58887Z" fill="#D9D9D9"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    :                
                        <div className="flex justify-center gap-2 ">
                          <button type="button" 
                          className="action-icon-btn-trash" 
                          title="Historial"
                          onClick={mov.monto_formateado.charAt(0) === "+" ? (()=> setShowModalEliminaAbono(true)) : ( () => setShowModalEliminaGasto(true)) }
                          >
                            <span>
                              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.64844 13.3096C4.79427 13.3096 4.91276 13.2663 5.00391 13.1797C5.09505 13.0931 5.13835 12.9792 5.13379 12.8379L4.91504 5.40039C4.91504 5.25911 4.86719 5.14746 4.77148 5.06543C4.68034 4.97884 4.56413 4.93555 4.42285 4.93555C4.27246 4.93555 4.15169 4.97884 4.06055 5.06543C3.97396 5.15202 3.93294 5.26595 3.9375 5.40723L4.14258 12.8379C4.15169 12.9837 4.19954 13.0999 4.28613 13.1865C4.37728 13.2686 4.49805 13.3096 4.64844 13.3096ZM6.74023 13.3096C6.89062 13.3096 7.01139 13.2686 7.10254 13.1865C7.19824 13.0999 7.24609 12.986 7.24609 12.8447V5.40723C7.24609 5.26595 7.19824 5.15202 7.10254 5.06543C7.01139 4.97884 6.89062 4.93555 6.74023 4.93555C6.5944 4.93555 6.47363 4.97884 6.37793 5.06543C6.28678 5.15202 6.24121 5.26595 6.24121 5.40723V12.8447C6.24121 12.986 6.28678 13.0999 6.37793 13.1865C6.47363 13.2686 6.5944 13.3096 6.74023 13.3096ZM8.83887 13.3096C8.98926 13.3096 9.10775 13.2686 9.19434 13.1865C9.28548 13.1045 9.33333 12.9883 9.33789 12.8379L9.54297 5.40723C9.54753 5.26595 9.50423 5.15202 9.41309 5.06543C9.3265 4.97884 9.20801 4.93555 9.05762 4.93555C8.9209 4.93555 8.80469 4.97884 8.70898 5.06543C8.61784 5.14746 8.56999 5.26139 8.56543 5.40723L8.35352 12.8379C8.34896 12.9837 8.38997 13.0999 8.47656 13.1865C8.56771 13.2686 8.68848 13.3096 8.83887 13.3096ZM3.63672 3.14453V1.66797C3.63672 1.14388 3.79395 0.736003 4.1084 0.444336C4.42741 0.148112 4.86947 0 5.43457 0H8.03223C8.59733 0 9.03939 0.148112 9.3584 0.444336C9.67741 0.736003 9.83691 1.14388 9.83691 1.66797V3.14453H8.57227V1.72949C8.57227 1.55632 8.5153 1.41732 8.40137 1.3125C8.28743 1.20312 8.13477 1.14844 7.94336 1.14844H5.52344C5.33659 1.14844 5.1862 1.20312 5.07227 1.3125C4.95833 1.41732 4.90137 1.55632 4.90137 1.72949V3.14453H3.63672ZM0.608398 3.89648C0.439779 3.89648 0.296224 3.83724 0.177734 3.71875C0.0592448 3.60026 0 3.45671 0 3.28809C0 3.12402 0.0592448 2.98503 0.177734 2.87109C0.296224 2.7526 0.439779 2.69336 0.608398 2.69336H12.8789C13.0475 2.69336 13.1888 2.75033 13.3027 2.86426C13.4212 2.97819 13.4805 3.11947 13.4805 3.28809C13.4805 3.45671 13.4212 3.60026 13.3027 3.71875C13.1888 3.83724 13.0475 3.89648 12.8789 3.89648H0.608398ZM3.60254 15.4287C3.07389 15.4287 2.65007 15.2806 2.33105 14.9844C2.0166 14.6882 1.84798 14.2757 1.8252 13.7471L1.34668 3.75293H12.1338L11.6621 13.7402C11.6393 14.2689 11.4684 14.6813 11.1494 14.9775C10.8304 15.2783 10.4089 15.4287 9.88477 15.4287H3.60254Z" 
                                />
                              </svg>
                            </span>
                          </button>
                        </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

           {/* Componente de Paginación */}

            {busquedaPaginacion ? "": (

            <div className="pagination-container">
              {/* Botón Atrás (‹) - Se deshabilita si estás en la página 1 */}
              <button
                type="button"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                className="pagination-btn"
              >
                <span
                  className={
                    paginaActual === 1
                      ? "text-(--VerdeNeonDisabled)"
                      : "text-(--VerdeNeon) hover:text-(--DeelBlue)"
                  }
                >
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1.18362e-06 5.36719C0.00390741 5.21875 0.0332043 5.08398 0.0878917 4.96289C0.142579 4.83789 0.228517 4.7168 0.345704 4.59961L4.77539 0.263671C4.95508 0.0878896 5.17188 -1.02312e-06 5.42578 -1.06751e-06C5.59766 -1.09757e-06 5.75391 0.0429676 5.89453 0.128905C6.03906 0.210936 6.1543 0.322264 6.24023 0.462889C6.32617 0.603514 6.36914 0.759764 6.36914 0.931639C6.36914 1.19336 6.26758 1.42187 6.06445 1.61719L2.20313 5.36133L6.06445 9.11133C6.26758 9.31445 6.36914 9.54492 6.36914 9.80273C6.36914 9.97461 6.32617 10.1309 6.24024 10.2715C6.1543 10.4121 6.03906 10.5234 5.89453 10.6055C5.75391 10.6914 5.59766 10.7344 5.42578 10.7344C5.17188 10.7344 4.95508 10.6445 4.77539 10.4648L0.345704 6.12891C0.224611 6.01172 0.13672 5.89258 0.0820325 5.77148C0.027345 5.64648 1.20889e-06 5.51172 1.18362e-06 5.36719Z" />
                  </svg>
                </span>
              </button>

              {/* Render de números (1, 2, 3...) calculados por el total de registros de SQL Server */}
              {renderNumerosPaginacion()}

              {/* Botón Siguiente (›) - Se deshabilita si estás en la última página */}
              <button
                type="button"
                disabled={paginaActual === totalPaginas}
                onClick={() =>
                  setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                }
                className="pagination-btn"
              >
                <span
                  className={
                    paginaActual === totalPaginas
                      ? "text-(--VerdeNeonDisabled)"
                      : "text-(--VerdeNeon) hover:text-(--DeelBlue)"
                  }
                >
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6.36914 5.36719C6.36523 5.51562 6.33594 5.65039 6.28125 5.77148C6.22656 5.89648 6.14063 6.01758 6.02344 6.13477L1.59375 10.4707C1.41406 10.6465 1.19727 10.7344 0.943359 10.7344C0.771484 10.7344 0.615235 10.6914 0.47461 10.6055C0.330078 10.5234 0.214844 10.4121 0.128906 10.2715C0.0429689 10.1309 1.89018e-07 9.97461 2.04043e-07 9.80273C2.26924e-07 9.54102 0.101563 9.3125 0.304688 9.11719L4.16602 5.37305L0.304688 1.62305C0.101563 1.41992 9.5704e-07 1.18945 9.79579e-07 0.93164C9.94605e-07 0.759765 0.0429698 0.603515 0.128907 0.46289C0.214845 0.322265 0.330079 0.210937 0.47461 0.128906C0.615235 0.0429682 0.771485 -5.48783e-07 0.94336 -5.33757e-07C1.19727 -5.1156e-07 1.41406 0.0898433 1.59375 0.269531L6.02344 4.60547C6.14453 4.72266 6.23242 4.8418 6.28711 4.96289C6.3418 5.08789 6.36914 5.22266 6.36914 5.36719Z" />
                  </svg>
                </span>
              </button>
            </div>
            )}

      </section>
    </div>
      {/* MODALES */}
      <div className="flex flex-col items-center justify-center text-white">

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

        <ModalDetalleAbono 
          isOpen={showModalDetalleAbono}
          estatus={seleccionMovimiento.estatus}
          monto={detalleClienteSelecionado?.precio}
          nomComercio = {detalleClienteSelecionado?.nombreNegocio}
          concepto = {detalleClienteSelecionado?.concepto}
          fechaCargo = {detalleClienteSelecionado?.Fecha}
          noOperacion = {detalleClienteSelecionado?.idMovimiento}
          comprobante = {detalleClienteSelecionado?.comprobante}              
          onCancel={() => {setShowModalDetalleAbono(false)}}
          onEdit={() => {handleEditarAbono()}}
        />

        <ModalDetalleGasto 
          isOpen={showModalDetalleGasto}
          estatus={seleccionMovimiento.estatus}
          monto={detalleClienteSelecionado?.precio}
          nomComercio = {detalleClienteSelecionado?.nombreNegocio}
          concepto = {detalleClienteSelecionado?.concepto}
          fechaCargo = {detalleClienteSelecionado?.Fecha}
          noOperacion = {detalleClienteSelecionado?.idMovimiento}
          comprobante = {detalleClienteSelecionado?.comprobante}              
          onCancel={() => {setShowModalDetalleGasto(false)}}
          onEdit={() => {handleEditarGasto()}}
        />
        { showModalEliminaGasto && (
          <Modal
            tipo={4}
            title="Eliminar gasto"
            description="Eliminar un gasto afectará el balance general de la plataforma"
            textCancel="No eliminar"
            textConfirm="Eliminar"
            idMovimiento={limpiarANumero(seleccionMovimiento.movimiento)}
            // idTarjeta={dataInputs?.idTarjeta}
            onClose={handleEliminaGasto}
          />
        ) }
        { showModalEliminaAbono && (
          <Modal
            tipo={4}
            title="Eliminar abono"
            description="Eliminar un gasto afectará el balance general de la plataforma"
            textCancel="No eliminar"
            textConfirm="Eliminar"
            idMovimiento={limpiarANumero(seleccionMovimiento.movimiento)}
            // idTarjeta={dataInputs?.idTarjeta}
            onClose={handleEliminaAbono}
          />
        ) }
          { showRestaurarGasto && (
          <Modal
            tipo={3}
            title="Recuperar gasto"
            description="Recuperar un gasto afectará el balance general de la plataforma"
            textCancel="Restaurar el registro"
            textConfirm="No restaurar el registro"
            // onCancel={() => setShowModalAviso(false)}
            onClose={handledRestaurarGasto}
          />
        ) }
          { showRestaurarAbono && (
          <Modal
            tipo={3}
            title="Recuperar abono"
            description="Recuperar un abono afectará el balance general de la plataforma "
            textCancel="Restaurar el registro"
            textConfirm="No restaurar el registro"
            // onCancel={() => setShowModalAviso(false)}
            onClose={handledRestaurarAbono}
          />
        ) }

        { showEditaModalGasto && (
          <ModalGasto
            // isOpen={showModalGasto}
            title={!idMovimientoEdicion ? 'Agregar Gasto' : 'Edición de Gasto' }
            tarjetahabiente={`${dataInputs?.nombreCliente} ${dataInputs.apellidoP} ${dataInputs.apellidoM}`}
            cta={formatDigitoBancarios(dataInputs?.noTarjeta)}
            noCliente={dataInputs?.noCliente} 
            noOperacion={idMovimientoEdicion}
            idTarjeta1={dataInputs?.idTarjeta}
            idUsuario1={Number.parseInt(idUsuario as string, 10) }
            idMovimientoVinculado1={limpiarANumero(idMovimientoEdicion)}
            // -----
            monto={limpiarANumero( detalleClienteSelecionado?.precio )}
            nomComercio={detalleClienteSelecionado?.nombreNegocio}
            concepto={detalleClienteSelecionado?.concepto}
            fechaCargo={formatearParaInput(detalleClienteSelecionado?.Fecha)}
            comprobante={detalleClienteSelecionado?.comprobante}
            bajaPorEdicion1={0}

            textConfirm="Agregar"
            textCancel="Cancelar"
            // onConfirm={() => setShowModalGasto(false)}
            onClose={handleAgregaGasto} 
          />
        )}


        { showEditaModalAbono && ( 
          <ModalAbono
          icono={
            <svg width="33" height="21" viewBox="0 0 33 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 19.2017V0.964355C0 0.671387 0.0895182 0.439453 0.268555 0.268555C0.447591 0.0895182 0.683594 0 0.976562 0H31.2622C31.5552 0 31.7871 0.0895182 31.958 0.268555C32.137 0.439453 32.2266 0.671387 32.2266 0.964355V19.2017C32.2266 19.4946 32.137 19.7306 31.958 19.9097C31.7871 20.0887 31.5552 20.1782 31.2622 20.1782H0.976562C0.683594 20.1782 0.447591 20.0887 0.268555 19.9097C0.0895182 19.7306 0 19.4946 0 19.2017ZM2.23389 17.1997C2.23389 17.6961 2.47803 17.9443 2.96631 17.9443H29.2603C29.7485 17.9443 29.9927 17.6961 29.9927 17.1997V2.97852C29.9927 2.4821 29.7485 2.23389 29.2603 2.23389H2.96631C2.47803 2.23389 2.23389 2.4821 2.23389 2.97852V17.1997ZM3.50342 16.3818V3.79639C3.50342 3.60107 3.60107 3.50342 3.79639 3.50342H13.3179C12.6831 4.15446 12.1867 5.04557 11.8286 6.17676C11.4705 7.2998 11.2915 8.59782 11.2915 10.0708C11.2915 11.5438 11.4705 12.8499 11.8286 13.9893C12.1948 15.1204 12.6994 16.0156 13.3423 16.6748H3.79639C3.60107 16.6748 3.50342 16.5771 3.50342 16.3818ZM12.7563 10.0708C12.7563 8.80127 12.8906 7.69043 13.1592 6.73828C13.4359 5.78613 13.8224 5.04557 14.3188 4.5166C14.8234 3.98763 15.4053 3.72314 16.0645 3.72314C16.748 3.72314 17.3462 3.98763 17.8589 4.5166C18.3797 5.04557 18.7826 5.78613 19.0674 6.73828C19.3522 7.69043 19.4946 8.80127 19.4946 10.0708C19.4946 11.3403 19.3522 12.4512 19.0674 13.4033C18.7826 14.3555 18.3797 15.1001 17.8589 15.6372C17.3462 16.1662 16.748 16.4307 16.0645 16.4307C15.4053 16.4307 14.8234 16.1662 14.3188 15.6372C13.8224 15.1001 13.4359 14.3555 13.1592 13.4033C12.8906 12.4512 12.7563 11.3403 12.7563 10.0708ZM18.8599 16.6748C19.5109 16.0156 20.0195 15.1204 20.3857 13.9893C20.7601 12.8499 20.9473 11.5438 20.9473 10.0708C20.9473 8.59782 20.7642 7.2998 20.3979 6.17676C20.0317 5.04557 19.5231 4.15446 18.8721 3.50342H28.4302C28.6255 3.50342 28.7231 3.60107 28.7231 3.79639V16.3818C28.7231 16.5771 28.6255 16.6748 28.4302 16.6748H18.8599Z" fill="#02FFA2"/>
            </svg>
          }
          title={!idMovimientoEdicion ? 'Abono' : 'Edición de Abono' }
          tarjetahabiente={`${dataInputs?.nombreCliente} ${dataInputs.apellidoP} ${dataInputs.apellidoM}`}
          cta={formatDigitoBancarios(dataInputs?.noTarjeta)}
          noCliente={dataInputs?.noCliente} 
          noOperacion={idMovimientoEdicion}
          concepto = {user?.nombreCompleto}
          idTarjeta1={dataInputs?.idTarjeta}
          idUsuario1={Number.parseInt(idUsuario as string, 10) }
          idMovimientoVinculado1={limpiarANumero(idMovimientoEdicion)}
          bajaPorEdicion1={0}
          // -------
          monto={limpiarANumero( detalleClienteSelecionado?.precio )}
          fechaCargo={formatearParaInput(detalleClienteSelecionado?.Fecha)}
          comprobante={detalleClienteSelecionado?.comprobante}
          textConfirm="Agregar"
          textCancel="Cancelar"
          onClose={handleAgregaAbono}
        />)}


        { showAgregaModalGasto && (
          <ModalGasto
            // isOpen={showModalGasto}
            title={'Agregar Gasto'}
            tarjetahabiente={`${dataInputs?.nombreCliente} ${dataInputs.apellidoP} ${dataInputs.apellidoM}`}
            cta={formatDigitoBancarios(dataInputs?.noTarjeta)}
            noCliente={dataInputs?.noCliente} 
            noOperacion={idMovimientoEdicion}
            idTarjeta1={dataInputs?.idTarjeta}
            idUsuario1={Number.parseInt(idUsuario as string, 10) }
            idMovimientoVinculado1={limpiarANumero(idMovimientoEdicion)}
            // -----
            // monto={limpiarANumero( detalleClienteSelecionado?.precio )}
            // nomComercio={detalleClienteSelecionado?.nombreNegocio}
            // concepto={detalleClienteSelecionado?.concepto}
            // fechaCargo={formatearParaInput(detalleClienteSelecionado?.Fecha)}
            // comprobante={detalleClienteSelecionado?.comprobante}
            bajaPorEdicion1={0}

            textConfirm="Agregar"
            textCancel="Cancelar"
            // onConfirm={() => setShowModalGasto(false)}
            onClose={handleAgregaGasto} 
          />
        )}

        { showAgregaModalAbono && ( 
          <ModalAbono
          icono={
            <svg width="33" height="21" viewBox="0 0 33 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 19.2017V0.964355C0 0.671387 0.0895182 0.439453 0.268555 0.268555C0.447591 0.0895182 0.683594 0 0.976562 0H31.2622C31.5552 0 31.7871 0.0895182 31.958 0.268555C32.137 0.439453 32.2266 0.671387 32.2266 0.964355V19.2017C32.2266 19.4946 32.137 19.7306 31.958 19.9097C31.7871 20.0887 31.5552 20.1782 31.2622 20.1782H0.976562C0.683594 20.1782 0.447591 20.0887 0.268555 19.9097C0.0895182 19.7306 0 19.4946 0 19.2017ZM2.23389 17.1997C2.23389 17.6961 2.47803 17.9443 2.96631 17.9443H29.2603C29.7485 17.9443 29.9927 17.6961 29.9927 17.1997V2.97852C29.9927 2.4821 29.7485 2.23389 29.2603 2.23389H2.96631C2.47803 2.23389 2.23389 2.4821 2.23389 2.97852V17.1997ZM3.50342 16.3818V3.79639C3.50342 3.60107 3.60107 3.50342 3.79639 3.50342H13.3179C12.6831 4.15446 12.1867 5.04557 11.8286 6.17676C11.4705 7.2998 11.2915 8.59782 11.2915 10.0708C11.2915 11.5438 11.4705 12.8499 11.8286 13.9893C12.1948 15.1204 12.6994 16.0156 13.3423 16.6748H3.79639C3.60107 16.6748 3.50342 16.5771 3.50342 16.3818ZM12.7563 10.0708C12.7563 8.80127 12.8906 7.69043 13.1592 6.73828C13.4359 5.78613 13.8224 5.04557 14.3188 4.5166C14.8234 3.98763 15.4053 3.72314 16.0645 3.72314C16.748 3.72314 17.3462 3.98763 17.8589 4.5166C18.3797 5.04557 18.7826 5.78613 19.0674 6.73828C19.3522 7.69043 19.4946 8.80127 19.4946 10.0708C19.4946 11.3403 19.3522 12.4512 19.0674 13.4033C18.7826 14.3555 18.3797 15.1001 17.8589 15.6372C17.3462 16.1662 16.748 16.4307 16.0645 16.4307C15.4053 16.4307 14.8234 16.1662 14.3188 15.6372C13.8224 15.1001 13.4359 14.3555 13.1592 13.4033C12.8906 12.4512 12.7563 11.3403 12.7563 10.0708ZM18.8599 16.6748C19.5109 16.0156 20.0195 15.1204 20.3857 13.9893C20.7601 12.8499 20.9473 11.5438 20.9473 10.0708C20.9473 8.59782 20.7642 7.2998 20.3979 6.17676C20.0317 5.04557 19.5231 4.15446 18.8721 3.50342H28.4302C28.6255 3.50342 28.7231 3.60107 28.7231 3.79639V16.3818C28.7231 16.5771 28.6255 16.6748 28.4302 16.6748H18.8599Z" fill="#02FFA2"/>
            </svg>
          }
          title={'Abono'}
          tarjetahabiente={`${dataInputs?.nombreCliente} ${dataInputs.apellidoP} ${dataInputs.apellidoM}`}
          cta={formatDigitoBancarios(dataInputs?.noTarjeta)}
          noCliente={dataInputs?.noCliente} 
          noOperacion={idMovimientoEdicion}
          concepto = {user?.nombreCompleto}
          idTarjeta1={dataInputs?.idTarjeta}
          idUsuario1={Number.parseInt(idUsuario as string, 10) }
          idMovimientoVinculado1={limpiarANumero(idMovimientoEdicion)}
          // -------
          // monto={limpiarANumero( detalleClienteSelecionado?.precio )}
          // fechaCargo={formatearParaInput(detalleClienteSelecionado?.Fecha)}
          // comprobante={detalleClienteSelecionado?.comprobante}
          bajaPorEdicion1={0}
          textConfirm="Agregar"
          textCancel="Cancelar"
          // onConfirm={() => setShowModalAbono(false)}
          onClose={handleAgregaAbono}
        />)}
        
      </div>
    </>
  );
};
