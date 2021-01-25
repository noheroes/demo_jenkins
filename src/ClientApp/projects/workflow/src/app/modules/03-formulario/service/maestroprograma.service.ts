import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MaestroProgramaService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;
  private urlPresentacionExternos: string = `${this.configuration.apiPresentacionAddress}/api/v1/external`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

  getFormatoByVersion = (idVersion: string): Observable<any> => {

    return this.http.post<any>(`${this.urlPresentacion}/GetFormatoByVersion`, { 'IdVersion': idVersion });
  }
  setGenerateFormato = (request: any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/setGenerateFormato`, request);
  }
  setUpdateFormato = (request: any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/setUpdateFormato`, request);
  }
  getCINE = (idOne:string,idTwo:string): Observable<any>  =>{

    //const urlDMZ64 = `https://md-dmz64-2.sunedu.gob.pe:4433/api/v1/Institucional/Programa`;
    const request = {
      idTblTipoNivelAcademico: idOne,
      idTblNivelAcademico:idTwo
    };

    return this.http.post<any>(`${this.urlPresentacionExternos}/getPrograma`, request);
    /*return this.http.get(urlDMZ64, {
        params: {
          IdTblTipoNivelAcademico: '1',
          IdTblNivelAcademico: '1'
        }
      });*/
/*
      .toPromise()
      .then(response => {
        //console.log('cine 3');
        //console.log(response);
      })
      .catch(console.log);
*/
      //resp = this.http.get<any>(urlDMZ64,{ 'params':params});
      /*
      resp = this.http.get(urlDMZ64,opts) // ...using post request
                         .map(res => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')) //...errors if
                         .subscribe();
                         */

  }
}
