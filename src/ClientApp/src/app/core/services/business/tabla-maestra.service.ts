import { Observable } from 'rxjs';
import { ConfigurationService } from '../infrastructure/configuration.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayToString } from '@sunedu/shared';

@Injectable({
  providedIn: 'root'
})
export class TablaMaestraService {

  private url: string = `${this.configuration.apiGatewayAddress}/api/v1`;

  constructor(private configuration: ConfigurationService, private http: HttpClient) {
  }

  listar = (idTipoTabla: number, codigoPadre: string = ''): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listaMaestroDetalleConId`, {
      params: {
        tipoTabla: `${idTipoTabla}`,
        codigoPadre: `${codigoPadre}`
      } });
  }

  listarItems = (tablaMaestraNombre: string = null, codigoPadre: number = 1, sortField: string = null, sortDir: string = null): Observable<any> => {

    return this.http.get(`${this.url}/TablaMaestra/ListarSelectListItem`, {
      params: {
        sortField: `${sortField}` ,
        sortDir: `${sortDir}` ,
        [`${'filter.tablaMaestraNombre'}`]: `${tablaMaestraNombre}`,
        [`${'filter.codigoPadre'}`]: `${codigoPadre}`,
  } });
  }

  listarItemsDependiente = (idTablaMaestra: number = null, codigosPadre: string = null): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listarItemsDependientes`, {
      params: {
        [`${'idTablaMaestra'}`]: `${idTablaMaestra}`,
        [`${'codigosPadre'}`]: `${codigosPadre}`,
      }
    });
  }

  listarPrograma = (idTblTipoNivelAcademico: number, idTblNivelAcademico: number): Observable<any> => {
    return this.http.get(`${this.url}/Programa/ListarItem`, {
      params: {
        idTblTipoNivelAcademico: `${idTblTipoNivelAcademico}`,
        idTblNivelAcademico: `${idTblNivelAcademico}`
      } });
  }

  listarDependienteSelectListItem = (tablaMaestraPrincipal: string = null, codigoPrincipal: number = null, tablaMaestraDependiente: string = null): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listarDependienteSelectListItem`, {
      params: {
        tablaMaestraPrincipal: tablaMaestraPrincipal,
        codigoPrincipal: codigoPrincipal ? `${codigoPrincipal}` : '',
        tablaMaestraDependiente: tablaMaestraDependiente
      }
    });
  }

  listarNombreTablaMaestra = (idTblModuloMenu: number = null, idTblOpcionMenu: number = null): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listarNombreTablaMaestra`, {
      params: {
        [`${'idTblModuloMenu'}`]: `${idTblModuloMenu}`,
        [`${'idTblOpcionMenu'}`]: `${idTblOpcionMenu}`,
      }
    });
  }

  // listarItemesEspecificos = (idTipoTabla: number, codEntidad: string = ''): Observable<any> => {
  //  return this.http.get(`${this.url}/TablaMaestra/listaItemsEspecificoAsync`, {
  //    params: {
  //      idTabla: `${idTipoTabla}`,
  //      codEntidad: `${codEntidad}`
  //    }
  //  });
  // }

  listarItemesEspecificosById = (idTipoTabla: number, idEntidad: number, idTblEstado: number): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listaItemsEspecificoByIdAsync`, {
      params: {
        idTabla: `${idTipoTabla}`,
        idEntidad: `${idEntidad}`,
        idTblEstado: `${idTblEstado}`
      }
    });
  }


  listarItemesEspecificosByIds = (idTipoTabla: number, entidades: any): Observable<any> => {
    const idsEntidad = arrayToString(entidades);
    return this.http.get(`${this.url}/TablaMaestra/listaItemsEspecificoByIdsAsync`, {
      params: {
        idTabla: `${idTipoTabla}`,
        idEntidad: `${idsEntidad}`
      }
    });
  }

  listarTablas = (): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listaTablaAsync`);
  }

  // Acceso a Datos
  listarItemsAccesoDato = (tipoTabla:number): Observable<any> => {
    return this.http.get(`${this.url}/TablaMaestra/listViewItemsSecurity`, {
      params:{
        accion:'CON',
        subOpcion: 'generales',
        orderField: 'orden',
        orderDir: 'asc',
        tipoTabla: `${tipoTabla}`

      }
    });
  }


}

