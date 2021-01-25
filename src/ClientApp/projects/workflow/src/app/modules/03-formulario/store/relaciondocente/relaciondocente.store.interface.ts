import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
export interface IFromAgregarRelacionDocente {
  id: string;
  idLocal: string;
  idPersona: string;
  tipoPersona: string;
  descripcionDocente: string;
  mayorGrado: string;
}
export interface IAgregarRelacionDocente {
  isLoading: boolean;
  error: any;
  type: FormType;
  title: string;
  form: IFromAgregarRelacionDocente;
  idVersion?: string;
  idSedeFilial?: string;
  comboLists: {
    personas: IComboList;
  };
}
export interface IBuscardorRelacionDocente {
  isLoading: boolean;
  error: any;
  idVersion: string;
  idSedeFilial: string;
  idLocal: string;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorRelacionDocente>>;
  formBuscar: Partial<IFormBuscardorRelacionDocente>;
  readOnly?:boolean;
}
export interface IGridBuscardorRelacionDocente {
  id: string;
  persona: string;
  mayorGrado: string;
}
export interface IFormBuscardorRelacionDocente {
  id: string;
}

export enum TIPO_PERSONA {
  DOCENTE = 1,
  NODOCENTE = 2
}
export interface IRequestRelacionDocente {
  idVersion: string;
  idSedeFilial: string;
}
