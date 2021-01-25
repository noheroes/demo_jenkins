import { BuildGridButton, IDataGridSource, ComboList, FormType, IDataGridDefinition } from '@sunedu/shared';
import { IGridBuscardorCurso, IFormBuscardorCurso, IBuscardorCurso, IFormCurso, IModalCurso, IModalHoraLectivaCurso, IFormHoraLectivaCurso, IModalPreRequisitoCurso, IFormPreRequisitoCurso } from './curso.store.interface';

export class FormBuscardorCurso implements IFormBuscardorCurso {
  codigoCurso = '';
  codigoPeriodoAcademico = '';
  codigoTipoCurso = '';
  codigoTipoEstudio = '';
  nombreCurso = '';
  numeroTotalSemanas = '';
  idVersion = '';
}

export class DataGridSource implements IDataGridSource<IGridBuscardorCurso>{
  items = [
    {
      codigoCurso: '',
      codigoPeriodoAcademico: '',
      codigoTipoCurso: '',
      codigoTipoEstudio: '',
      nombreCurso: '',
      numeroTotalSemanas: ''
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorCurso implements IBuscardorCurso {
  isLoading = false;
  error = null;
  idMallaCurricular = '';
  idVersion = '';
  descripcionPrograma = '';
  duracionProgramaEnSemanas = '';
  gridDefinition = {
    columns: [
      { label: 'Nombre de curso', field: 'nombre' },
      { label: 'Tipo de estudio', field: 'descripcionEstudio' },
      { label: 'Tipo de curso', field: 'descripcionTipoCurso' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action:'PRE_REQUSITO',
            icon:'mediation',
            color:'primary',
            tooltip:'Cursos PreRequsitos'
          },
          {
            action: 'HORARIO_LECTIVO',
            icon: 'account_balance',
            color: 'primary',
            tooltip: 'Horarios lectivos'
          },
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorCurso();
  comboLists = {
    perdiodoAcademicos: new ComboList([]),
    tipoEstudios: new ComboList([]),
    tipoCursos: new ComboList([])
  };
}


export class FormCurso implements IFormCurso {
  tipoPeriodoAcademico = '';
  codigo = '';
  nombre = '';
  tipoEstudioEnum = '';
  descripcionEstudio = '';
  tipoCursoEnum = '';
  descripcionTipoCurso = '';
  totalSemanas = '';
  creditosAcademicos = null;
}
export class ModalCurso implements IModalCurso {
  title = 'Agregar curso';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormCurso();
  codigoCurso = null;
  comboLists = {
    perdiodoAcademicos: new ComboList([]),
    tipoEstudios: new ComboList([]),
    tipoCursos: new ComboList([])
  };
}

export class FormHoraLectivaCurso implements IFormHoraLectivaCurso {
  tipoHoraLectivaEnum = '';
  descripcionHoraLectiva = '';
  cantidad = null;

}
export class DataHoraLectivaCursoGridSource implements IDataGridSource<IFormHoraLectivaCurso>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class ModalHorarioLectivoCurso implements IModalHoraLectivaCurso {
  title = 'Agregar hora lectivas por periodo académico';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormHoraLectivaCurso();
  codigoHoraLectiva?= '';
  idVersion?= '';
  idMallaCurricular?= '';
  idCurso = '';
  comboLists = {
    horaLectivas: new ComboList([]),
  };
  source = new DataHoraLectivaCursoGridSource();
  gridDefinition = {
    columns: [
      { label: 'Hora lectiva', field: 'descripcionHoraLectiva' },
      { label: 'Cantidad', field: 'cantidad' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
}

export class FormPreRequisitoCurso implements IFormPreRequisitoCurso{
  codigo='';
  nombre='';
  totalSemanas=null;
}

export class DataPreRequisitoCursoGridSource implements IDataGridSource<IFormPreRequisitoCurso>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class ModalPreRequisitoCurso implements IModalPreRequisitoCurso {
  title = 'Agregar Curso Pre-Requisito';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormPreRequisitoCurso();
  cursos?= [];
  idVersion?= '';
  idMallaCurricular?= '';
  idCurso = '';
  comboLists = {
    cursos: new ComboList([]),
  };
  source = new DataPreRequisitoCursoGridSource();
  gridDefinition = {
    columns: [
      { label: 'Código Curso', field: 'codigo' },
      { label: 'Nombre Curso', field: 'nombre' },
      { label: 'Nro. Total Semanas', field: 'totalSemanas' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
}



export class CursoStoreModel {
  buscadorCurso = new BuscardorCurso();
  modalCurso = new ModalCurso();
  modalHoraLectivaCurso = new ModalHorarioLectivoCurso();
  modalPrerequisitoCurso= new ModalPreRequisitoCurso();
}
