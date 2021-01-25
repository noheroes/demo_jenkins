import { InfraestructuraCantidadesActions } from './actions/infraestructura-cantidades.action';
import { InfraestructuraCantidadesStoreModel } from './infraestructura-cantidades.store.model';
import { AppCurrentFlowStore } from '@lic/core';
import { Store } from '@lic/core';
import { Injectable } from "@angular/core";
import { InfraestructuraCantidadesService } from '../../service/infraestructura-cantidades.service';

@Injectable()
export class InfraestructuraCantidadesStore extends Store<InfraestructuraCantidadesStoreModel> {
  infraestructuraCantidadesActions: InfraestructuraCantidadesActions;

  constructor(infraestructuraCantidadesService: InfraestructuraCantidadesService, storeCurrent : AppCurrentFlowStore) {
    super(new InfraestructuraCantidadesStoreModel());
    this.infraestructuraCantidadesActions = new InfraestructuraCantidadesActions(
      this.buildScopedGetState('infraestructuraCantidades'),
      this.buildScopedSetState('infraestructuraCantidades'),
      infraestructuraCantidadesService, storeCurrent
    );
  }
}
