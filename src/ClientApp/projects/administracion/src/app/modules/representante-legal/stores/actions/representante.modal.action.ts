import {
  RepresentanteLegal,
  StatusResponse,
} from './../../../entidades/stores/entidad.store.interface';
import { FormType, ComboList,  ToastService, } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, Subscription, throwError } from 'rxjs';
import { map, tap, catchError,concatMap } from 'rxjs/operators';

import { IModalRepresentante } from '../representante.store.interface';
import { ModalRepresentante } from '../representante.store.model';

import { EntidadService } from '../../../entidades/services/entidad.service';
import { IEntidad } from '../../../entidades/stores/entidad.store.interface';

export class RepresentanteModalActions {
  constructor(
    private getState: () => IModalRepresentante,
    private setState: (newState: IModalRepresentante) => void,
    private entidadService: EntidadService,
    private toast: ToastService,
  ) {}

  setModalEdit = (id: string, entidad: IEntidad) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      entidad: entidad,
      codigo: id,
      type: FormType.EDITAR,
      title: 'Modificar Representante',
    });
  };
  setModalReadOnly = (id: string, entidad: IEntidad) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigo: id,
      entidad: entidad,
      type: FormType.CONSULTAR,
      title: 'Consulta Representante',
    });
  };

  setModalNew = (entidad: IEntidad) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      entidad: entidad,
    });
  };
  resetModalRepresentanteLegal = () => {
    this.setState(new ModalRepresentante());
  };

  /*asynUpdateEntidad = (form: IEntidad): Observable<StatusResponse> => {
    this.showLoading(true);
    return this.entidadService.updateEntidad(form).pipe(
      tap((x) => {
        this.showLoading(false);

        return x;
      }),
      catchError((error) => {
        this.crudError(error);
        return throwError(error);
      })
    );
  };*/

  asynUpdateEntidad = (form: IEntidad): Observable<IEntidad> => {
    this.crudLocalBegin();
    const state = this.getState();
    //var idElemento = uuid.v4();
    return this.entidadService.getEntidades()
      .pipe(
        map(response => {          
          const request ="";                 
          return request;
        }),
        concatMap(request => this.entidadService.updateEntidad(form)),
        tap(response => {
          /*this.showLoading(false);
          return response;*/          
          this.crudLocalSucces();
        }),
        catchError(error => {          
          this.crudError(error);                   
          return throwError(error);
        })
      );
  }

  loadDataRepresentanteLegal = (data: RepresentanteLegal) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data },
      })
    );
  };
  loadTipoDocumentoEnum = (data: any) => {
    this.setState(
      update(this.getState(), {
        comboLists: {
          tipoDocumentos: { $set: { list: data, loading: false } },
        },
      })
    );
  };

  //#region Private Methods

  private showLoading = (value: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true },
      })
    );
  };
  private fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error },
      })
    );
  };

  private crudError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },        
        error: { $set: mensajes }
      })
    );
  } 

  private crudLocalSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };

  private crudLocalBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
  //#endregion
}
