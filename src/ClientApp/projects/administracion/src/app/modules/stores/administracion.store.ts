import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { ActividadAdministracionActions } from './actions/actividad-administracion.action';
import { AdministracionStoreModel } from './adminitracion.store.model';

@Injectable()
export class AdministracionStore extends Store<AdministracionStoreModel> {
  actionActividadFormulario: ActividadAdministracionActions;
  constructor() {
    super(new AdministracionStoreModel());

    this.actionActividadFormulario = new ActividadAdministracionActions(
      this.buildScopedGetState('actividadAdministracionModel'),
      this.buildScopedSetState('actividadAdministracionModel')
    );
  }
}
