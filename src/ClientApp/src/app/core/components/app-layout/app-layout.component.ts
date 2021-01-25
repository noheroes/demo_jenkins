
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import {
  AppXState,
  AttachDrawer,
  DetachDrawer,
  Logout,
  SetIsMobile,
  SetBlockUi,
  OpenDrawerMobile,
  OpenDrawer,
  CloseDrawerMobile,
  CloseDrawer,
} from './../../state';
import { IAppUi, IServerConfig, IAppSession } from '../../store';
import { buildUrlChangePasswordPunku } from '../../functions';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  readonly state$ = this.store.select(AppXState.state);
  constructor(
    private store: Store,
    public router: Router
  ) { }

  ngOnInit() {

  }

  handleToogleDrawer = (open) => {
    const ui = this.store.selectSnapshot<IAppUi>(state => state.appStore.ui);
    if (open) {
      if (ui.isMobile) {
        this.store.dispatch(new OpenDrawerMobile());
      } else {
        this.store.dispatch(new OpenDrawer());
      }
    } else {
      if (ui.isMobile) {
        this.store.dispatch(new CloseDrawerMobile());
      } else {
        this.store.dispatch(new CloseDrawer());
      }
    }
  }

  handleToogleAttachDrawer = (open) => {
    if (open) { this.store.dispatch(new AttachDrawer()); } else { this.store.dispatch(new DetachDrawer()); }
  }

  handleLogout = () => {
    this.store.dispatch(new Logout());
  }

  handleChangeMobileSize = (isMobile: boolean) => {
    this.store.dispatch(new SetIsMobile(isMobile));
  }

  handleClickLogo = () => {
    this.router.navigate(['/']);
  }

  handleClickChangePassword = () => {
    this.store.dispatch(new SetBlockUi(true));
    const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    const { punku } = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    window.location.href = buildUrlChangePasswordPunku(punku, session.token);
  }
}
