
import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { SedeFilialLocalesStoreModel } from './sedefilial-locales.store.model';
import { SedeFilialLocalesActions } from './actions/sedefilial-locales.actions';
import { SedeFilialService } from './../../service/sedefilial.service';

@Injectable()
export class SedeFilialLocalesStore extends Store<SedeFilialLocalesStoreModel> {
  sedeFilialLocalesActions: SedeFilialLocalesActions;

  constructor(sedeFilialService: SedeFilialService) {
    super(new SedeFilialLocalesStoreModel());


    this.sedeFilialLocalesActions = new SedeFilialLocalesActions(
      this.buildScopedGetState('sedeFilialLocales'),
      this.buildScopedSetState('sedeFilialLocales'),
      sedeFilialService
    );
  }
}
