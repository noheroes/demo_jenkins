export interface IAdministracionADM {
  nombreProcedimiento: string;
  codigo: string;
  configuracionTabs: IConfiguracionTabs;
}

export interface IAdministracionModelADM {
  formulario: IAdministracionADM;
}

export interface IConfiguracionTabs {
  configuracionEntidades: any;
  configuracionRepresentanteLegal: any;
}
