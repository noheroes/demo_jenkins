import { FormType, IComboList } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';

// export interface IMetadataArchivo{
//   archivoContentType?:string;
//   archivoNombre?:string;
//   archivoPesoEnBytes?:number;
//   estadoRS?:number;
//   formatoArchivoContenidoEnum?:number;
//   trackingNumber?:string;
// }

// export interface IEnviado {
//   subtipoEspecializacion: string,
//   estadoDocumento: string,
//   fechaEmision: string,
//   numeroDocumento: string,
//   idArchivo: string,
//   metadataArchivo?:IMetadataArchivo
// }

// export interface IFaseOrigenDocumento {
//   isExpanded: boolean;
//   documentsCount: number;
//   idFase: number,
//   descripcion: string,
//   documentosFase: IEnviado[]
// }

export interface ITipoDocumentos{
  idSubtipo:number;
  nombre:string;
  esActivo:boolean;
}
export interface IDocumentosOperacion{
  descActividad:string;
  archivoNombre:string;
  subTipoDocumentoDesc:string;
  fechaCargaDesde:string;
  numeroDocumento:string;
  fechaCargaHasta:string;
  estadoDocumento:string;
  tipoDocumento:string;
}

export interface IDocumentosOperacionForm {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IDocumentosOperacion>;
  isSolicitudVersion: string;
  modelData: IFormularioModel;
  tipoDocumentos: ITipoDocumentos[];
  // fasesOrigen: IFaseOrigenDocumento[];
  // tipoDocumentos: ITipoDocumentos[];
  // comboLists: {
  //   tiposDocumentos:IComboList;
  // };
}

export interface IFormDocumentosOperacion{
  tipoDocumento:string;
  nombreOficial:string;
  fechaEmision:string;
  numero:string;
  tipo:string;
  descripcion:string;
}

export interface IModalDocumentosOperacion {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormDocumentosOperacion>;
  tipo:any;
  comboLists: {
  };
}
