import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
import { IAudit } from '@lic/core';
export interface IRequestSolicitudVersion {
  idVersion: string;
}
//Buscador
export interface IEntidadBuscador {
  idSedeFilial:string
  idLocal: string;
  modalidadEstudio: string;
  programaMencion: string;
  facultad: string;
}
export interface IBuscadorPrograma {
  isLoading: boolean; 
  error: any;
  form: Partial<IEntidadBuscador>;
  comboLists: {
    modalidadEstudios:IComboList;
  };
}
//Bandeja
export interface IEntidadProgramaMencionSedeFilial{
  IdLocal:string;
  IdPrograma:string;
  DenominacionPrograma:string;
  Facultad:string;
  GradoAcademico:string;
  Titulo:string;
  Id:string;
}
export interface IGridBandejaPrograma {
  id: string;
  numero: string;
  denominacionPrograma: string;
  facultad: string; 
  gradoAcademico: string;
  titulo: string;
  idPrograma:string;
}
export interface IEntidadPrograma extends IAudit{
  id:string;
  denominacionPrograma: string;
  idFacultad:string;
  denominacionGradoAcademico:string;
  idPrograma:string;
  denominacionTituloOtorgado:string;
}
export interface IBandejaPrograma {
  isLoading: boolean; 
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaPrograma>>;
  form: Partial<IEntidadPrograma>;
  comboLists: {
    listadoProgramas:IComboList;
  };
  formBuscar:Partial<IBuscadorPrograma>;
  formRequest:Partial<IRequestSolicitudVersion>;
  idPrograma:string;
  programas:any;
  allItems:any;
  readOnly?:boolean;
}


