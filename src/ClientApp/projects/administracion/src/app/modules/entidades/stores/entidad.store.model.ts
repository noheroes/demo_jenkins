import { FormType, BuildGridButton, ComboList } from '@sunedu/shared';
import { IDataGridSource, IDataGridDefinition } from '@sunedu/shared';
import { EntidadBuscadorActions } from './actions/entidad.buscador.action';
import {
  IFormBuscardorEntidad,
  IEntidad,
  IBuscardorEntidad,
  IModalEntidad,
  RepresentanteLegal,
} from './entidad.store.interface';

export class FormEntidad implements IEntidad {
  id = '';
  rowNum = 0;
  nombre = '';
  razonSocial = '';
  ruc = '';
  esEditable = true;  
  representanteLegales = [];
  token = '';
}
export class ModalEntidad implements IModalEntidad {
  title = 'Registrar universidad';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormEntidad();
  id = null;
  comboLists = {
    // locales: new ComboList([]),
    // tieneInternet: new ComboList([{'text':'SI','value':'1'},{'text':'NO','value':'0'}]),
    // regimenDedicaciones: new ComboList([{'text':'Tiempo completo','value':'1'}])
  };
}
export class FormBuscardorEntidad implements IFormBuscardorEntidad {
  nombre = '';
}

export class BuscardorEntidad implements IBuscardorEntidad {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'rowNum' },
      { label: 'Nombre', field: 'nombre' },
      { label: 'Razón Social', field: 'razonSocial' },
      { label: 'RUC', field: 'ruc' },
      {
        label: 'Registrado',
        field: 'fechaCreacion',
        isDatetime: true,
        dateTimeFormat: 'DD/MM/YYYY hh:mm a',
      },
      {
        label: 'Modificado',
        field: 'fechaModificacion',
        isDatetime: true,
        dateTimeFormat: 'DD/MM/YYYY hh:mm a',
      },
      {
        label: 'Acciones',
        field: 'buttons',
        buttons: [
          BuildGridButton.CONSULTAR(),
          // BuildGridButton.EDITAR(),
          // BuildGridButton.ELIMINAR(),
          {
            action: 'EDITAR',
            icon: 'edit',
            color: 'primary',
            tooltip: 'Editar',
            hidden: (item) => item.esEditable === false,
          },
          {
            action: 'ELIMINAR',
            icon: 'delete',
            color: 'primary',
            tooltip: 'Eliminar',
            hidden: (item) => item.esEditable === false,
          },
        ],
      },
    ],
  };
  gridSource = {
    items: Array<IEntidad>(),
    page: 1,
    pageSize: 10,
    total: 0,
    skip: 0,
    orderBy: 'rowNum',
    orderDir: 'asc', // 'desc'
  };
  formBuscar = new FormBuscardorEntidad();
}
export class EntidadStoreModel {
  modalEntidad = new ModalEntidad();
  buscadorEntidad = new BuscardorEntidad();
}
