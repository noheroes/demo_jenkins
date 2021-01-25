import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { MediosVerificacionStoreModel } from './mediosverificacion.store.model';
import { MediosVerificacionActions } from './actions/mediosverificacion.action';
import { FirmarMediosVerificacionActions } from './actions/firmarmediosverificacion.action';
import { MediosVerificacionService } from '../../service/mediosverificacion.service';
import { SedesFilialesActions } from './actions/sedes-filiales.action'

@Injectable()
export class MediosVerificacionStore extends Store<MediosVerificacionStoreModel> {
  mediosVerificacionActions: MediosVerificacionActions;
  sedesFilialesActions: SedesFilialesActions;
  firmarMediosVerificacionActions: FirmarMediosVerificacionActions;

  constructor(mediosVerificacionService: MediosVerificacionService) {
    super(new MediosVerificacionStoreModel());

    this.mediosVerificacionActions = new MediosVerificacionActions(
      this.buildScopedGetState('mediosVerificacion'),
      this.buildScopedSetState('mediosVerificacion'),
      mediosVerificacionService
    );

    this.sedesFilialesActions = new SedesFilialesActions(
      this.buildScopedGetState('sedesFiliales'),
      this.buildScopedSetState('sedesFiliales'),
      mediosVerificacionService
    );

    this.firmarMediosVerificacionActions = new FirmarMediosVerificacionActions(
      this.buildScopedGetState('firmarMediosVerificacion'),
      this.buildScopedSetState('firmarMediosVerificacion'),
      mediosVerificacionService
    );

  }
}
