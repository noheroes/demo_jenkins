// import { AppStore } from '@bio/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import {
  SetAuthToken,
  AsyncLogin,
  AppSessionState,
  IAppSession,
  AppGlobalConfigState,
  buildUrlLoginPunku,
  IServerConfig,
} from '@lic/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logging-in',
  templateUrl: './logging-in.component.html',
  styleUrls: ['./logging-in.component.scss'],
})
export class LoggingInComponent implements OnInit {
  @Select(AppSessionState.session) public session$: Observable<IAppSession>;
  constructor(private route: ActivatedRoute, private appStore: Store) {}

  ngOnInit() {
    const token: string = this.route.snapshot.queryParamMap.get('token');
    const returnUrl: string = this.route.snapshot.queryParamMap.get(
      'returnUrl'
    );

    if (token) {
      this.appStore
        .dispatch(new SetAuthToken(token, returnUrl))
        .subscribe(() => {
          this.appStore.dispatch(new AsyncLogin());
        });
    }
  }

  handleRetryLogin = () => {
    const sessionStore = this.appStore.selectSnapshot<IAppSession>(
      (state) => state.appStore.session
    );
    const { punku } = this.appStore.selectSnapshot<IServerConfig>(
      (state) => state.appStore.globalConfig.configuration
    );
    window.location.href = buildUrlLoginPunku(punku, sessionStore.returnUrl);
  };
}
