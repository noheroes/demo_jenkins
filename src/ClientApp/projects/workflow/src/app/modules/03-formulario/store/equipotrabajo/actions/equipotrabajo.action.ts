import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';
import { IAsignacionEquipoTrabajo, IMiembroEquipoTrabajo } from '../equipotrabajo.store.interface';
import { EquipoTrabajoService } from '../../../service/equipotrabajo.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import update from 'immutability-helper';
import { isNullOrUndefined } from 'util';
import { ComboList } from '@sunedu/shared';

export class EquipoTrabajoActions {

  constructor(
    private getState: () => IAsignacionEquipoTrabajo,
    private setState: (newState: IAsignacionEquipoTrabajo) => void,
    private equipoTrabajoService: EquipoTrabajoService
  ) {


  }

  setInit = (modelData: IFormularioModel) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      modelData: modelData,
    });
  }
  setUsuarios = (usuarios: IMiembroEquipoTrabajo[], mensajes: Object) => {
    const state = this.getState();   

    this.setState({
      ...state,
      usuariosDisponibles: usuarios
    })

  };
  getUsuarios = () => {
    const state = this.getState();
    return state.usuariosDisponibles;
  };
  

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }

  private fetchSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }

  private fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }

  asyncFetchUsuariosEquipoTrabajo = (idProceso: string, mensajes: Object) => {
    this.fetchBegin();
    return this.equipoTrabajoService.getMiembrosEquipoTrabajo(idProceso).pipe(
      tap(response => {
        this.setUsuarios(response.usuarios, mensajes);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }
}
