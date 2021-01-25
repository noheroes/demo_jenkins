import { FormType, IComboList, IDataGridDefinition, IDataGridSource } from '@sunedu/shared';

export interface IFormLocal {
    codigoSedeFilial: string;    
    codigo: string;
    ubicacion: string;
    esServicioEducativo: boolean;
    esServicioEducativoComplementario: boolean;
    esOtroServicio: boolean;
    otroServicio: string;
    resolucionAutorizacion: string;
    fechaAutorizacion: string;
    ubigeo: string;
    descripcionUbigeo: string;
    nombreDepartamento: string;
    nombreProvincia: string;
    nombreDistrito: string;
    direccion: string;
    referencia: string;
    areaTerreno: string;
    areaConstruida: string;
    aforo: string;
    telefono: string;
    cantidadEstudiantes: string;
    comentarios: string;    
}

export interface IModalLocal {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: IFormLocal;
  codigoLocal?: string;
  codigoSedeFilial?: string;
  idVersion?: string;
  ubigeo?: string;
  codigo?: string;
  comboLists: {
    departamentos: IComboList;
    provincias: IComboList;
    distrito: IComboList;
  };
}

export interface IBuscardorLocal {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorLocal>>;
  formBuscar: Partial<IFormBuscardorLocal>;
  readOnly?:boolean;
}
export interface IGridBuscardorLocal {
  codigoLocal: string;
  departamento: string;
  provincia: string;
  distrito: string;
}
export interface IFormBuscardorLocal {
  id: string;
  idVersion: string;
}
