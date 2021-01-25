import { IArchivoTestigo } from './archivoTestigo.store.interface';
import { IFormularioModel } from '@lic/core';

export class ArchivoTestigo implements IArchivoTestigo {
  isLoading = false;
  error = null;
  isSolicitud = null;  
  modelData: IFormularioModel = null;   
}

export class ArchivoTestigoStoreModel {
    archivoTestigo = new ArchivoTestigo(); 
}
