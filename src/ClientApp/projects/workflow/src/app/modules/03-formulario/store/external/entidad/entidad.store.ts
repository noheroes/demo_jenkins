import { Store } from '@lic/core';
import { Injectable } from '@angular/core';
import { ExternalEntidadService } from '../../../service/external/external.entidad.service';
import { EntidadGeneralStoreModel } from './entidad.store.model';
import { EntidadActions } from './actions/entidad.action';

@Injectable({
  providedIn: 'root'
})
export class EntidadGeneralStore extends Store<EntidadGeneralStoreModel> {
  entidadActions: EntidadActions;
  constructor(
    entidadService: ExternalEntidadService
  ) {
    super(new EntidadGeneralStoreModel());
    this.entidadActions = new EntidadActions(
      this.buildScopedGetState('currentEntidades'),
      this.buildScopedSetState('currentEntidades'),
      entidadService
    );
  }
}