import { ISiuClaims } from './../../store/app.state.interface';
import { IPunkuClaims } from '../../interfaces/punku-claims.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PunkuService {
  /*
   * Url del gateway api.
   * Se setea en AppComponent, al cargar la configuracion
   */
  private baseProxyUrlService: string;

  constructor(private http: HttpClient) { }

  setBaseProxyUrl = (proxyUrl) => {
    if (!this.baseProxyUrlService) {
      this.baseProxyUrlService = `${proxyUrl}/api/v1`;
    }
  };

  login = (): Observable<{
    punkuClaims: IPunkuClaims;
    siuClaims: ISiuClaims;
   
  }> => {
    const path = `${this.baseProxyUrlService}/seguridad/sessionAllData`;
    return this.http.post<{ punkuClaims: IPunkuClaims; siuClaims: ISiuClaims }>(
      path,
      {}
    );
  };

  checkSession = (): Observable<{ authorized: boolean }> => {
    const path = `${this.baseProxyUrlService}/seguridad/checksession`;
    return this.http.post<{ authorized: boolean }>(path, {});
  };
}
