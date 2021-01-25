import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IFormBuscardorInfraestructura, IGridBuscardorInfraestructura, IBuscardorInfraestructura, IFormInfraestructura, IModalInfraestructura } from './infraestructura.store.interface';

export class FormBuscardorInfraestructura implements IFormBuscardorInfraestructura {
  id = '';
  idVersion = '';
  idSedeFilial = '';
  idLocal = '';
}

export class DataGridSource implements IDataGridSource<IGridBuscardorInfraestructura>{
  items = [
    {
        numero: '',
        numeroLaboratorioComputo: '',
        numeroLaboratorioEnsenanza: '',
        numeroLaboratorioInvestigacion: '',
        numeroBibliotecas: '',
        numeroAulas: ''
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorInfraestructura implements IBuscardorInfraestructura {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [      
      { label: 'N°. total lab. de cómputo', field: 'numeroLaboratorioComputo' },
      { label: 'N° total de lab. de enseñanza', field: 'numeroLaboratorioEnsenanza' },
      { label: 'N° total de lab. de investigación', field: 'numeroLaboratorioInvestigacion' },
      { label: 'N° total de biblotecas', field: 'numeroBibliotecas' },
      { label: 'N° total de aulas', field: 'numeroAulas' },
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
  formBuscar = new FormBuscardorInfraestructura();
  comboLists = {
    sedeFilial: new ComboList([{ 'text': 'Sede filial 1', 'value': '1' }]),
  };
  bloquearRegistro = false;
}


export class FormInfraestructura implements IFormInfraestructura {
    id = '';
    idLocal = '';
    numeroLaboratorioComputo = '';
    numeroLaboratorioEnsenanza = '';
    numeroLaboratorioInvestigacion = '';
    numeroTalleresEnsenanza = '';
    numeroBibliotecas = '';
    numeroAulas = '';
    numeroAmbientesDocentes = '';
    numeroTopicos = '';
    denominacionAmbienteComplementario = '';
    denominacionAmbienteServicio = '';
    comentario = '';
}
export class ModalInfraestructura implements IModalInfraestructura {
  title = 'Registrar infraestructura';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormInfraestructura();
  codigoInfraestructura = null;  
  idVersion = null;
  idSedeFilial = null;
  idLocal = null;
}

export class InfraestructuraStoreModel {
  buscadorInfraestructura = new BuscardorInfraestructura();
  modalInfraestructura = new ModalInfraestructura();
}
