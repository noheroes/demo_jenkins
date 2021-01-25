import { IFormatoCurso } from '../formatocurso.store.interface';
import { FormType } from '@sunedu/shared';

export class FormatoActionsCursos {
  constructor(
    private getState: () => IFormatoCurso,
    private setState: (newState: IFormatoCurso) => void,
  ) {

  }
  setModalEditar = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      curso: {
        ...state.curso,
        modalCurso: {
          ...state.curso.modalCurso,
          curso: {
            ...state.curso.modalCurso.curso,
            codigoTipoEstudio: '1111'
          }
        }
      }
    });
  }
  setModalConsultar = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      curso: {
        ...state.curso,
        modalCurso: {
          ...state.curso.modalCurso,
          type: FormType.CONSULTAR,
          title: 'Consultar Persona',
          curso: {
            ...state.curso.modalCurso.curso,
            codigoTipoEstudio: '1111'
          }
        }
      }
    });
  }


}
