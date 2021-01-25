import { FormType, IComboList, IDataGridDefinition, IDataGridSource } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';

export interface IDocumentosConsulta{
  idBandeja:string;
  descBandeja:string;
  fechaRecepcionDesde:string;
  fechaRecepcionHasta:string;
  subTipoDocumentoDesc:string;
  fechaNotificacionDesde:string;
  fechaNotificacionHasta:string;
  archivoNombre:string;
  busqueda:string;
}

export interface IDocumentosConsultaForm {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IDocumentosConsulta>;
  isSolicitudVersion: string;
  modelData: IFormularioModel;
  // fasesOrigen: IFaseOrigenDocumento[];
  // tipoDocumentos: ITipoDocumentos[];
  // comboLists: {
  //   tiposDocumentos:IComboList;
  // };
}


/** BANDEJA GRILLA */
export interface IGridBandejaDocumentosConsulta{
  id:string;
  idBandeja:string;
  //descBandeja:string;
  subtipoEspecializacion:string;
  archivoNombre:string;
  fechaRegistro:string;
  fechaNotificacion:string;
}
export interface IFormBuscardorDocumentoConsulta{
  // parametros de busqueda
  idBandeja:string;
  descBandeja:string;
  fechaRecepcionDesde:string;
  fechaRecepcionHasta:string;
  subTipoDocumentoDesc:string;
  fechaNotificacionDesde:string;
  fechaNotificacionHasta:string;
  archivoNombre:string;
}
export interface IBandejaDocumentosConsulta{
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<IGridBandejaDocumentosConsulta>;
  formBuscar: Partial<IFormBuscardorDocumentoConsulta>;
  subTiposDocumento:any[];
}


/** DOCUMENTOS MODAL ADD */

export interface IFormDocumentosConsulta{
  tipoDocumento:string;
  nombreOficial:string;
  fechaEmision:string;
  numero:string;
  tipo:string;
  descripcion:string;
}

export interface IModalDocumentosConsulta {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormDocumentosConsulta>;
  tipo:any;
  comboLists: {
  };
}
