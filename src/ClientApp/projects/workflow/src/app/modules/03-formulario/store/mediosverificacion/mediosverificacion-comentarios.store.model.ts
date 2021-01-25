import { IFormMediosVerificacionComentarios, IMediosVerificacionComentarios } from './mediosverificacion-comentarios.store.interface';
import { FormType } from '@sunedu/shared';

export class FormMediosVerificacionComentarios implements IFormMediosVerificacionComentarios{
  comentarios='';
}

export class MediosVerificacionComentarios implements IMediosVerificacionComentarios{
  title='Medio de Verificación - Comentarios';
  isLoading= false;
  error=null;
  type=FormType.CONSULTAR;
  form = new FormMediosVerificacionComentarios();
  comentarios=[];
}

export class MediosVerificacionComentariosStoreModel{
  mediosVerificacionComentarios = new MediosVerificacionComentarios();
}
