import { FormType } from '@sunedu/shared';
import { IComentario } from './mediosverificacion.store.interface';


export interface IFormMediosVerificacionComentarios{
  comentarios:string;
}


export interface IMediosVerificacionComentarios{
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  comentarios:IComentario[];
  form: Partial<IFormMediosVerificacionComentarios>;
}
