import { AppCurrentFlowStore } from '../store/app.currentFlow.store';
import * as uuid from 'uuid';

export class AppAudit {
  constructor(private storeCurrent: AppCurrentFlowStore) {}

  set<T>(objeto: T, isNew: boolean): T {
    if (objeto) {
      const { currentFlow } = this.storeCurrent.state;
      const idUsuario = currentFlow.idUsuario;
      const fecha = new Date().toISOString();

      if (isNew) {
        objeto['fechaCreacion'] = fecha;
        objeto['usuarioCreacion'] = idUsuario.toUpperCase();
        objeto['esActivo'] = true;
        objeto['esEliminado'] = false;
        objeto['tipoOperacion'] = "R";//Registro
        objeto['token'] = uuid.v4(); //Token
      } else {
        objeto['usuarioModificacion'] = idUsuario.toUpperCase();
        objeto['fechaModificacion'] = fecha;
        objeto['tipoOperacion'] = "M"; //Modificacion
      }
    }
    return objeto;
  }
  setInsert<T>(objeto: T, includeId: boolean = false): T {
    const obj = this.set(objeto, true);
    if (includeId && objeto) {
       obj['id'] = uuid.v4();
    }
    return obj;
  }
  setUpdate<T>(objeto: T): T {
    return this.set(objeto, false);
  }
  setDelete<T>(objeto: T): T {
    const obj = this.set(objeto, false);
    if (objeto) {
      obj['esEliminado'] = true;
      obj['esActivo'] = false;
      obj['tipoOperacion'] = "E"; //Eliminacion
    }
    return obj;
  }
}
