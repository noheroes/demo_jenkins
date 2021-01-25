import update from 'immutability-helper';
import {
  IBuscardorFirmante, IFormBuscardorFirmante,
} from '../firmante.store.interface';
import { FirmantesService } from '../../../service/firmantes.service';
import { IDataGridPageRequest } from '@sunedu/shared';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class FirmanteBuscadorActions {
  constructor(
    private getState: () => IBuscardorFirmante,
    private setState: (newState: IBuscardorFirmante) => void,
    private firmantesService: FirmantesService
  ) {
  }

  setInit = (form: IFormBuscardorFirmante) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: form
    });
  }

  asyncFetchPageLFirmante = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchFirmanteBegin();
    return this.firmantesService.getUsuariosByEntidad(filters).pipe(
      tap(response => {
        const representante = response.map(item => ({ ...item, seleccionado: false }));
        this.fetchPageFirmanteSucces(representante, response.count, pageRequest);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  };

  setFirmanteSeleccionados = (firmantes: any[]) => {
    const state = this.getState();
    const items: any[] = state.source.items;
    // console.log(firmantes);
    // console.log('CAYL items', items);
    items.forEach(item => {
      if (firmantes.some(x => x.userName == item.userName && x.seleccionado == true)) {
        item.seleccionado = true;
      }
      if(item.esResponsable=="SI"){
        item.seleccionado = true;
      }
    });
    let rls = [];
    items.forEach(element=>{
      if(element.seleccionado){
        const firmante = {
          userName:element.userName,
          codRol:element.codRol,
          seleccionado:true,
        }
        rls.push(firmante);  
      }
    })
    this.setState(
      update(this.getState(), {
        source: {
          items: { $set: items }
        },
        firmantes: {$set: rls}
      })
    );

  };

  getFirmantes=()=>{
    const state = this.getState();
    return state.firmantes;
  }

  private fetchPageFirmanteSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);    
    if(items.length){
      items.forEach(element => {
        element.esResponsable = element.esResponsable?"SI":"NO";
      });
    }
    elementos = (items || [])
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
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

  private fetchFirmanteBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
}
