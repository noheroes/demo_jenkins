import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { TallerBandejaActions } from './actions/taller.bandeja.action';
import { TallerFormActions } from './actions/taller.form.action';
import { TallerProgramaFormActions } from './actions/tallerprograma.form.action';
import { TallerStoreModel } from './taller.store.model';
import { TallerService } from '../../service/taller.service';
import { MaestroProgramaService } from '../../service/maestroprograma.service';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
@Injectable()
export class TallerStore extends Store<TallerStoreModel> {
  tallerBandejaActions: TallerBandejaActions;
  tallerFormActions: TallerFormActions;
  tallerProgramaFormActions: TallerProgramaFormActions;

  constructor(tallerService:TallerService, maestroProgramaService: MaestroProgramaService,storeCurrent : AppCurrentFlowStore) {
    super(new TallerStoreModel());

    this.tallerBandejaActions = new TallerBandejaActions(
      this.buildScopedGetState('bandejaTaller'),
      this.buildScopedSetState('bandejaTaller'),
      tallerService,
      storeCurrent
    );
    this.tallerFormActions = new TallerFormActions(
      this.buildScopedGetState('formTaller'),
      this.buildScopedSetState('formTaller'),
      tallerService
    );
    this.tallerProgramaFormActions = new TallerProgramaFormActions(
      this.buildScopedGetState('formTallerPrograma'),
      this.buildScopedSetState('formTallerPrograma'),
      tallerService,
      maestroProgramaService,
      storeCurrent
    );
  }
}