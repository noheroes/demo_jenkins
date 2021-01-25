import { FormType } from '@sunedu/shared';
import { IVisorForm } from './visor.store.interface';

export class VisorForm implements IVisorForm {
    title = 'Visor';
    error = null;
    isLoading = false;
    type = FormType.REGISTRAR;
}

export class VisorStoreModel {
    IAppUser;
    visorForm: IVisorForm = new VisorForm()
}
