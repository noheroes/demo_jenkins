import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { ProgramaSeStoreModel } from './programase.store.model';
import { ProgramaSeBuscadorActions } from './actions/programase.buscador.action';
import { ProgramaSeBandejaActions } from './actions/programase.bandeja.action';
import { ProgramaSeService } from '../../service/programase.service';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

@Injectable()
export class ProgramaSeStore extends Store<ProgramaSeStoreModel> {
  programaSeBuscadorActions: ProgramaSeBuscadorActions;
  programaSeBandejaActions:ProgramaSeBandejaActions;
  constructor( programaSeService: ProgramaSeService, storeCurrent: AppCurrentFlowStore) {
    super(new ProgramaSeStoreModel());
    this.programaSeBuscadorActions = new ProgramaSeBuscadorActions(
      this.buildScopedGetState('buscadorProgramaSe'),
      this.buildScopedSetState('buscadorProgramaSe'),
      programaSeService
    );

    this.programaSeBandejaActions = new ProgramaSeBandejaActions(
      this.buildScopedGetState('bandejaProgramaSe'),
      this.buildScopedSetState('bandejaProgramaSe'),
      programaSeService,
      storeCurrent
    );
  }
}
