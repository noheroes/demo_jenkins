import { IAdministracionModelADM } from './administracion.interface';

export class AdministracionModel implements IAdministracionModelADM {
  formulario = {
    nombreProcedimiento: 'ADM',
    codigo: 'AAA',
    configuracionTabs: {
      configuracionEntidades: {
        code: 'ENT',
        name: 'Universidades',
        readOnly: false,
        visible: true,
        settings: {}
      },
      configuracionRepresentanteLegal: {
        code: 'RPL',
        name: 'Representante Legal',
        readOnly: false,
        visible: true,
        settings: {}
      }
    },
  };
}

export class AdministracionStoreModel {
  isLoading = false;
  error = null;
  formulario = new AdministracionModel();
}
