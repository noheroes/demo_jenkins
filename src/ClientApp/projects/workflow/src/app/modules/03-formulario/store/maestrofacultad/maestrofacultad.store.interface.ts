import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
import { IAudit } from '@lic/core';

export interface IRequestSolicitudVersion {
  idVersion: string;
  idElemento:string;
}
export interface IGridBandejaMaestroFacultad {
  id: string;
  nombre: string;
  codigo:string;
}
export interface IBandejaMaestroFacultad {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaMaestroFacultad>>;
  formRequest:Partial<IRequestSolicitudVersion>;
  readOnly?:boolean;
}


export interface IEntidadMaestroFacultad extends IAudit {
  id: string;
  codigo: string;
  nombre: string;
  fechaCreacionFacultad:string;
  numeroResolucion:string;
  organoCreacion:string;
}
export interface IFormMaestroFacultad {
  formRequest: Partial<IRequestSolicitudVersion>;
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadMaestroFacultad>;
}