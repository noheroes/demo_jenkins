//import { DocumentoService } from './../../../service/documento.service';
import { IModalDocumentosOperacion } from './../documentos-operacion.store.interface';
import { FormType } from '@sunedu/shared';
import { DocumentosOperacionService } from '../../../service/documentos-operacion.service';
import { formatCurrency } from '@angular/common';
import update from 'immutability-helper';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class DocumentosOperacionModalActions {
    
    constructor(
        private getState: () => IModalDocumentosOperacion,
        private setState: (newState: IModalDocumentosOperacion) => void,
        private documentosOperacionService: DocumentosOperacionService
      ) {}
    
    setModalAdd =  (tipo:any) => {
        const state = this.getState();
        this.setState({
            ...state,
            isLoading: false,
            tipo: tipo,
            type: FormType.REGISTRAR,
            title: 'Agregar Documento',
            form : {
                nombreOficial:null,
                numero:null,
                fechaEmision:null,
                descripcion:null
            }
        });
    }

    setModalEdit =  (tipo:any, nombreOficial:string, numero:string, fechaEmision:string, descripcion:string) => {
        const state = this.getState();
        this.setState({
            ...state,
            isLoading: false,
            tipo: tipo,
            type: FormType.EDITAR,
            title: `Modificar Documento`, //- ${tipo.text} - ${nombre}`
            form: {
                nombreOficial,
                numero,
                fechaEmision,
                descripcion
            }
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

  asyncFetchDocumentosGetById = (idDocumento:string) =>{
    this.fetchBegin();
    return this.documentosOperacionService.getDocumentoById(idDocumento).pipe(
      tap(response => {
        console.log('CAYL asyncFetchDocumentosGetById',response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncFetchRegistrarRTD = (parametros:any) =>{
    this.fetchBegin();
    return this.documentosOperacionService.setRegistrarRTD(parametros).pipe(
      tap(response => {
        console.log('CAYL asyncFetchRegistrarRTD',response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

}