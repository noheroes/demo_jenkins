import {
  IFormBuscardorRelacionNoDocente,
  IGridBuscardorRelacionNoDocente,
  IBuscardorRelacionNoDocente,
  IFromAgregarRelacionNoDocente,
  IAgregarRelacionNoDocente
} from './relacionnodocente.store.interface';


import { IDataGridSource, BuildGridButton, FormType, ComboList } from '@sunedu/shared';

export class FormBuscardorRelacionNoDocente implements IFormBuscardorRelacionNoDocente {
  id = '';
}

export class DataGridSource implements IDataGridSource<IGridBuscardorRelacionNoDocente>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorRelacionNoDocente implements IBuscardorRelacionNoDocente {
  isLoading = false;
  error = null;
  idLocal: '';
  idVersion = '';
  idSedeFilial = '';
  gridDefinition = {
    columns: [
      { label: 'Persona', field: 'persona' },
      { label: 'Mayor grado académico o título', field: 'mayorGrado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorRelacionNoDocente();
}
export class FromAgregarRelacionNoDocente implements IFromAgregarRelacionNoDocente {
  id = '';
  idLocal = '';
  idPersona = '';
  descripcionDocente = '';
  mayorGrado = '';
  tipoPersona = '';
}
export class AgregarRelacionNoDocente implements IAgregarRelacionNoDocente {
  title = 'Programas en los que dicta clases el no docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FromAgregarRelacionNoDocente();
  comboLists = {
    personas: new ComboList([])
  };
}

export class RelacionNoDocenteStoreModel {
  buscadorRelacionNoDocente = new BuscardorRelacionNoDocente();
  agregarRelacionNoDocente = new AgregarRelacionNoDocente();
}
