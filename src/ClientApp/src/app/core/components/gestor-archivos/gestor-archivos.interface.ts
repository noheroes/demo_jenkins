export interface IGAInternalDisplayConfig {
  seleccionarArchivoHabilitado: boolean;
  cargarArchivoHabilitado: boolean;
  descargarArchivoHabilitado: boolean;
  eliminarArchivoHabilitado: boolean;
  verHistorialArchivoHabilitado: boolean;
  barraProgresoVisible: boolean;
  barraProgresoLabel: string;
  barraProgresoPorcentaje: number;
  barraProgresoClase: string;
}

export interface IParamsExtra{
  idUsuario:string;
  idAplicacion: string;
  idCatalogo:string;
  idCondicion:string;
  idComponente:string;
  idIndicador:string;
  idMedioVerificacion:string;
  origenEnum:string;
}

export interface IGestorArchivosConfig {
  tiposPermitidos?: string[] | string;
  usarBorradores?: boolean;
  pesoMaximoEnMB?: number;
  defaultDisplayText?: string;
  version?: number;
  mostrarHint?: boolean;
  // integrando display config
  puedeCargarArchivo?: boolean;
  puedeSubirArchivo?:boolean;
  puedeDescargarArchivo?: boolean;
  puedeEliminarArchivo?: boolean;
  puedeVerHistorialArchivo?: boolean;
  maxVersionesHistorial?: number;
  preservarNombreArchivo?: boolean;
  tamanioControles?: string;
  claseTamanioInput?: string;
  claseTamanioBoton?: string;
  mostrarCajaDeTexto?: boolean;
  mostrarAlertasExito?: boolean;
  puedeVerTags?: boolean;
  puedeEditarTags?: boolean;
  paramsExtra?:IParamsExtra;
  fileName?:string;
}

export interface IGestorArchivosFriendlyConfig {
  icon?: string;
  mostrarBotonAyuda?: boolean;
}
