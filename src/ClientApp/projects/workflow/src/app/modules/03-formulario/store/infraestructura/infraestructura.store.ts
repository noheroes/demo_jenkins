import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { InfraestructuraStoreModel } from './infraestructura.store.model';
import { InfraestructuraService } from '../../service/infraestructura.service';
import { InfraestructuraModalActions } from './actions/infraestructura.modal.action';
import { InfraestructuraBuscadorActions } from './actions/infraestructura.buscardor.action';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class InfraestructuraStore extends Store<InfraestructuraStoreModel> {
  infraestructuraModalActions: InfraestructuraModalActions;
  infraestructuraBuscadorActions: InfraestructuraBuscadorActions;

  constructor(infraestructuraService: InfraestructuraService,storeCurrent : AppCurrentFlowStore) {
    super(new InfraestructuraStoreModel());
    this.infraestructuraModalActions = new InfraestructuraModalActions(
      this.buildScopedGetState('modalInfraestructura'),
      this.buildScopedSetState('modalInfraestructura'),
      infraestructuraService
    );
    this.infraestructuraBuscadorActions = new InfraestructuraBuscadorActions(
      this.buildScopedGetState('buscadorInfraestructura'),
      this.buildScopedSetState('buscadorInfraestructura'),
      infraestructuraService,
      storeCurrent
    );
  }
}
