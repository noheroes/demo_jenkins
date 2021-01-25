import { FormType, IComboList } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';

export interface IMetadataArchivo{
  archivoContentType?:string;
  archivoNombre?:string;
  archivoPesoEnBytes?:number;
  estadoRS?:number;
  formatoArchivoContenidoEnum?:number;
  trackingNumber?:string;
}

export interface IDocumento {
  subtipoEspecializacion: string,
  estadoDocumento: string,
  fechaEmision: string,
  numeroDocumento: string,
  idArchivo: string,
  metadataArchivo?:IMetadataArchivo
}

export interface IFaseOrigenDocumento {
  isExpanded: boolean;
  documentsCount: number;
  idFase: number,
  descripcion: string,
  documentosFase: IDocumento[]
}

export interface ITipoDocumentos{
  idSubtipo:number;
  nombre:string;
  esActivo:boolean;
}
export interface ITipoDocumento{
  tipoDocumento:string;
}

export interface IDocumentoConsultaGeneral {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<ITipoDocumento>;
  isSolicitudVersion: string;
  modelData: IFormularioModel;
  fasesOrigen: IFaseOrigenDocumento[];
  tipoDocumentos: ITipoDocumentos[];
  comboLists: {
    tiposDocumentos:IComboList;
  };
}

export interface IFormDocumento{
  tipoDocumento:string;
  nombreOficial:string;
  fechaEmision:string;
  numero:string;
  tipo:string;
  descripcion:string;
}

export interface IModalDocumento {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormDocumento>;
  tipo:any;
  comboLists: {
  };
}
