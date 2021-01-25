import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext } from '@ngxs/store';
import { UbigeoActions } from './actions/ubigeo.action';
import { ExternalUbigeoService } from '../../../service/external/external.ubigeo.service';
import { Store } from '@lic/core';
import { UbigeoGeneralStoreModel } from './ubigeo.store.model';
import { UbigeoDepartamentoActions } from './actions/ubigeo.departamento.action';

@Injectable({
   providedIn: 'root'
 })
  export class UbigeoGeneralStore extends Store<UbigeoGeneralStoreModel> {
    currentUbigeoActions: UbigeoActions
    currentDepartamentoActions: UbigeoDepartamentoActions
  constructor(
    ubigeoService:ExternalUbigeoService
    ) {
      super(new UbigeoGeneralStoreModel());


      this.currentUbigeoActions = new UbigeoActions(
        this.buildScopedGetState('currentUbigeos'),
        this.buildScopedSetState('currentUbigeos'),
        ubigeoService
      );

      this.currentDepartamentoActions =new UbigeoDepartamentoActions(
        this.buildScopedGetState('currentDepartamentos'),
        this.buildScopedSetState('currentDepartamentos')
      )

  }

}


