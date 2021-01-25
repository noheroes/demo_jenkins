import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';

export interface IBuscardorCurso {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorCurso>>;
  formBuscar: Partial<IFormBuscardorCurso>;
  idMallaCurricular: string;
  idVersion: string;
  descripcionPrograma: string,//De Programa (Extendido)
  duracionProgramaEnSemanas: string, //De Programa (Extendido)
  //modalidadEstudioEnum: number; //De Programa (Extendido)
  //regimenEstudioEnum: number; //De Programa (Extendido)
  comboLists: {
    perdiodoAcademicos: IComboList;
    tipoEstudios: IComboList;
    tipoCursos: IComboList;
  };
  readOnly?:boolean;
}
export interface IGridBuscardorCurso {
  codigoCurso: string;
  codigoPeriodoAcademico: string;
  codigoTipoCurso: string;
  codigoTipoEstudio: string;
  nombreCurso: string;
  numeroTotalSemanas: string;
}
export interface IFormBuscardorCurso {
  codigoCurso: string;
  codigoPeriodoAcademico: string;
  codigoTipoCurso: string;
  codigoTipoEstudio: string;
  nombreCurso: string;
  numeroTotalSemanas: string;
  idVersion: string;
}


export interface IFormCurso {
  tipoPeriodoAcademico: string;
  codigo: string;
  nombre: string;
  tipoEstudioEnum: string;
  descripcionEstudio: string;
  tipoCursoEnum: string;
  descripcionTipoCurso: string;
  totalSemanas: string;
  creditosAcademicos: number;
}
export interface IModalCurso {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormCurso>;
  codigoCurso?: string;
  idVersion?: string;
  idMallaCurricular?: string;
  duracionProgramaEnSemanas?: string;
  comboLists: {
    perdiodoAcademicos: IComboList;
    tipoEstudios: IComboList;
    tipoCursos: IComboList;
  };
}

export interface IFormHoraLectivaCurso {
  tipoHoraLectivaEnum: string;
  descripcionHoraLectiva: string;
  cantidad: number;
}

export interface IModalHoraLectivaCurso {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormHoraLectivaCurso>;
  codigoHoraLectiva?: string;
  idVersion?: string;
  idMallaCurricular?: string;
  idCurso: string;
  comboLists: {
    horaLectivas: IComboList;
  };
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IFormHoraLectivaCurso>>;
  readOnly?:boolean;
}

export interface IFormPreRequisitoCurso {
  codigo:string;
  nombre: string;
  totalSemanas:number;
}

export interface IModalPreRequisitoCurso {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormPreRequisitoCurso>;
  cursos?: any;
  idVersion?: string;
  idMallaCurricular?: string;
  idCurso: string;
  comboLists: {
    cursos: IComboList;
  };
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IFormPreRequisitoCurso>>;
  readOnly?:boolean;
}