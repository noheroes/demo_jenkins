export class OpenDrawer {
    static readonly type = '[AppUiState] Open Drawer';
}


export class CloseDrawer {
    static readonly type = '[AppUiState] Close Drawer';
}


export class OpenDrawerMobile {
    static readonly type = '[AppUiState] Open DrawerMobile';
}


export class CloseDrawerMobile {
    static readonly type = '[AppUiState] Close DrawerMobile';
}


export class SetIsMobile {
    static readonly type = '[AppUiState] Set IsMobile';
    constructor(public value: boolean) { }
}

export class SetAppMenu {
    static readonly type = '[AppUiState] SetAppMenu';
    constructor(public punkuMenu: any[], public tokenUser: string = null) { }
}

export class SetBlockUi {
    static readonly type = '[AppUiState] SetBlockUi';
    constructor(public show: boolean) { }
}

export class AttachDrawer {
    static readonly type = '[AppUiState] AttachDrawer';
}
export class DetachDrawer {
    static readonly type = '[AppUiState] DetachDrawer';
}
