import {
  IDataGridDefinition,
  IDataGridSource,
  IComboList,
  FormType
} from '@sunedu/shared';

export interface IFormBuscardorCargaMasiva {
  tipo: string;
  comboLists: {
    tipoCargaMasiva: IComboList;
  };
}
export interface IBuscardorCargaMasiva {
  isLoading: boolean;
  error: any;
  type: FormType;
  idVersion: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<any>;
  formBuscar: Partial<IFormBuscardorCargaMasiva>;
  form: IFormTarea;
  comboLists: {
    tipoCargaMasiva: IComboList;
  };
}

export interface IFormBuscardorCargaMasivaActividad {
  id: string;
}

export interface IBuscardorCargaMasivaActividad {
  isLoading: boolean;
  title: string;
  error: any;
  type: FormType;
  idVersion: string;
  idTarea: string;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<any>;
  formBuscar: Partial<IFormBuscardorCargaMasiva>;
}


export interface IFormTarea {
  idVersion: string;
  tipoCargaEnum: string;
  tipoCargaDescripcion: string;
  estadoEnum: string;
  estadoDesc: string;
  idArchivo: string;  
  idArchivoTemporal: string;  
  actividad: Partial<IActividad>;
}

export interface IActividad {
  descripcion: string;
  descripcionServidor: string;  
}