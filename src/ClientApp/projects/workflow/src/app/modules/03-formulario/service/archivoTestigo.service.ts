import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ArchivoTestigoService {  
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  constructor(    
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {
  }  

  setReplicateToFtp = (current: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/archivoTestigo/replicate`,
      current
    );
  };
  setReplicateFromFtp = (current: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/archivoTestigo/import`,
      current
    );
  };
}
