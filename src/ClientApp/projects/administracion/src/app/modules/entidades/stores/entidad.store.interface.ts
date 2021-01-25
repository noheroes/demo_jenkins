import {
  IDataGridDefinition,
  IDataGridSource,
  FormType,
  IComboList,
} from '@sunedu/shared';
import { IAudit } from '@lic/core';

export interface StatusResponse {
  id: string;
  success: boolean;
  message: string;
  details?: any;
}
export interface IModalEntidad {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEntidad>;
  id?: string;
  comboLists: {
    // locales: IComboList;
    // tieneInternet: IComboList;
    // regimenDedicaciones: IComboList;
  };
}

export interface IBuscardorEntidad {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  gridSource: IDataGridSource<Partial<IEntidad>>;
  formBuscar: Partial<IFormBuscardorEntidad>;
}
export interface RepresentanteLegal extends IAudit {
  tipoDocumentoEnum: number;
  numeroDocumento: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  telefono: string;
  correo: string;
  casillaElectronica: string;
  id: string;
  addedAtUtc: Date;
  version: number;
  esEditable: boolean;
  token: string;  
}
export interface RepresentanteLegalCustom extends RepresentanteLegal {
  rowNum: number;
  tipoDocumento: string;
  nombresApellidos: string;
}
export interface IEntidad extends IAudit {
  id: string;
  rowNum: number;
  nombre: string;
  razonSocial: string;
  ruc: string;
  esEditable: boolean;
  // programaMenciones: any[];
  // segundaEspecialidades: any[];
  // facultades: any[];
  representanteLegales: RepresentanteLegal[];
  token: string;
}

export interface IFormBuscardorEntidad {
  nombre: string;
}
