import { IModalRepresentanteLegal, IFormRepresentanteLegal } from '../datosgenerales.store.interface';
import { DatosGeneralesService } from '../../../service/datos-generales.service';
import { FormType } from '@sunedu/shared';
import { ModalRepresentanteLegal } from '../datosgenerales.store.model';
import update from 'immutability-helper';
import { of, from, Observable, throwError } from 'rxjs';
import { RepresentanteLegalService } from '../../../service/representantelegal.service';
import { tap, catchError } from 'rxjs/operators';
import { DatosGeneralesActions } from './datosgenerales.action';

export class RepresentantenLegalModalActions {

  constructor(
    private getState: () => IModalRepresentanteLegal,
    private setState: (newState: IModalRepresentanteLegal) => void,
    private representanteLegalService: RepresentanteLegalService
  ) { }

  setModalEdit = (tipo:string, id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      tipoDocumento: tipo,
      numeroDocumento: id,
      type: FormType.EDITAR,
      title: 'Datos asociados al Representante Legal'
    });

  }
  setModalReadOnly = (tipo:string, id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      tipoDocumento:tipo,
      numeroDocumento: id,
      type: FormType.CONSULTAR,
      title: 'Consulta datos representante legal'
    });
  }

  setModalNew = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false
    });
  }
  resetModalRepresentanteLegal = () => {
    this.setState(new ModalRepresentanteLegal());
  };

  private fetchDocumentosBegin = () => {
    this.setState(
      update(this.getState(), {
        comboLists: { tipoDocumentos: { loading: { $set: true } } }
      })
    );
  };

  private fetchDocumentosSucces = data => {
    this.setState(
      update(this.getState(), {
        comboLists: { tipoDocumentos: { $set: { list: data, loading: false } } }
      })
    );
  };

  asyncFetchDocumentos = () => {
    const source = from([
      { 'text': 'DNI', 'value': '1' },
      { 'text': 'Carnet Extranjeria', 'value': '2' }
    ]);
    this.fetchDocumentosBegin();
    source.subscribe(value => {
      this.fetchDocumentosSucces(value);
    });
  }

  private fetchRepresentanteLegalBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchRepresentanteLegalSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataRepresentanteLegal = (data: any) => {
    // console.log(data);
    this.fetchRepresentanteLegalSucces(data);
  }

  asynSaveRepresentanteLegal = (form: IFormRepresentanteLegal): Observable<IFormRepresentanteLegal> => {
    this.crudRepresentanteLegalBegin();
    return this.representanteLegalService.saveRepresentanteLegal(form).pipe(
      tap(x => {
        this.crudAmbienteSucces();
      }),
      catchError(error => {
        this.crudAmbienteSucces();
        return throwError(error);
      })
    );
  }

  asynUpdateRepresentanteLegal = (form: IFormRepresentanteLegal): Observable<IFormRepresentanteLegal> => {
    this.crudRepresentanteLegalBegin();
    return this.representanteLegalService.updateRepresentanteLegal(form).pipe(
      tap(x => {
        this.crudAmbienteSucces();
      }),
      catchError(error => {
        this.crudAmbienteSucces();
        return throwError(error);
      })
    );
  }

  private crudRepresentanteLegalBegin = () => {
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
