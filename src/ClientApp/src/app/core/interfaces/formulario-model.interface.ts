export interface ProcedimientoRequest {
  idEntidad: number;
  idFlujo: string;
}

export interface IFormularioRequest {
  idProceso: string;
  idProcesoBandeja: string;
  idUsuario: string;
  idVersion: string;
  // esComponente: boolean;
  nombreActividad?: string;
}

export interface IFlujoInicialRequest {
  idUsuario: string;
  idEntidad: string;
  idFlujo: string;
  idTipoUsuario: string;
}

export interface IFormularioModel {
  // id?: string;
  // idSolicitud: number;
  // idProceso: string;
  // idProcesoBandeja: string;

  // actividad: IActividadModel;
  // metadata: IMetaDataModel;
  // derivador: IDerivarModel;
  formulario: IFormulario;
  cabecera: ICabeceraDetalle;
  solicitud: { solicitud: ISolicitudRequest; version: IVersionRequest };
  detalleBandeja: IDetalleBandeja;
  derivadorModel: IDerivarModel;

  tareas: any;
}

export interface ICabeceraDetalle {
  numeroSolicitud: string;
  fechaInicio: Date;
  fechaPresentacion?: Date;
  fechaAdmisibilidad?: Date;
  fechaOficialIngreso?: Date;
  nombreEntidad: string;
  rucEntidad: string;
  idSolicitud: string;
  versiones: any
}

export interface ISolicitudRequest {
  id: string;
  idEntidad: string;
  idUsuario: string;
  numeroSolicitud: string;
  fechaSolicitud: string;
}

export interface IVersionRequest {
  id: string;
  idSolicitud: string;
  correlativoVersion: string;
  correlativoVersionPadre: string;
  estadoVersionEnum: string;
  fechaOficialIngreso: string;
  fechaRegistro: string;
  numeradorFormato: string;
  tipoVersionEnum: string;
}

export interface ISolicitud {
  idSolicitud: number;
  guid: string;
  siuIdEntidad: number;
  nroSolicitud: string;
  nroSolicitudDilic: string;
  fechaSolicitud?: Date;
  fechaInicioEvaluacion?: Date;
  estado: boolean;
}

export interface IDetalleBandeja {
  idProceso: string;
  idProcesoBandeja: string;

  actividad: IActividadModel;
  metadata: IMetaDataModel;

  metadataFlujoSecundario: any;
  responsableFinPaso: boolean;
}
export interface IActividadModel {
  ruta: string;
  nombre: string;
  identificador: string;
}
export interface IMetaDataModel {
  idProcesoBase: string;
  guidSolicitud: string;
  idVersionSolicitud: string;
  // idSolicitudVersion: string;
  guidSede: string;
  fechaRegistro: Date;
  numero: string;
  // desicionWorkflow: number;
  // esTransversal: boolean;
  // esModificacionSolicitud: boolean;
  // usuario:any ;
  // idProcesoCompartido: string;
  // idProcesoTestigo: string;

  // nombreActividad: string;
  // nombreProcedimiento: string;
  // tipoEspecializacionDocumentos: string;
  // conBorradorSolicitud: boolean;
}

export interface IDerivarModel {
  idProcesoBandeja: string;
  bandejaDetalleDerivador: any;
  codArea: string;
  codigoRoles: string;
  usuarioSeleccionados: string;
  idSolicitud: number;
  nombrePersonal: string;
}

export interface IFormulario {
  nombreProcedimiento: string;
  conDecisionAutomatica: boolean;
  conFinalizacionElaboracionDocumento: boolean;

  // mostrarCondicion: string;
  codigo: string;
  tipoFormulario: number;
  decision: {
    conDecision: boolean,
    pregunta: string,
    opciones: []
  };
  // codigoDependencia: string;
  configuracionDefecto: string;
  antesDeFinalizar: string;
  // sinFinalizar: boolean;
  // finalizarConClave: boolean;
  // conFechaLimite: boolean;
  // fechaLimite: Date;
  configuracionDocumento: IConfiguracionDocumento;
  configuracionTabs: IConfiguracionTabs;
  configuracionAsincrono: IConfiguracionAsincrono;
  listarSubtipos?: number[];
  listarEstados?: number[];
  descUsuarioAutor: string;
  idRolUsuarioAutor: string;
  descRolUsuarioAutor: string;
  categoriaDocumentoEnum: number;
  subTipoDocumento: number;
  estadoOrigenDocumento: number;
  estadoDestinoDocumento: number;
  idAplicacion: string;
  subsanacionReadonly:boolean;
  conActualizacionColaboradores:boolean;
  esConsultaSolicitud:boolean;
  idVersionFlujo:string;
  idFlujo:string;
  conFinalizacionFirma:boolean;
}

export interface IConfiguracionDocumento{
  estadoDestinoDocumento: number;
  listarEstados:number[];
  listarSubtipos: number[];
}

export interface IConfiguracionBase<T> {
  name: string;
  code: string;
  readOnly: boolean;
  visible: boolean;
  settings: T;
}

export interface IConfiguracionTabs {
  configuracionDatosGenerales: IConfiguracionBase<IConfiguracionDatosGenerales>;
  configuracionFormatos: IConfiguracionBase<IConfiguracionDatosGenerales>;
  configuracionSolicitud: IConfiguracionBase<IConfiguracionSolicitud>;
  configuracionMedioVerificacion: IConfiguracionBase<IConfiguracionMedioVerificacion>;
  configuracionRecibidos: IConfiguracionBase<IConfiguracionRecibidos>;
  configuracionEnviados: IConfiguracionBase<IConfiguracionEnviados>;
  configuracionArchivoTestigo: IConfiguracionBase<IConfiguracionArchivoTestigo>;
  configuracionFirmantes: IConfiguracionBase<IConfiguracionFirmantes>;

  configuracionDocumentosOperacion: IConfiguracionBase<IConfiguracionFirmantes>;


  configuracionFirmaMedioVerificacion: IConfiguracionBase<IConfiguracionFirma>;
  //configuracionFirmaArchivoTestigo: IConfiguracionBase<IConfiguracionFirma>;
  // Otros
  configuracionEntidades: IConfiguracionBase<any>;
  configuracionRepresentanteLegal: IConfiguracionBase<any>;
  configuracionHorarioUACTD: IConfiguracionBase<any>;
}
export interface IConfiguracionAsincrono {
  esFinalizarAsincrono: boolean;
}

export interface IConfiguracionSolicitud {
  mostrarVersion: boolean;
}
export interface IConfiguracionMedioVerificacion {
  conHistorial: boolean;
  conComentarioAutor: boolean;
}
export interface IConfiguracionFirma {
  //conFirma: boolean;
  esFirmaAT:boolean;
  esFirmaDocumento:boolean;
}
export interface IConfiguracionRecibidos { }
export interface IConfiguracionEnviados { }

export interface IConfiguracionDocumentosOperacion { };


export interface IConfiguracionDatosGenerales {
  mostrarVersion: boolean;
}
export interface IConfiguracionArchivoTestigo {
  conFirma: boolean;
}
export interface IConfiguracionFirmantes { }
