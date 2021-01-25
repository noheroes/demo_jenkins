import { ExternalUbigeoService } from '../../../../service/external/external.ubigeo.service';
import { Observable, of } from 'rxjs';
import { ComboList } from '@sunedu/shared';
import { ExternalPaisService } from '../../../../service/external/external.paisservice';
import { IPaises, IPais } from '../pais.interface';
import { tap, map } from 'rxjs/operators';

export class PaisActions {
  constructor(
    private getState: () => IPaises,
    private setState: (newState: IPaises) => void,
    private paisService: ExternalPaisService,
  ) {
  }
  asyncGetPaisTodos(): Observable<ComboList> {
    return this.paisService.listarPaises().pipe(map(reponse => {
      return new ComboList(reponse.map(item => ({ 'text': item.nombre.toUpperCase(), 'value': item.codigo })), false);
    }));
  }
}

