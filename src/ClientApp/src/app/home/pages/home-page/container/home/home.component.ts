import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IAppSession, SetBlockUi, buildUrlLoginPunku, IServerConfig, IMenuItemPunkuClaim } from '@lic/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean;
  listMenu: IMenuItemPunkuClaim[] = [];
  constructor(
    private store: Store,
    private router: Router
  )
  {
    const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    const { isLoggedIn, token } = session;
    this.isLoggedIn = isLoggedIn;
  }

  ngOnInit() {
    const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    if (session.isLoggedIn) {
      // this.store.dispatch(new SetBlockUi(false));
      // console.log('Session.claims CAYL');
      // let claims = session.claims;
      // console.log(claims);
      // Incluir los datos necesarios.
      // idEntidad: mismo nombre del userName
      //this.store.dispatch(new SetCurrentProcedimiento(current));


      this.buildMenu();
    }
  }

  handleLogin = () => {
    const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    if (!session.isLoggedIn) {
      this.store.dispatch(new SetBlockUi(true));
      const { punku } = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
      window.location.href = buildUrlLoginPunku(punku, '');
    }
  }

  buildMenu = () => {
    const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    const { MENU } = session.claims;

    const defaultGuidPadre = '00000000-0000-0000-0000-000000000000';

    this.listMenu = MENU.filter(x => x.GUID_PADRE === defaultGuidPadre && x.RUTA_RELATIVA !== '#');
    this.listMenu = this.listMenu.sort((n1, n2) => { return (n1.ORDEN > n2.ORDEN ? 1 : -1); });

  }

  IrAProcesoBandeja() {
    // this.router.navigate(['/formulario/TransRegistroSolicitudRevisionPreliminar/v01_REVISAR_FORMA', {idProceso: 12345, idProcesoBandeja: 123456}]);
    // this.router.navigate(['/formulario', {idFlujo: 'TransRegistroSolicitudRevisionPreliminar', idActividad: 'v01_REVISAR_FORMA'}]);
    // this.router.navigate(['/formulario', {
    //   idFlujo: 'TransRegistroSolicitudRevisionPreliminar',
    //   idActividad: 'v01_REVISAR_FORMA',
    //   queryParams: { order: 'popular', 'price-range': 'not-cheap' }
    // }]);
    this.router.navigate(['/workflow/Formularios/TransRegistroSolicitudRevisionPreliminar/v01_REVISAR_FORMA'], {
      queryParams: {'idProceso': '12345', 'idProcesoBandeja': '123456'}
    });
  }
}
