
import { Injectable } from '@angular/core';

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IAppUi } from '../store/app.state.interface';
import * as actions from './app-ui.actions';
import { IMenuItemPunkuClaim } from '../interfaces/punku-claims.interface';
import { APP_UI_DEFAULT } from '../store';

@State<IAppUi>({
    name: 'ui', // required
    defaults: APP_UI_DEFAULT
})
export class AppUiState {
    constructor(
        // private http: HttpClient,
        // private punkuService: PunkuService, private localStorage: LocalStorageService
    ) { }

    @Selector()
    public static title(state: IAppUi): string {
        return state.appTitle.full;
    }


    @Action(actions.OpenDrawer)
    openDrawer(ctx: StateContext<IAppUi>) {
        ctx.setState({ ...ctx.getState(), drawerOpen: true });
    }
    @Action(actions.CloseDrawer)
    closeDrawer(ctx: StateContext<IAppUi>) {
        ctx.setState({ ...ctx.getState(), drawerOpen: false });
    }
    @Action(actions.OpenDrawerMobile)
    openDrawerMobile(ctx: StateContext<IAppUi>) {
        ctx.setState({ ...ctx.getState(), drawerMobileOpen: true });
    }
    @Action(actions.CloseDrawerMobile)
    closeDrawerMobile(ctx: StateContext<IAppUi>) {
        ctx.setState({ ...ctx.getState(), drawerMobileOpen: false });
    }
    @Action(actions.SetIsMobile)
    setIsMobile(ctx: StateContext<IAppUi>, action: actions.SetIsMobile) {
        ctx.setState({ ...ctx.getState(), isMobile: action.value });
    }

    @Action(actions.SetAppMenu)
    setAppMenu(ctx: StateContext<IAppUi>, action: actions.SetAppMenu) {
        const state = ctx.getState();
        const { appMenu } = state;
        //const menu = this.buildAppMenuFromPunku(action.punkuMenu, action.tokenUser);
        const menu = this.buildAppMenuFromPunku2(action.punkuMenu, action.tokenUser);
        //ctx.setState({ ...state, appMenu: [...appMenu, ...menu] });
        ctx.setState({ ...state, appMenu: [...menu] });
    }

    @Action(actions.SetBlockUi)
    setBlockUi(ctx: StateContext<IAppUi>, action: actions.SetBlockUi) {
        ctx.setState({ ...ctx.getState(), blockUi: action.show });
    }

    @Action(actions.AttachDrawer)
    attachDrawer(ctx: StateContext<IAppUi>, ) {
        ctx.setState({ ...ctx.getState(), drawerAttached: true });
    }

    @Action(actions.DetachDrawer)
    detachDrawer(ctx: StateContext<IAppUi>, ) {
        ctx.setState({ ...ctx.getState(), drawerAttached: false, drawerOpen: false });
    }

    private buildAppMenuFromPunku2 = (punkuMenu: IMenuItemPunkuClaim[], tokenUser: string = null) => {

      const GUID_PADRE_DEFAULT = '00000000-0000-0000-0000-000000000000';
      //console.log('CAYL punkuMenu',punkuMenu);
      // CAYL ojo borrar
        // punkuMenu.forEach(m =>{
        //     if(m.NOMBRE=="Trazabilidad" || m.NOMBRE=="Visor"){
        //         m.TIPO_OPCION="Link";
        //     }

        //     if(m.NOMBRE=="Consulta"){
        //         m.RUTA_RELATIVA=null;
        //     }
        // })


      let menu = punkuMenu.filter(value => (
          value.GUID_PADRE != null || value.GUID_PADRE !== GUID_PADRE_DEFAULT
      ) && value.TIPO_OPCION === 'Interno').map(x => ({
          label: x.NOMBRE,
          icon: x.NOMBRE_ICONO ? x.NOMBRE_ICONO.replace('-', '_') : null, // x.NOMBRE_ICONO,
          items: null,
          value: x,
          link: null,
          externalRedirect: false
      }));

      // console.log(menu);

      menu = menu.sort((n1, n2) => (n1.value.ORDEN > n2.value.ORDEN ? 1 : -1));

      menu.forEach(item => {
          item = this.recuperarMenuHijo(item, punkuMenu);
          if (item.value.TIPO_OPCION === 'Link') {
              item.externalRedirect = true;
              if (!item.value.RUTA_RELATIVA.includes('?token=')) {
                  item.value.RUTA_RELATIVA = `${item.value.RUTA_RELATIVA}?token=${tokenUser}`;
              }
          }
          item.link = (item.value.RUTA_RELATIVA !== '#' ? item.value.RUTA_RELATIVA : null);
      });
      //console.log('CAYL Menu Final', menu);
      return menu;
  }

    private buildAppMenuFromPunku = (punkuMenu: IMenuItemPunkuClaim[], tokenUser: string = null) => {

        const GUID_PADRE_DEFAULT = '00000000-0000-0000-0000-000000000000';
        // console.log(punkuMenu);
        let menu = punkuMenu.filter(value => (
            value.GUID_PADRE == null || value.GUID_PADRE === GUID_PADRE_DEFAULT
        ) && value.TIPO_OPCION !== 'Interno').map(x => ({
            label: x.NOMBRE,
            icon: x.NOMBRE_ICONO ? x.NOMBRE_ICONO.replace('-', '_') : null, // x.NOMBRE_ICONO,
            items: null,
            value: x,
            link: null,
            externalRedirect: false
        }));

        // console.log(menu);

        menu = menu.sort((n1, n2) => (n1.value.ORDEN > n2.value.ORDEN ? 1 : -1));

        menu.forEach(item => {
            item = this.recuperarMenuHijo(item, punkuMenu);
            if (item.value.TIPO_OPCION === 'Link') {
                item.externalRedirect = true;
                if (!item.value.RUTA_RELATIVA.includes('?token=')) {
                    item.value.RUTA_RELATIVA = `${item.value.RUTA_RELATIVA}?token=${tokenUser}`;
                }
            }
            item.link = (item.value.RUTA_RELATIVA !== '#' ? item.value.RUTA_RELATIVA : null);
        });
        return menu;
    }

    private recuperarMenuHijo = (menu: any, punkuMenu: IMenuItemPunkuClaim[]) => {
        menu.items = punkuMenu.filter(value => (
            (value.GUID_PADRE === menu.value.GUID) && value.TIPO_OPCION !== 'Interno')  
        ).map(x => ({
            label: x.NOMBRE,
            icon: null, // 'subdirectory_arrow_right',//x.NOMBRE_ICONO,
            items: null,
            value: x,
            link: null,
            externalRedirect: false
        }));

        if (menu.items.length > 0) {
            menu.items = menu.items.sort((n1, n2) => (n1.value.ORDEN > n2.value.ORDEN ? 1 : -1));

            menu.items.forEach(item => {
                item = this.recuperarMenuHijo(item, punkuMenu);
                // CAYL ojo que si se activa salta al siguiente tab page.
                //if (item.value.TIPO_OPCION === 'Link') { item.externalRedirect = true; }
                item.link = (item.items.length === 0 ? item.value.RUTA_RELATIVA : null);
            });

        }
        return menu;
    }

}
