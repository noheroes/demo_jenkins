//import { IFormularioModel } from '@lic/core';
import { FormType, IComboList, ComboList, IDataGridSource } from '@sunedu/shared';
import { IFormularioModel } from '../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IDocumentosConsultaForm, IDocumentosConsulta, IBandejaDocumentosConsulta, IFormBuscardorDocumentoConsulta, IGridBandejaDocumentosConsulta, IModalDocumentosConsulta, IFormDocumentosConsulta }
  from './documentos-consulta.store.interface';

export class DocumentosConsultaForm implements IDocumentosConsultaForm {
  title: 'Documentos';
  type: FormType = FormType.REGISTRAR;
  isLoading = false;
  error = null;
  form = new DocumentosConsulta();
  isSolicitudVersion = null;
  modelData: IFormularioModel = null;
  //fasesOrigen: FaseOrigenDocumento[] = [];
  //tipoDocumentos:TipoDocumentos[]=[];
  // comboLists = {
  //   tiposDocumentos:  new ComboList([]),
  // };
}

export class DocumentosConsulta implements IDocumentosConsulta{
  idBandeja=null;
  descBandeja=null;
  fechaRecepcionDesde=null;
  fechaRecepcionHasta=null;
  subTipoDocumentoDesc=null;
  fechaNotificacionDesde=null;
  fechaNotificacionHasta=null;
  archivoNombre=null;
  busqueda=null;
}

/** GRILLA */
export class FormBuscadorDocumentoConsulta implements IFormBuscardorDocumentoConsulta {
  idBandeja=null;
  descBandeja=null;
  fechaRecepcionDesde=null;
  fechaRecepcionHasta=null;
  subTipoDocumentoDesc=null;
  fechaNotificacionDesde=null;
  fechaNotificacionHasta=null;
  archivoNombre=null;
  busqueda=null;
}

export class DataGridSource implements IDataGridSource<IGridBandejaDocumentosConsulta>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class DocumentosConsultaBusqueda implements IBandejaDocumentosConsulta {
  tipoPersona = '';
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      //{ label: 'Bandeja', field: 'descBandeja' },
      { label: 'Fecha de recepción de SUNEDU', field: 'fechaRegistro', isDatetime: true,
      dateTimeFormat: 'DD/MM/YYYY hh:mm a'},
      { label: 'Fecha de recepción de la Universidad', field: 'fechaNotificacion',isDatetime: true,
      dateTimeFormat: 'DD/MM/YYYY hh:mm a' },
      { label: 'Nombre del Archivo', field: 'metadataArchivo.archivoNombre' },
      { label: 'Tipo de Documento', field: 'subtipoEspecializacion'},
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action:'DESCARGAR',
            icon:'cloud_download',
            color:'primary',
            tooltip:'Descargar archivo'
          }
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscadorDocumentoConsulta();
  subTiposDocumento = [];
}

export class FormDocumentosConsulta implements IFormDocumentosConsulta{
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

export class DocumentosConsultaModal implements IModalDocumentosConsulta{
  title='Agregar Documento';
  error= null;
  type = FormType.REGISTRAR;
  isLoading = false;
  form= new FormDocumentosConsulta();
  tipo=null;
  comboLists = null;
}


export class DocumentosConsultaStoreModel {
  documentosConsulta = new DocumentosConsultaForm();
  documentosConsutlaBusqueda = new DocumentosConsultaBusqueda();
  documentosConsultaModal = new DocumentosConsultaModal();
}
