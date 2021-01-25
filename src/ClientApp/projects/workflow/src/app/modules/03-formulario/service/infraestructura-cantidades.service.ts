import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormInfraestructura, IGridBuscardorInfraestructura, IFormBuscardorInfraestructura } from '../store/infraestructura/infraestructura.store.interface';

/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class InfraestructuraCantidadesService {
    private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;
    private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formatoDetalle/version`;
    constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

    setUpdateFormatoDetalle = (request: any): Observable<any> => {
        return this.http.post<any>(`${this.urlPresentacion}/SetFormatoDetalleByVersionSedeFilial`, request);
    }
    getFormatoDetalleByVersion = (idVersion: string, idSedeFilial: string): Observable<any> => {
      return this.http.post<any>(`${this.urlPresentacion}/sedeFilial`, { 'IdVersion': idVersion, 'idSedeFilial': idSedeFilial });
    }
    getInfraestructura = (codigoAmbiente: string): Observable<IFormInfraestructura> => {
    return new Observable<IFormInfraestructura>((observer) => {
        const handler = (e) => observer.next(e);
        setTimeout(() => {
        return handler({
            totalLaboratorioComputo: '1',
            totalLaboratorioEnsenianza: '1',
            totalTalleresEnsenianza: '1',
            totalBibliotecas: '1',
            totalAulas: '1',
            totalAmbientesDocentes: '1',
            totalTopico: '1',
            denominacionAmbientesComplementarios: '1',
            denominacionAmbientesServicioUniversitario: '1',
            comentarios: '',
        });
        }, 750);
    });
    // return this.http.get<IFormAmbiente>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
    }

}
