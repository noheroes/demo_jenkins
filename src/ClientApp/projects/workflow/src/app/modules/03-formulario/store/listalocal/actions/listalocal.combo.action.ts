import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IListaLocal } from '../listalocal.store.interface';
export class ListaLocalActions {

  constructor(
    private getState: () => IListaLocal,
    private setState: (newState: IListaLocal) => void,
  ) {

  }  
}
