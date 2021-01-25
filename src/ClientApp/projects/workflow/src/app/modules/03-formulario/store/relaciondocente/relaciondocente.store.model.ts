import { IFormBuscardorRelacionDocente, IGridBuscardorRelacionDocente, IBuscardorRelacionDocente, IAgregarRelacionDocente, IFromAgregarRelacionDocente } from './relaciondocente.store.interface';
import { IDataGridSource, BuildGridButton, FormType, ComboList } from '@sunedu/shared';

export class FormBuscardorRelacionDocente implements IFormBuscardorRelacionDocente {
  id = '';
}

export class DataGridSource implements IDataGridSource<IGridBuscardorRelacionDocente>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorRelacionDocente implements IBuscardorRelacionDocente {
  isLoading = false;
  error = null;
  idLocal: '';
  idVersion = '';
  idSedeFilial = '';
  gridDefinition = {
    columns: [
      { label: 'Persona', field: 'persona' },
      { label: 'Mayor grado académico', field: 'mayorGrado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorRelacionDocente();
}
export class FromAgregarRelacionDocente implements IFromAgregarRelacionDocente {
  id = '';
  idLocal = '';
  idPersona = '';
  descripcionDocente = '';
  mayorGrado = '';
  tipoPersona = '';
}
export class AgregarRelacionDocente implements IAgregarRelacionDocente {
  title = 'Programas en los que dicta clases el docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FromAgregarRelacionDocente();
  comboLists = {
    personas: new ComboList([])
  };
}

export class RelacionDocenteStoreModel {
  buscadorRelacionDocente = new BuscardorRelacionDocente();
  agregarRelacionDocente = new AgregarRelacionDocente();
}
