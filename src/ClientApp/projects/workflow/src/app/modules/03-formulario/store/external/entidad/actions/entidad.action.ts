import { ExternalUbigeoService } from '../../../../service/external/external.ubigeo.service';
import { Observable, of } from 'rxjs';
import { ComboList } from '@sunedu/shared';
import { ExternalEntidadService } from '../../../../service/external/external.entidad.service';
import { tap, map } from 'rxjs/operators';
import { IEntidades } from '../entidad.interface';

export class EntidadActions {
  constructor(
    private getState: () => IEntidades,
    private setState: (newState: IEntidades) => void,
    private entidadService: ExternalEntidadService,
  ) {
  }
  asyncGetEntidad(codigoTipoAutorizacionEntidad: string, codigoEstadoVigenciaEntidad: number): Observable<ComboList> {
    return this.entidadService.listarEntidades(codigoTipoAutorizacionEntidad, codigoEstadoVigenciaEntidad).pipe(map(reponse => {
      return new ComboList(reponse.map(item => ({ 'text': item.nombreEntidad.toUpperCase(), 'value': item.codigoEntidad })), false);
    }));
  }
}

