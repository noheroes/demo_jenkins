import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { ArchivoTestigoStoreModel } from './archivoTestigo.store.model';
import { FirmarArchivoTestigoActions } from './actions/firmarArchivoTestigo.action';
import { ArchivoTestigoService } from '../../service/archivoTestigo.service';

@Injectable()
export class ArchivoTestigoStore extends Store<ArchivoTestigoStoreModel> {  
  firmarArchivoTestigoActions: FirmarArchivoTestigoActions;

  constructor(archivoTestigoService: ArchivoTestigoService) {
    super(new ArchivoTestigoStoreModel());    

    this.firmarArchivoTestigoActions = new FirmarArchivoTestigoActions(
      this.buildScopedGetState('firmarArchivoTestigo'),
      this.buildScopedSetState('firmarArchivoTestigo'),
      archivoTestigoService
    );

  }
}
