import { Store } from './../../../../../../../../src/app/core/store/store';
import { Injectable } from "@angular/core";


import { MediosVerificacionComentariosStoreModel } from "./mediosverificacion-comentarios.store.model";
import { MediosVerificacionComentariosActions } from "./actions/mediosverificacion-comentarios.action";
import { MediosVerificacionService } from "../../service/mediosverificacion.service";

@Injectable()
export class MediosVerificacionComentariosStore extends Store<MediosVerificacionComentariosStoreModel> {
  mediosVerificacionComentariosActions: MediosVerificacionComentariosActions;

  constructor(mediosVerificacionService: MediosVerificacionService) {
    super(new MediosVerificacionComentariosStoreModel());

    this.mediosVerificacionComentariosActions = new MediosVerificacionComentariosActions(
      this.buildScopedGetState('mediosVerificacionComentarios'),
      this.buildScopedSetState('mediosVerificacionComentarios'),
      mediosVerificacionService
    );
  }
}
