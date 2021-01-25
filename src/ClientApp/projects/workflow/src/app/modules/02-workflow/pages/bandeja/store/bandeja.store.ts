import { Injectable } from '@angular/core';
import {
  Store,
  TablaMaestraService,
  AppStore,
  WorkflowService,
} from '@lic/core';
import { BandejaStoreModel } from './bandeja.store.model';
import { GridBandejaActions } from './actions/grid-bandeja.action';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class BandejaStore extends Store<BandejaStoreModel> {
  actionGridBandeja: GridBandejaActions;
  constructor(
    workflowService: WorkflowService,
    storeCurrentFlow: AppCurrentFlowStore
  ) {
    super(new BandejaStoreModel());

    this.actionGridBandeja = new GridBandejaActions(
      this.buildScopedGetState('buscadorBandeja'),
      this.buildScopedSetState('buscadorBandeja'),
      workflowService,
      storeCurrentFlow
    );
  }
}
