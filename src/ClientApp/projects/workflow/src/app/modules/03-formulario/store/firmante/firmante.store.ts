import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { FirmantesStoreModel } from './firmante.store.model';
import { FirmantesService } from '../../service/firmantes.service';
import { FirmanteBuscadorActions } from './actions/firmante.buscador.action';

@Injectable()
export class FirmatesStore extends Store<FirmantesStoreModel> {
  firmanteBuscadorActions: FirmanteBuscadorActions;
  constructor(firmantesService: FirmantesService) {
    super(new FirmantesStoreModel());
    this.firmanteBuscadorActions = new FirmanteBuscadorActions(
      this.buildScopedGetState('buscadorFirmante'),
      this.buildScopedSetState('buscadorFirmante'),
      firmantesService
    );
  }
}
