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
export interface IBuscadorProgramaSe {
  isLoading: boolean; 
  error: any;
  form: Partial<IEntidadBuscador>;
  comboLists: {
    modalidadEstudios:IComboList;
  };
}
//Bandeja
export interface IEntidadSegundaEspecialidadSedeFilial{
  idLocal:string;
  idSegundaEspecialidad:string;
  denominacionSegundaEspecialidad:string;
  facultad:string;
  gradoAcademico:string;
  titulo:string;
  id:string;
}
export interface IGridBandejaProgramaSe {
  id: string;
  numero: string;
  denominacionPrograma: string;
  facultad: string; 
  gradoAcademico: string;
  titulo: string;
  idPrograma:string;
}
export interface IEntidadProgramaSe extends IAudit {
  id:string;
  denominacionPrograma: string;
  idFacultad:string;
  denominacionGradoAcademico:string;
  idPrograma:string;
  denominacionTituloOtorgado:string;
}
export interface IBandejaProgramaSe {
  isLoading: boolean; 
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaProgramaSe>>;
  form: Partial<IEntidadProgramaSe>;
  comboLists: {
    listadoProgramas:IComboList;
  };
  formBuscar:Partial<IBuscadorProgramaSe>;
  formRequest:Partial<IRequestSolicitudVersion>;
  idProgramaSe:string;
  ProgramaSes:any;
  allItems:any;
  readOnly?:boolean;
}


