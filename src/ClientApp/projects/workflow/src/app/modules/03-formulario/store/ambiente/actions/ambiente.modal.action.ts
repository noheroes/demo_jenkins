import { FormType } from '@sunedu/shared';
import { IModalAmbiente, IFormAmbiente } from '../ambiente.store.interface';
import update from 'immutability-helper';
import { of, Observable, Subscription, throwError } from 'rxjs';
import { AmbienteService } from '../../../service/ambiente.service';
import { ModalAmbiente } from '../ambiente.store.model';
import { map, tap, catchError } from 'rxjs/operators';
export class AmbienteModalActions {
  constructor(
    private getState: () => IModalAmbiente,
    private setState: (newState: IModalAmbiente) => void,
    private ambienteService: AmbienteService
  ) {

  }
  setModalEdit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoAmbiente: id,
      type: FormType.EDITAR,
      title: 'Modificar ambiente'
    });

  }
  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoAmbiente: id,
      type: FormType.CONSULTAR,
      title: 'Consulta ambiente'
    });
  }

  setModalNew = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false
    });
  }
  resetModalAmbiente = () => {
    this.setState(new ModalAmbiente());
  };

  private fetchLocalBegin = () => {
    this.setState(
      update(this.getState(), {
        comboLists: { locales: { loading: { $set: true } } }
      })
    );
  };

  private fetchLocalSucces = data => {
    this.setState(
      update(this.getState(), {
        comboLists: { locales: { $set: { list: data, loading: false } } }
      })
    );
  };

  asyncFetchLocal = () => {
    const source = of([{ 'text': 'SL01', 'value': 'value' }]);
    this.fetchLocalBegin();
    source.subscribe(value => {
      this.fetchLocalSucces(value);
    });
  }

  private fetchAmbienteBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchAmbienteSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataAmbiente = (data: any) => {
    this.fetchAmbienteSucces(data);
  }
  asynFetchAmbiente = (codigoAmbiente: string): Observable<IFormAmbiente> => {
    return this.ambienteService.getAmbiente(codigoAmbiente);
  }
  asynSaveAmbiente = (form: IFormAmbiente): Observable<IFormAmbiente> => {
    this.crudAmbienteBegin();
    return this.ambienteService.saveAmbiente(form).pipe(
      tap(x => {
        this.crudAmbienteSucces();
      }),
      catchError(error => {
        this.crudAmbienteSucces();
        return throwError(error);
      })
    );
  }

  asynUpdateAmbiente = (form: IFormAmbiente): Observable<IFormAmbiente> => {
    this.crudAmbienteBegin();
    return this.ambienteService.updateAmbiente(form).pipe(
      tap(x => {
        this.crudAmbienteSucces();
      }),
      catchError(error => {
        this.crudAmbienteSucces();
        return throwError(error);
      })
    );
  }

  private crudAmbienteBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudAmbienteSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
}
