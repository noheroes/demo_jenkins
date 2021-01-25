import { IFormularioModel } from './../../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IDocumentosConsultaForm } from '../documentos-consulta.store.interface';
//import { DocumentoService } from '../../../service/documento.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import update from 'immutability-helper';
import { isNullOrUndefined } from 'util';
import { ComboList, IDataGridPageRequest } from '@sunedu/shared';
import { DocumentosConsultaService } from '../../../service/documentos-consulta.service';

export class DocumentosConsultaActions {

  constructor(
    private getState: () => IDocumentosConsultaForm,
    private setState: (newState: IDocumentosConsultaForm) => void,
    private documentosConsultaService: DocumentosConsultaService
  ) {


  }

  setInit = (modelData: IFormularioModel) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      modelData: modelData,
    });
  }


  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }

  private fetchSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }

  private fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }

  asyncDownLoadDocumentoConsulta(idArchivo: string, version: number) {
    this.fetchBegin();
    this.documentosConsultaService.downloadDocumento(idArchivo, version)
      .subscribe(
        info => { this.fetchSucces(); },
        error => { this.fetchError(error); return throwError(error); });
  }


  // asyncFetchDocumentosConsulta = () =>{
  //   this.fetchBegin();
  //   return this.documentosConsultaService.getDocumentosConsulta().pipe(
  //     tap(response => {
  //       console.log('CAYL getDocumentosConsulta',response);
  //       //this.setFasesOrigen(response.fasesOrigen, mensajes);
  //       this.fetchSucces();
  //     }),
  //     catchError(error => {
  //       this.fetchError(error);
  //       return throwError(error);
  //     })
  //   );
  // }


}
