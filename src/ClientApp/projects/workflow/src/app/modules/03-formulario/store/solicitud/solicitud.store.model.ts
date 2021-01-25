import { Formato } from '../formato/formato.store.model';
import { FormatoCurso } from '../formato/formatocurso.store.model';

export class SolicitudStoreModel {
  formato: Formato = new Formato();
  formatoCurso: FormatoCurso = new FormatoCurso();
}
