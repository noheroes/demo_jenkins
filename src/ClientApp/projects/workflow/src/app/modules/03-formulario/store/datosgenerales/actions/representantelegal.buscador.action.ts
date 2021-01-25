import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IDataGridPageRequest, IDataGridSource } from '@sunedu/shared';
import {
  IBuscarRepresentanteLegal,
  IGridBuscardorRepresentanteLegal,
  IFormRepresentanteLegal,
} from '../datosgenerales.store.interface';
import { RepresentanteLegalService } from '../../../service/representantelegal.service';
import { forEach } from '@angular/router/src/utils/collection';
// import { IGridBuscadorRepresentante } from '@lic/administracion/app/modules/representante-legal/stores/representante.store.interface';
export class RepresentanteLegalBuscadorActions {
  constructor(
    private getState: () => IBuscarRepresentanteLegal,
    private setState: (newState: IBuscarRepresentanteLegal) => void,
    private representanteLegalService: RepresentanteLegalService
  ) {}
  setModalEditar = (id: string) => {
    const state = this.getState();
  };
  setModalConsultar = (id: string) => {
    const state = this.getState();
  };

  resetBuscadorRepresentanteLegal = () => {
    const state = this.getState();
    this.setState({
      ...state,
      source: null,
    });
  };

  getBuscardorRepresentanteLegal = () => {
    const state = this.getState();
    return state;
  };

  setBuscadorRepresentanteLegal = (
    items: IGridBuscardorRepresentanteLegal[],
    readOnly:boolean
  ) => {
    const state = this.getState();
    let fuente: IDataGridSource<IGridBuscardorRepresentanteLegal> = {
      page: 1,
      total: items.length,
      items: items,
      pageSize: 10,
      skip: 0
    };
    state.gridDefinition.columns.forEach(column=>{
      if(column.label=='Acciones'){
        column.buttons.forEach(button=>{
          if(button.action=='EDITAR'){
            button.hidden = item=>readOnly;
          }
        })
      }
    });
    this.setState({
      ...state,
      source: fuente
    });
  };

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  asyncFetchRepresentanteLegal = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar
  ): Observable<any> => {
    this.fetchRepresentanteLegalBegin();

    return this.representanteLegalService
      .searchPageRepresentanteLegal(pageRequest, filters)
      .pipe(
        tap((response) => {
          this.fetchPageRepresentanteLegalSucces(
            response.data,
            response.cout,
            pageRequest
          );
        }),
        catchError((error) => {
          this.fetchRepresentanteLegalError(error);
          return throwError(error);
        })
      );
  };

  asynDeleteRepresentanteLegal = (
    id: string
  ): Observable<IFormRepresentanteLegal> => {
    this.fetchRepresentanteLegalBegin();
    return this.representanteLegalService.deleteRepresentanteLegal(id).pipe(
      tap((x) => {
        this.fetchRepresentanteLegalSucces();
      }),
      catchError((error) => {
        this.fetchRepresentanteLegalError(error);
        return throwError(error);
      })
    );
  };
  private fetchRepresentanteLegalBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true },
      })
    );
  };

  private fetchRepresentanteLegalSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
      })
    );
  };
  private fetchPageRepresentanteLegalSucces = (
    items: any,
    total: number,
    pageRequest: IDataGridPageRequest
  ) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: items },
          total: { $set: elementos },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip },
        },
      })
    );
  };
  private fetchRepresentanteLegalError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error },
      })
    );
  };
}
