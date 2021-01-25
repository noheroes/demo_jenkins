export interface IFiltroBandejaModel {
  Administrado: string;
  codigosFlujo: string;
  dtFechaDesde: Date;
  dtFechaHasta: Date;
  actividad: string;
  nroExpediente: string;
}
export interface IEntidad {
  id: string;
  nombre: string;  
}
export interface IActividad {
  ruta?: string;
  nombre: string;
  identificador: string;
}

export interface IBandejaActividad {
  rowNum: number;
  idProceso: string;
  idProcesoBandeja: string;
  nroExpediente: string;
  administrado: string;
  procedimiento: string;
  actividad: IActividad;
  entidad : IEntidad;
  // FechaSolicitud: Date;
  fechaAsignacion: Date;
  formulario: string;
  idFlujo: string;
  // ConfirmarAutoasignacion: boolean;
  Estado: string;
  fechaCreacion: Date;
}
