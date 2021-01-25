import { Injectable } from '@angular/core';
import { Store } from './store';
import { AppCurrentFlow } from './app.state';
import { AppCurrentFlowActions } from './app.currentFlow.action';
import { LocalStorageService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AppCurrentFlowStore extends Store<AppCurrentFlow> {
  currentFlowAction: AppCurrentFlowActions;

  constructor(localStorage: LocalStorageService) {
    super(new AppCurrentFlow());

    this.currentFlowAction = new AppCurrentFlowActions(
      this.buildScopedGetState('currentFlow'),
      localStorage,
      this.buildScopedSetState('currentFlow')
    );
  }
}
