import { IPunkuClaims } from "../interfaces";

import {
    IAppPermission,
    IAppPermissions,
    IAppSession,
    IAppUser,
    IAppUserRol,
    ICurrentMenu,
    ISiuClaims,
    IServerConfig,
    IServerPunkuConfig
} from "../store";

import { TipoRolSiuEnum } from "../enums";

const DEFAULT_MSG_PERIMSSION =
    'No tiene permisos para realizar acciones en esta opción';

const DEFAULT_PERMISSIONS: IAppPermissions = {
    ADMINISTRADO: { value: false, msg: DEFAULT_MSG_PERIMSSION },
    FUNCIONARIO: { value: false, msg: DEFAULT_MSG_PERIMSSION },
};

export function buildUrlLoginPunku(punku: IServerPunkuConfig, currentUrl: string): string {
    const url = punku.api.loginUrl
        .replace('{0}', punku.guidSistema)
        .replace('{1}', punku.returnUrl)
        .replace('{2}', (currentUrl ? encodeURIComponent(`returnUrl=${currentUrl}`) : ''));
    return url;
}
export function buildUrlChangePasswordPunku(punku: IServerPunkuConfig, token: string) {
    const url = punku.api.changePasswordUrl
      .replace('{0}', token)
      .replace('{1}', punku.returnUrl);
    return url;
}

export function buildUser(
    claims: IPunkuClaims,
    siuClaims: ISiuClaims
): IAppUser {
    if (!claims) { return null; }

    const { USUARIO, SESION, ROL_USUARIO } = claims;

    if (!USUARIO) { return null; }

    const ROLES: IAppUserRol[] = ROL_USUARIO.map(x => ({
        ...x,
        TIPO_ROL_SIU:
            x.DESCRIPCION_TIPO_SEDE == 'Oficina'
                ? TipoRolSiuEnum.INTERNO
                : TipoRolSiuEnum.EXTERNO
    }));

    const esEntidad = siuClaims && siuClaims.idEntidad;

    const DEFAULT_ROL: IAppUserRol = ROLES.filter(x => x.POR_DEFECTO).map(
        (x): IAppUserRol => ({
            ...x,
            ID_ENTIDAD: esEntidad ? siuClaims.idEntidad : null,
            PERMISSIONS: esEntidad ? this.buildAppPermissions(siuClaims) : null,
            NOMBRE_ENTIDAD: esEntidad ? siuClaims.nombreEntidad : null,
            TEXTO_AUTORIZACION: esEntidad ? siuClaims.textoAutorizacion : null,
            NOMBRE_SEDE: x.DESCRIPCION_SEDE,
            ID_TBL_TIPO_GESTION: esEntidad ? siuClaims.idTblTipoGestion : null,
            OFICINA:
                siuClaims && siuClaims.abreviaturaSede
                    ? siuClaims.abreviaturaSede
                    : null
        })
    )[0];

    const avatarText = `${USUARIO.NOMBRES.substring(
        0,
        1
    ).toUpperCase()}${USUARIO.APELLIDO_PATERNO.substring(0, 1).toUpperCase()}`;

    return {
        fullName: `${USUARIO.NOMBRES}, ${USUARIO.APELLIDO_PATERNO} ${USUARIO.APELLIDO_MATERNO}`,
        email: USUARIO.CORREO_ELECTRONICO,
        lastSession: SESION.FECHA_ULTIMA_SESION,
        avatarText,
        defaultRol: DEFAULT_ROL,
        roles: [...ROLES]
    };
}

export function buildAppPermissions (siuClaims: ISiuClaims): IAppPermissions {
    // tslint:disable-next-line: prefer-const
    let siuPermissions: IAppPermissions = { ...DEFAULT_PERMISSIONS };

    if (!siuClaims) {
        console.error('Error en el servicio de matríz de permisos.');
        return siuPermissions;
    }

    siuClaims.rules.forEach(rule => {
        const permission: IAppPermission = {
            msg: rule.desEstado,
            value: rule.estado
        };

        siuPermissions[rule.desTblAccionMatriz] = permission;
    });

    return siuPermissions;
}