import { BuildGridButton, IDataGridSource } from '@sunedu/shared';
import { IBuscardorFirmante, IGridBuscardorFirmante, IFormBuscardorFirmante } from './firmante.store.interface';

export class FormBuscardorFirmante implements IFormBuscardorFirmante {
  id = '';
  idVersion = '';
  codApp = '';
  codArea = '';
  codRol = '';
  idProceso = '';
  idUsuario ='';
}

export class DataGridSource implements IDataGridSource<IGridBuscardorFirmante>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorFirmante implements IBuscardorFirmante {
  tipoPersona = '';
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Nombre completo', field: 'nombre' },
      { label: 'N° documento', field: 'nroDocumento' },
      { label: 'Responsable', field: 'esResponsable' },
      { label: 'Razón social', field: 'razonSocial' },
      { label: 'Universidad', field: 'dsArea' },
      { label: 'Selección', field: 'firmante' , template: 'firmante'}
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorFirmante();
  firmantes = [];
}

export class FirmantesStoreModel {
  buscadorFirmante = new BuscardorFirmante();
}
