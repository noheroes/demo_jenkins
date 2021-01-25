import update from 'immutability-helper';
import { IBuscardorAmbiente, IFormAmbiente } from '../ambiente.store.interface';
import { AmbienteService } from '../../../service/ambiente.service';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
export class AmbienteBuscadorActions {
  constructor(
    private getState: () => IBuscardorAmbiente,
    private setState: (newState: IBuscardorAmbiente) => void,
    private ambienteService: AmbienteService
  ) {

  }
  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();

  }

  asyncFetchPersons = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar) => {

    this.fetchAmbienteBegin();

    this.ambienteService.searchPageAmbiente(pageRequest, filters).pipe(
      tap(response => {
        this.fetchPageAmbienteSucces(response.data, response.cout, pageRequest);
      }),
      catchError(error => {
        this.fetchAmbienteError(error);
        return throwError(error);
      })
    );
  }

  asynDeleteAmbiente = (id: string): Observable<IFormAmbiente> => {
    this.fetchAmbienteBegin();
    return this.ambienteService.deleteAmbiente(id).pipe(
      tap(x => {
        this.fetchAmbienteSucces();
      }),
      catchError(error => {
        this.fetchAmbienteError(error);
        return throwError(error);
      })
    );
  }
  private fetchAmbienteBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchAmbienteSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageAmbienteSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: items },
          total: { $set: elementos.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };
  private fetchAmbienteError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
