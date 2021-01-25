export interface IBandejaActividad {
  IdProceso: string;
  IdProcesoBandeja: string;
  NroExpediente: string;
  Administrado: string;
  Procedimiento: string;
  Actividad: string;
  FechaSolicitud: Date;
  FechaAsignacion: Date;
  Formulario: string;
  IdFlujo: string;
  ConfirmarAutoasignacion: boolean;
  Estado: string;
  FechaCreacion: Date;
}
