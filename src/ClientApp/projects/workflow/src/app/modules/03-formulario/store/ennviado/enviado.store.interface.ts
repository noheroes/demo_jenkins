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

// export interface ITipoDocumentos{
//   idSubtipo:number;
//   nombre:string;
//   esActivo:boolean;
// }
export interface IEnviado{
  descActividad:string;
  archivoNombre:string;
  subTipoDocumentoDesc:string;
  fechaCargaDesde:string;
  numeroDocumento:string;
  fechaCargaHasta:string;
  estadoDocumento:string;
  tipoDocumento:string;
}

export interface IEnviadoConsultaGeneral {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IEnviado>;
  isSolicitudVersion: string;
  modelData: IFormularioModel;
  // fasesOrigen: IFaseOrigenDocumento[];
  // tipoDocumentos: ITipoDocumentos[];
  // comboLists: {
  //   tiposDocumentos:IComboList;
  // };
}

export interface IFormEnviado{
  tipoDocumento:string;
  nombreOficial:string;
  fechaEmision:string;
  numero:string;
  tipo:string;
}

export interface IModalEnviado {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormEnviado>;
  tipo:any;
  comboLists: {
  };
}
