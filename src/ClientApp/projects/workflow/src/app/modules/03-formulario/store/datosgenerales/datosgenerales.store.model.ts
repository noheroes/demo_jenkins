import { IDatosGenerales, IFormDatosGenerales, IModalRepresentanteLegal, IFormRepresentanteLegal, IBuscarRepresentanteLegal, IDatosGeneralesBody, IEntidad, IDomicilioLegal, IPromotora, IRepresentantesLegales } from './datosgenerales.store.interface';
import { BuildGridButton, FormType, ComboList } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';
import { FormAmbiente } from '../ambiente/ambiente.store.model';

export class FormDatosGenerales implements IFormDatosGenerales {
  nombre=null;
  ruc=null;
  razonSocial = null;
  numeroDocumentoCreacion = null;
  fechaDocumentoCreacion = null;
  tipoGestionEnum = null;
  tipoModalidadCreacionEnum=null;

  domicilio = null;
  codigoUbigeoRef = null;
  nombreDepartamento = null;
  nombreProvincia = null;
  nombreDistrito = null;
  referencia = null;
  telefono = null;
  paginaWeb = null;

  tipoDocumentoEnum = null;
  numeroDocumento = null;
  nombrePromotora = null;
  oficinaRegitral = null;
  numeroPartida = null;
  asiento = null;
  razonSocialPromotora = null;
  rubro = null;
  domicilioLegal = null;
  codigoUbigeoRefPromotora = null;
  nombreDepartamentoPromotora = null;
  nombreProvinciaPromotora = null;
  nombreDistritoPromotora = null;
}

export class EntidadBody implements IEntidad{
  nombre=null;
  ruc=null;
  razonSocial=null;
  numeroDocumentoCreacion=null;
  fechaDocumentoCreacion=null;
  tipoGestionEnum=null; // OJO
  tipoModalidadCreacionEnum=null; // OJO
}

export class DomicilioLegalBody implements IDomicilioLegal{
  domicilio = null;
  ubigeo = null; // OJO
  nombreDepartamento = null;
  nombreProvincia = null;
  nombreDistrito = null;
  referencia = null;
  telefono = null;
  paginaWeb = null;
}

export class PromotoraBody implements IPromotora{
  tipoDocumentoEnum = null;
  numeroDocumento = null;
  nombreDenominacion = null; //OJO
  oficinaRegitral = null;
  numeroPartida = null;
  asiento = null;
  razonSocial = null; // OJO
  rubro = null;
  domicilioLegal = null;
  ubigeo = null;
  nombreDepartamentoPromotora = null;
  nombreProvinciaPromotora = null;
  nombreDistritoPromotora = null;
}

export class RepresentantesLegalesBody implements IRepresentantesLegales{
  tipoDocumentoEnum=null;
  numeroDocumento= null;
  nombres= null;
  apellidoPaterno= null;
  apellidoMaterno=null;
  telefono=null;
  correo=null;
  numeroCasillaElectronica=null;
  cargo=null;
  oficinaRegistral=null;
  numeroPartida=null;
  asiento=null;
  domicilioLegal=null;
  ubigeo=null;
  tipoOperacion=null;
  esResponsable = '';
}

export class FormDatosGeneralesBody implements IDatosGeneralesBody{
  idVersion=null;
  entidad=new EntidadBody();
  domicilioLegal=new DomicilioLegalBody();
  promotora=new PromotoraBody();
  representantesLegales=[];
  licenciado=null;
  estadoSolicitudEnum=null;
  etapaSolicitudEnum=null;
  fechaInicioSolicitud=null;
  esEliminado=null;
  esActivo=null;
  usuarioCreacion=null;
  fechaCreacion=null;
  usuarioModificacion=null;
  fechaModificacion=null;
  id=null;
  addedAtUtc=null;
  version=null;
}

export class DatosGenerales implements IDatosGenerales {
  isLoading = false;
  error = null;
  idSolicitud = null;
  type = FormType.REGISTRAR;
  form = new FormDatosGenerales();
  comboLists = {
    // tipoGestion: new ComboList([]),
    // modalidad:new ComboList([])
  };
  modelData: IFormularioModel = null;
  datosGeneralesBody:IDatosGeneralesBody=null;
}
export class FormRepresentanteLegal implements IFormRepresentanteLegal {
  tipoDocumento='';
  numeroDocumento= '';
  nombres='';
  apellidoPaterno='';
  apellidoMaterno='';
  cargo = '';
  oficinaRegistral = '';
  numeroPartida = '';
  asiento = '';
  domicilioLegal = '';
  ubigeo = '';
  telefono='';
  correo='';
  nombreDepartamento = '';
  nombreProvincia = '';
  nombreDistrito = '';
  esResponsable = '';
  // codigoTipoDocumento= '';
  // numeroCasillaElectronica='';
  // nombresApellidos = '';
  // tipoDocumentoEnum = '';


}
export class ModalRepresentanteLegal implements IModalRepresentanteLegal {
  title = 'Agregar representante legal';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormRepresentanteLegal();
  tipoDocumento=null;
  numeroDocumento = null;
  comboLists = null;
  //{
    // tipoDocumentos: new ComboList([
    //   { 'text': 'DNI', 'value': '1' },
    //   { 'text': 'Carnet Extranjeria', 'value': '2' }
    // ]),
    // departamentos: new ComboList([
    //   { 'text': 'LIMA DEP', 'value': '1' },
    //   //{ 'text': 'NO', 'value': '0' }
    // ]),
    // provincias: new ComboList([
    //   { 'text': 'LIMA PRO', 'value': '1' },
    //   //{ 'text': 'NO', 'value': '0' }
    // ]),
    // distritos: new ComboList([
    //   { 'text': 'LIMA DIS', 'value': '1' },
    //   //{ 'text': 'NO', 'value': '0' }
    // ])
  //};
}
//====================================================
// DEFINICION DEL MODELO DEL ESTADO
//====================================================

export class DatosGeneralesStoreModel {
  datosGenerales: DatosGenerales = new DatosGenerales();
  modalRepresentanteLegal = new ModalRepresentanteLegal();
  buscardorRepresentanteLegal: IBuscarRepresentanteLegal = {
    isLoading: false,
    error: null,
    formBuscar: {
      codigo: ''
    },
    gridDefinition: {
      columns: [
        { label: 'Nombres y Apellidos', field: 'nombresApellidos' },
        { label: 'Tipo de documento', field: 'tipoDocumento' },
        { label: 'N° de documento', field: 'numeroDocumento' },
        { label: 'Responsable', field: 'esResponsable' },
        //{ label: 'Cargo', field: 'cargo' },
        {
          label: 'Acciones', field: 'buttons', buttons: [
            BuildGridButton.CONSULTAR(),
            BuildGridButton.EDITAR(),
            //BuildGridButton.ELIMINAR()
          ]
        }
      ]
    },
    source: {
      items: [],
      page: 1,
      pageSize: 10,
      total: 1,
      orderBy: null,
      orderDir: null
    }
  };
}
