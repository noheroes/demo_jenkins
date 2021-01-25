import { Injectable } from '@angular/core';
import { Store } from '@lic/core';

import { EntidadStoreModel } from './entidad.store.model';
import { EntidadModalActions } from './actions/entidad.modal.action';
import { EntidadService } from '../services/entidad.service';
import { EntidadBuscadorActions } from './actions/entidad.buscador.action';
@Injectable()
export class EntidadStore extends Store<EntidadStoreModel> {
  entidadModalActions: EntidadModalActions;
  entidadBuscadorActions: EntidadBuscadorActions;

  constructor(entidadService: EntidadService) {
    super(new EntidadStoreModel());

    this.entidadModalActions = new EntidadModalActions(
      this.buildScopedGetState('modalEntidad'),
      this.buildScopedSetState('modalEntidad'),
      entidadService
    );

    this.entidadBuscadorActions = new EntidadBuscadorActions(
      this.buildScopedGetState('buscadorEntidad'),
      this.buildScopedSetState('buscadorEntidad'),
      entidadService
    );
  }
}
