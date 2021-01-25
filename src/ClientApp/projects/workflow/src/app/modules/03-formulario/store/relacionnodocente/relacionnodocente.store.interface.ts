import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
export interface IFromAgregarRelacionNoDocente {
  id: string;
  idLocal: string;
  idPersona: string;
  tipoPersona: string;
  descripcionDocente: string;
  mayorGrado: string;
}
export interface IAgregarRelacionNoDocente {
  isLoading: boolean;
  error: any;
  type: FormType;
  title: string;
  form: IFromAgregarRelacionNoDocente;
  idVersion?: string;
  idSedeFilial?: string;
  comboLists: {
    personas: IComboList;
  };
}
export interface IBuscardorRelacionNoDocente {
  isLoading: boolean;
  error: any;
  idVersion: string;
  idSedeFilial: string;
  idLocal: string;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorRelacionNoDocente>>;
  formBuscar: Partial<IFormBuscardorRelacionNoDocente>;
  readOnly?:boolean;
}
export interface IGridBuscardorRelacionNoDocente {
  id: string;
  persona: string;
  mayorGrado: string;
}
export interface IFormBuscardorRelacionNoDocente {
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
