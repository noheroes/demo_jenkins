import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IDataGridPageRequest, FormType } from '@sunedu/shared';
import { IBuscardorCargaMasivaActividad } from '../cargamasiva.store.interface';
import { CargaMasivaService } from '../../../service/cargamasiva.service';
export class CargaMasivaActividadBuscadorActions {
  constructor(
    private getState: () => IBuscardorCargaMasivaActividad,
    private setState: (newState: IBuscardorCargaMasivaActividad) => void,
    private cargaMasivaService: CargaMasivaService
  ) {
  }  

  setModalConsultar = (idVersion: string, idTarea: string) => {

    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      idVersion: idVersion,
      idTarea: idTarea,
      type: FormType.EDITAR,
      title: 'Actividades de la carga masiva'
    });
  }

  asyncFetchPageActividad = ( 
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState()): Observable<any> => {
    this.fetchActividadBegin();
    return this.cargaMasivaService.getCargaMasivaAll(filters.idVersion).pipe(
      tap(response => {              
        this.fetchPageActividadSucces(response.find(x => x.id == filters.idTarea).actividades, response.count, pageRequest);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private fetchPageActividadSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {    
    let numeroOrden = 0;
    items.forEach(element => {     
      numeroOrden = numeroOrden + 1;
      element['numeroOrden'] = numeroOrden;    
    });
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = (items || []).filter(item => !item.esEliminado)
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

  private fetchActividadBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  resetModal = () => {
    // this.setState(new ModalProgramaNoDocente());
  }
}
