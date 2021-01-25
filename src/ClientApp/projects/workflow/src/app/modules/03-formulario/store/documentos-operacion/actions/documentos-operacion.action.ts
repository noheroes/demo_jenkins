import { IFormularioModel } from './../../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IDocumentosOperacionForm, ITipoDocumentos } from '../documentos-operacion.store.interface';
//import { DocumentoService } from '../../../service/documento.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, of, Observable, concat } from 'rxjs';
import update from 'immutability-helper';
import { isNullOrUndefined } from 'util';
import { ComboList } from '@sunedu/shared';
import { DocumentosOperacionService } from '../../../service/documentos-operacion.service';

export class DocumentosOperacionActions {

  constructor(
    private getState: () => IDocumentosOperacionForm,
    private setState: (newState: IDocumentosOperacionForm) => void,
    private documentosOperacionService: DocumentosOperacionService
  ) {


  }

  setInit = (modelData: IFormularioModel) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      modelData: modelData,
    });
  }

  setTipoDocumentos = (tiposDocumentos: ITipoDocumentos[]) =>{
    const state = this.getState();
    this.setState({
      ...state,
      tipoDocumentos: tiposDocumentos
    })
  }

  getTipoDocumentos(){
    const state = this.getState();
    const tiposF = state.tipoDocumentos;
    if(tiposF.length){
      let list=[];
      tiposF.map(item=>{
        if(item.esActivo){
          list.push({
            text:item.nombre,
            value:item.idSubtipo
          });
        }
      });
      let tipos = new ComboList(list);
      return of(tipos);
    }
    return null;
  }

  // setFasesOrigen = (fasesOrigen: IFaseOrigenDocumento[], mensajes: Object) => {
  //   const state = this.getState();

  //   fasesOrigen.forEach(f => {
  //     f.documentosFase.forEach(d => {

  //     });
  //   });

  //   this.setState({
  //     ...state,
  //     fasesOrigen: fasesOrigen
  //   })

  // };
  // getFasesOrigen = () => {
  //   const state = this.getState();
  //   return state.fasesOrigen;
  // };

  // setTipoDocumentos = (tiposDocumentos: ITipoDocumentos[]) =>{
  //   const state = this.getState();
  //   this.setState({
  //     ...state,
  //     tipoDocumentos: tiposDocumentos
  //   })
  // }

  // getTipoDocumentos(){
  //   const state = this.getState();
  //   const tiposF = state.tipoDocumentos;
  //   if(tiposF.length){
  //     let list=[];
  //     tiposF.map(item=>{
  //       if(item.esActivo){
  //         list.push({
  //           text:item.nombre,
  //           value:item.idSubtipo
  //         });
  //       }
  //     });
  //     let tipos = new ComboList(list);
  //     return of(tipos);
  //   }
  //   return null;
  // }


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

  asyncFetchDocumentosOperacion = (parametros:any) =>{
    this.fetchBegin();
    return this.documentosOperacionService.getDocumentosOperacion(parametros).pipe(
      tap(response => {
        //console.log('CAYL getDocumentosOperacion',response);
        //this.setFasesOrigen(response.fasesOrigen, mensajes);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncFetchTipoDocumentosByid = (subtipos:number[]) =>{
    this.fetchBegin();
    return this.documentosOperacionService.getTiposDocumentosById(subtipos).pipe(
      tap(response=>{
        this.setTipoDocumentos(response['subtipos'])
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  // asyncFetchDocumentosByFaseOrigen = (idSolicitudVersion: string, mensajes: Object, retornar:boolean) => {
  //   this.fetchBegin();
  //   return this.documentoEnviadoService.getDocumentosByFaseOrigen(idSolicitudVersion, retornar).pipe(
  //     tap(response => {
  //       this.setFasesOrigen(response.fasesOrigen, mensajes);
  //       this.fetchSucces();
  //     }),
  //     catchError(error => {
  //       this.fetchError(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // asyncFetchTipoDocumentosByid = (subtipos:number[]) =>{
  //   this.fetchBegin();
  //   return this.documentoEnviadoService.getTiposDocumentosById(subtipos).pipe(
  //     tap(response=>{
  //       this.setTipoDocumentos(response['subtipos'])
  //       this.fetchSucces();
  //     }),
  //     catchError(error => {
  //       this.fetchError(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  asyncDownLoadDocumentoOperacion(idArchivo: string, version: number) {
    this.fetchBegin();
    this.documentosOperacionService.downloadDocumento(idArchivo, version)
      .subscribe(
        info => { this.fetchSucces(); },
        error => { this.fetchError(error); return throwError(error); });
  }

  asyncDeleteDocumentoOperacion(parametros:any) {
    this.fetchBegin();
    return this.documentosOperacionService.deleteDocumentoOperacion(parametros).pipe(
      tap(response => {
        // console.log(response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncGetFileInfo(id:string, version:number){
    this.fetchBegin();
    console.log(id);
    console.log(version);
    return this.documentosOperacionService.getFileInfo(id,version).pipe(
      tap(response => {
        // console.log(response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncDownLoadPlantilla(idSubtipoDocumento: number){
    this.fetchBegin();
    return new Promise(
      (resolve)=>{ 
        this.documentosOperacionService.downloadPlantilla(idSubtipoDocumento)
        .subscribe(
          info => { 
            this.fetchSucces(); 
            resolve(info);},
          error => {
            //console.log('CAYL asyncDownLoadPlantilla error', error); 
            this.fetchError(error); 
            // const result = concat(of(7), throwError(new Error('oops!')));
            // result.subscribe(x => console.log(x), e => console.error(e));
            // resolve(error);
            return resolve(throwError(error)); 
          });
         
    });
    
  }

  asyncReplicateToFtp = (current: any) => {
    this.showLoading(true);
    return this.documentosOperacionService.setReplicateToFtp(current).pipe(
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
    return this.documentosOperacionService.setReplicateFromFtp(current).pipe(
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

}
