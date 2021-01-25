import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import update from 'immutability-helper';
import { IArchivoTestigo } from '../archivoTestigo.store.interface';
import { ArchivoTestigoService } from '../../../service/archivoTestigo.service';
import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';

export class FirmarArchivoTestigoActions {
  constructor(
    private getState: () => IArchivoTestigo,
    private setState: (newState: IArchivoTestigo) => void,
    private archivoTestigoService: ArchivoTestigoService
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
    return this.archivoTestigoService.setReplicateToFtp(current).pipe(
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
    return this.archivoTestigoService.setReplicateFromFtp(current).pipe(
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
