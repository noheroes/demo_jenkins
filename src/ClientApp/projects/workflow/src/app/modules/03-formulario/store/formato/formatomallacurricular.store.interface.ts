import { IDataGridDefinition, IDataGridSource, FormType, IComboList } from '@sunedu/shared';

export interface IMallaCurricular {
  codigoPrograma: string;
  codigoModalidadEstudio: string;
  fechaPlanCurricular: Date;
  codigoRegimenEstudio: string;
  periodoAcademico: string;
  duracionProgramaAnios: string;
  duracionProgramaSemanas: string;
  valorCreditoHorasTeoricas: string;
  valorCreditoHorasPracticas: string;
}
export interface IModalMallaCurricular {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  mallaCurricular: Partial<IMallaCurricular>;
  codigoMallaCurricular?: string;
}
export interface ICurso {
  codigoCurso: string;

}
export interface IModalCurso {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  curso: Partial<ICurso>;
  codigoCurso?: string;
}
export interface IBuscardorCurso {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IFormBuscardorCurso>>;
  formBuscar: Partial<IFormBuscardorCurso>;
  comboLists: {
    tipoPrograma: { text: string, value: number; }[];
    tipoModalidad: { text: string, value: number; }[];
  };
}

export interface IFormBuscardorCurso {
  id: string;

}

export interface IOpcionMallaCurricular {
  modalMallaCurricular: IModalMallaCurricular;
  buscarMallCurricular: IBuscardorMallaCurricular;
  modalCurso: IModalCurso;
  buscardorCurso: IBuscardorCurso;
}
export interface IFormato {
  currentForm: string;
  mallaCurricular: IOpcionMallaCurricular;
  comboList?:{
    sedes:IComboList
  }
}
export interface IBuscardorMallaCurricular {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IFormBuscardorMallaCurricular>>;
  formBuscar: Partial<IFormBuscardorMallaCurricular>;
  comboLists: {
    tipoPrograma: { text: string, value: number; }[];
    tipoModalidad: { text: string, value: number; }[];
  };
}

export interface IFormBuscardorMallaCurricular {
  id: string;
  codigoPrograma: string;
  programa: string;
  codigoModalidad: string;
  modalidad: string;
  numeroResolucion: string;
  fechaPlanCurricular: Date;
}

