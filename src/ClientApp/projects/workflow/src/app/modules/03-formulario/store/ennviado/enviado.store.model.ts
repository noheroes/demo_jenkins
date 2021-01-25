//import { IFormularioModel } from '@lic/core';
import { FormType, IComboList, ComboList } from '@sunedu/shared';
import { IFormularioModel } from '../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IEnviadoConsultaGeneral, IEnviado, IModalEnviado, IFormEnviado }
  from './enviado.store.interface';

export class EnviadoConsultaGeneral implements IEnviadoConsultaGeneral {
  title: 'Documentos';
  type: FormType = FormType.CONSULTAR;
  isLoading = false;
  error = null;
  form = new DocumentoEnviado();
  isSolicitudVersion = null;
  modelData: IFormularioModel = null;
  //fasesOrigen: FaseOrigenDocumento[] = [];
  //tipoDocumentos:TipoDocumentos[]=[];
  // comboLists = {
  //   tiposDocumentos:  new ComboList([]),
  // };
}

export class DocumentoEnviado implements IEnviado{
  descActividad=null;
  archivoNombre=null;
  numeroDocumento=null;
  subTipoDocumentoDesc=null;
  fechaCargaDesde=null;
  fechaCargaHasta=null;
  estadoDocumento=null;
  tipoDocumento=null;
}

// export class TipoDocumentos implements ITipoDocumentos{
//   idSubtipo:number;
//   nombre:string;
//   esActivo:boolean;
// }
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

export class FormDocumento implements IFormEnviado{
  tipoDocumento=null;
  nombreOficial=null;
  fechaEmision=null;
  numero=null;
  tipo=null;
}

// export class TipoDocumento implements ITipoDocumento{
//   tipoDocumento=null;
// }

export class EnviadoModal implements IModalEnviado{
  title='Agregar Documento';
  error= null;
  type = FormType.REGISTRAR;
  isLoading = false;
  form= new FormDocumento();
  tipo=null;
  comboLists = null;
}

export class EnviadoConsultaGeneralStoreModel {
  enviado = new EnviadoConsultaGeneral();
  enviadoModal = new EnviadoModal() 
}
