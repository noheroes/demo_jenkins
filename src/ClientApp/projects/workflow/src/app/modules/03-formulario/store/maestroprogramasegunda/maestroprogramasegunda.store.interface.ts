import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
import { IAudit } from '@lic/core';
export interface IRequestSolicitudVersion {
  idVersion: string;
}
export interface IBandejaMaestroPrograma {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaMaestroPrograma>>;
  formRequest:Partial<IRequestSolicitudVersion>;
  codigoGenerado:string;
  formResponse:any;
  cine:any;
  readOnly?:boolean;
}
export interface IGridBandejaMaestroPrograma {
  id: string;
  numeroPrograma: string;
  codigoPrograma: string;
  resolucionCreacion: string;
  fechaCreacion: string;
  modalidadEstudio: string;
  resolucionCreacionModalidad: string;
  fechaCreacionModalidad: string;
  nombreFacultad: string;
  regimenEstudio: string;
  gradoAcademico: string;
  denominacionGradoAcademico: string;
  denominacionTituloOtorgado: string;
  denominacionClasificadorCINE: string;
  denominacionProgramaEstudioMencion: string;
  comentarios: string;
}

export interface IEntidadMaestroPrograma  extends IAudit{
  id: string;
  codigo: string;
  resolucionCreacion: string;
  fechaCreacionResolucion: string;
  modalidadEstudioEnum: string;
  resolucionCreacionModalidad: string;
  fechaCreacionModalidad: string;
  idFacultad: string;
  descripcionFacultad:string;
  regimenEstudioEnum: string;
  tipoGradoAcademicoEnum: string;
  denominacionGradoAcademico: string;
  denominacionTituloOtorgado: string;
  codigoCINE: string;
  descripcionCINE:string;
  denominacionPrograma: string;
  comentario: string;
}
export interface IFormMaestroPrograma {
  idVersion: string;
  id:string;
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadMaestroPrograma>;
  codigoGenerado?: string;
  comboLists: {
    modalidadEstudios: IComboList;
    nombreFacultades: IComboList;
    regimenEstudios: IComboList;
    gradoAcademicos: IComboList;
    denominacionClasificadorCINEs: IComboList;
  };
  facultades:any;
  cine:any;
}

export interface IExternalPrograma{
  id:number;
  nombre:string;
  denominacionCompleta:string;
}

/** SEGUNDA */


//Bandeja
export interface IBandejaMaestroProgramaSegunda {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaMaestroProgramaSegunda>>;
  formRequest:Partial<IRequestSolicitudVersion>;
  codigoGenerado:string;
  formResponse:any;
  cine:any;
  programasResponse:any;
  readOnly?:boolean;
}
export interface IGridBandejaMaestroProgramaSegunda {
  id: string;
  codigo: string;
  denominacionTituloOtorgado: string;
  codigoCINE: string;
  denominacionPrograma: string;
  resolucionCreacionModalidad: string;
  fechaCreacionModalidad: string;
  idFacultad: string;
  regimenEstudioEnum: string;
}

//Form Entidad
export interface IEntidadMaestroProgramaSegunda extends IAudit{
  id: string;
  codigo: string;
  denominacionTituloOtorgado: string;
  codigoCINE: string;
  descripcionCINE:string;
  denominacionPrograma: string;
  resolucionCreacionModalidad: string;
  fechaCreacionModalidad: string;
  idFacultad: string;
  descripcionFacultad:string;
  regimenEstudioEnum: string;
}

export interface IFormMaestroProgramaSegunda {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadMaestroProgramaSegunda>;
  id: string;
  codigoGenerado?: string;
  comboLists: {
    denominacionClasificadorCINEs: IComboList;
    nombreFacultades: IComboList;
    regimenEstudios: IComboList;
  };
  facultades:any;
  cine:any;
  idVersion:string;
}

//Form Vinculado
export interface IGridBandejaMaestroProgramaVinculado {
  id: string;
  numero: number;
  denominacionPrograma: string;
}
export interface IBandejaMaestroProgramaVinculado {
  isLoading: boolean;
  error: any;
  type: FormType;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaMaestroProgramaVinculado>>;
  form: Partial<IEntidadMaestroProgramaVinculado>;
  programaVinculado:string;
  id:string;
  formRequest:Partial<IRequestSolicitudVersion>;
  programas:any;
  programasSe:any;
  comboLists: {
    codigoProgramaVinculados:IComboList;
  };
  idPrograma:string;
  allItems:any;
  title:string;
  readOnly?:boolean;
}
export interface IEntidadMaestroProgramaVinculado {
  id: string;
  denominacionPrograma: string;
}

/** SEGUNDA */

export interface IRequestSolicitudVersion {
  idVersion: string;
}
//Bandeja
export interface IBandejaMaestroProgramaSegunda {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaMaestroProgramaSegunda>>;
  formRequest:Partial<IRequestSolicitudVersion>;
  codigoGenerado:string;
  formResponse:any;
  cine:any;
  programasResponse:any;
  readOnly?:boolean;
}
export interface IGridBandejaMaestroProgramaSegunda {
  id: string;
  codigo: string;
  denominacionTituloOtorgado: string;
  codigoCINE: string;
  denominacionPrograma: string;
  resolucionCreacionModalidad: string;
  fechaCreacionModalidad: string;
  idFacultad: string;
  regimenEstudioEnum: string;
}

//Form Entidad
export interface IEntidadMaestroProgramaSegunda extends IAudit{
  id: string;
  codigo: string;
  denominacionTituloOtorgado: string;
  codigoCINE: string;
  descripcionCINE:string;
  denominacionPrograma: string;
  resolucionCreacionModalidad: string;
  fechaCreacionModalidad: string;
  idFacultad: string;
  descripcionFacultad:string;
  regimenEstudioEnum: string;
  cantidadProgramaVinculado: string;
}

export interface IFormMaestroProgramaSe {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadMaestroProgramaSegunda>;
  id: string;
  codigoGenerado?: string;
  comboLists: {
    denominacionClasificadorCINEs: IComboList;
    nombreFacultades: IComboList;
    regimenEstudios: IComboList;
  };
  facultades:any;
  cine:any;
  idVersion:string;
}

//Form Vinculado
export interface IGridBandejaMaestroProgramaVinculado {
  id: string;
  numero: number;
  denominacionPrograma: string;
}
export interface IBandejaMaestroProgramaVinculado {
  isLoading: boolean;
  error: any;
  type: FormType;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaMaestroProgramaVinculado>>;
  form: Partial<IEntidadMaestroProgramaVinculado>;
  programaVinculado:string;
  id:string;
  formRequest:Partial<IRequestSolicitudVersion>;
  programas:any;
  programasSe:any;
  comboLists: {
    codigoProgramaVinculados:IComboList;
  };
  idPrograma:string;
  allItems:any;
  title:string;
  readOnly?:boolean;
}
export interface IEntidadMaestroProgramaVinculado {
  id: string;
  denominacionPrograma: string;
}


