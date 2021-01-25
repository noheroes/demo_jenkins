import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormMaestroPersona, IAgregarPersona } from '../maestropersona.store.interface';
export class MaestroPersonaAgregarActions {
  constructor(
    private getState: () => IAgregarPersona,
    private setState: (newState: IAgregarPersona) => void
  ) {

  }
  setTipoPersonas = data => {
    this.setState(
      update(this.getState(), {
        comboLists: {
          tipoPersonas: {
            $set: data.list.map(item => {
              return {
                label: item.text,
                value: item.value
              }
            })
          }
        }
      })
    )
  }

  // setasyncFetchEnums = (id: string) => {
  //   const state = this.getState();
  //   this.setState({
  //     ...state,
  //     isLoading: true
  //   });

  // }
}
