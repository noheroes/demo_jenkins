import { IServerConfig } from '@lic/core';

export class SetLoading {
    static readonly type = '[GlobalConfig] Set Loading';
    constructor(public show: boolean) { }
}

export class GlobalBegin {
    static readonly type = '[GlobalConfig] Global Begin';
}
export class GlobalConfigSuccess {
    static readonly type = '[GlobalConfig] Success From Server';
    constructor(public configuration: IServerConfig) { }
}

export class GlobalConfigError {
    static readonly type = '[GlobalConfig] Error From Server';
}

export class GetGlobalConfig {
    static readonly type = '[GlobalConfig] Get Global config From Server';
}
