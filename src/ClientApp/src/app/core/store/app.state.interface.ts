
import { IAppTitle, IComboList } from '@sunedu/shared';

import { TipoRolSiuEnum } from './../enums/siu-config.enum';
import {
  IMenuItemPunkuClaim,
  IPunkuClaims,
} from '../interfaces/punku-claims.interface';
export interface IAppUi {
  drawerMini: boolean;
  drawerOpen: boolean;
  drawerMobileOpen: boolean;
  appTitle: IAppTitle;
  appMenu: any[];
  isMobile: boolean;
  blockUi: boolean;
  drawerAttached: boolean;
}

export interface IAppUser {
  fullName: string;
  email: string;
  lastSession: any;
  avatarText: string;
  defaultRol: IAppUserRol;
  roles: IAppUserRol[];
}
export interface ICurrentMenu {
  item: IMenuItemPunkuClaim;
  permissions: any;
}

export interface IAppSession {
  /**
   * Indica que se está cargando la data del usuario
   */
  isLoading: boolean;
  /**
   * Indica si el usuario se encuentra logueado en el sistema
   */
  isLoggedIn: boolean;
  token: string;
  // user: IAppUser,
  claims: IPunkuClaims;
  /**
   * Indica a que url se debe retornar una vez logueado
   */
  returnUrl: string;
  loginError: boolean;
  /**
   * Indica a que la sesión se ha seteado desde el storage
   */
  fromStorage: boolean;
  /**
   * Guarda el GUID de la opción en la que se encuentra
   * actualmente el ususario
   */
  currentMenu: ICurrentMenu;
  /**
   * Indica a que la sesión ha expirado.
   * Normalmente cuando el servidor retorna status = 401
   */
  sessionExpired: boolean;
  user: IAppUser;
}
export interface IServerLicApiConfig {
  principalUrl: string;
  workflowUrl: string;
  institucionalUrl: string;
  presentacionUrl: string; // nuevo CAYL
}
export interface IServerPunkuApiConfig {
  proxyUrl: string;
  loginUrl: string;
  logoutUrl: string;
  changePasswordUrl: string;
}
export interface IServerPunkuConfig {
  guidSistema: string;
  returnUrl: string;
  api: IServerPunkuApiConfig;
}
export interface IServerSupportConfig {
  notificacion: string;
  signalRUrl: string;
}
export interface IServerConfig {
  licApi: IServerLicApiConfig;
  punku: IServerPunkuConfig;
  support: IServerSupportConfig;
}

export interface IAppGlobalConfig {
  isLoading: boolean;
  configuration: IServerConfig;
  error: boolean;
}

export interface ISiuClaims {
  idEntidad: number;
  nombreEntidad: string;
  textoAutorizacion: string;
  rules: ISiuConfigRule[];
  abreviaturaSede: string;
  idTblTipoGestion: number;
}
export interface ISiuConfigRule {
  idTblAccionMatriz: number;
  estado: boolean;
  desTblAccionMatriz: string;
  desEstado: string;
}

/**
 * Objeto que controla los permisos del sistema
 * en las diferentes pantallas (acciones).
 * Se construye en base a la
 * matriz de configuracion de estados.
 */
export interface IAppUserRol {
  CODIGO_ENTIDAD: string;
  DESCRIPCION_SEDE: string;
  DESCRIPCION_TIPO_SEDE: string;
  GUID_ROL: string;
  GUID_SEDE: string;
  GUID_TIPO_SEDE: string;
  NOMBRE_ROL: string;
  POR_DEFECTO: boolean;
  // CAMPOS GENERADOS POR EL SISTEMA
  TIPO_ROL_SIU?: TipoRolSiuEnum;
  ID_ENTIDAD?: number;
  PERMISSIONS?: IAppPermissions;
  NOMBRE_ENTIDAD?: string;
  TEXTO_AUTORIZACION?: string;
  NOMBRE_SEDE?: string;
  OFICINA?: string;
  ID_TBL_TIPO_GESTION?: number;
}
export interface IAppPermission {
  value: boolean;
  msg: string;
}

export interface IAppPermissions {
  ADMINISTRADO: IAppPermission;
  FUNCIONARIO: IAppPermission;
}

export interface ISiuClaims {
  idEntidad: number;
  nombreEntidad: string;
  textoAutorizacion: string;
  rules: ISiuConfigRule[];
  abreviaturaSede: string;
  idTblTipoGestion: number;
}

export interface ISiuConfigRule {
  idTblAccionMatriz: number;
  estado: boolean;
  desTblAccionMatriz: string;
  desEstado: string;
}

export interface ICurrentMenuPermission {
  ACCEDER: boolean;
  CONSULTAR: boolean;
  AGREGAR: boolean;
  MODIFICAR: boolean;
  ELIMINAR: boolean;
  EJECUTAR: boolean;
}

export interface IExpediente {
  codigo: string;
  fechaCreacion: Date;
  fechaAsignacion?: Date;
  fechaSolicitud?: Date;
}

export interface ICabecera {
  numeroSolicitud: string;
  fechaInicio: Date;
  fechaPresentacion?: Date;
  fechaAdmisibilidad?: Date;
  fechaOficialIngreso?: Date;
  nombreEntidad: string;
  rucEntidad: string;
  idSolicitud: string;
}

export interface IDocumento{
  listarSubtipos?:number[];
  listarEstados?:number[];
  listadoAccionesPermitidas?:string[];
  operacion?:string;
  estadoOrigenDocumento?:number;
  estadoDestinoDocumento?:number;
  registrarSubtipos?:number[];
  registrarSubtiposMulti?:number[];
  registrarCategoriaDocumento?:number;
  registrarExtensionesPermitidasArchivos?:string;
  registrarPesoMaximoMBArchivos?:number;
  restringirDescargaDePlantillas?:boolean;
  registrarInformacionComplementaria?:boolean;
  

  // registroSubtiposSeleccion?:number[];
  // registroEstadoOrigenDocumento?:number;
  // registroEstadoDestinoDocumento?:number;
  // registroFaseOrigenDocumento?:number;
}
// export interface IProgramaExternal{
//   programaOne: IExternalPrograma[];
//   programaTwo: IExternalPrograma[];
// }

export interface IExternalPrograma{
  id?:number;
  nombre?:string;
  denominacionCompleta?:string;
}

export interface IFrontSetttings{
  codigoPais:string;
}

// CAYL
export interface ICurrentFlow {
  idSesion: string;
  idUsuario: string;
  idEntidad: string;
  idFlujo: string;
  idTipoUsuario: string;
  idVersionSolicitud: string;
  esResponsable: boolean;
  // Opcionales
  descripcionSede?: string;
  codigoFlujos?: string[];
  fechaDesde?: string;
  fechaHasta?: string;
  codigoActividad?: string;
  page?: number;
  pageSize?: number;
  idAplicacion?: string;
  usuarioFullName?: string;
  idRol?: string;
  rolDescripcion?: string;
  idProceso?: string;
  idProcesoBandeja?:string;
  expediente?: IExpediente;
  cabecera?: ICabecera;
  documento?:IDocumento;
  programaOne: IComboList;
  programaTwo: IComboList;
  frontSettings?:IFrontSetttings;
  idTipoRolSIU?:number;
  usuarioNumeroDocumento?:string;
  usuarioEsRolAdministrado?:boolean;
  esFirmadoDocumento?:boolean;
  subsanacionReadonly?:boolean;
  esFirmaAT?:boolean;
  conActualizacionColaboradores?:boolean;
  idProcesoOrigen?:string;
  idProcesoBandejaOrigen?:string;
  esModoConsulta?:boolean;
  idVersionFlujo?:string;
  conFinalizacionFirma?:boolean;
}
