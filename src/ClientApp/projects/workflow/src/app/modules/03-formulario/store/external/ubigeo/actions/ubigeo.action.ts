import { IUbigeo, IUbigeoGeneral } from '../ubigeo.interface';
import { ExternalUbigeoService } from '../../../../service/external/external.ubigeo.service';
import { Observable, of } from 'rxjs';
import { ComboList } from '@sunedu/shared';
import { isNullOrUndefined } from 'util';

export class UbigeoActions {

  constructor(
    private getState: () => IUbigeoGeneral,
    private setState: (newState: IUbigeoGeneral) => void,
    private ubigeoService: ExternalUbigeoService,
    ) {
  }

  setValueTodos = (newValue: IUbigeo[]) => {
    const state = this.getState();
    const newState = {
      ...state,
      ubigeos: newValue
    }
    this.setState(newState);
  }

  getUbigeos = ()=>{
    return this.getState();
  }

getDepartamentos(){
  return new Promise(
    (resolve)=>{ 
      const state = this.getState();
      // console.log(state);
      let depasF:IUbigeo[]=[];
      //console.log(state);
  
      if(state){
        //console.log('CAYL existe state');
        if(state.ubigeos)
        {
          //console.log('CAYL existe ubigeos');
          depasF = state.ubigeos.filter(x=>x.referencia=="");
          resolve(this.departamentosComboList(depasF));
        }else{
          //console.log('CAYL NO existe ubigeos');
          this.asyncGetUbigeoTodos().then(()=>{
            const state2 = this.getState();
            console.log(state2);
            depasF = state2.ubigeos.filter(x=>x.referencia=="");
            resolve(this.departamentosComboList(depasF)); 
          });
        }
      }
  });
}

  getDepartamentos2():Observable<ComboList>{
    const state = this.getState();
    // console.log(state);
    let depasF:IUbigeo[]=[];
    console.log(state);

    if(state){
      //console.log('CAYL existe state');
      if(state.ubigeos)
      {
        //console.log('CAYL existe ubigeos');
        depasF = state.ubigeos.filter(x=>x.referencia=="");
        return this.departamentosComboList(depasF);
      }else{
        //console.log('CAYL NO existe ubigeos');
        this.asyncGetUbigeoTodos().then(()=>{
          const state2 = this.getState();
          console.log(state2);
          depasF = state2.ubigeos.filter(x=>x.referencia=="");
          return this.departamentosComboList(depasF);  
        });
      }
    }
    
  }

  departamentosComboList(depasF:IUbigeo[]){
    if(depasF.length){
      let list=[];
      depasF.forEach((element) => {
        element.nombre = element.nombre.toUpperCase();
      });
      depasF.map(dep=>{
        list.push({
          text:dep.nombre,
          value:dep.codigo
        });
      });
      let departamentos = new ComboList(list);
      return of(departamentos);
    }else{
      return null;
    }
  }

  getProvincias(referencia:string):Observable<ComboList>{
    const state = this.getState();
    let provinF = state.ubigeos.filter(x=>x.referencia==referencia);
    if(provinF.length){
      provinF.forEach((element) => {
        element.nombre = element.nombre.toUpperCase();
      });
      let list=[];
      provinF.map(dep=>{
        list.push({
          text:dep.nombre,
          value:dep.codigo
        });
      });
      let provincias = new ComboList(list);
      return of(provincias);
    }else{
      return null;
    }
  }

  getDistritos(referencia:string):Observable<ComboList>{
    const state = this.getState();
    let distriF = state.ubigeos.filter(x=>x.referencia==referencia);
    if(distriF.length){
      distriF.forEach((element) => {
        element.nombre = element.nombre.toUpperCase();
      });
      let list=[];
      distriF.map(dep=>{
        list.push({
          text:dep.nombre,
          value:dep.codigo
        });
      });
      let distritos = new ComboList(list);
      return of(distritos);
    }else{
      return null;
    }
  }

  getInformacionUbigeoByCodigo(codigo:string):Observable<IUbigeo>{
    const state = this.getState();
    let ubigeo = state.ubigeos.find(x=>x.codigo==codigo);
    return ubigeo==null?null:of(ubigeo);
  }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  asyncGetUbigeoTodos = ()=>{
    return new Promise(
    (resolve)=>{
      this.ubigeoService.listarUbigeos()
      .subscribe(info=>{
        //console.log(info);
        this.setValueTodos(info);
        resolve();
      })
    });
  }


}
