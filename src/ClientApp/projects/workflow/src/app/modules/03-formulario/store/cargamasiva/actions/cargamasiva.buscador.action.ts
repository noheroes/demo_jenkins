import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, concatMap, map } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IBuscardorCargaMasiva, IFormTarea } from '../cargamasiva.store.interface';
import { CargaMasivaService } from '../../../service/cargamasiva.service';
import { BuscardorCargaMasiva } from '../cargamasiva.store.model';
export class CargaMasivaBuscadorActions {
  constructor(
    private getState: () => IBuscardorCargaMasiva,
    private setState: (newState: IBuscardorCargaMasiva) => void,
    private cargaMasivaService: CargaMasivaService
  ) {
  }
  setModalEdit = (id: string) => {    
  }

  resetModal = () => {    
    this.setState(new BuscardorCargaMasiva());
  }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      formBuscar: {
        ...state.formBuscar
      }
    });
  }

  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        tipoCargaMasiva: enums[0]        
      }
    };
    this.setState(newState);
  }


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

  asyncDownLoadFile(nombrePlanitilla: string, esPlantilla: boolean, idArchivo: string){
    this.fetchBegin();
    this.cargaMasivaService.downloadFile(nombrePlanitilla, esPlantilla, idArchivo)
    .subscribe(
      info=>{this.fetchSucces();},
      error=>{ this.fetchError(error); return throwError(error);});
  }

  asynSaveTarea = (form: any) => {
    this.crudTareaBegin();
    const state = this.getState();
    var request = {};    
    request = {
      "idVersion": state.idVersion,
      "tipoCargaEnum": form.tipoCargaEnum,
      "tipoCargaDescripcion": form.tipoCargaDescripcion,
      "estadoEnum": 1,
      "estadoDesc": "Pendiente",
      "idArchivoTemporal": form.idArchivoTemporal,
      "nombreArchivo": form.nombreArchivo,
      "idArchivo": "",
      "actividad": []
    };       
    return new Promise(
      (resolve)=>{
        this.fetchBegin();        
        this.cargaMasivaService.setInsertCargaMasiva(request)
        .subscribe(
          info=>{            
            this.fetchSucces();
            resolve(info);
          },
          error => {
            this.fetchSucces();
            return throwError(error);
          }
        )
    });
  }

  private crudTareaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudTareaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };


  asyncFetchPageCargaMasiva = ( 
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState()): void => {
    this.fetchCargaMasivaBegin();
    this.cargaMasivaService.getCargaMasivaAll(filters.idVersion).subscribe(response => {                
      this.fetchPageCargaMasivaSucces(response, response.count, pageRequest);        
    }),
    catchError(error => {
      return throwError(error);
    });    
  }

  private fetchCargaMasivaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchPageCargaMasivaSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {    
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
          total: { $set: /*total*/elementos.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  }

  clearDataArchivo() {
    this.cargaMasivaService.clearDataArchivo();
  }
}
