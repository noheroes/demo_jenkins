import { IFormBuscardorCargaMasiva, IBuscardorCargaMasiva, IFormBuscardorCargaMasivaActividad, IBuscardorCargaMasivaActividad, IActividad, IFormTarea } from './cargamasiva.store.interface';
import { ComboList, BuildGridButton, FormType } from '@sunedu/shared';

export class Actividad implements IActividad {
  descripcion = '';
  descripcionServidor = '';
}

export class FormTarea implements IFormTarea {  
  idVersion = '';
  tipoCargaEnum = '';
  tipoCargaDescripcion = '';
  estadoEnum = '';
  estadoDesc = '';
  idArchivo = '';
  idArchivoTemporal = '';
  actividad= new Actividad();
}

export class FormBuscardorCargaMasiva implements IFormBuscardorCargaMasiva {
  tipo = '';
  comboLists = {
    tipoCargaMasiva: new ComboList([])
  };
}

export class BuscardorCargaMasiva implements IBuscardorCargaMasiva {
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  idVersion = null;
  form = new FormTarea();
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'numeroOrden' },
      { label: 'Tipo de carga masiva', field: 'tipoCargaDescripcion' },
      { label: 'Estado', field: 'estadoDesc' },
      { label: 'Nombre de archivo', field: 'nombreArchivo' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.CONSULTAR(),
          {
            action: 'DESCARGAR',
            icon: 'cloud_download',
            color: 'primary',
            tooltip: 'Descargar'
          }
        ]
      }
    ]
  };
  source = {
    items: [],
    page: 1,
    pageSize: 10,
    total: 3,
    orderBy: null,
    orderDir: null
  };
  formBuscar = new FormBuscardorCargaMasiva();
  comboLists = {
    tipoCargaMasiva: new ComboList([])
  };
}


export class FormBuscardorCargaMasivaActividad implements IFormBuscardorCargaMasivaActividad {
  id = '';
}

export class BuscardorCargaMasivaActividad implements IBuscardorCargaMasivaActividad {
  isLoading = false;
  title = 'Actividades de la carga masiva';
  error = null;
  type = FormType.REGISTRAR;
  idTarea = "";
  idVersion = "";
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'numeroOrden' },
      { label: 'Descripción actividad', field: 'descripcion' }      
    ]
  };
  source = {
    items: [],
    page: 1,
    pageSize: 10,
    total: 3,
    orderBy: null,
    orderDir: null
  };
  formBuscar = new FormBuscardorCargaMasiva();
}

export class CargaMasivaStoreModel {
  buscadorCargaMasiva = new BuscardorCargaMasiva();
  buscadorCargaMasivaActividad = new BuscardorCargaMasivaActividad();
}
