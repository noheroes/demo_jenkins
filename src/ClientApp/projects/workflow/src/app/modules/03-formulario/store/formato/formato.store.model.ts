import { IMallaCurricular, IModalMallaCurricular, IOpcionMallaCurricular, IFormato, IBuscardorMallaCurricular, IFormBuscardorMallaCurricular, ICurso, IModalCurso, IBuscardorCurso, IFormBuscardorCurso } from './formatomallacurricular.store.interface';
import { FormType, BuildGridButton, ComboList } from '@sunedu/shared';

export class MallaCurricular implements IMallaCurricular {
  codigoPrograma = '';
  codigoModalidadEstudio = '';
  fechaPlanCurricular = null;
  codigoRegimenEstudio = '';
  periodoAcademico = '';
  duracionProgramaAnios = '';
  duracionProgramaSemanas = '';
  valorCreditoHorasTeoricas = '';
  valorCreditoHorasPracticas = '';
}
export class ModalMallaCurricular implements IModalMallaCurricular {
  title = 'Agregar malla curricular';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  mallaCurricular = new MallaCurricular();
  codigoMallaCurricular?: null;
}
export class FormBuscardorMallaCurricular implements Partial<IFormBuscardorMallaCurricular> {
  codigoPrograma = '';
  codigoModalidad = '';
  numeroResolucion = '';
  fechaPlanCurricular = null;
}
export class Curso implements ICurso {
  codigoCurso = '';
}

export class ModalCurso implements IModalCurso {
  title = 'Agregar malla curricular';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  curso = new Curso();
  codigoCurso?: null;
}

export class FormBuscardorCurso implements Partial<IFormBuscardorCurso> {
 id: string;
}


export class OpcionMallaCurricular implements IOpcionMallaCurricular {
  modalMallaCurricular = new ModalMallaCurricular();
  buscarMallCurricular: IBuscardorMallaCurricular = {
    isLoading: false,
    error: null,
    comboLists: {
      tipoPrograma: [{ value: 0, text: 'Instituto' }, { value: 1, text: 'Universidad' }],
      tipoModalidad: [{ value: 0, text: 'Instituto' }, { value: 1, text: 'Universidad' }]
    },
    formBuscar: new FormBuscardorMallaCurricular(),
    gridDefinition: {
      columns: [
        { label: 'Denominación del programa', field: 'programa' },
        { label: 'Modalidad de estudio', field: 'modalidad' },
        { label: 'Resolución', field: 'numeroResolucion' },
        { label: 'Fecha', field: 'fechaPlanCurricular', isDatetime: true },
        {
          label: 'Acciones', field: 'buttons', buttons: [
            {
              action: 'AGREGAR_CURSOS',
              icon: 'book',
              color: 'primary',
              tooltip: 'Agregar cursos'
            },
            BuildGridButton.CONSULTAR(),
            BuildGridButton.EDITAR(),
            BuildGridButton.ELIMINAR()
          ]
        }
      ]
    },
    source: {
      items: [
        {
          id: '123',
          programa: 'P01 - Ingenieria Hidraulica',
          modalidad: 'Presencial',
          numeroResolucion: ' RS-1254-2020',
          fechaPlanCurricular: new Date()
        }
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      orderBy: null,
      orderDir: null
    }
  };
  modalCurso = new ModalCurso();
  buscardorCurso: IBuscardorCurso = {
    isLoading: false,
    error: null,
    comboLists: {
      tipoPrograma: [{ value: 0, text: 'Instituto' }, { value: 1, text: 'Universidad' }],
      tipoModalidad: [{ value: 0, text: 'Instituto' }, { value: 1, text: 'Universidad' }]
    },
    formBuscar: new FormBuscardorCurso(),
    gridDefinition: {
      columns: [
        { label: 'Denominación del programa', field: 'programa' },
        { label: 'Modalidad de estudio', field: 'modalidad' },
        { label: 'Resolución', field: 'numeroResolucion' },
        { label: 'Fecha', field: 'fechaPlanCurricular', isDatetime: true },
        {
          label: 'Acciones', field: 'buttons', buttons: [
            {
              action: 'AGREGAR_CURSOS',
              icon: 'book',
              color: 'primary',
              tooltip: 'Agregar cursos'
            },
            BuildGridButton.CONSULTAR(),
            BuildGridButton.EDITAR(),
            BuildGridButton.ELIMINAR()
          ]
        }
      ]
    },
    source: {
      items: [
        {
          id: '123'
        }
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      orderBy: null,
      orderDir: null
    }
  };
}
export class Formato implements IFormato {
  currentForm = 'mallacurricular';
  mallaCurricular = new OpcionMallaCurricular();
  comboList={
    sedes: new ComboList([{ 'text': 'S - Lima/Lima', 'value': '1' }])
  }
}

export class FormatoStoreModel{
  formato = new Formato();
}
