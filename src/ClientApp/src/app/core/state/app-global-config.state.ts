import { Injectable } from '@angular/core';
// import { AppUiAction } from './actions/app-ui.action';
import { HttpClient } from '@angular/common/http';
// import { LocalStorageService } from '../services/infrastructure/local-storage.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  GlobalConfigSuccess,
  GlobalConfigError,
  GlobalBegin,
  SetLoading,
  GetGlobalConfig,
} from './app-global-config.actions';
import { IAppGlobalConfig, IServerConfig } from '../store/app.state.interface';
import { mergeMap, tap, catchError } from 'rxjs/operators';
import { config, of, Observable } from 'rxjs';
import { APP_GLOBAL_CONFIG_DEFAULT } from '../store';

import { environment } from '../../../environments/environment';

@State<IAppGlobalConfig>({
  name: 'globalConfig', // required
  defaults: APP_GLOBAL_CONFIG_DEFAULT,
})
export class AppGlobalConfigState {
  constructor(
    private http: HttpClient // private punkuService: PunkuService, private localStorage: LocalStorageService
  ) {}

  @Selector()
  public static isLoading(state: IAppGlobalConfig): boolean {
    return state.isLoading;
  }

  @Selector()
  public static principalUrl(state: IAppGlobalConfig): string {
    return state.configuration.licApi.principalUrl;
  }

  @Selector()
  public static configuration(state: IAppGlobalConfig): IServerConfig {
    return state.configuration;
  }

  @Action(SetLoading)
  setLoading(ctx: StateContext<IAppGlobalConfig>, action: SetLoading) {
    ctx.setState({ ...ctx.getState(), isLoading: action.show });
  }

  @Action(GlobalBegin)
  getGlobalBegin(ctx: StateContext<IAppGlobalConfig>) {
    ctx.setState({ ...ctx.getState(), isLoading: true, error: false });
  }

  @Action(GlobalConfigSuccess)
  getGlobalConfigSuccess(
    ctx: StateContext<IAppGlobalConfig>,
    action: GlobalConfigSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isLoading: false,
      error: false,
      configuration: action.configuration,
    });
  }
  @Action(GlobalConfigError)
  getGlobalConfigError(ctx: StateContext<IAppGlobalConfig>) {
    const state = ctx.getState();
    ctx.setState({ ...state, isLoading: false, error: true });
  }

  // @Action(GetGlobalConfig)
  // asyncGetGlobalConfig(ctx: StateContext<IAppGlobalConfig>) {
  //     ctx.dispatch(new GlobalBegin());
  //     this.http.get<IServerConfig>('/api/Configuration/ConfigurationData').subscribe(config => {
  //         return ctx.dispatch(new GlobalConfigSuccess(config));
  //     }, error => {
  //         return ctx.dispatch(new GlobalConfigError());
  //     });
  // }

  // @Action(GetGlobalConfig)
  // asyncGetGlobalConfig(ctx: StateContext<IAppGlobalConfig>) {
  //     return ctx.dispatch(new GlobalBegin())
  //         .pipe(
  //             mergeMap(() => this.http.get<IServerConfig>('/api/Configuration/ConfigurationData')),
  //             tap((config) => {
  //                 return ctx.dispatch(new GlobalConfigSuccess(config));
  //             }),
  //             catchError(err => {
  //                 return ctx.dispatch(new GlobalConfigError());
  //             })
  //         );
  // }

  // @Action(GetGlobalConfig)
  // asyncGetGlobalConfig(ctx: StateContext<IAppGlobalConfig>) {
  //   console.log(configJson);
  //  const state = ctx.getState();
  //  //Leer de Variables de entorno y asignar a clase
  //  ctx.setState({
  //      ...state,
  //      isLoading: false, error: false, configuration: configJson
  //  });

  // }

  getConfiguracion(): Observable<IServerConfig> {
    const urlBase = this.getBaseUrl();

    const configuracion: IServerConfig = {
      licApi: {
        principalUrl: 'linu',
        workflowUrl: 'linu',
        institucionalUrl: 'linu',
        presentacionUrl: environment.linu_licApi_presentacionUrl,
      },
      punku: {
        guidSistema: environment.linu_punku_guidSistema,
        returnUrl: urlBase + 'logging-in',
        api: {
          proxyUrl: urlBase,
          loginUrl: environment.linu_punku_api_loginUrl,
          logoutUrl: environment.linu_punku_api_logoutUrl,
          changePasswordUrl: environment.linu_punku_api_changePasswordUrl,
        },
      },
      support: {
        notificacion: 'linu',
        signalRUrl: 'linu',
      },
    };
    //console.log(configuracion);
    return of(configuracion);
  }

  @Action(GetGlobalConfig)
  asyncGetGlobalConfig(ctx: StateContext<IAppGlobalConfig>) {
    return ctx.dispatch(new GlobalBegin()).pipe(
      mergeMap(() => this.getConfiguracion()),
      tap((config) => {
        return ctx.dispatch(new GlobalConfigSuccess(config));
      }),
      catchError((err) => {
        return ctx.dispatch(new GlobalConfigError());
      })
    );
  }
  getBaseUrl(): string {
    return document.getElementsByTagName('base')[0].href;
  }
}
