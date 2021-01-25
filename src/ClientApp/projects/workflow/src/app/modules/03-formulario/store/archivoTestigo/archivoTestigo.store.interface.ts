import { IFormularioModel } from '@lic/core';

export interface IArchivoTestigo {
  isLoading: boolean;
  error: any;
  isSolicitud: string;
  modelData: IFormularioModel;    
}