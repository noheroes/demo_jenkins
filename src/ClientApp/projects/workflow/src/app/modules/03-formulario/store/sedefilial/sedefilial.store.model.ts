import { IFormSedeFilial, IModalSedeFilial, IFormBuscardorSedeFilial, IGridBuscardorSedeFilial, IBuscardorSedeFilial, IFormato, ILocal } from './sedefilial.store.interface';
import { FormType, ComboList, IDataGridSource, BuildGridButton } from '@sunedu/shared';

export class Local implements ILocal {
  codigoSedeFilial = '';
  numeroLocal = '';
  codigoLocal = '';
  servicioEducativo = false;
  servicioEducacionalesComplementarios = false;
  otrosServicio = false;
  otroTipoServicio = '';
  resolucionAutorizacion = '';
  fechaAutorizacion = '';
  codigoUbigeoRef = '';
  nombreDepartamento = '';
  nombreProvincia = '';
  nombreDistrito = '';
  direccion = '';
  referencia = '';
  areaTerreno = '';
  areaConstruida = '';
  aforoLocal = '';
  telefonoLocal = '';
  cantidadEstudiantes = '';
  comentarios = '';
}

export class FormSedeFilial implements IFormSedeFilial {  
  id = '';
  codigo = '';
  ubigeo = '';
  nombreDepartamento = '';
  nombreProvincia = '';
  descripcionUbigeo = '';
  esSedeFilial = false;
  locales= []
  cantidadLocal = '';
}

export class ModalSedeFilial implements IModalSedeFilial {
  title = 'Registrar Sede/filial';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormSedeFilial();  
  codigoSedeFilial = null;
  idVersion = null;
  comboLists = {
    nombreDepartamento: new ComboList([], true),
    nombreProvincia: new ComboList([], true)
  };
  listSedes = [];
}

export class FormBuscardorSedeFilial implements IFormBuscardorSedeFilial {
  id = '';
  idVersion = '';
}
export class DataGridSource implements IDataGridSource<IGridBuscardorSedeFilial>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorSedeFilial implements IBuscardorSedeFilial {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Código sede/filial', field: 'codigo' },
      { label: 'Departamento', field: 'nombreDepartamento' },
      { label: 'Provincia', field: 'nombreProvincia' },
      { label: 'Sede principal', field: 'esSedeFilial' },
      { label: 'Cant de Local', field: 'cantidadLocal' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'AGREGAR_LOCAL',
            icon: 'business',
            color: 'primary',
            tooltip: 'Locales'
          } ,
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorSedeFilial();
}

export class Formato implements IFormato {
  currentForm = 'sedeFilial';
}

export class SedeFilialStoreModel {
  modalSedeFilial = new ModalSedeFilial();
  buscadorSedeFilial = new BuscardorSedeFilial();
  formato: Formato = new Formato();
}
