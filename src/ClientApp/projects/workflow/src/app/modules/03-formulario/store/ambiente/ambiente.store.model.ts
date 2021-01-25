import { IModalAmbiente, IBuscardorAmbiente, IFormAmbiente, IFormBuscardorAmbiente, IGridBuscardorAmbiente } from './ambiente.store.interface';
import { FormType, BuildGridButton, ComboList } from '@sunedu/shared';
import { IDataGridSource, IDataGridDefinition } from '@sunedu/shared';

export class FormAmbiente implements IFormAmbiente {
  codigoLocalRef = '';
  codigo = '';
  ubicacion = '';
  aforo = '';
  cantidadDocente = '';
  tieneInternet = '';
  cantidadSillas = '';
  cantidadMesas = '';
  tipoRegimenDedicacionEnum = '';
  otroEquipamentoMobiliario = '';
  comentario = '';
}
export class ModalAmbiente implements IModalAmbiente {
  title = 'Registrar ambiente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormAmbiente();
  codigoAmbiente = null;
  comboLists = {
    locales: new ComboList([]),
    tieneInternet: new ComboList([{ 'text': 'SI', 'value': '1' }, { 'text': 'NO', 'value': '0' }]),
    regimenDedicaciones: new ComboList([{ 'text': 'Tiempo completo', 'value': '1' }])
  };
}
export class FormBuscardorAmbiente implements IFormBuscardorAmbiente {
  codigoSedeFilial = '';
}
export class DataGridSource implements IDataGridSource<IGridBuscardorAmbiente>{
  items = [
    {
      codigoLocal: '',
      codigoAmbiente: '',
      ubicacion: '',
      aforo: '',
      cantidadDocente: '',
      cantidadSillas: '',
      cantidadMesas: '',
      tieneInternet: '',
      registroDocentes: '',
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorAmbiente implements IBuscardorAmbiente {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Código de local', field: 'codigoLocal' },
      { label: 'N° de ambiente', field: 'codigoAmbiente' },
      { label: 'Ref ubicación ambiente', field: 'ubicacion' },
      { label: 'Aforo', field: 'aforo' },
      { label: 'N° total de docentes que usan ambiente', field: 'cantidadDocente' },
      { label: 'N° de sillas', field: 'cantidadSillas' },
      { label: 'N° de mesas', field: 'cantidadMesas' },
      { label: 'Internet', field: 'tieneInternet' },
      { label: 'Reg. de docentes que alberga', field: 'registroDocentes' },
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
  formBuscar = new FormBuscardorAmbiente();
}
export class AmbienteStoreModel {
  modalAmbiente = new ModalAmbiente();
  buscadorAmbiente = new BuscardorAmbiente();
}
