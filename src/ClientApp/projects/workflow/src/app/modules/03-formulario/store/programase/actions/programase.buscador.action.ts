import update from 'immutability-helper'; 
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IDataGridPageRequest, ComboList } from '@sunedu/shared';
import { IBuscadorProgramaSe } from '../programase.store.interface';
import { ProgramaSeService } from '../../../service/programase.service';
export class ProgramaSeBuscadorActions {
  constructor(
    private getState: () => IBuscadorProgramaSe,
    private setState: (newState: IBuscadorProgramaSe) => void,
    private ProgramaSeService: ProgramaSeService
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
