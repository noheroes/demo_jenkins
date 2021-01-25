import { Injectable } from '@angular/core';
import { SolicitudStoreModel } from './solicitud.store.model';
import { FormatoActions } from '../formato/actions/formatomallacurricular.action';
import { Store } from '@lic/core';
@Injectable()
export class SolicitudStore extends Store<SolicitudStoreModel> {
   formatoActions: FormatoActions;
  constructor() {
    super(new SolicitudStoreModel());
    this.formatoActions = new FormatoActions(
      this.buildScopedGetState('formato'),
      this.buildScopedSetState('formato')
    );
  }
}
