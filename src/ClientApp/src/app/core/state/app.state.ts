import { Injectable } from '@angular/core';
// import { AppUiAction } from './actions/app-ui.action';
import { HttpClient } from '@angular/common/http';
// import { LocalStorageService } from '../services/infrastructure/local-storage.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as session from './app-session.actions';
import { AppGlobalConfigState } from './app-global-config.state';
import { AppSessionState } from './app-session.state';
import { AppUiState } from './app-ui.state';

import {
  IAppGlobalConfig,
  IAppSession,
  IAppUi,
} from '../store/app.state.interface';

export interface AppStateModel {
  campaignName: string;
  globalConfig: IAppGlobalConfig;
  session: IAppSession;
  ui: IAppUi;
}
// export const initialAppStateModel: AppStateModel = {
//     campaignName: '',
//     // audiences: [{ id: 1, name: "audience 1" }, { id: 2, name: "audience 2" }, { id: 3, name: "audience 3" }],
// };
@State<AppStateModel>({
  name: 'appStore',
  // defaults: initialAppStateModel,
  children: [AppGlobalConfigState, AppSessionState, AppUiState],
})
export class AppXState {
  // [...]
  constructor() {}

  @Selector()
  public static state(state: AppStateModel): AppStateModel {
    return state;
  }

  @Selector()
  public static globalConfig(state: AppStateModel): IAppGlobalConfig {
    return state.globalConfig;
  }
}
export const States = [
  AppXState,
  AppGlobalConfigState,
  AppSessionState,
  AppUiState,
];
// export const States = [AppXState];
