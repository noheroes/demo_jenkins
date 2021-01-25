//import { IFormularioModel } from '@lic/core';
import { FormType, IComboList, ComboList } from '@sunedu/shared';
import { IFormularioModel } from '../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IDocumentosOperacionForm, IDocumentosOperacion, IModalDocumentosOperacion, IFormDocumentosOperacion, ITipoDocumentos }
  from './documentos-operacion.store.interface';

export class DocumentosOperacionForm implements IDocumentosOperacionForm {
  title: 'Documentos';
  type: FormType = FormType.CONSULTAR;
  isLoading = false;
  error = null;
  form = new DocumentosOperacion();
  isSolicitudVersion = null;
  modelData: IFormularioModel = null;
  tipoDocumentos:TipoDocumentos[]=[];
  //fasesOrigen: FaseOrigenDocumento[] = [];
  
  // comboLists = {
  //   tiposDocumentos:  new ComboList([]),
  // };
}

export class DocumentosOperacion implements IDocumentosOperacion{
  descActividad=null;
  archivoNombre=null;
  numeroDocumento=null;
  subTipoDocumentoDesc=null;
  fechaCargaDesde=null;
  fechaCargaHasta=null;
  estadoDocumento=null;
  tipoDocumento=null;
}

export class TipoDocumentos implements ITipoDocumentos{
  idSubtipo:number;
  nombre:string;
  esActivo:boolean;
}
// export class FaseOrigenDocumento implements IFaseOrigenDocumento {
//   isExpanded: boolean;
//   documentsCount: number;
//   idFase: number;
//   descripcion: string;
//   documentosFase: Documento[];
// }

// export class Documento implements IEnviado {
//   subtipoEspecializacion: string;
//   estadoDocumento: string;
//   fechaEmision: string;
//   numeroDocumento: string;
//   idArchivo: string;
// }

export class FormDocumentosOperacion implements IFormDocumentosOperacion{
  tipoDocumento=null;
  nombreOficial=null;
  fechaEmision=null;
  numero=null;
  tipo=null;
  descripcion=null;
}

// export class TipoDocumento implements ITipoDocumento{
//   tipoDocumento=null;
// }

export class DocumentosOperacionModal implements IModalDocumentosOperacion{
  title='Agregar Documento';
  error= null;
  type = FormType.REGISTRAR;
  isLoading = false;
  form= new FormDocumentosOperacion();
  tipo=null;
  comboLists = null;
}

export class DocumentosOperacionStoreModel {
  documentosOperacion = new DocumentosOperacionForm();
  documentosOperacionModal = new DocumentosOperacionModal() 
}
