import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { EnumeradoGeneralStoreModel } from './enumerado.store.model';
import { MaestroEnumeradoService } from '../../../service/maestro/maestro.enumerado.service';
import { EnumeradoActions } from './actions/enumerado.action';

@Injectable({
   providedIn: 'root'
 })
  export class EnumeradoGeneralStore extends Store<EnumeradoGeneralStoreModel> {
    currentEnumeradoActions: EnumeradoActions
  constructor(
    enumeradoService:MaestroEnumeradoService
    ) {
      super(new EnumeradoGeneralStoreModel());


      this.currentEnumeradoActions = new EnumeradoActions(
        this.buildScopedGetState('currentEnumerados'),
        this.buildScopedSetState('currentEnumerados'),
        enumeradoService
      );
  }

}


