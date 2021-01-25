import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { AsignacionEquipoTrabajoStoreModel } from './equipotrabajo.store.model';
import { EquipoTrabajoActions } from './actions/equipotrabajo.action';
import { EquipoTrabajoService } from '../../service/equipotrabajo.service';

@Injectable()
export class EquipoTrabajoStore extends Store<AsignacionEquipoTrabajoStoreModel>{
  equipoTrabajoActions: EquipoTrabajoActions;

  constructor(equipoTrabajoService: EquipoTrabajoService) {
    super(new AsignacionEquipoTrabajoStoreModel());

    this.equipoTrabajoActions = new EquipoTrabajoActions(
      this.buildScopedGetState('asignacionEquipoTrabajo'),
      this.buildScopedSetState('asignacionEquipoTrabajo'),
      equipoTrabajoService
    );
  }
}
