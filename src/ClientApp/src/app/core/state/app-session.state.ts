import { Injectable } from '@angular/core';
// import { AppUiAction } from './actions/app-ui.action';
import { HttpClient } from '@angular/common/http';
// import { LocalStorageService } from '../services/infrastructure/local-storage.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as session from './app-session.actions';

import { IAppSession, ICurrentMenu } from '../store/app.state.interface';

import { IPunkuClaims } from '../interfaces';
import { PUNKU_ACTIONS, TipoRolSiuEnum } from '../enums';
import { PunkuService, LocalStorageService } from '../services';
import { mergeMap, tap, catchError } from 'rxjs/operators';
import * as globalConfig from './app-global-config.actions';
import { buildUser } from '../functions';
import { APP_SESSION_DEFAULT } from '../store';
import { APP_LOCAL_STORAGE } from '../constants';
import { Router } from '@angular/router';

@State<IAppSession>({
  name: 'session', // required
  defaults: APP_SESSION_DEFAULT,
})
export class AppSessionState {

  isAuthorized: boolean = false;

  constructor(
    private http: HttpClient,
    private punkuService: PunkuService,
    private localStorage: LocalStorageService,
    private router: Router,
  ) { }

  @Selector()
  public static session(state: IAppSession): IAppSession {
    return state;
  }

  @Selector()
  public static isLoggedIn(state: IAppSession): boolean {
    return state.isLoggedIn;
  }
  @Selector()
  public static claims(state: IAppSession): IPunkuClaims {
    return state.claims;
  }

  @Action(session.SetSessionFromStorage)
  setSessionFromStorage(
    ctx: StateContext<IAppSession>,
    action: session.SetSessionFromStorage
  ) {
    ctx.setState({ ...action.session, fromStorage: true });
  }
  @Action(session.SetNewToken)
  setNewToken(ctx: StateContext<IAppSession>, action: session.SetNewToken) {
    ctx.setState({ ...ctx.getState(), token: action.token });
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_SESSION_KEY, ctx.getState());
  }
  @Action(session.SetAuthToken)
  setAuthToken(ctx: StateContext<IAppSession>, action: session.SetAuthToken) {
    ctx.setState({
      ...ctx.getState(),
      token: action.token,
      returnUrl: action.returnUrl,
    });
  }
  @Action(session.LoginBegin)
  loginBegin(ctx: StateContext<IAppSession>) {
    ctx.setState({ ...ctx.getState(), isLoading: true, loginError: false });
  }
  @Action(session.LoginSuccess)
  loginSuccess(ctx: StateContext<IAppSession>, action: session.LoginSuccess) {
    const user = buildUser(action.punkuClaims, action.siuClaims);

    ctx.setState({
      ...ctx.getState(),
      isLoading: false,
      isLoggedIn: true,
      claims: action.punkuClaims,
      user,
    });
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_SESSION_KEY, ctx.getState());
  }

  @Action(session.LoginError)
  loginError(ctx: StateContext<IAppSession>) {
    ctx.setState({ ...ctx.getState(), isLoading: false, loginError: true });
  }
  @Action(session.SetCurrentMenu)
  setCurrentMenu(
    ctx: StateContext<IAppSession>,
    action: session.SetCurrentMenu
  ) {
    let url = action.url;
    const state = ctx.getState();
    const { MENU, ACCION } = state.claims;

    let item = MENU.find((x) => x.RUTA_RELATIVA === url);

    if (!item) {
      const urlSplit = url.split('?');
      url = urlSplit[0];
      item = MENU.find((x) => x.RUTA_RELATIVA === url);
    }

    // tslint:disable-next-line: prefer-const
    let permissions = {};
    // tslint:disable-next-line: prefer-const
    let rolPermissions = {};

    Object.keys(PUNKU_ACTIONS).forEach((key) => {
      permissions[key] = false;
    });

    if (item) {
      ACCION.filter((x) => x.GUID_MENU === item.GUID).forEach((x) => {
        rolPermissions[x.NOMBRE] = true;
      });
    }

    const currentMenu: ICurrentMenu = {
      item: item ? item : null,
      permissions: { ...permissions, ...rolPermissions },
    };

    // console.log(currentMenu);

    ctx.setState({ ...ctx.getState(), currentMenu });
  }

  @Action(session.Logout)
  logout(ctx: StateContext<IAppSession>) {
    ctx.setState({
      ...ctx.getState(),
      isLoggedIn: false,
      claims: null,
      user: null,
    });
    // this.localStorage.remove(LIC_SESSION_KEY);
    this.localStorage.removeAll(APP_LOCAL_STORAGE.LIC_PATTERN_KEY);
  }

  @Action(session.SetSessionExpired)
  setSessionExpired(ctx: StateContext<IAppSession>) {
    ctx.setState({ ...ctx.getState(), sessionExpired: true });
  }

  // public static checkHasClaim(claim: IGuardClaim): boolean {
  //     switch (claim.type) {
  //         case ClaimTypeEnum.URL: {
  //             const state = ctx.getState();
  //             const { MENU, ACCION } = state.claims;

  //             if (!MENU) { return false; }

  //             const menuFound = MENU.find(
  //                 x => x.RUTA_RELATIVA.split('?')[0] === claim.path
  //             );

  //             if (!menuFound) { return false; }

  //             return (
  //                 ACCION.find(
  //                     x => x.GUID_MENU === menuFound.GUID && x.CODIGO === claim.action
  //                 ) !== undefined
  //             );
  //         }
  //         case ClaimTypeEnum.GUID:
  //             const state = ctx.getState();

  //             const { MENU } = state.claims;
  //             const { ACCION } = state.claims;

  //             if (!MENU) { return false; }

  //             const menuFound = state.claims.MENU.find(c => c.GUID === claim.value);

  //             if (!menuFound) { return false; }

  //             return (
  //                 ACCION.find(
  //                     c => c.GUID_MENU === menuFound.GUID && c.CODIGO === claim.action
  //                 ) !== undefined
  //             );
  //     }
  //     return true;
  // }

  // @Action(session.AsyncLogin)
  // asyncLogin(ctx: StateContext<IAppSession>) {
  //     this.loginBegin();
  //     this.punkuService.login().subscribe(
  //         response => {
  //             if (response.punkuClaims.HasErrors) {
  //                 this.loginError();
  //             } else {
  //                 this.loginSuccess(response.punkuClaims, response.siuClaims);
  //             }
  //         },
  //         error => {
  //             this.loginError();
  //         }
  //     );
  // }
  @Action(session.AsyncLogin)
  asyncLogin(ctx: StateContext<IAppSession>) {    
    if (!this.isAuthorized) {
      return ctx.dispatch(new session.LoginBegin()).pipe(
        mergeMap(() => this.punkuService.login()),
        tap((response) => {

          if (response.punkuClaims.HasErrors) {
            return ctx.dispatch(new session.LoginError());
          } else {
            return ctx.dispatch(
              new session.LoginSuccess(response.punkuClaims, response.siuClaims)
            );
          }
          
        }),
        catchError((err) => {
          return ctx.dispatch(new session.LoginError());
        })
      );
    } else {

      ctx.dispatch(new globalConfig.SetLoading(false));
      this.router.navigate(['/']);
      return ctx;
    }

  }

  // @Action(session.AsyncCheckSession)
  // asyncCheckSession(ctx: StateContext<IAppSession>) {
  //     return this.punkuService
  //         .checkSession()
  //         .pipe(
  //             map(response => {
  //                 if (!response.authorized) {
  //                     return false;
  //                 }
  //                 return true;
  //             }),
  //             catchError(err => {
  //                 console.error(err);
  //                 return throwError(false);
  //             })
  //         )
  //         .toPromise();
  // }

  @Action(session.AsyncCheckSession)
  asyncCheckSession(ctx: StateContext<IAppSession>) {
    return ctx.dispatch(new globalConfig.SetLoading(true)).pipe(
      mergeMap(() => this.punkuService.checkSession()),
      tap((response) => {
        this.isAuthorized = response.authorized;

        if (!response.authorized) {
          return ctx.dispatch([
            new session.Logout(),
            new globalConfig.SetLoading(false),
          ]);
        }
        return ctx.dispatch(new globalConfig.SetLoading(false));
      }),
      catchError((err) => {
        return ctx.dispatch(new session.LoginError());
      })
    );
  }
}
