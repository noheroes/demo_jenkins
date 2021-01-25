import { FormType, IComboList, IDataGridDefinition, IDataGridPageRequest, IDataGridSource } from '@sunedu/shared';
import { IAudit } from '@lic/core';
export interface IRequestSolicitudVersion {
  idVersion: string;
  idSede:string;
  idLocal:string;
  tipoCBCEnum:string;
}
export interface IEntidadRequestValues{
  id:string;
  idVersion:string;
  idSedeFilial:string;
  idLocal:string;
  tipoCBCEnum:number;
}

export interface IEntidadPresupuesto extends IAudit {
  tipoCBCEnum:string;
  codigo: string;
  concepto:string;
  anioUnoPresupuesto:number;
  anioUnoEjecucion: number;
  anioDosPresupuesto: number;
  anioTresPresupuesto: number;
  anioCuatroPresupuesto: number;
  anioCincoPresupuesto: number;
  anioSeisPresupuesto: number;
  esOtroconcepto:boolean;
  readOnly:boolean;
}

export interface IFormPresupuesto {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadPresupuesto>;
  tipoCBCEnum: string;
  requestValues:IEntidadRequestValues;
  readOnly?:boolean;
}

export interface IBandejaPresupuesto {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaPresupuesto>>;
  sourceList:IGridMultiSourcePresupuesto[];
  sourceListTotales:IGridMultiSourcePresupuesto[];
  readOnly?:boolean;
  formRequest:Partial<IRequestSolicitudVersion>;
}
export interface IGridMultiSourcePresupuesto {
  tipoCBCEnum:string;
  pageRequest: IDataGridPageRequest;
  source: IDataGridSource<Partial<IGridBandejaPresupuesto>>;
}
export interface IGridBandejaPresupuesto {
  tipoCBCEnum:string;
  codigo: string;
  concepto:string;
  anioUnoPresupuesto:number;
  anioUnoEjecucion: number;
  anioDosPresupuesto: number;
  anioTresPresupuesto: number;
  anioCuatroPresupuesto: number;
  anioCincoPresupuesto: number;
  anioSeisPresupuesto: number;
  esOtroconcepto:boolean;
  readOnly:boolean;
}

