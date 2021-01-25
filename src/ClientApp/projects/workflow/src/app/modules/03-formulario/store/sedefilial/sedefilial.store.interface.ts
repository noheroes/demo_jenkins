import { FormType, IComboList, IDataGridDefinition, IDataGridSource } from '@sunedu/shared';

export interface IFormSedeFilial {
  id: string;
  codigo: string;
  ubigeo: string;
  descripcionUbigeo: string;
  esSedeFilial: boolean;
  nombreDepartamento: string;
  nombreProvincia: string;
  locales: Partial<Array<ILocal>>;
  cantidadLocal: string;
}

export interface ILocal {
  codigoSedeFilial: string;
  numeroLocal: string;
  codigoLocal: string;
  servicioEducativo: boolean;
  servicioEducacionalesComplementarios: boolean;
  otrosServicio: boolean;
  otroTipoServicio: string;
  resolucionAutorizacion: string;
  fechaAutorizacion: string;
  codigoUbigeoRef: string;
  nombreDepartamento: string;
  nombreProvincia: string;
  nombreDistrito: string;
  direccion: string;
  referencia: string;
  areaTerreno: string;
  areaConstruida: string;
  aforoLocal: string;
  telefonoLocal: string;
  cantidadEstudiantes: string;
  comentarios: string;
}

export interface IModalSedeFilial {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: IFormSedeFilial;  
  codigoSedeFilial?: string;  
  idVersion?: string;
  comboLists: {
    nombreDepartamento: IComboList;
    nombreProvincia: IComboList;
  };
  listSedes:any;
}

export interface IBuscardorSedeFilial {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorSedeFilial>>;
  formBuscar: Partial<IFormBuscardorSedeFilial>;
  readOnly?:boolean;
}
export interface IGridBuscardorSedeFilial {
  id: string;
  codigo: string;
  ubigeo: string;
  descripcionUbigeo: string;
  esSedeFilial: string;
}
export interface IFormBuscardorSedeFilial {
  id: string;
  idVersion: string;
}

export interface IFormato {
  currentForm: string;
}
