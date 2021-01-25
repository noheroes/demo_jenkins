import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { ProgramaStoreModel } from './programa.store.model';
import { ProgramaBuscadorActions } from './actions/programa.buscador.action';
import { ProgramaBandejaActions } from './actions/programa.bandeja.action';
import { ProgramaService } from '../../service/programa.service';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
@Injectable()
export class ProgramaStore extends Store<ProgramaStoreModel> {
  programaBuscadorActions: ProgramaBuscadorActions;
  programaBandejaActions:ProgramaBandejaActions;
  constructor( programaService: ProgramaService, storeCurrent: AppCurrentFlowStore) {
    super(new ProgramaStoreModel());
    this.programaBuscadorActions = new ProgramaBuscadorActions(
      this.buildScopedGetState('buscadorPrograma'),
      this.buildScopedSetState('buscadorPrograma'),
      programaService
    );

    this.programaBandejaActions = new ProgramaBandejaActions(
      this.buildScopedGetState('bandejaPrograma'),
      this.buildScopedSetState('bandejaPrograma'),
      programaService,
      storeCurrent
    );
  }
}
