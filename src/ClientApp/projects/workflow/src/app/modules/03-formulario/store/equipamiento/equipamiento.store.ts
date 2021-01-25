import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { EquipamientoStoreModel } from './equipamiento.store.model';
import { EquipamientoService } from '../../service/equipamiento.service';
import { EquipamientoModalActions } from './actions/equipamiento.modal.action';
import { EquipamientoBuscadorActions } from './actions/equipamiento.buscardor.action';
import { AppCurrentFlowStore } from '@lic/core';
@Injectable()
export class EquipamientoStore extends Store<EquipamientoStoreModel> {
  equipamientoModalActions: EquipamientoModalActions;
  equipamientoBuscadorActions: EquipamientoBuscadorActions;

  constructor(equipamientoService: EquipamientoService,storeCurrent: AppCurrentFlowStore) {
    super(new EquipamientoStoreModel());
    this.equipamientoModalActions = new EquipamientoModalActions(
      this.buildScopedGetState('modalEquipamiento'),
      this.buildScopedSetState('modalEquipamiento'),
      equipamientoService,
      storeCurrent
    );
    this.equipamientoBuscadorActions = new EquipamientoBuscadorActions(
      this.buildScopedGetState('buscadorEquipamiento'),
      this.buildScopedSetState('buscadorEquipamiento'),
      equipamientoService
    );
  }
}
