import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';

export interface IBuscardorMallaCurricular {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorMallaCurricular>>;
  formBuscar: Partial<IFormBuscardorMallaCurricular>;
  comboLists: {
    programas: IComboList;
  };
  readOnly?:boolean;
}
export interface IGridBuscardorMallaCurricular {
  id: string;
  programa: string;
  modalidad: string;
  numeroResolucion: string;
  fechaPlanCurricular: Date;
  idPrograma: string;
  descripcionPrograma:string,
}
export interface IFormBuscardorMallaCurricular {
  codigoPrograma: string;
  codigoModalidad: string;
  numeroResolucion: string;
  fechaPlanCurricular: Date;
  idVersion: string;
}


export interface IFormMallaCurricular {
  idPrograma: string;
  descripcionModalidad: string;
  fechaElaboracion: Date;
  tipoRegimenEstudioEnum: string;
  descripcionRegimen: string;
  conOtroRegimen: boolean;
  otroRegimen: string;
  numeroPeriodo: number;
  duracionProgramaAnios: number;
  duracionProgramaSemanas: number;
  valorCreditoTeorica: number;
  valorCreditoPractica: number;
  modalidadEstudioEnum: number;
}
export interface IModalMallaCurricular {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormMallaCurricular>;
  codigoMallaCurricular?: string;
  idPrograma?: string;
  idVersion?: string;
  comboLists: {
    programas: IComboList;
    modalidadEstudios: IComboList;
    regimenEstudios: IComboList;
  };
}

export interface IGridResumenMalla {
  Id: string;
  Teoria: string;
  Practica: string;
  Total: string;
  PorcentajeTotal: string;
}

export interface IFormResumenMalla {
  ResumenMalla: Array<IGridResumenMalla>;
}

export interface IModalResumenMalla {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormResumenMalla>;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridResumenMalla>>;
  codigoMaestroPersona?: string;
}
export enum ENU_IDREGIMENESTUDIO {
  OTRO = 5
}
