import { Store } from './../../../../../../../../src/app/core/store/store';
import { AppCurrentFlowStore } from './../../../../../../../../src/app/core/store/app.currentFlow.store';
import { Injectable } from '@angular/core';
import { MaestroProgramaSegundaStoreModel } from './maestroprogramasegunda.store.model';
import { ProgramaBandejaActions } from './actions/programa.bandeja.action';
import { ProgramaFormActions } from './actions/programa.form.action';
import { MaestroProgramaSegundaService } from '../../service/maestroprogramasegunda.service';
import { SegundaBandejaActions } from './actions/segunda.bandeja.action';
import { SegundaFormActions } from './actions/segunda.form.action';
import { VinculadoBandejaActions } from './actions/vinculado.bandeja.action';



@Injectable()
export class MaestroProgramaSegundaStore extends Store<MaestroProgramaSegundaStoreModel> {
  programaBandejaActions: ProgramaBandejaActions;
  programaFormActions: ProgramaFormActions;
  segundaBandejaActions: SegundaBandejaActions;
  segundaFormActions: SegundaFormActions;
  vinculadoBandejaActions:VinculadoBandejaActions

  constructor(maestroProgramaSegundaService: MaestroProgramaSegundaService, storeCurrent: AppCurrentFlowStore) {
    super(new MaestroProgramaSegundaStoreModel());
    this.programaBandejaActions = new ProgramaBandejaActions(
      this.buildScopedGetState('bandejaMaestroPrograma'),
      this.buildScopedSetState('bandejaMaestroPrograma'),
      maestroProgramaSegundaService,
      storeCurrent
    );
    this.programaFormActions= new ProgramaFormActions(
      this.buildScopedGetState('formMaestroPrograma'),
      this.buildScopedSetState('formMaestroPrograma'), 
      maestroProgramaSegundaService
      );


      this.segundaBandejaActions = new SegundaBandejaActions(
        this.buildScopedGetState('bandejaMaestroProgramaSegunda'),
        this.buildScopedSetState('bandejaMaestroProgramaSegunda'),
        maestroProgramaSegundaService,
        storeCurrent
      );
      this.segundaFormActions= new SegundaFormActions(
        this.buildScopedGetState('formMaestroProgramaSegunda'),
        this.buildScopedSetState('formMaestroProgramaSegunda'),
        maestroProgramaSegundaService
        );
      this.vinculadoBandejaActions= new VinculadoBandejaActions(
        this.buildScopedGetState('bandejaMaestroProgramaVinculado'),
        this.buildScopedSetState('bandejaMaestroProgramaVinculado'),
        maestroProgramaSegundaService,
        storeCurrent
        );
  }
}
