
import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';

export interface IRequestTaller {
  id: string;
  idVersion: string;
  idSedeFilial: string;
  idLocal: string;
  listTipoTaller: any;
}

//Bandeja Taller
export interface IBandejaTaller {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaTaller>>;
  form: IRequestTaller;    
  readOnly?:boolean;
}
export interface IGridBandejaTaller {
  id: string;
  numeroOrden: string;
  numeroTaller: string;
  nombreTaller: string;
  tipoTaller: string;
  referenciaUbicacionTaller: string;
}
//Entidad Taller
export interface IEntidadTaller {
  id: string;
  codigoLocal: string;
  idLocal: string;    
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

export interface IFormTaller {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadTaller>;
  codigoTaller?: string;
  idVersion?: string;
  idSedeFilial?: string;
  idLocal?: string;
  codigoLocal?: string;
  comboLists: {
    tipoTalleres: IComboList;
  };
}
//Entidad TallerPrograma
export interface IEntidadTallerPrograma{
  idPrograma: string;
  programaMencion: string;
  facultad: string;
  gradoAcademico: string;
  titulo: string;
  codigoProgramaVinculado: string;
}
export interface IGridBandejaTallerPrograma {
  id: string;
  numeroOrden: string;
  programaMencion: string;
  facultad: string;
  gradoAcademico: string;
  titulo: string;
}

export interface IFormTallerPrograma {
  title: string;  
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidadTallerPrograma>;
  codigoTaller?: string;
  idVersion?: string,
  idSedeFilial: string,
  idLocal: string,
  idPrograma?: string,
  idTaller?: string,
  formato: any[];
  formatoDetalle: any[];
  comboLists: {
    programas: IComboList;
  };
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBandejaTallerPrograma>>;
  allItems:any;
  readOnly?:boolean;
}