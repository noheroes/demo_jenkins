import { IFormularioModel } from '@lic/core';
import { FormType, IComboList, ComboList } from '@sunedu/shared';
import { IFaseOrigenDocumento, IDocumentoConsultaGeneral, IDocumento, IModalDocumento, IFormDocumento, ITipoDocumentos, ITipoDocumento }
  from './documento.store.interface';

export class DocumentoConsultaGeneral implements IDocumentoConsultaGeneral {
  title: 'Documentos';
  type: FormType = FormType.CONSULTAR;
  isLoading = false;
  error = null;
  form = new TipoDocumento();
  isSolicitudVersion = null;
  modelData: IFormularioModel = null;
  fasesOrigen: FaseOrigenDocumento[] = [];
  tipoDocumentos:TipoDocumentos[]=[];
  comboLists = {
    tiposDocumentos:  new ComboList([]),
  };
}

export class TipoDocumentos implements ITipoDocumentos{
  idSubtipo:number;
  nombre:string;
  esActivo:boolean;
}
export class FaseOrigenDocumento implements IFaseOrigenDocumento {
  isExpanded: boolean;
  documentsCount: number;
  idFase: number;
  descripcion: string;
  documentosFase: Documento[];
}

export class Documento implements IDocumento {
  subtipoEspecializacion: string;
  estadoDocumento: string;
  fechaEmision: string;
  numeroDocumento: string;
  idArchivo: string;
}

export class FormDocumento implements IFormDocumento{
  tipoDocumento=null;
  nombreOficial=null;
  fechaEmision=null;
  numero=null;
  tipo=null;
  descripcion=null;
}

export class TipoDocumento implements ITipoDocumento{
  tipoDocumento=null;
}

export class DocumentoModal implements IModalDocumento{
  title='Agregar Documento';
  error= null;
  type = FormType.REGISTRAR;
  isLoading = false;
  form= new FormDocumento();
  tipo=null;
  comboLists = null;
}

export class DocumentoConsultaGeneralStoreModel {
  documentosPorFasesOrigen = new DocumentoConsultaGeneral();
  documentosModal = new DocumentoModal() 
}
