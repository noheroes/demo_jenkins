import { IFormularioModel } from './../../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IBandejaDocumentosConsulta, IFormBuscardorDocumentoConsulta } from '../documentos-consulta.store.interface';
//import { DocumentoService } from '../../../service/documento.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, of, Observable } from 'rxjs';
import update from 'immutability-helper';
import { ComboList, IDataGridPageRequest } from '@sunedu/shared';
import { DocumentosConsultaService } from '../../../service/documentos-consulta.service';

export class DocumentosConsultaBuscadorActions {

  constructor(
    private getState: () => IBandejaDocumentosConsulta,
    private setState: (newState: IBandejaDocumentosConsulta) => void,
    private documentosConsultaService: DocumentosConsultaService
  ) { }

  setInit = (form: IFormBuscardorDocumentoConsulta) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: form
    });
  }

  getSubtiposDocumento(){
    const subTiposDocumento = this.getState().subTiposDocumento;
    if(subTiposDocumento.length){
      let list=[];
      subTiposDocumento.map(item=>{
        list.push({
          text:`${item.desc}`,
          value:item.id
        });
      });
      let combo = new ComboList(list);
      return of(combo);
    }else{
      return of(new ComboList([]));
    }
  }

  getTipoBandeja(){
    let list=[];
    list.push({
      text: 'ENVIADO',
      value: "E"
    });
    list.push({
      text:'RECIBIDO',
      value: 'R'
    });
    let combo = new ComboList(list);
    return of(combo);
  }
  
  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  private fetchPageSucces = (items: any, total: number, pageRequest: IDataGridPageRequest, subTiposDocumento:any) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = (items || [])
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    elementos.forEach(element => {
      element.descBandeja = element.usuarioAutorEsRolAdministrado?"Enviado":"Recibido";
    });
    // console.log('CAYL Elementos',elementos);
    // console.log('CAYL subTiposDocumento',subTiposDocumento);
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
          total: { $set: /*total*/elementos.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        },
        subTiposDocumento: {$set: subTiposDocumento}
      })
    );
    
  };

  private fetchPageBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchPageError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }



  /** BANDEJA */
  asyncFetchPageDocumentosConsulta = (
    pageRequest: IDataGridPageRequest 
    // = {
    //   page: this.getState().source.page,
    //   pageSize: this.getState().source.pageSize,
    //   orderBy: this.getState().source.orderBy,
    //   orderDir: this.getState().source.orderDir,
    // }
    ,
    filters:any): Observable<any> => {
    this.fetchPageBegin();
    return this.documentosConsultaService.getDocumentosConsulta(filters, pageRequest).pipe(
        tap(response => {
          console.log('CAYL getDocumentosConsulta',response);
          if(response.hasOwnProperty('documentos')){
            this.fetchPageSucces(response['documentos'].data, response.count, pageRequest, response['subtiposDocumento']);
          }else{
            this.setState(
              update(this.getState(), {
                isLoading: { $set: false }
              })
            );
          }

        }),
        catchError(error => {
          this.fetchPageError(error);
          return throwError(error);
        })
      );
  };


}
