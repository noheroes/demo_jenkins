import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { ListaLocalStoreModel } from './listalocal.store.model';
import { ListaLocalActions } from './actions/listalocal.combo.action';
@Injectable()
export class ListaLocalStore extends Store<ListaLocalStoreModel> {
  listaLocalActions: ListaLocalActions;
  constructor() {
    super(new ListaLocalStoreModel());

    this.listaLocalActions = new ListaLocalActions(
      this.buildScopedGetState('listaLocal'),
      this.buildScopedSetState('listaLocal')
    );
  }
}
