import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IBuscardorEquipamiento, IFormEquipamiento, IFormBuscardorEquipamiento } from '../equipamiento.store.interface';
import { EquipamientoService } from '../../../service/equipamiento.service';
import * as uuid from 'uuid';

export class EquipamientoBuscadorActions {
  constructor(
    private getState: () => IBuscardorEquipamiento,
    private setState: (newState: IBuscardorEquipamiento) => void,
    private EquipamientoService: EquipamientoService
  ) {

  }

  setInit = (form: IFormBuscardorEquipamiento) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: form
    });
  }

  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();

  }



  asynDeleteEquipamiento = (id: string): Observable<IFormEquipamiento> => {
    this.fetchEquipamientoBegin();
    const state = this.getState();
    
    return this.EquipamientoService.getFormatoDetalleByVersion(state.formBuscar.idVersion, state.formBuscar.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.equipoMobiliarios.findIndex(item => item.id == id);
          const form = response.equipoMobiliarios[index];
          form.esEliminado = true;
          const equipamientoUpdate = [...response.equipoMobiliarios.slice(0, index), form, ...response.equipoMobiliarios.slice(index + 1)];
          const request = {
            ...response,
            equipoMobiliarios: equipamientoUpdate
          };

          return request;
        }),
        concatMap(request => this.EquipamientoService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchEquipamientoSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchEquipamientoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchEquipamientoSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };

  private fetchEquipamientoError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
