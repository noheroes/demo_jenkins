import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IGridBuscardorMallaCurricular, IFormBuscardorMallaCurricular, IBuscardorMallaCurricular, IFormMallaCurricular, IModalMallaCurricular, IFormResumenMalla, IGridResumenMalla, IModalResumenMalla } from './mallacurricular.store.interface';

export class FormBuscardorMallaCurricular implements IFormBuscardorMallaCurricular {
  constructor(idVersion: string = '') {
    this.idVersion = idVersion;
  }
  id = '';
  codigoPrograma = '';
  programa = '';
  codigoModalidad = '';
  modalidad = '';
  numeroResolucion = '';
  fechaPlanCurricular = null;
  idVersion = '';
}

export class DataGridSource implements IDataGridSource<IGridBuscardorMallaCurricular>{
  items = [
    {
      id: '',
      programa: '',
      modalidad: '',
      numeroResolucion: '',
      fechaPlanCurricular: new Date(),
      idPrograma: '',
      descripcionPrograma: ''
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorMallaCurricular implements IBuscardorMallaCurricular {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Denominación de Programa', field: 'descripcionPrograma' },
      { label: 'Fecha', field: 'fechaElaboracion', isDatetime: true, dateTimeFormat: 'DD/MM/YYYY' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'AGREGAR_CURSO',
            icon: 'list',
            color: 'primary',
            tooltip: 'Registrar cursos por malla'
          },
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorMallaCurricular();
  comboLists = {
    programas: new ComboList([]),
  };
}


export class FormMallaCurricular implements IFormMallaCurricular {
  idPrograma = '';
  descripcionPrograma = '';
  descripcionModalidad = '';
  fechaElaboracion = null;
  tipoRegimenEstudioEnum = '';
  descripcionRegimen = '';
  conOtroRegimen = false;
  otroRegimen = '';
  numeroPeriodo = null;
  duracionProgramaAnios = null;
  duracionProgramaSemanas = null;
  valorCreditoTeorica = null;
  valorCreditoPractica = null;
  modalidadEstudioEnum = 0;
}
export class ModalMallaCurricular implements IModalMallaCurricular {
  title = 'Agregar malla curricular';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormMallaCurricular();
  codigoMallaCurricular = null;
  idPrograma = null;
  comboLists = {
    programas: new ComboList([]),
    modalidadEstudios: new ComboList([]),
    regimenEstudios: new ComboList([])
  };
}




export class FormResumenMalla implements IFormResumenMalla {
  ResumenMalla = [];
}
export class DataGridResumenMallaSource implements IDataGridSource<IGridResumenMalla>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class ModalResumenMalla implements IModalResumenMalla {
  title = 'Resumen de crédito y horas del programa académico';
  isLoading = false;
  error = null;
  type = FormType.CONSULTAR;
  form = new FormResumenMalla();
  gridDefinition = {
    columns: [
      { label: 'Teoria', field: 'Teoria' },
      { label: 'Practica', field: 'Practica' },
      { label: 'Total', field: 'Total' },
      { label: 'PorcentajeTotal', field: 'PorcentajeTotal' }
    ]
  };
  source = new DataGridResumenMallaSource();
  codigoMaestroPersona?= null;
}

export class MallaCurricularStoreModel {
  buscadorMallaCurricular = new BuscardorMallaCurricular();
  modalMallaCurricular = new ModalMallaCurricular();
  modalResumenMalla = new ModalResumenMalla();
}
