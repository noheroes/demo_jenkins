import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';

import {
  AppState,
  IAppSession,
  AppXState,
  AppGlobalConfigState,
  AppUiState,
  IServerConfig,
  IAppGlobalConfig,
  IAppUi,
  buildUrlLoginPunku,
  IPunkuClaims
} from '@lic/core';
// import { Store, select } from '@ngrx/store';
import { Store, Select } from '@ngxs/store';

import { map, distinctUntilChanged, skipWhile, skip, withLatestFrom, mergeMap, tap, catchError } from 'rxjs/operators';

import { convertQueryParamsStringToJson } from '@sunedu/shared';
import { Observable, Subscription, of } from 'rxjs';
import { SetLoading, GetGlobalConfig } from './core/state/app-global-config.actions';
import { Logout, LoginError, SetCurrentMenu, AsyncCheckSession } from './core/state/app-session.actions';
import { SetAppMenu, SetBlockUi } from './core/state/app-ui.actions';

import { PunkuService } from './core/services';
import { AppSessionState } from './core/state/app-session.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  // Observables de UiState
  @Select(AppUiState.title) public title$: Observable<string>;
   // Observables de GlobalConfigState
  @Select(AppGlobalConfigState.configuration) public configuration$: Observable<IServerConfig>;
  // public configuration$: this.store.selectSnapshot<IAppGlobalConfig>(state => state.appStore.globalConfig);
  // Observables de SessionState
  @Select(AppSessionState.session) public session$: Observable<IAppSession>;
  @Select(AppSessionState.isLoggedIn) public isLoggedIn$: Observable<boolean>;
  @Select(AppSessionState.claims) public claims$: Observable<IPunkuClaims>;

  private subscriptions: Subscription[] = [];
  // readonly state$ = this.store.select<IAppGlobalConfig>(state => state.globalConfig);
  readonly state$ = this.store.select(AppXState.state);
  // stateAppConfig$ = this.store.select(AppXState.globalConfig);
  // session$ = this.store.select(AppXState.globalConfig);
  constructor(
    // private appStore: Store<AppState>,
    private store: Store,
    private router: Router,
    private punkuService: PunkuService,
  ) {
    // this.configuration$ = this.store.select(AppGlobalConfigState.configuration);
    // this.store.dispatch(new GetGlobalConfig());
  }

  ngOnInit(): void {


    // Examples OBS$
    // console.log('appstate');
    // this.state$.subscribe(console.log);
    // console.log('stateAppConfig');
    // this.stateAppConfig$.subscribe(console.log);
    // console.log('title');
    // this.title$.subscribe(console.log);
    // this.isLoggedIn$.subscribe(console.log);

    this.subscribeToLoggedIn();
    this.subscribeToConfig();
    this.subscribeToRouter();
    // this.notifications();

    // Si se quiere capturar el snapshot
    // this.docId = this.store.selectSnapshot<string>(state => state.document.id)
  }

  ngOnDestroy(): void {
    this.unsubscribeToStore();
  }

  private subscribeToLoggedIn = () => {
    const subSession = this.store.select(AppSessionState.session)
      .pipe(
        skipWhile(x => !x.isLoggedIn),
        map(x => x.isLoggedIn),
        distinctUntilChanged(),
      ).subscribe(isLoggedIn => {
        if (isLoggedIn) {
          // console.log("here");
          // this.listenNotificationService.connect(this.appStore);
          this.subscribeToNotifications();
        }
        /**
         * Ingresa aqui cuando se inicia la sesión
         */
        const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
        if (isLoggedIn && !session.fromStorage) {
          this.redirectToPreviousUrl(session);
        }
        /**
         * Ingresa aqui cuando se destruye la sesión
         */
        if (!isLoggedIn) {
          window.close();
          this.redirectToPunkuLogin(this.router.routerState.snapshot.url);
        }
      });

    const subsClaims = this.store.select(AppSessionState.claims)
      .pipe(
        // map(x => x.claims),
        distinctUntilChanged()
      )
      .subscribe(claims => {
        /**
         * Ingresa aqui cuando se guardan los claims del punku
         * para construir el menú de la aplicación
         */
        const stateUi = this.store.selectSnapshot<IAppUi>(state => state.appStore.ui);
        // console.log(stateUi);
        // const stateSession = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
        // console.log(stateSession);
        // this.store.dispatch(new SetAppMenu(
        //     stateSession.claims.MENU,
        //     stateSession.token
        //   ));
        if (claims && stateUi.appMenu.length === 0) {
          const stateSession = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
          // console.log(stateSession);
          this.store.dispatch(new SetAppMenu(
            stateSession.claims.MENU,
            stateSession.token
          ));
        }
      });

    this.subscriptions.push(subSession);
    this.subscriptions.push(subsClaims);
  }
  private subscribeToConfig = () => {
    // const stateSnapshot = this.store.selectSnapshot<PlacesStateModel>(state => state.places);
    const subsConf = this.configuration$
      .pipe(
        map(x => x),
        distinctUntilChanged()
      )
      .subscribe(config => {
        if (config) {
          this.punkuService.setBaseProxyUrl(config.licApi.presentacionUrl);
          this.checkSession();
        }
      });
    this.subscriptions.push(subsConf);
  }
  private subscribeToRouter = () => {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let route = this.router.routerState.snapshot.root;

        this.setAppTitle(this.router.url);

        while (route.firstChild) {
          route = route.firstChild;
        }
        this.setCurrentMenuInStore(event, route.data);
      }
    });
  }

  private subscribeToNotifications = () => {
  }
  private unsubscribeToStore = () => {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  // Functions Adicionales
  private redirectToPreviousUrl = (session: IAppSession) => {
    if (!session.returnUrl) {
      this.router.navigate(['/']);
    } else {
      const urlSplit = session.returnUrl.split('?');
      const url = urlSplit[0];
      if (urlSplit.length === 1) {
        this.router.navigate([url]);
      } else {
        this.router.navigate([url], {
          queryParams: convertQueryParamsStringToJson(urlSplit[1])
        });
      }
    }
  }
  private redirectToPunkuLogin = currentUrl => {
    this.store.dispatch(new SetBlockUi(true));
    const { punku } = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    window.location.href = buildUrlLoginPunku(punku, currentUrl);
  }

  private setCurrentMenuInStore = (event: NavigationEnd, data: any) => {
    const { claims } = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    if (claims) {
      // console.log(claims);
      const url = data && data.parentUrl ? data.parentUrl : event.url;
      // console.log(url);
      this.store.dispatch(new SetCurrentMenu(url));
    }
  }

  private setAppTitle = (url: string) => {
  }
  private checkSession =  () => {    
    const sessionStore = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    if (sessionStore) {
      this.store.dispatch(new AsyncCheckSession());
    }
  }
}
