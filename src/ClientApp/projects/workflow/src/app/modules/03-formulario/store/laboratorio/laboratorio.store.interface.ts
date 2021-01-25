
import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';


export interface IRequestLaboratorio {
  id: string;
  idVersion: string;
  idSedeFilial: string;
  idLocal: string;
  listTipoLaboratorio: any;
  codigoLocal: string;
}
//Bandeja Laboratorio
export interface IBandejaLaboratorio {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaLaboratorio>>;
  form: IRequestLaboratorio;
  readOnly?:boolean;
}

export interface IGridBandejaLaboratorio {
  id: string;
  numeroOrden: string;
  codigo: string;
  nombre: string;
  tipoLaboratorioTallerEnum: string;
  ubicacion: string;
}
//Entidad Laboratorio
export interface IEntidadLaboratorio {
  id: string;
  codigoLocal: string;
  idLocal: string;  
  numero: string;
  codigo: string;
  nombre: string;
  tipoLaboratorioTallerEnum: string;
  ubicacion: string;
  programa: Partial<IPrograma>;
  aforo: string;
  comentario: string;
  cantidadProgramaVinculado: string;
}

export interface IPrograma {
  idPrograma: string;
  programaMencion: string;
  facultad: string;
  gradoAcademico: string;
  titulo: string;
}

export interface IFormLaboratorio {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadLaboratorio>;
  codigoLaboratorio?: string;
  idVersion?: string;
  idSedeFilial?: string;
  idLocal?: string;
  codigoLocal?: string;
  comboLists: {
    tipoLaboratorios: IComboList;
  };
  //laboratorioBody:
}
//Entidad LaboratorioPrograma
export interface IEntidadLaboratorioPrograma {
  codigoProgramaVinculado: string;
}
export interface IGridBandejaLaboratorioPrograma {
  id: string;
  numeroOrden: string;
  programaMencion: string;
  factultad: string;
  gradoAcademico: string;
  titulo: string;
}
export interface IBandejaLaboratorioPrograma {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaLaboratorioPrograma>>
}
export interface IGridBandejaPrograma {
  programaMencion: string;
  facultad: string;
  gradoAcademico: string;
  titulo: string;
}
export interface IFormLaboratorioPrograma {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadLaboratorioPrograma>;
  codigoLaboratorio?: string;
  idVersion: string;
  idSedeFilial: string;
  idLaboratorio: string;
  formato: any[];
  formatoDetalle: any[];
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaPrograma>>;
  comboLists: {
    programas: IComboList;
  };
  allItems:any;
  readOnly?:boolean;
}

export interface IFormato {
  currentForm: string;
}