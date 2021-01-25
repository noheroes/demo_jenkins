import { Injectable } from '@angular/core';
import { Store } from '@lic/core';

import { PresupuestoStoreModel } from './presupuesto.store.model';
import { PresupuestoFormActions } from './actions/presupuesto.form.action';
import { PresupuestoBandejaActions } from './actions/presupuesto.bandeja.action';
import { PresupuestoService } from '../../service/presupuesto.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class PresupuestoStore extends Store<PresupuestoStoreModel> {
  presupuestoFormActions: PresupuestoFormActions;
  presupuestoBandejaActions: PresupuestoBandejaActions;
  constructor(presupuestoService: PresupuestoService, storeCurrent: AppCurrentFlowStore) {
    super(new PresupuestoStoreModel());
    this.presupuestoFormActions = new PresupuestoFormActions(
      this.buildScopedGetState('formPresupuesto'),
      this.buildScopedSetState('formPresupuesto'),
      presupuestoService
    );
    this.presupuestoBandejaActions = new PresupuestoBandejaActions(
      this.buildScopedGetState('bandejaPresupuesto'),
      this.buildScopedSetState('bandejaPresupuesto'),
      presupuestoService,
      storeCurrent
    );
  }
}
