import { FormType } from '@sunedu/shared';

import update from 'immutability-helper';
import { of, Observable, Subscription, throwError } from 'rxjs';

import { map, tap, catchError } from 'rxjs/operators';
import {
  IModalEntidad,
  IEntidad,
  StatusResponse
} from '../entidad.store.interface';

import { EntidadService } from '../../services/entidad.service';
import { ModalEntidad } from '../entidad.store.model';

export class EntidadModalActions {
  constructor(
    private getState: () => IModalEntidad,
    private setState: (newState: IModalEntidad) => void,
    private entidadService: EntidadService
  ) { }
  setModalEdit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      id: id,
      type: FormType.EDITAR,
      title: 'Modificar Universidad',
    });
  };
  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      id: id,
      type: FormType.CONSULTAR,
      title: 'Consulta Universidad',
    });
  };

  setModalNew = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
    });
  };
  resetModalEntidad = () => {
    this.setState(new ModalEntidad());
  };

  private fetchEntidadSucces = (data: IEntidad) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data },
      })
    );
  };

  loadDataEntidad = (data: IEntidad) => {
    this.fetchEntidadSucces(data);
  };

  asynSaveEntidad = (form: IEntidad): Observable<StatusResponse> => {
    this.showLoading(true);
    return this.entidadService.saveEntidad(form).pipe(
      tap((x) => {
        this.showLoading(false);
        return x;
      }),
      catchError((error) => {
        this.showLoading(false);
        return throwError(error);
      })
    );
  };

  asynUpdateEntidad = (
    form: IEntidad
  ): Observable<StatusResponse> => {
    this.showLoading(true);
    return this.entidadService.updateEntidad(form).pipe(
      tap((x) => {
        this.showLoading(false);

        return x;
      }),
      catchError((error) => {
        this.showLoading(false);
        return throwError(error);
      })
    );
  };

  private showLoading = (value: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: value },
      })
    );
  };
}
