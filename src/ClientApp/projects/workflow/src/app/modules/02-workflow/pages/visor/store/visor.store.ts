import { Injectable, } from '@angular/core';
import { AlertService, ToastService } from '@sunedu/shared';
import { VisorStoreModel } from './visor.store.model';
import { AppCurrentFlowStore, Store } from '../../../../../../../../../src/app/core/store';
import { WorkflowService } from '../../../../../../../../../src/app/core/services';
import { VisorActions } from './actions/visor.action';

@Injectable()
export class VisorStore extends Store<VisorStoreModel> {

  actionVisorForm: VisorActions;
    constructor(
        workflowService: WorkflowService,
        appStore: AppCurrentFlowStore,
        alert: AlertService,
        toast: ToastService,
      ) {
        super(new VisorStoreModel());

        this.actionVisorForm = new VisorActions(
          this.buildScopedGetState('visorForm'),
          this.buildScopedSetState('visorForm'),
          workflowService,
          appStore
        );
      }
}
