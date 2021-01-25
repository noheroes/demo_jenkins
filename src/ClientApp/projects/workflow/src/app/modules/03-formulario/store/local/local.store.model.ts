import { FormType, ComboList, IDataGridSource, BuildGridButton } from '@sunedu/shared';
import { IFormLocal, IModalLocal, IFormBuscardorLocal, IGridBuscardorLocal, IBuscardorLocal } from './local.store.interface';

export class FormLocal implements IFormLocal {
    codigoSedeFilial = '';    
    codigo = '';
    ubicacion = '';
    esServicioEducativo = false;
    esServicioEducativoComplementario = false;
    esOtroServicio = false;
    otroServicio = '';
    resolucionAutorizacion = '';
    fechaAutorizacion = '';
    ubigeo = '';
    descripcionUbigeo = '';
    nombreDepartamento = '';
    nombreProvincia = '';
    nombreDistrito = '';
    direccion = '';
    referencia = '';
    areaTerreno = '';
    areaConstruida = '';
    aforo = '';
    telefono = '';
    cantidadEstudiantes = '';
    comentarios = '';
  
}

export class ModalLocal implements IModalLocal {
  title = 'Registrar local';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormLocal();
  codigoSedeFilial = null;  
  codigoLocal = null;
  esServicioEducativo = null;
  esServicioEducativoComplementario = null;
  esOtroServicio = null;
  otroTipoServicio = null;
  resolucionAutorizacion = null;
  fechaAutorizacion = null;
  comboLists = {
    departamentos: new ComboList([{ 'text': 'SI', 'value': '1' }, { 'text': 'NO', 'value': '0' }]),
    provincias: new ComboList([{ 'text': 'Tiempo completo', 'value': '1' }]),
    distrito: new ComboList([{ 'text': 'Tiempo completo', 'value': '1' }])
  };
  direccion = null;
  referencia = null;
  areaTerreno = null;
  areaConstruida = null;
  aforoLocal = null;
  telefonoLocal = null;
  cantidadEstudiantes = null;
  comentarios = null;
  ubigeo = null;
  codigo = null;
}

export class FormBuscardorLocal implements IFormBuscardorLocal {
  id = '';
  idVersion = '';
}
export class DataGridSource implements IDataGridSource<IGridBuscardorLocal>{
  items = [
    {
      codigoLocal: '',
      departamento: '',
      provincia: '',
      distrito: '',
      direccion: ''
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorLocal implements IBuscardorLocal {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Código local', field: 'codigo' },
      { label: 'Departamento', field: 'nombreDepartamento' },
      { label: 'Provincia', field: 'nombreProvincia' },
      { label: 'Distrito', field: 'nombreDistrito' },
      { label: 'Conducente a grado', field: 'esServicioEducativo' },
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
  formBuscar = new FormBuscardorLocal();
}

export class LocalStoreModel {
  modalLocal = new ModalLocal();
  buscadorLocal = new BuscardorLocal();
}

