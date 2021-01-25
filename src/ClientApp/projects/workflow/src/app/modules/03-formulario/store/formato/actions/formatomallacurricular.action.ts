import { IFormato } from '../formatomallacurricular.store.interface';
import { FormType } from '@sunedu/shared';

export class FormatoActions {
  constructor(
    private getState: () => IFormato,
    private setState: (newState: IFormato) => void,
  ) {

  }
  setModalEditar = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      mallaCurricular: {
        ...state.mallaCurricular,
        modalMallaCurricular: {
          ...state.mallaCurricular.modalMallaCurricular,
          mallaCurricular: {
            ...state.mallaCurricular.modalMallaCurricular.mallaCurricular,
            codigoModalidadEstudio: '1111'
          }
        }
      }
    });
  }
  setModalConsultar = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      mallaCurricular: {
        ...state.mallaCurricular,
        modalMallaCurricular: {
          ...state.mallaCurricular.modalMallaCurricular,
          type: FormType.CONSULTAR,
          title: 'Consultar Persona',
          mallaCurricular: {
            ...state.mallaCurricular.modalMallaCurricular.mallaCurricular,
            codigoModalidadEstudio: '1111'
          }
        }
      }
    });
  }


}
