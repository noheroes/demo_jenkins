import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';
import {
  IMediosVerificacion,
  ITreeNode,
} from '../mediosverificacion.store.interface';
import { MediosVerificacionService } from '../../../service/mediosverificacion.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import update from 'immutability-helper';
import { isNullOrUndefined } from 'util';
import { ICurrentFlow } from 'src/app/core/store/app.state.interface';

export class FirmarMediosVerificacionActions {
  constructor(
    private getState: () => IMediosVerificacion,
    private setState: (newState: IMediosVerificacion) => void,
    private mediosVerificacionService: MediosVerificacionService
  ) {}

  setInit = (modelData: IFormularioModel) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      modelData,
    });
  };

  asyncReplicateToFtp = (current: any) => {
    this.showLoading(true);
    return this.mediosVerificacionService.setReplicateToFtp(current).pipe(
      tap((x) => {
        this.showLoading(false);
        return x;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  };
  asyncReplicateFromFtp = (current: any) => {
    this.showLoading(true);
    return this.mediosVerificacionService.setReplicateFromFtp(current).pipe(
      tap((x) => {
        this.showLoading(false);
        return x;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  };

  asyncGetEstadoFirma = (current:any) =>{
    this.showLoading(true);
    const parametros = {
      idProceso: current.idProceso,
      idUsuario: current.idUsuario
    }
    //console.log('CAYL parametros', parametros);
    return this.mediosVerificacionService.getEstadoFirma(parametros).pipe(
      tap((x) => {
        console.log('CAYL getEstadoFirma',x);
        this.showLoading(false);
        return x;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncSetUpdateEstadoFirma = (current:any, tipoFirma:number) =>{
    this.showLoading(true);
    const parametros = {
      idProceso: current.idProceso,
      tipoFirma:tipoFirma,
      idUsuario: current.idUsuario,
      idTipoUsuario:current.idTipoUsuario
    }
    //console.log('CAYL parametros', parametros);
    return this.mediosVerificacionService.setUpdateEstadoFirma(parametros).pipe(
      tap((x) => {
        //console.log('CAYL setUpdateEstadoFirma',x);
        this.showLoading(false);
        return x;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  private showLoading = (value: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: value },
      })
    );
  };
  private fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error },
      })
    );
  };
}
