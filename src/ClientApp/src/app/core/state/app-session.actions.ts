import {
  IAppPermission,
  IAppPermissions,
  IAppSession,
  IAppUser,
  IAppUserRol,
  ICurrentMenu,
  ISiuClaims,
} from '../store/app.state.interface';
import { IPunkuClaims } from '../interfaces/punku-claims.interface';

export class SetSessionFromStorage {
  static readonly type = '[Session] SetSessionFromStorage';
  constructor(public session: IAppSession) {}
}

export class SetNewToken {
  static readonly type = '[Session] SetNewToken';
  constructor(public token: string) {}
}

export class SetAuthToken {
  static readonly type = '[Session] SetAuthToken';
  constructor(public token: string, public returnUrl: string) {}
}

export class LoginBegin {
  static readonly type = '[Session] LoginBegin';
}

export class LoginSuccess {
  static readonly type = '[Session] LoginSuccess';
  constructor(public punkuClaims: IPunkuClaims, public siuClaims: ISiuClaims) {}
}

export class LoginError {
  static readonly type = '[Session] LoginError';
}

export class SetCurrentMenu {
  static readonly type = '[Session] SetCurrentMenu';
  constructor(public url: string) {}
}

export class Logout {
  static readonly type = '[Session] Logout';
}

export class SetSessionExpired {
  static readonly type = '[Session] SetSessionExpired';
}

export class AsyncLogin {
  static readonly type = '[Session] AsyncLogin';
}

export class AsyncCheckSession {
  static readonly type = '[Session] AsyncCheckSession';
}
