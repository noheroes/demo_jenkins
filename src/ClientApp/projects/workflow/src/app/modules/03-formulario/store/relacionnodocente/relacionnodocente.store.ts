import { Injectable } from '@angular/core';
import { RelacionNoDocenteStoreModel } from './relacionnodocente.store.model';
import { RelacionNoDocenteBuscadorActions } from './actions/relacionnodocente.buscador.action';
import { RelacionNoDocenteAgregarActions } from './actions/relacionnodocente.agregar.action';
import { MaestropersonaService } from '../../service/maestropersona.service';
import { RelacionDocenteService } from '../../service/relaciondocente.service';
import { Store, AppCurrentFlowStore } from '@lic/core';
@Injectable()
export class RelacionNoDocenteStore extends Store<RelacionNoDocenteStoreModel> {
  relacionNoDocenteBuscadorActions: RelacionNoDocenteBuscadorActions;
  relacionNoDocenteAgregarActions: RelacionNoDocenteAgregarActions;
  constructor(
    maestropersonaService: MaestropersonaService,
    relacionDocenteService: RelacionDocenteService,
    private storeCurrent: AppCurrentFlowStore) {
    super(new RelacionNoDocenteStoreModel());
    this.relacionNoDocenteBuscadorActions = new RelacionNoDocenteBuscadorActions(
      this.buildScopedGetState('buscadorRelacionNoDocente'),
      this.buildScopedSetState('buscadorRelacionNoDocente'),
      maestropersonaService,
      relacionDocenteService,
      storeCurrent
    );
    this.relacionNoDocenteAgregarActions = new RelacionNoDocenteAgregarActions(
      this.buildScopedGetState('agregarRelacionNoDocente'),
      this.buildScopedSetState('agregarRelacionNoDocente'),
      maestropersonaService,
      relacionDocenteService,
      storeCurrent
    );
  }
}
