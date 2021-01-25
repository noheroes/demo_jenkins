// import { PunkuService } from './../services/business/punku.service';
// import { AppSessionAction } from './actions/app-session.action';
// import { AppGlobalConfigAction } from './actions/app-global-config.action';
import { Injectable } from '@angular/core';
import { Store } from './store';
import { AppState } from './app.state';
// import { AppUiAction } from './actions/app-ui.action';
// import { HttpClient } from '@angular/common/http';
// import { LocalStorageService } from '../services/infrastructure/local-storage.service';
// import { State, Action, StateContext } from '@ngxs/store';
// import { GlobalConfigSuccess } from '../state/app-global-config.actions';
// import { AppGlobalConfigState } from '../state/app-global-config.state';
// import { ICurrentFlow } from './app.state.interface';

@Injectable({
  providedIn: 'root',
})
export class AppStore extends Store<AppState> {
  // uiAction: AppUiAction;
  // globalConfigAction: AppGlobalConfigAction;
  // sessionAction: AppSessionAction;

  constructor() // private http: HttpClient,
  // private punkuService: PunkuService,
  // private localStorage: LocalStorageService
  {
    super(new AppState());

    // this.uiAction = new AppUiAction(
    // this.buildScopedGetState('ui'),
    // this.buildScopedSetState('ui')
    // );

    // this.globalConfigAction = new AppGlobalConfigAction(
    // this.buildScopedGetState('globalConfig'),
    // this.buildScopedSetState('globalConfig'),
    // this.http
    // );

    // this.sessionAction = new AppSessionAction(
    // this.buildScopedGetState('session'),
    // this.buildScopedSetState('session'),
    // this.punkuService,
    // this.localStorage
    // );
  }
}
