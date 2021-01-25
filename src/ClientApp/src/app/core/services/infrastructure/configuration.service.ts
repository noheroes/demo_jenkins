import { IServerConfig } from './../../store/app.state.interface';
import { Injectable } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { Store, Select } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private appStore: AppStore, private store: Store) { }

  get apiGatewayAddress() {
    // console.log(this.store);
    const { licApi } = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    // console.log(licApi);
    return licApi.principalUrl;
    return this.appStore.state.globalConfig.configuration ? this.appStore.state.globalConfig.configuration.licApi.principalUrl : '';
  }

  get apiWorkflowAddress() {
    const { licApi } = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    return licApi.workflowUrl;
    return this.appStore.state.globalConfig.configuration ? this.appStore.state.globalConfig.configuration.licApi.workflowUrl : '';
  }

  // CAYL
  get apiPresentacionAddress(){
    const { licApi } = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    return licApi.presentacionUrl;
  }

  global = (): IServerConfig => {
    const configuration = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    return configuration;
    return this.appStore.state.globalConfig.configuration;
  }

}
