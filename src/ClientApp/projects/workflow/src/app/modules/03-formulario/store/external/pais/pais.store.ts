import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { PaisActions } from './actions/pais.action';
import { ExternalPaisService } from '../../../service/external/external.paisservice';
import { PaisGeneralStoreModel } from './pais.store.model';

@Injectable({
  providedIn: 'root'
})
export class PaisGeneralStore extends Store<PaisGeneralStoreModel> {
  paisActions: PaisActions;
  constructor(
    paisService: ExternalPaisService
  ) {
    super(new PaisGeneralStoreModel());
    this.paisActions = new PaisActions(
      this.buildScopedGetState('currentPaises'),
      this.buildScopedSetState('currentPaises'),
      paisService
    );
  }
}


