import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IDataGridPageRequest, IDataGridSource, ComboList } from '@sunedu/shared';
import { ISedesFiliales, ISedeFilial, IFormatoSedeFilial } from '../sedes-filiales.store.interface';
import { MediosVerificacionService } from '../../../service/mediosverificacion.service';

export class SedesFilialesActions {
  constructor(
    private getState: () => ISedesFiliales,
    private setState: (newState: ISedesFiliales) => void,
    private mediosVerificacionService: MediosVerificacionService
  ) { }

  getSedesFiliales(){
    const state = this.getState();
    if(state.sedes.length){
      let list=[];
      state.sedes.map(item=>{
        list.push({
          text:`${item.codigo} - ${item.descripcionUbigeo}`,
          value:item.idSedeFilial
        });
      });
      let sedes = new ComboList(list);
      return of(sedes);
    }else{
      return of(new ComboList([]));
    }
  }

  setSedesFiliales(formatos:any){
    let sedesF = formatos['sedeFiliales'];
    let sedes:ISedeFilial[]=[];
    sedesF.forEach(item => {
      if(!item.esEliminado){
        let sede:ISedeFilial={
          codigo:item.codigo,
          ubigeo:item.ubigeo,
          descripcionUbigeo:item.descripcionUbigeo,
          esSedeFilial:item.esSedeFilial,
          idSedeFilial:item.id,
          idCatalogo:''
        }
        sedes.push(sede);
      }
    });

    this.setState(
      update(this.getState(), {
        //isLoading: { $set: true },
        sedes: {$set: sedes}
      })
    );
  }

  setCatalogos(catalogos:any){
    const state = this.getState();
    let sedesO = state.sedes;
    let sedesF = catalogos['catalogosSedesFiliales'];
    if(sedesO.length && sedesF.length){
      sedesO.forEach(item=>{
        let sede= sedesF.find(x=>x.idSedeFilial==item.idSedeFilial);
        if(sede!=null){
          item.idCatalogo=sede.idCatalogo;
        }
      });

      this.setState(
        update(this.getState(), {
          isLoading: { $set: false },
          sedes: {$set: sedesO}
        })
      );
    }
  }

  getSedesCatalogos(){
    const state = this.getState();
    return state.sedes;
  }

  getIdCatalogoByIdSedeFilial(idSedeFilial):string{
    const state = this.getState();
    let sede = state.sedes.find(x=>x.idSedeFilial==idSedeFilial);
    return sede==null?null:sede.idCatalogo;
  }




  // //OJO VER
  // getBuscardorRepresentanteLegal=()=>{
  //   const state = this.getState();
  //   return state;
  // }



  // setBuscadorRepresentanteLegal=(items:IGridBuscardorRepresentanteLegal[])=>{
  //   const state = this.getState();
  //   let fuente:IDataGridSource<IGridBuscardorRepresentanteLegal> = {
  //     page:1,
  //     total:items.length,
  //     items:items,
  //     pageSize:10,
  //     skip:0
  //   };
  //   this.setState({
  //     ...state,
  //     source:fuente
  //   });
  // }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  asyncFetchSedesFiliales=(idVersionSolicitud:string)=>{
    this.fetchBegin();
    return this.mediosVerificacionService.getSedesFiliales(idVersionSolicitud).pipe(
      tap(response => {
        // console.log(response);
        this.setSedesFiliales(response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
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


  asyncFetchCatalogos=(idVersionSolicitud:string)=>{
    this.fetchBegin();
    return this.mediosVerificacionService.getCatalogos(idVersionSolicitud).pipe(
      tap(response => {
        // console.log(response);
        this.setCatalogos(response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  // private fetchSedesFilialesSucces = (sedes) => {
  //   this.setState(
  //     update(this.getState(), {
  //       isLoading: { $set: false },
  //       source: {
  //         items: { $set: items },
  //         total: { $set: total },
  //         page: { $set: pageRequest.page },
  //         pageSize: { $set: pageRequest.pageSize },
  //         orderBy: { $set: pageRequest.orderBy },
  //         orderDir: { $set: pageRequest.orderDir },
  //         skip: { $set: pageRequest.skip }
  //       }
  //     })
  //   );
  // }



  // asyncFetchRepresentanteLegal = (
  //   pageRequest: IDataGridPageRequest = {
  //     page: this.getState().source.page,
  //     pageSize: this.getState().source.pageSize,
  //     orderBy: this.getState().source.orderBy,
  //     orderDir: this.getState().source.orderDir,
  //   },
  //   filters = this.getState().formBuscar): Observable<any> => {

  //   this.fetchRepresentanteLegalBegin();

  //   return this.representanteLegalService.searchPageRepresentanteLegal(pageRequest, filters).pipe(
  //     tap(response => {
  //       this.fetchPageRepresentanteLegalSucces(response.data, response.cout, pageRequest);
  //     }),
  //     catchError(error => {
  //       this.fetchRepresentanteLegalError(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // asynDeleteRepresentanteLegal = (id: string): Observable<IFormRepresentanteLegal> => {
  //   this.fetchRepresentanteLegalBegin();
  //   return this.representanteLegalService.deleteRepresentanteLegal(id).pipe(
  //     tap(x => {
  //       this.fetchRepresentanteLegalSucces();
  //     }),
  //     catchError(error => {
  //       this.fetchRepresentanteLegalError(error);
  //       return throwError(error);
  //     })
  //   );
  // }
  // private fetchRepresentanteLegalBegin = () => {
  //   this.setState(
  //     update(this.getState(), {
  //       isLoading: { $set: true }
  //     })
  //   );
  // }

  // private fetchRepresentanteLegalSucces = () => {
  //   this.setState(
  //     update(this.getState(), {
  //       isLoading: { $set: false }
  //     })
  //   );
  // }
  // private fetchPageRepresentanteLegalSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
  //   this.setState(
  //     update(this.getState(), {
  //       isLoading: { $set: false },
  //       source: {
  //         items: { $set: items },
  //         total: { $set: total },
  //         page: { $set: pageRequest.page },
  //         pageSize: { $set: pageRequest.pageSize },
  //         orderBy: { $set: pageRequest.orderBy },
  //         orderDir: { $set: pageRequest.orderDir },
  //         skip: { $set: pageRequest.skip }
  //       }
  //     })
  //   );
  // }
  // private fetchRepresentanteLegalError = (error: any) => {
  //   this.setState(
  //     update(this.getState(), {
  //       isLoading: { $set: false },
  //       error: { $set: error }
  //     })
  //   );
  // }

}
