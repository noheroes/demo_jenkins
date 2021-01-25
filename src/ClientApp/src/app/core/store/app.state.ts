import { ComboList } from '@sunedu/shared';
import {
  IAppUi,
  IAppSession,
  IAppGlobalConfig,
  IAppUser,
  ICurrentFlow,
} from './app.state.interface';

export const APP_UI_DEFAULT: IAppUi = {
  appTitle: {
    full: 'Licenciamiento Institucional de Universidades Nuevas',
    mini: 'LIC-PM',
  },
  drawerMini: false,
  isMobile: false,
  drawerOpen: false,
  drawerMobileOpen: false,
  blockUi: false,
  appMenu: [],
  // appMenu: [
  //   {
  //     label: 'Inicio',
  //     icon: 'memory',
  //     link: '/workflow',
  //   },
  //   {
  //     label: 'Bandeja',
  //     icon: 'memory',
  //     link: '/workflow/bandeja',
  //   } /* No se usa de momento
  //   {
  //     label: 'Consulta',
  //     icon: 'memory',
  //     items: [
  //       {
  //         label: 'Trazabilidad',
  //         icon: 'subdirectory_arrow_right',
  //         link: '/workflow/consulta',
  //       },
  //       {
  //         label: 'Visor',
  //         icon: 'subdirectory_arrow_right',
  //         link: '/workflow/visor'
  //       }
  //     ]
  //   },*/,
  //   {
  //     label: 'Administracion',
  //     icon: 'developer_board',
  //     link: '/administracion',
  //     items: [],
  //   },
  // ],
  drawerAttached: false,
};

export const APP_SESSION_DEFAULT: IAppSession = {
  isLoading: false,
  isLoggedIn: false,
  user: null,
  token: null,
  returnUrl: null,
  loginError: false,
  fromStorage: false,
  claims: null,
  currentMenu: null,
  sessionExpired: false,
};

export const APP_GLOBAL_CONFIG_DEFAULT: IAppGlobalConfig = {
  isLoading: false,
  configuration: null,
  error: false,
};

export class AppState {
  ui: IAppUi = APP_UI_DEFAULT;
  session: IAppSession = APP_SESSION_DEFAULT;
  globalConfig: IAppGlobalConfig = APP_GLOBAL_CONFIG_DEFAULT;
}

export const APP_CURRENT_PROCEDIMIENTO: ICurrentFlow = {
  idSesion: null,
  idUsuario: null,
  idEntidad: null,
  idFlujo: null,
  idTipoUsuario: null,
  esResponsable :false,
  idVersionSolicitud: null,
  programaOne:new ComboList([]),
  programaTwo:new ComboList([])
};

export class AppCurrentFlow {
  currentFlow: ICurrentFlow = APP_CURRENT_PROCEDIMIENTO;
}
