import update from 'immutability-helper'; 
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IDataGridPageRequest, ComboList } from '@sunedu/shared';
import { IBuscadorPrograma } from '../programa.store.interface';
import { ProgramaService } from '../../../service/programa.service';
export class ProgramaBuscadorActions {
  constructor(
    private getState: () => IBuscadorPrograma,
    private setState: (newState: IBuscadorPrograma) => void,
    private programaService: ProgramaService
  ) {

  }
  
  asyncFetchCombos = (enums) => {
    this.crudBegin();
    const state = this.getState();   
    state.comboLists = {
      modalidadEstudios: enums[0],
    };
    state.isLoading=true;
    this.setState(state);
    this.crudSucces();
  }
  private crudBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
}
