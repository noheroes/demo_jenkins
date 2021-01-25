
import { IUbigeo, IUbigeoDepartamento, IUbigeoProvincia } from '../ubigeo.interface';
import { UbigeoGeneralStore } from '../ubigeo.store';

export class UbigeoProvinciaActions {

  constructor(
    private getState: () => IUbigeoProvincia,
    private setState: (newState: IUbigeoProvincia) => void
    ) {
  }

  setValueProvincias = (newValue: IUbigeo[]) => {
    const state = this.getState();
    const newState = {
      ...state,
      provincias: newValue
    }
    this.setState(newState);
  }

  getDepartamentos = ()=>{
    return this.getState();
  }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================


}
