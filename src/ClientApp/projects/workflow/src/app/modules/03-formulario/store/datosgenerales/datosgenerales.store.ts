import { Store } from '@lic/core';
import { DatosGeneralesStoreModel } from './datosgenerales.store.model';
import { Injectable } from '@angular/core';
import { DatosGeneralesActions } from './actions/datosgenerales.action';
import { DatosGeneralesService } from '../../service/datos-generales.service';
import { RepresentantenLegalModalActions } from './actions/representantelegal.modal.action';
import { RepresentanteLegalService } from '../../service/representantelegal.service';
import { RepresentanteLegalBuscadorActions } from './actions/representantelegal.buscador.action';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Injectable()
export class DatosGeneralesStore
  extends Store<DatosGeneralesStoreModel> {
  actionDatoGenerales: DatosGeneralesActions;
  representantenLegalModalActions: RepresentantenLegalModalActions;
  representanteLegalBuscadorActions: RepresentanteLegalBuscadorActions;

  constructor(datosGeneralesService: DatosGeneralesService,
    representanteLegalService: RepresentanteLegalService, storeCurrent: AppCurrentFlowStore) {
    super(new DatosGeneralesStoreModel());

    this.actionDatoGenerales = new DatosGeneralesActions(
      this.buildScopedGetState('datosGenerales'),
      this.buildScopedSetState('datosGenerales'),
      datosGeneralesService,
      storeCurrent
    );
    this.representantenLegalModalActions = new RepresentantenLegalModalActions(
      this.buildScopedGetState('modalRepresentanteLegal'),
      this.buildScopedSetState('modalRepresentanteLegal'),
      representanteLegalService
    );
    this.representanteLegalBuscadorActions= new RepresentanteLegalBuscadorActions(
      this.buildScopedGetState('buscardorRepresentanteLegal'),
      this.buildScopedSetState('buscardorRepresentanteLegal'),
      representanteLegalService
    );
  }
}
