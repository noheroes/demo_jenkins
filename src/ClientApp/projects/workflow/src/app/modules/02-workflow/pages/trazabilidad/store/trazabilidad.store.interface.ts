import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
export interface IDataMemory{
  universidad:Array<IEntidadUniversidad>;
  estado:Array<IEntidadEstado>;
}
export interface IDataMemoryTrazabilidad{
  fechamin:string;
  fechamax:string;
  estado:Array<string>;
  actividad:Array<string>;
  responsable:Array<string>;
  rol:Array<string>;
  idProceso:string;
}
export interface IEntidadUniversidad{
  id:string;
  nombre:string;
}
export interface IEntidadEstado{
  value:number;
  text:string;
}
export interface IEntidadActividad{
  value:number;
  text:string;
}
export interface IEntidadResponsable{
  value:number;
  text:string;
}
export interface IEntidadRol{
  value:number;
  text:string;
}
export interface IBuscardorBandejaSolicitud {
    tipoUsuario:string;
    numeroSolicitud: string;
    idEntidad: string;
  }
export interface IBandejaSolicitud {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaSolicitud>>;
  formBuscar: Partial<IBuscardorBandejaSolicitud>;
  dataMemory:Partial<IDataMemory>;
  comboLists: {
    universidades: IComboList;
  };
  readOnly?:boolean;
}
export interface IGridBandejaSolicitud {
  id: string;
  numeroSolicitud: string;
  universidad: string;
  procedimiento: string;
  fechaCreacion: Date;
  estado: string;
}
export interface IEntidadSolicitud {
  id: string;
  numeroSolicitud: string;
  universidad: string;
  fechaCreacion: Date;
  estado: string;
}

export interface IBandejaTrazabilidad {
    isLoading: boolean;
    error: any;
    type: FormType;
    title:string;
    gridDefinition: IDataGridDefinition;
    source: IDataGridSource<Partial<IGridBandejaTrazabilidad>>;
    formBuscar: Partial<IBuscadorBandejaTrazabilidad>;
    dataMemory:Partial<IDataMemoryTrazabilidad>;
    comboLists: {
      actividades: IComboList;
      responsables: IComboList;
      estados: IComboList;
      roles: IComboList;
    };

    readOnly?:boolean;
}
export interface IGridBandejaTrazabilidad {
    fechaCreacion: string;
    fechaFinalizacion: string;
    pasoNombre: string;
    responsableRol: string;
    responsable: string;
    respuestaRuta: string;
    estado: string;
  }
  export interface ITrazabilidadRequest {
    filter:Partial<IBuscadorBandejaTrazabilidad>;
  }
  export interface ITrazabilidadResponse{
    listUnicos: Array<ITrazabilidadDistinct>
    proceso:Array<IGridBandejaTrazabilidad>;
  }
  export interface ITrazabilidadDistinct{
    fechaMinimo: string,
    fechaMaximo: string,
    pasoNombre: Array<string>,
    responsable: Array<string>,
    estado: Array<string>
    rol: Array<string>,
  }

  export interface IBuscadorBandejaTrazabilidad {
    idProceso:string;
    tipoUsuario:string;
    fechaMinimo: string;
    fechaMaximo: string;
    pasoNombre: string;
    responsable: string;
    estado: string;
    rol: string;
    page:number;
    pageSize:number;
  }

export enum ENU_Util {
  OTRO = 5
}
