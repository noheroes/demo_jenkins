import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IListaLocal} from './listalocal.store.interface';

export class  ListaLocal implements IListaLocal {
    comboLists = {
        locales: new ComboList([{ 'text': 'locales 1', 'value': '1' }]),
      };
}

export class ListaLocalStoreModel {
    listaLocal = new ListaLocal();
  }