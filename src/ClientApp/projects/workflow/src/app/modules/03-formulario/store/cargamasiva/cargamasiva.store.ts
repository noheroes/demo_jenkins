import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { CargaMasivaService } from '../../service/cargamasiva.service';
import { CargaMasivaStoreModel } from './cargamasiva.store.model';
import { CargaMasivaBuscadorActions } from './actions/cargamasiva.buscador.action';
import { CargaMasivaActividadBuscadorActions } from './actions/cargamasivaactividad.modal.action';
@Injectable()
export class CargaMasivaStore extends Store<CargaMasivaStoreModel> {
  cargaMasivaBuscadorActions: CargaMasivaBuscadorActions;
  cargaMasivaActividadBuscadorActions: CargaMasivaActividadBuscadorActions;
  constructor(cargaMasivaService: CargaMasivaService) {
    super(new CargaMasivaStoreModel());
    this.cargaMasivaBuscadorActions = new CargaMasivaBuscadorActions(
      this.buildScopedGetState('buscadorCargaMasiva'),
      this.buildScopedSetState('buscadorCargaMasiva'),
      cargaMasivaService
    );

    this.cargaMasivaActividadBuscadorActions = new CargaMasivaActividadBuscadorActions(
      this.buildScopedGetState('buscadorCargaMasivaActividad'),
      this.buildScopedSetState('buscadorCargaMasivaActividad'),
      cargaMasivaService
    );

  }
}
