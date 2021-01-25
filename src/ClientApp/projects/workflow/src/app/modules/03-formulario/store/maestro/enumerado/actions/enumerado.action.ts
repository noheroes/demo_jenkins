import { Observable, of } from 'rxjs';
import { ComboList } from '@sunedu/shared';

import { IEnumeradoGeneral, IEnumerado } from '../enumerado.interface';
import { MaestroEnumeradoService } from '../../../../service/maestro/maestro.enumerado.service';

export class EnumeradoActions {

  constructor(
    private getState: () => IEnumeradoGeneral,
    private setState: (newState: IEnumeradoGeneral) => void,
    private enumeradoService: MaestroEnumeradoService,
    ) {
  }

  setValueEnumerados = (newValue: IEnumerado[]) => {
    const state = this.getState();
    const newState = {
      ...state,
      enumerados: newValue
  }
    this.setState(newState);
  }

  getEnumerados = ()=>{
    return this.getState();
  }

  getEnumeradoByNombre = (nombre:string)=>{
    return new Promise<ComboList>(
      (resolve)=>{ 
        const state = this.getState();
        //console.log(state);
        if(state){
          //console.log('CAYL existe state');
          if(state.enumerados)
          {
            resolve(this.getEnumeradoName(nombre));
          }
          else
          {
            //console.log('CAYL NO existe ubigeos');
            this.asyncGetEnumeradosTodos().then(
              ()=>{
                resolve(this.getEnumeradoByNombre(nombre));
              });
          }
        }
    });

  }

  getEnumeradoName = (nombre:string) =>{
    return new Promise<ComboList>(
      (resolve)=>{ 
        //console.log('CAYL existe enumerados');
        const state = this.getState();
        let enumerado = state.enumerados.find(x=>x.nombre==nombre);
        if(enumerado==null) return;
        const { elementos } = enumerado;
        if(elementos.length ){
          let list=[];
          elementos.map(element=>{
            list.push({
              text:element.valor,
              value:element.codigo
            });
          });
          let enumerados = new ComboList(list);
          resolve(enumerados);
        }else{
          resolve(null);
        }
      
    });
    
  }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  asyncGetEnumeradosTodos = ()=>{
    return new Promise(
    (resolve)=>{
      this.enumeradoService.listarEnumerados()
      .subscribe(info=>{
        // console.log(info);
        this.setValueEnumerados(info);
        resolve();
      })
    });
  }

}
