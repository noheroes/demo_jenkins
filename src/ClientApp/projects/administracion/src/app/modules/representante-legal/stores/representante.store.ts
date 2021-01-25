import { Injectable } from '@angular/core';
import { Store } from '@lic/core';

import { RepresentanteStoreModel } from './representante.store.model';
import { RepresentanteModalActions } from './actions/representante.modal.action';
import { RepresentanteBuscadorActions } from './actions/representante.buscador.action';
import { EntidadService } from '../../entidades/services/entidad.service';
import {  ToastService, } from '@sunedu/shared';

@Injectable()
export class RepresentanteStore extends Store<RepresentanteStoreModel> {
  representanteModalActions: RepresentanteModalActions;
  representanteBuscadorActions: RepresentanteBuscadorActions;
  constructor(entidadService: EntidadService, toast: ToastService) {
    super(new RepresentanteStoreModel());
    this.representanteModalActions = new RepresentanteModalActions(
      this.buildScopedGetState('modalRepresentante'),
      this.buildScopedSetState('modalRepresentante'),
      entidadService,
      toast
    );
    this.representanteBuscadorActions = new RepresentanteBuscadorActions(
      this.buildScopedGetState('buscadorRepresentante'),
      this.buildScopedSetState('buscadorRepresentante'),
      entidadService
    );
  }
}
