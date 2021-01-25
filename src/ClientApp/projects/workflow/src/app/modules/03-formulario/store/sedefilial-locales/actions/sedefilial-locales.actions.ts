import { ComboList } from '@sunedu/shared';
import { tap, catchError } from 'rxjs/operators';
import { throwError, of, Observable } from 'rxjs';
import update from 'immutability-helper';
import { IFormatoBody } from '../sedefilial-locales.store.interface';
import { SedeFilialService } from '../../../service/sedefilial.service';

export class SedeFilialLocalesActions {
  constructor(
    private getState: () => IFormatoBody,
    private setState: (newState: IFormatoBody) => void,
    private sedeFilialService:SedeFilialService
  ) { }

  setFormato(sedesFiliales:any){
    this.setState(
      update(this.getState(),{
        isLoading:{$set:false},
        sedeFilialLocales:{$set:sedesFiliales}
      })
    );
  }


  getSedesFiliales(){
    const state = this.getState();
    const sedesF = state.sedeFilialLocales;
    if(sedesF.length){
      let list=[];
      let sede = sedesF.filter(x => !x.esEliminado && x.esSedeFilial); 
      let orderFiliales = sedesF.filter(x => !x.esEliminado && !x.esSedeFilial).sort(function(a, b) { if (a.codigo > b.codigo) return 1; if (a.codigo < b.codigo) return -1; return 0;});
      let orderSedeFiliales = sede.concat(orderFiliales);
      orderSedeFiliales.map(item=>{
        if(!item.esEliminado){
          list.push({
            text:`${item.codigo} - ${item.descripcionUbigeo}`,
            value:item.id
          });
        }
      });
      
      /*list.sort(function (a, b) {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });*/
      let sedes = new ComboList(list);
      return of(sedes);
    }
    return null;
  }

  getLocales(id:string):Observable<ComboList>{
    const state = this.getState();
    let locales = new ComboList([]);
    const sede = state.sedeFilialLocales.find(x=>x.id==id);
    if(sede!=null){
      if(sede.locales.length){
        const localesF = sede.locales.filter(x=>x.esEliminado==false);
        if(localesF.length){
          let list=[];
          localesF.map(item=>{
            list.push({
              text:`${item.codigo} - ${item.descripcionUbigeo}`,
              value:item.id
            });
          });
          locales = new ComboList(list);
          return of(locales);
        }
      }
    }
    return of(locales);
  }




  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  asyncFetchSedesFiliales=(idVersionSolicitud:string)=>{
    this.fetchBegin();
    return this.sedeFilialService.getFormatoByVersion(idVersionSolicitud).pipe(
      tap(response => {
        // console.log(response['sedeFiliales']);
        this.setFormato(response['sedeFiliales']);
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

}
