import { IActividadAdministracionModel } from '../actividad-model.interface';
import { IAdministracionModelADM } from '../administracion.interface';

export class ActividadAdministracionActions {
  constructor(
    private getState: () => IActividadAdministracionModel,
    private setState: (newState: IActividadAdministracionModel) => void
  ) {}

  getAdministracionModelStart = () => {
    const state = this.getState();
    this.setState({ ...state, isLoading: true, error: null });
  };

  getAdministracionModelSuccess = (value: IAdministracionModelADM) => {
    const state = this.getState();
    this.setState({ ...state, isLoading: false, formulario: value });
  };

  getAdministracionModelError = (error: any) => {
    const state = this.getState();
    this.setState({ ...state, isLoading: false, error: error });
  };
}
