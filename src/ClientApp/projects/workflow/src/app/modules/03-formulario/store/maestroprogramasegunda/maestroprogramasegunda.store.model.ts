import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IRequestSolicitudVersion,IFormMaestroPrograma, IGridBandejaMaestroPrograma, IBandejaMaestroPrograma, IEntidadMaestroPrograma,IGridBandejaMaestroProgramaSegunda, IBandejaMaestroProgramaSegunda, 
IEntidadMaestroProgramaSegunda,IFormMaestroProgramaSegunda,
IGridBandejaMaestroProgramaVinculado,IEntidadMaestroProgramaVinculado,IBandejaMaestroProgramaVinculado } from './maestroprogramasegunda.store.interface';

export class RequestSolicitudVersion implements IRequestSolicitudVersion  {
  idVersion: string;
}
export class DataGridSourcePrograma implements IDataGridSource<IGridBandejaMaestroPrograma>{
  items = [  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaMaestroPrograma implements IBandejaMaestroPrograma {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Código de programa', field: 'codigo' },
      { label: 'Denominación del programa', field: 'denominacionPrograma' },
      { label: 'Régimen de estudio', field: 'regimenEstudioEnum' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSourcePrograma();
  formRequest = new RequestSolicitudVersion;
  formResponse = {};
  codigoGenerado ='';
  cine='';
}


export class EntidadMaestroPrograma implements IEntidadMaestroPrograma {
    id = '';
    codigo = '';
    resolucionCreacion = '';
    fechaCreacionResolucion = '';
    modalidadEstudioEnum = '';
    resolucionCreacionModalidad='';
    fechaCreacionModalidad = '';
    idFacultad = '';
    descripcionFacultad = '';
    regimenEstudioEnum = '';
    tipoGradoAcademicoEnum = '';
    denominacionGradoAcademico = '';
    denominacionTituloOtorgado = '';
    codigoCINE = '';
    descripcionCINE = '';
    denominacionPrograma = '';
    comentario = '';
}
export class FormMaestroPrograma implements IFormMaestroPrograma {
  title = 'Agregar programa y mención';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new EntidadMaestroPrograma();
  codigoGenerado = null;
  id=null;
  idVersion=null;
  comboLists = {
    modalidadEstudios: new ComboList([]),
    nombreFacultades: new ComboList([]),
    regimenEstudios: new ComboList([]),
    gradoAcademicos: new ComboList([]),
    denominacionClasificadorCINEs: new ComboList([]),
  };
  facultades=[];
  cine=[];
}


export enum ENU_Util {
  ENU_TipoGradoAcademico_1 = 1,
  ENU_TipoGradoAcademico_2 = 2,
  ENU_TipoGradoAcademico_3 = 3,
  ENU_CINE_OTRO=-1
}

/** SEGUNDA */




// export class  RequestSolicitudVersion implements IRequestSolicitudVersion {
//   idVersion = '';
// }
//Bandeja
export class DataGridSourceSegunda implements IDataGridSource<IGridBandejaMaestroProgramaSegunda>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaMaestroProgramaSegunda implements IBandejaMaestroProgramaSegunda {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Código de programa', field: 'codigo' },
      { label: 'Denominación del programa', field: 'denominacionPrograma' },
      { label: 'Régimen de estudio', field: 'regimenEstudioEnum' },
      { label: 'Cant de Programas Vinculados', field: 'cantidadProgramaVinculado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'PROGRAMA_VINCULADO',
            icon: 'library_books',
            color: 'primary',
            tooltip: 'Vinculación con Programa'
          },
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()          
        ]
      }
    ]
  };
  source = new DataGridSourceSegunda();
  formRequest = new RequestSolicitudVersion;
  formResponse = {};
  codigoGenerado ='';
  cine='';
  programasResponse={};
}

//Form Entidad
export class EntidadMaestroProgramaSegunda implements IEntidadMaestroProgramaSegunda {

    id='';
    codigo='';
    denominacionTituloOtorgado='';
    codigoCINE='';
    descripcionCINE='';
    denominacionPrograma='';
    resolucionCreacionModalidad='';
    fechaCreacionModalidad='';
    idFacultad='';
    descripcionFacultad:string;
    regimenEstudioEnum='';
    cantidadProgramaVinculado = '';
}

export class FormMaestroProgramaSegunda implements IFormMaestroProgramaSegunda {
  idVersion='';
  title = 'Agregar segunda especialidad';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new EntidadMaestroProgramaSegunda();
  codigoGenerado? = null;
  id=null;
  comboLists = {
    denominacionClasificadorCINEs: new ComboList([]),
    nombreFacultades: new ComboList([]),
    regimenEstudios: new ComboList([]),
    codigoProgramaVinculados: new ComboList([]),
  };
  facultades:any;
  cine:any;
}


//Form Vinculado
export class GridBandejaMaestroProgramaVinculado implements IGridBandejaMaestroProgramaVinculado{
  id='';
  numero=0;
  denominacionPrograma='';
}
export class EntidadMaestroProgramaVinculado implements IEntidadMaestroProgramaVinculado{
  id='';
  denominacionPrograma='';
}
export class DataGridSourceProgramaVinculado implements IDataGridSource<IGridBandejaMaestroProgramaVinculado>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}
export class BandejaMaestroProgramaVinculado implements IBandejaMaestroProgramaVinculado {
  title = 'Relacionar con programa y mención';
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Programa y mención', field: 'denominacionPrograma' },      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  type = FormType.REGISTRAR;
  source = new DataGridSourceProgramaVinculado();
  form = new EntidadMaestroProgramaVinculado();
  programaVinculado='';
  id='';
  formRequest = new RequestSolicitudVersion();
  comboLists = {
    codigoProgramaVinculados: new ComboList([]),
  };
  programas = [];
  idPrograma='';
  allItems=[];
  programasSe=[];
}

/** MODEL */

export class MaestroProgramaSegundaStoreModel {
    bandejaMaestroPrograma = new BandejaMaestroPrograma();
    formMaestroPrograma = new FormMaestroPrograma();
    
    bandejaMaestroProgramaSegunda = new BandejaMaestroProgramaSegunda();
    formMaestroProgramaSegunda = new FormMaestroProgramaSegunda();
    bandejaMaestroProgramaVinculado = new BandejaMaestroProgramaVinculado();
}

// export class MaestroProgramaSeStoreModel {
// }
// // export enum ENU_Util {
// //   ENU_CINE_OTRO=-1
// // }
