import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { MaestroFacultadStoreModel } from './maestrofacultad.store.model';
import { MaestroFacultadFormActions } from './actions/maestrofacultad.form.action';
import { MaestroFacultadBandejaActions } from './actions/maestrofacultad.bandeja.action';
import { MaestroFacultadService } from '../../service/maestrofacultad.service';
import { AppCurrentFlowStore, APP_FORM_VALIDATOR } from '@lic/core'; 

@Injectable()
export class MaestroFacultadStore extends Store<MaestroFacultadStoreModel> {
  maestroFacultadBandejaActions: MaestroFacultadBandejaActions;
  maestroFacultadFormActions: MaestroFacultadFormActions;
  
  constructor(maestroFacultadService: MaestroFacultadService, storeCurrent: AppCurrentFlowStore) {
    super(new MaestroFacultadStoreModel());
    this.maestroFacultadBandejaActions = new MaestroFacultadBandejaActions(
      this.buildScopedGetState('bandejaMaestroFacultad'),
      this.buildScopedSetState('bandejaMaestroFacultad'),
      maestroFacultadService,
      storeCurrent
    );
    this.maestroFacultadFormActions = new MaestroFacultadFormActions(
      this.buildScopedGetState('formMaestroFacultad'),
      this.buildScopedSetState('formMaestroFacultad'),
      maestroFacultadService,
      storeCurrent
    );
  }
}
