// import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import { IAppSession } from './store/app.state.interface';
import { AppStore } from './store/app.store';

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetSessionFromStorage } from './state/app-session.actions';
import { GetGlobalConfig } from './state/app-global-config.actions';
import { LocalStorageService } from './services';
import { InteceptorsModule } from './interceptors/interceptors.module';
import { APP_LOCAL_STORAGE } from './constants';

export function appInitializerFn(
  store: Store,
  localStorage: LocalStorageService
) {
  return () => {
    const session = localStorage.get<IAppSession>(
      APP_LOCAL_STORAGE.LIC_SESSION_KEY
    );
    // console.log(session);
    if (session) {
      store.dispatch(new SetSessionFromStorage(session));
    }
    return store.dispatch(new GetGlobalConfig()).toPromise();
  };
}

@NgModule({
  declarations: [],
  imports: [InteceptorsModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [Store, LocalStorageService],
    },
  ],
})
export class CoreModule {}
