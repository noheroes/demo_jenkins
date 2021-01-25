import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { AmbienteStoreModel } from './ambiente.store.model';
import { AmbienteModalActions } from './actions/ambiente.modal.action';
import { AmbienteBuscadorActions } from './actions/ambiente.buscardor.action';
import { AmbienteService } from '../../service/ambiente.service';
@Injectable()
export class AmbienteStore extends Store<AmbienteStoreModel> {
  ambienteModalActions: AmbienteModalActions;
  ambienteBuscadorActions: AmbienteBuscadorActions;
  constructor(ambienteService: AmbienteService) {
    super(new AmbienteStoreModel());
    this.ambienteModalActions = new AmbienteModalActions(
      this.buildScopedGetState('modalAmbiente'),
      this.buildScopedSetState('modalAmbiente'),
      ambienteService
    );
    this.ambienteBuscadorActions = new AmbienteBuscadorActions(
      this.buildScopedGetState('buscadorAmbiente'),
      this.buildScopedSetState('buscadorAmbiente'),
      ambienteService
    );
  }
}
