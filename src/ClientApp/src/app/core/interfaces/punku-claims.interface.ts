export interface IActionPunkuClaim {
  CODIGO: string;
  GUID_MENU: string;
  GUID_ROL: string;
  NOMBRE: string;
}

export interface IMenuItemPunkuClaim {
  ACCION: string;
  AREA: string;
  CODIGOS_ACCION?: any;
  CONTROLADOR: string;
  GUID: string;
  GUID_PADRE: string;
  ID_CONTROL: string;
  NOMBRE: string;
  NOMBRE_ICONO: string;
  ORDEN: number;
  RUTA_RELATIVA: string;
  TIPO_OPCION: string;
  HIJOS?: IMenuItemPunkuClaim[];
}

export interface IPunkuRolUsuarioClaim {
  CODIGO_ENTIDAD: any;
  DESCRIPCION_SEDE: string;
  DESCRIPCION_TIPO_SEDE: string;
  GUID_ROL: string;
  GUID_ROL_USUARIO: string;
  GUID_SEDE: string;
  GUID_TIPO_SEDE: string;
  NOMBRE_ROL: string;
  POR_DEFECTO: boolean;
}

export interface IPunkuSessionClaim {
  FECHA_CADUCIDAD: Date;
  FECHA_ULTIMA_SESION: Date;
  GUID_SESION: string;
  GUID_SISTEMA: string;
  GUID_USUARIO: string;
  TOKEN_JWT?: any;
  HasErrors: boolean;
  Messages: any[];
}

export interface IPunkuUserClaim {
  APELLIDO_MATERNO: string;
  APELLIDO_PATERNO: string;
  CORREO_ELECTRONICO: string;
  FECHA_NACIMIENTO: Date;
  GUID_USUARIO: string;
  NOMBRES: string;
  NOMBRE_AUTENTICACION: string;
  NUMERO_DOCUMENTO: string;
  TIPO_DOCUMENTO: string;
  TIPO_USUARIO:string;
  RESPONSABLE:boolean;
  HasErrors: boolean;
  Messages: any[];
}

export interface IPunkuClaims {
  ACCION: IActionPunkuClaim[];
  MENU: IMenuItemPunkuClaim[];
  ROL_USUARIO: IPunkuRolUsuarioClaim[];
  SESION: IPunkuSessionClaim;
  USUARIO: IPunkuUserClaim;
  HasErrors: boolean;
  Messages: any[];
}
