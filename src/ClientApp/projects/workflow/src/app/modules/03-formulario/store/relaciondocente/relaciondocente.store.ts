import { Injectable } from '@angular/core';
import { Store, AppCurrentFlowStore } from '@lic/core';
import { RelacionDocenteStoreModel } from './relaciondocente.store.model';
import { RelacionDocenteBuscadorActions } from './actions/relaciondocente.buscador.action';
import { RelacionDocenteAgregarActions } from './actions/relaciondocente.agregar.action';
import { MaestropersonaService } from '../../service/maestropersona.service';
import { RelacionDocenteService } from '../../service/relaciondocente.service';
@Injectable()
export class RelacionDocenteStore extends Store<RelacionDocenteStoreModel> {
  relacionDocenteBuscadorActions: RelacionDocenteBuscadorActions;
  relacionDocenteAgregarActions: RelacionDocenteAgregarActions;
  constructor(
    maestropersonaService: MaestropersonaService,
    relacionDocenteService: RelacionDocenteService,
    private storeCurrent: AppCurrentFlowStore
  ) {
    super(new RelacionDocenteStoreModel());
    this.relacionDocenteBuscadorActions = new RelacionDocenteBuscadorActions(
      this.buildScopedGetState('buscadorRelacionDocente'),
      this.buildScopedSetState('buscadorRelacionDocente'),
      maestropersonaService,
      relacionDocenteService,
      storeCurrent
    );
    this.relacionDocenteAgregarActions = new RelacionDocenteAgregarActions(
      this.buildScopedGetState('agregarRelacionDocente'),
      this.buildScopedSetState('agregarRelacionDocente'),
      maestropersonaService,
      relacionDocenteService,
      storeCurrent
    );
  }
}
