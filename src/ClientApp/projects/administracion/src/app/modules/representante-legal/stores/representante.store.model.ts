import {
  FormType,
  ComboList,
  IDataGridSource,
  BuildGridButton,
} from '@sunedu/shared';
import {
  IModalRepresentante,
  IFormBuscadorRepresentante,
  IBuscadorRepresentante,
} from './representante.store.interface';
import {
  RepresentanteLegal,
  IEntidad,
} from '../../entidades/stores/entidad.store.interface';

export class FormRepresentante implements RepresentanteLegal {
  tipoDocumentoEnum = 0;
  numeroDocumento = null;
  apellidoPaterno = null;
  apellidoMaterno = null;
  nombres = null;
  telefono = null;
  correo = null;
  casillaElectronica = null;
  esEliminado = false;
  esActivo = true;
  usuarioCreacion = null;
  usuarioModificacion = null;
  fechaCreacion = null;
  fechaModificacion = null;
  id = null;
  addedAtUtc = null;
  version = 0;
  esEditable: true;
  token = null;
}

export class ModalRepresentante implements IModalRepresentante {
  title = 'Agregar Representante Legal';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormRepresentante();
  entidad: IEntidad = null;
  codigo = null;
  comboLists = {
    tipoDocumentos: new ComboList([]),
  };
}

export class FormBuscadorRepresentante implements IFormBuscadorRepresentante {
  codigoTipoDocumento = '';
}
export class DataGridSource implements IDataGridSource<RepresentanteLegal> {
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy: 'rowNum';
  orderDir: 'asc'; // 'desc'
}

export class BuscadorRepresentante implements IBuscadorRepresentante {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'numero' },// rowNum
      { label: 'Tipo de documento', field: 'tipoDocumento' },
      { label: 'N° de documento', field: 'numeroDocumento' },
      { label: 'Nombres y Apellidos', field: 'nombresApellidos' },
      { label: 'Correo', field: 'correo' },
      { label: 'Teléfono', field: 'telefono' },
      { label: 'N° de casilla electrónica', field: 'casillaElectronica' },
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
          }
        ],
      },
    ],
  };
  gridSource = new DataGridSource();
  formBuscar = new FormBuscadorRepresentante();
}

export class RepresentanteStoreModel {
  modalRepresentante = new ModalRepresentante();
  buscadorRepresentante = new BuscadorRepresentante();
}
