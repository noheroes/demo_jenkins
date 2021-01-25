import { PUNKU_ACTIONS } from '../enums/punku-actions.enum';
import {
  IAppGlobalConfig,
  IAppSession,
  IAppUser,
  IServerConfig,
} from './../store/app.state.interface';
import { PUNKU_HEADERS } from '../enums/punku-headers.enum';

export const buildPunkuHeaders = (
  configuration: IServerConfig,
  appSession: IAppSession,
  appUser: IAppUser,
  requestMethod: string = 'POST',
): { name: string; value: string }[] => {
  const headers = [];

  /**
   * Asignando el token de autenticación de punku
   */
  if (appSession.token) {
    headers.push({
      name: PUNKU_HEADERS.AUTHORIZATION,
      value: `Bearer ${appSession.token}`, // Bearer
    });
  }

  /**
   * Asignando el guid de sistema de punku
   */
  // if (configuration) {
  //   headers.push({
  //     name: PUNKU_HEADERS.GUID_SISTEMA,
  //     value: configuration.punku.guidSistema,
  //   });
  // }

  /**
   * Asignando el guid de rol de usuario y el codigo de entidad si existiera
   */
  // if (appUser && appUser.defaultRol) {
  //   headers.push({
  //     name: PUNKU_HEADERS.GUID_ROL,
  //     value: appUser.defaultRol.GUID_ROL,
  //   });

  //   if (appUser.defaultRol.CODIGO_ENTIDAD) {
  //     headers.push({
  //       name: PUNKU_HEADERS.CODIGO_ENTIDAD,
  //       value: appUser.defaultRol.CODIGO_ENTIDAD,
  //     });
  //   }
  // }

  /**
   * Asignando el guid de menu padre y de menu actual
   */
  if (appSession.currentMenu && appSession.currentMenu.item) {
    headers.push({
      name: PUNKU_HEADERS.GUID_MENU,
      value: appSession.currentMenu.item.GUID,
    });

    if (appSession.currentMenu.item.GUID_PADRE) {
      headers.push({
        name: PUNKU_HEADERS.GUID_MODULO,
        value: appSession.currentMenu.item.GUID_PADRE,
      });
    }
  }

  /**
   * Asignando el codigo de accion que se va realizar
   */
  switch (requestMethod) {
    case 'GET':
      headers.push({
        name: PUNKU_HEADERS.CODIGO_ACCION,
        value: PUNKU_ACTIONS.CONSULTAR,
      });
      break;

    case 'POST':
      headers.push({
        name: PUNKU_HEADERS.CODIGO_ACCION,
        value: PUNKU_ACTIONS.AGREGAR,
      });
      break;

    case 'PUT':
      headers.push({
        name: PUNKU_HEADERS.CODIGO_ACCION,
        value: PUNKU_ACTIONS.MODIFICAR,
      });
      break;

    case 'DELETE':
      headers.push({
        name: PUNKU_HEADERS.CODIGO_ACCION,
        value: PUNKU_ACTIONS.ELIMINAR,
      });
      break;
  }

  /**
   * Asignando el header idEntidad en caso exista
   */
  if (
    appSession.user &&
    appSession.user.defaultRol &&
    appSession.user.defaultRol.ID_ENTIDAD
  ) {
    headers.push({
      name: 'IdEntidad',
      value: appSession.user.defaultRol.ID_ENTIDAD,
    });
  }

  return headers;
};
