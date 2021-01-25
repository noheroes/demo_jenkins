import { ComboList, FormType } from '@sunedu/shared';
import { IInicioProcedimiento } from '../../../interfaces/inicio.interface';
import { IModalIniciarProcedimiento } from './inicio.store.interface';


export class InicioProcedimiento implements IInicioProcedimiento {
    idEntidad = null;
    idProcedimiento = null;
}

export class ModalIniciarProcedimiento implements IModalIniciarProcedimiento {
    title = 'Seleccione el procedimiento a iniciar';
    error = null;
    isLoading = false;
    type = FormType.REGISTRAR;
    inicioProcedimiento = new InicioProcedimiento();
    tieneSubFlujo=false;
    filterLists = {
        entidad: new ComboList([]),
        solicitud:new ComboList([]),
        procedimiento: new ComboList([]),
        subFlujo: new ComboList([])
    };
}




export class InicioStoreModel {
    IAppUser;
    modalIniciarProcedimiento: IModalIniciarProcedimiento = new ModalIniciarProcedimiento()
}
