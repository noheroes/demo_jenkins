import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CargaMasivaService {    
    private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/cargaMasiva`;
    private notify = new Subject<any>();
    notifyObservable$ = this.notify.asObservable();
    constructor(
        private configuration: ConfigurationService,
        private http: HttpClient
    ) {}

    downloadFile = (
        nombreArchivo: string,
        esPlantilla: boolean,
        idArchivo: string  
      ): Observable<any> => {
        const params = {
          idArchivo: `${idArchivo}`,
          nombre: `${nombreArchivo}`,
          esPlantilla: `${esPlantilla}`          
        };        
        return this.http
          .get(`${this.urlPresentacion}/download`, {
            params,
            responseType: 'blob' as 'json',
          })
          .pipe(
            map((response: any) => {
              const binaryData = [];
              binaryData.push(response);
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: response.type })
              );
              downloadLink.setAttribute('download', `${nombreArchivo}`);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            })
          );
      };

      setInsertCargaMasiva = (request: any): Observable<any> => {           
        return this.http.post<any>(`${this.urlPresentacion}/insert`, request);
      }      

      getCargaMasivaAll = (idVersion: string): Observable<any> => {        
        return this.http.post<any>(`${this.urlPresentacion}/getCargaMasivaAll`, { idVersion: idVersion });
      }

      public clearDataArchivo() {       
        this.notify.next();       
      }
}
