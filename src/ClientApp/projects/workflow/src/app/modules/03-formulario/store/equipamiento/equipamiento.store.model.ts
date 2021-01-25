import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IFormBuscardorEquipamiento, IGridBuscardorEquipamiento, IBuscardorEquipamiento, IFormEquipamiento, IModalEquipamiento } from './equipamiento.store.interface';


export class FormBuscardorEquipamiento implements IFormBuscardorEquipamiento {
  id = '';
  idVersion = '';
  idSedeFilial = '';
  idLocal = '';
  listEquipoMobiliario = [];
}

export class DataGridSource implements IDataGridSource<IGridBuscardorEquipamiento>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorEquipamiento implements IBuscardorEquipamiento {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'numero' },
      { label: 'Código Lab.', field: 'codigoLaboratorioTaller' },
      { label: 'N° de equipos, mobiliario y software', field: 'numeroEqMobSoft' },
      { label: 'Nombre de Laboratorio o Taller', field: 'nombreEqMobSoft' },
      { label: 'Tipo de equipamiento mobiliario software', field: 'descripcionEquipoMobiliario' },
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
  formBuscar = new FormBuscardorEquipamiento();
  comboLists = {
    sedeFilial: new ComboList([{ 'text': 'Sede filial 1', 'value': '1' }]),
  }
}


export class FormEquipamiento implements IFormEquipamiento {
  id = '';
  idLocal = '';
  decripcionLabTaller = '';
  codigoLaboratorioTaller = '';
  numeroEqMobSoft = null;
  nombreEqMobSoft = '';
  tipoEquipoMobiliarioEnum = null;
  valorizacion = null;
  comentario = '';
}
export class ModalEquipamiento implements IModalEquipamiento {
  title = 'Equipos, mobiliario y software';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormEquipamiento();
  codigoEquipamiento = null;
  idVersion = null;
  idSedeFilial = null;
  idLocal = null;
  decripcionLabTaller = null;
  codigoLaboratorioTaller = null;
  tipoEquipoMobiliarioEnum = null;
  formBuscar = null;
  tipoEquipamiento = null;
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'numero' },
      { label: 'Código laboratorio o taller', field: 'codigoLaboratorioTaller' },
      { label: 'Tipo de equipamiento, mobiliario y software', field: 'descripcionEquipoMobiliario' },      
      { label: 'Nombre de laboratorio o taller', field: 'nombreEqMobSoft' },
      { label: 'Cantidad de equipos, mobiliario y software', field: 'numeroEqMobSoft' },
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
  comboLists = {
    codigoLaboratorio: new ComboList([{ 'text': 'Codigo lab 1', 'value': '1' }]),
    codigoTipoEquipos: new ComboList([{ 'text': 'tipo Equi 1', 'value': '1' }]),
  };
}

export class EquipamientoStoreModel {
  buscadorEquipamiento = new BuscardorEquipamiento();
  modalEquipamiento = new ModalEquipamiento();
}
