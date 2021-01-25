import { Injectable, } from '@angular/core';
import { Store, AppStore, WorkflowService } from '@lic/core';
import { InicioStoreModel } from './inicio.store.model';
import { ModalInicioProcedimientoActions } from './actions/modal-iniciar-procedimiento.actions';
import { AlertService, ToastService } from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class InicioStore extends Store<InicioStoreModel> {

  actionModalInicioProcedimiento: ModalInicioProcedimientoActions;
    constructor(
        workflowService: WorkflowService,
        // entidadService: EntidadService,
        // tablaService: TablaMaestraService,
        // imagenResultadoService: ImagenResultadoService,
        appStore: AppCurrentFlowStore,
        alert: AlertService,
        toast: ToastService,
      ) {
        super(new InicioStoreModel());

        this.actionModalInicioProcedimiento = new ModalInicioProcedimientoActions(
          this.buildScopedGetState('modalIniciarProcedimiento'),
          this.buildScopedSetState('modalIniciarProcedimiento'),
          workflowService,
          // entidadService,
          // tablaService,
          // imagenResultadoService,
          appStore
        );
      }
}
