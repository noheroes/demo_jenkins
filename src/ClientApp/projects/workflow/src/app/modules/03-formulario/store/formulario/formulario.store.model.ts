
import { IFormularioModel, IActividadModel } from '@lic/core';
import { IActividadFormularioModel } from './actividad-model.interface';

export class FormularioModel implements IFormularioModel{
    // id = null;
    // idSolicitud = null;
    // idProceso = null;
    // idProcesoBandeja = null;
    solicitud = null;
    // actividad = null;
    // metadata = null;
    // derivador = null;
    cabecera = null;
    formulario = null;
    derivadorModel = null;
    detalleBandeja = null;
    tareas = null;
}

// export class ActividadFormularioModel implements IActividadFormularioModel {
//     isLoading: false;
//     error: null;
//     formulario: IFormularioModel = new FormularioModel();
// }

export class FormularioStoreModel {
    actividadFormulariosModel: IActividadFormularioModel = {
        isLoading : false,
        error: null,
        formulario: new FormularioModel()
    };
}
