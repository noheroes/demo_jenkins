import { ICurso, IModalCurso, IFormBuscardorCurso, IOpcionCurso, IBuscardorCurso, IFormatoCurso } from './formatocurso.store.interface';
import { FormType, BuildGridButton } from '@sunedu/shared';

export class Curso implements ICurso {
    codigoCurso = '';
    codigoPeriodoAcademico = '';
    codigoTipoCurso = '';
    codigoTipoEstudio = '';
    nombreCurso = '';
    numeroTotalSemanas = '';
  }

  export class ModalCurso implements IModalCurso {
    title = 'Agregar curso';
    isLoading = false;
    error = null;
    type = FormType.REGISTRAR;
    curso = new Curso();
    codigoCurso?: null;
  }

  export class FormBuscardorCurso implements Partial<IFormBuscardorCurso> {
    codigoEstudio = '';
    nombreCurso = '';
    codigoTipoCurso = '';
  }

  export class OpcionCurso implements IOpcionCurso {
    modalCurso = new ModalCurso();
    buscardorCurso: IBuscardorCurso = {
      isLoading: false,
      error: null,
      comboLists: {
        codigoTipoCurso: [{ value: 0, text: 'Instituto' }, { value: 1, text: 'Universidad' }],
        codigoEstudio: [{ value: 0, text: 'Instituto' }, { value: 1, text: 'Universidad' }]
      },
      formBuscar: new FormBuscardorCurso(),
      gridDefinition: {
        columns: [
          { label: 'Nombre de curso', field: 'nombreCurso' },
          { label: 'Estudio', field: 'codigoEstudio' },
          { label: 'Tipo de curso', field: 'codigoTipoCurso' },
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
            nombreCurso: 'Curso test',
            codigoEstudio: 'Presencial',
            codigoTipoCurso: ' RS-1254-2020'
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

  export class FormatoCurso implements IFormatoCurso {
    currentForm = 'curso';
    curso = new OpcionCurso();
  }
