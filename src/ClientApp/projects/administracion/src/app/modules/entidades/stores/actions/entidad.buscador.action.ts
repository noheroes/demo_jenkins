import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, takeUntil } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import {
  IBuscardorEntidad,
  StatusResponse,
  IEntidad,
} from '../entidad.store.interface';

import { EntidadService } from '../../services/entidad.service';

export class EntidadBuscadorActions {
  constructor(
    private getState: () => IBuscardorEntidad,
    private setState: (newState: IBuscardorEntidad) => void,
    private entidadService: EntidadService
  ) {}
  /*
  setModalEditar = (id: string) => {
    const state = this.getState();
  };
  setModalConsultar = (id: string) => {
    const state = this.getState();
  };
  */
  asyncFetchEntidades = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().gridSource.page,
      pageSize: this.getState().gridSource.pageSize,
      orderBy: this.getState().gridSource.orderBy,
      orderDir: this.getState().gridSource.orderDir,
    },
    filters = this.getState().formBuscar
  ) => {
    this.showLoading(true);
    this.entidadService
      .searchPageEntidad(pageRequest, filters)
      .pipe(
        tap((response) => {
          this.fetchPageEntidadSucces(response, 1, pageRequest);
        }),
        catchError((error) => {
          this.fetchError(error);
          return throwError(error);
        })
      )
      .subscribe();
  };

  asynDeleteEntidad = (entidad: IEntidad): Observable<StatusResponse> => {
    this.showLoading(true);
    return this.entidadService.deleteEntidad(entidad).pipe(
      tap((x) => {
        this.showLoading(false);
        return x;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  };

  getEntidadesFromState = (): Observable<IEntidad[]> => {
    const state = this.getState();
    const { items } = state.gridSource;
    return new Observable<IEntidad[]>((observer) => {
      setTimeout(() => {
        observer.next(items as IEntidad[]);
      });
    });
  };

  private showLoading = (value: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: value },
      })
    );
  };
  private fetchPageEntidadSucces = (
    items: Array<IEntidad>,
    total: number,
    pageRequest: IDataGridPageRequest
  ) => {
    items.forEach((element) => {
      const index = items.indexOf(element);
      element.rowNum = index + 1;
    });
    let elementos = (items || []).filter(item => !item.esEliminado);
    const totalItems =(items || []).filter(item => !item.esEliminado).length; 
    const elementosPag = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        gridSource: {
          items: { $set: elementosPag },
          total: { $set: totalItems},
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip },
        },
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
}
