import { IDataGridDefinition, IDataGridSource, FormType } from '@sunedu/shared';

export interface ICurso {
  nombreCurso: string;
  codigoCurso: string;
  codigoTipoEstudio: string;
  codigoTipoCurso: string;
  codigoPeriodoAcademico: string;
  numeroTotalSemanas: string;
}
export interface IModalCurso {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  curso: Partial<ICurso>;
  codigoCurso?: string;
}
export interface ICurso {
  codigoCurso: string;
}

export interface IFormatoCurso {
  currentForm: string;
  curso: IOpcionCurso;
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
    codigoTipoCurso: { text: string, value: number; }[];
    codigoEstudio: { text: string, value: number; }[];
  };
}

export interface IOpcionCurso {
  modalCurso: IModalCurso;
  buscardorCurso: IBuscardorCurso;
}
export interface IFormatoCurso {
  currentForm: string;
  curso: IOpcionCurso;
}
export interface IFormBuscardorCurso {
  id: string;
  nombreCurso: string;
  codigoTipoCurso: string;
  codigoEstudio: string;
}
