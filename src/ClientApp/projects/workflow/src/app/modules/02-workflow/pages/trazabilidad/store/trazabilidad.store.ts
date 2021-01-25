import { TrazabilidadService } from './../service/trazabilidad.service';
import { AppCurrentFlowStore } from './../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { SolicitudBandejaActions } from './actions/solicitud.bandeja.action';
import { TrazabilidadStoreModel } from './trazabilidad.store.model';
import { Store } from './../../../../../../../../../src/app/core/store/store';
import { Injectable } from '@angular/core';
import { TrazabilidadBandejaActions } from './actions/trazabilidad.bandeja.action';

@Injectable()
export class TrazabilidadStore extends Store<TrazabilidadStoreModel> {
    solicitudBandejaActions: SolicitudBandejaActions;
    trazabilidadBandejaActions: TrazabilidadBandejaActions;

  constructor(
    trazabilidadService: TrazabilidadService,
    storeCurrent: AppCurrentFlowStore) {
    super(new TrazabilidadStoreModel());
    this.solicitudBandejaActions = new SolicitudBandejaActions(
      this.buildScopedGetState('bandejaSolicitud'),
      this.buildScopedSetState('bandejaSolicitud'),
      trazabilidadService,
      storeCurrent
    );
    this.trazabilidadBandejaActions = new TrazabilidadBandejaActions(
      this.buildScopedGetState('bandejaTrazabilidad'),
      this.buildScopedSetState('bandejaTrazabilidad'),
      trazabilidadService,
      storeCurrent
    );
  }
}
