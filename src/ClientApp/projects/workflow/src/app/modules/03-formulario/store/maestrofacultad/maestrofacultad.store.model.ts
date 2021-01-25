import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IRequestSolicitudVersion,IBandejaMaestroFacultad, IGridBandejaMaestroFacultad, IEntidadMaestroFacultad, IFormMaestroFacultad } from './maestrofacultad.store.interface';

export class  RequestSolicitudVersion implements IRequestSolicitudVersion {
  idVersion = '';
  idElemento = '';
}

export class EntidadMaestroFacultad implements IEntidadMaestroFacultad {
  id = '';
  nombre= '';
  codigo='';
  fechaCreacionFacultad='';
  numeroResolucion='';
  organoCreacion='';
}

export class DataGridSource implements IDataGridSource<IGridBandejaMaestroFacultad>{
  items = [  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaMaestroFacultad implements IBandejaMaestroFacultad {
  isLoading = false;
  error = null;
  type=FormType.REGISTRAR;
  gridDefinition = {
    columns: [
      { label: 'Código', field: 'codigo' },
      { label: 'Nombre de facultad', field: 'nombre' },
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
  source = new DataGridSource();
  formRequest = new RequestSolicitudVersion();
  readOnly = false;
}
export class FormMaestroFacultad implements IFormMaestroFacultad {
  title = 'Agregar facultad';
  isLoading = false;
  error = null;
  id=null;
  type = FormType.REGISTRAR;
  form = new EntidadMaestroFacultad();
  formRequest = null;
}
export class MaestroFacultadStoreModel {
  formMaestroFacultad = new FormMaestroFacultad();
  bandejaMaestroFacultad = new BandejaMaestroFacultad();
}
