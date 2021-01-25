import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { SedeFilialStoreModel } from './sedefilial.store.model';
import { SedeFilialModalActions } from './actions/sedefilial.modal.action';
import { SedeFilialBuscadorActions } from './actions/sedefilial.buscar.actions';
import { SedeFilialService } from '../../service/sedefilial.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class SedeFilialStore extends Store<SedeFilialStoreModel> {
  sedeFilialModalActions: SedeFilialModalActions;
  sedeFilialBuscadorActions: SedeFilialBuscadorActions;
  constructor(ambienteService: SedeFilialService, storeCurrent: AppCurrentFlowStore) {
    super(new SedeFilialStoreModel());
    this.sedeFilialModalActions = new SedeFilialModalActions(
      this.buildScopedGetState('modalSedeFilial'),
      this.buildScopedSetState('modalSedeFilial'),
      ambienteService
    );
    this.sedeFilialBuscadorActions = new SedeFilialBuscadorActions(
      this.buildScopedGetState('buscadorSedeFilial'),
      this.buildScopedSetState('buscadorSedeFilial'),
      ambienteService,
      storeCurrent
    );
  }
}
