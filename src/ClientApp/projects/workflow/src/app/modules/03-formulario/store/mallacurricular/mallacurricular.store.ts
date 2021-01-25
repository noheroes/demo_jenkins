import { Injectable } from '@angular/core';
import { Store, AppCurrentFlowStore } from '@lic/core';
import { MallaCurricularStoreModel } from './mallacurricular.store.model';
import { MallaCurricularModalActions } from './actions/mallacurricular.modal.action';
import { MallaCurricularBuscadorActions } from './actions/mallcurricular.buscardor.action';
import { MallaCurricularService } from '../../service/mallacurricular.service';
import { MaestroProgramaService } from '../../service/maestroprograma.service';

@Injectable()
export class MallaCurricularStore extends Store<MallaCurricularStoreModel> {
  mallaCurricularModalActions: MallaCurricularModalActions;
  mallaCurricularBuscadorActions: MallaCurricularBuscadorActions;

  constructor(
    mallaCurricularService: MallaCurricularService,
    private storeCurrent: AppCurrentFlowStore) {
    super(new MallaCurricularStoreModel());
    this.mallaCurricularModalActions = new MallaCurricularModalActions(
      this.buildScopedGetState('modalMallaCurricular'),
      this.buildScopedSetState('modalMallaCurricular'),
      mallaCurricularService,
      storeCurrent
    );
    this.mallaCurricularBuscadorActions = new MallaCurricularBuscadorActions(
      this.buildScopedGetState('buscadorMallaCurricular'),
      this.buildScopedSetState('buscadorMallaCurricular'),
      mallaCurricularService,
      storeCurrent
    );
  }
}
