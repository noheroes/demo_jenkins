import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { LaboratorioStoreModel } from './laboratorio.store.model';
import { LaboratorioBandejaActions } from './actions/laboratorio.bandeja.action';
import { LaboratorioFormActions } from './actions/laboratorio.form.action';
import { LaboratorioProgramaFormActions } from './actions/laboratorioprograma.form.action';
import { LaboratorioService } from './../../service/laboratorio.service';
import { MaestroProgramaService } from '../../service/maestroprograma.service';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';

@Injectable()
export class LaboratorioStore extends Store<LaboratorioStoreModel> {
  laboratorioBandejaActions: LaboratorioBandejaActions;
  laboratorioFormActions: LaboratorioFormActions;
  laboratorioProgramaFormActions: LaboratorioProgramaFormActions;

  constructor(laboratorioService: LaboratorioService, maestroProgramaService: MaestroProgramaService,
    storeCurrent : AppCurrentFlowStore) {
    super(new LaboratorioStoreModel());

    this.laboratorioBandejaActions = new LaboratorioBandejaActions(
      this.buildScopedGetState('bandejaLaboratorio'),
      this.buildScopedSetState('bandejaLaboratorio'),
      laboratorioService,
      storeCurrent
    );
    this.laboratorioFormActions = new LaboratorioFormActions(
      this.buildScopedGetState('formLaboratorio'),
      this.buildScopedSetState('formLaboratorio'),
      laboratorioService,
      storeCurrent
    );
    this.laboratorioProgramaFormActions = new LaboratorioProgramaFormActions(
      this.buildScopedGetState('formLaboratorioPrograma'),
      this.buildScopedSetState('formLaboratorioPrograma'),
      laboratorioService,
      maestroProgramaService,
      storeCurrent
    );
  }
}
