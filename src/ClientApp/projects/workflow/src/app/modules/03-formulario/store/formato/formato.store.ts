import { Injectable } from '@angular/core';

import { FormatoActions } from '../formato/actions/formatoMallaCurricular.action';
import { Store } from '@lic/core';
import { FormatoStoreModel } from './formato.store.model';
@Injectable()
export class FormatoStore extends Store<FormatoStoreModel> {
   formatoActions: FormatoActions;
  constructor() {
    super(new FormatoStoreModel());
    this.formatoActions = new FormatoActions(
      this.buildScopedGetState('formato'),
      this.buildScopedSetState('formato')
    );
  }
}
