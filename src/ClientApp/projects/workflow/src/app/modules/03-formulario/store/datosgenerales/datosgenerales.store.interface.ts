import { IAudit } from './../../../../../../../../src/app/core/interfaces/audit.interface';
import { FormType, IDataGridDefinition, IDataGridSource, IComboList } from '@sunedu/shared';
import { AppAudit, IFormularioModel } from '@lic/core';

export interface IFormDatosGenerales {
  nombre: string;
  ruc: string;
  razonSocial: string;
  numeroDocumentoCreacion: string;
  fechaDocumentoCreacion: Date;
  tipoGestionEnum: number;
  tipoModalidadCreacionEnum: string;

  domicilio: string;
  nombreDepartamento: string;
  nombreProvincia: string;
  nombreDistrito: string;
  referencia: string;
  telefono: string;
  paginaWeb: string;

  //codigoUbigeoRef: string;

  nombrePromotora: string;
  numeroDocumento: string;
  razonSocialPromotora: string;
  oficinaRegitral: string;
  numeroPartida: string;
  asiento: string;
  domicilioLegal: string;
  nombreDepartamentoPromotora: string;
  nombreProvinciaPromotora: string;
  nombreDistritoPromotora: string;

  //rubro: string;
  //codigoUbigeoRefPromotora: string;
  //tipoDocumentoEnum: string;

}

export interface IDatosGenerales {
  isLoading: boolean;
  error: any;
  idSolicitud: string;
  form:IFormDatosGenerales;
  modelData: IFormularioModel;
  comboLists: { };
  datosGeneralesBody:IDatosGeneralesBody;

}

export interface IBuscarRepresentanteLegal {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<IGridBuscardorRepresentanteLegal>;
  formBuscar: Partial<IFormBuscardorRepresentanteLegal>;
}

export interface IGridBuscardorRepresentanteLegal {
  nombresApellidos: string;
  tipoDocumento:string;
  numeroDocumento:string;
  esResponsable:string;
  cargo: string;
}
export interface IFormBuscardorRepresentanteLegal {
  codigo: string;
}
export interface IFormRepresentanteLegal {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  cargo: string;
  oficinaRegistral: string;
  numeroPartida: string;
  asiento: string;
  domicilioLegal: string;
  ubigeo: string;
  telefono: string;
  correo: string;
 

  //codigoTipoDocumento?: string;
  tipoDocumentoEnum?: string;
  numeroCasillaElectronica?: string;

  nombresApellidos?:string;

  nombreDepartamento: string;
  nombreProvincia: string;
  nombreDistrito: string;
  esResponsable:string;
  //token?: string;
}

export interface IModalRepresentanteLegal {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormRepresentanteLegal>;
  tipoDocumento:string;
  numeroDocumento: string;
  comboLists: {
    // tipoDocumentos: IComboList;
    // departamentos: IComboList;
    // provincias: IComboList;
    // distritos: IComboList;
  };
}

// CAYL
export interface IEntidad{
  nombre:string;
  ruc:string;
  razonSocial:string;
  numeroDocumentoCreacion:string;
  fechaDocumentoCreacion:string;
  tipoGestionEnum:number;
  tipoModalidadCreacionEnum:number;
}

export interface IDomicilioLegal{
  domicilio:string;
  ubigeo:string;
  referencia:string;
  telefono:string;
  paginaWeb:string;
}

export interface IPromotora{
  tipoDocumentoEnum:string;
  numeroDocumento:string;
  nombreDenominacion:string;
  oficinaRegitral:string;
  numeroPartida:string;
  asiento:string;
  razonSocial:string;
  rubro:string;
  domicilioLegal:string;
  ubigeo:string;
}

export interface IRepresentantesLegales{
  tipoDocumentoEnum:string;
  numeroDocumento:string;
  nombres:string;
  apellidoPaterno:string;
  apellidoMaterno:string;
  telefono:string;
  correo:string;
  numeroCasillaElectronica:string;
  cargo:string;
  oficinaRegistral:string;
  numeroPartida:string;
  asiento:string;
  domicilioLegal:string;
  ubigeo:string;
  tipoOperacion?:string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  esResponsable:string;
  token?: string;
}

export interface IDatosGeneralesBody extends IAudit  {
  idVersion:string;
  entidad:IEntidad;
  domicilioLegal:IDomicilioLegal;
  promotora:IPromotora;
  representantesLegales:IRepresentantesLegales[];
  licenciado:boolean;
  estadoSolicitudEnum:string;
  etapaSolicitudEnum:string;
  fechaInicioSolicitud:string;
  // esEliminado:boolean;
  // esActivo:boolean;
  // usuarioCreacion:string;
  // fechaCreacion:string;
  // usuarioModificacion:string;
  // fechaModificacion:string;
  id:string;
  addedAtUtc:string;
  version:number
}
