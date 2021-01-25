import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { LocalStoreModel } from './local.store.model';
import { LocalModalActions } from './actions/local.modal.action';
import { LocalBuscadorActions } from './actions/local.buscar.actions';
import { LocalService } from '../../service/local.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class LocalStore extends Store<LocalStoreModel> {
  localModalActions: LocalModalActions;
  localBuscadorActions: LocalBuscadorActions;
  
  constructor(ambienteService: LocalService,storeCurrent: AppCurrentFlowStore) {
    super(new LocalStoreModel());
    this.localModalActions = new LocalModalActions(
      this.buildScopedGetState('modalLocal'),
      this.buildScopedSetState('modalLocal'),
      ambienteService
    );
    this.localBuscadorActions = new LocalBuscadorActions(
      this.buildScopedGetState('buscadorLocal'),
      this.buildScopedSetState('buscadorLocal'),
      ambienteService,
      storeCurrent
    );    
  }
}
