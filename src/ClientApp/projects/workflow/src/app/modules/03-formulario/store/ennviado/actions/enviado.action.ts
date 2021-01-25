import { IFormularioModel } from './../../../../../../../../../src/app/core/interfaces/formulario-model.interface';
import { IEnviadoConsultaGeneral } from '../enviado.store.interface';
//import { DocumentoService } from '../../../service/documento.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import update from 'immutability-helper';
import { isNullOrUndefined } from 'util';
import { ComboList } from '@sunedu/shared';
import { DocumentoEnviadoService } from '../../../service/documento-enviado.service';

export class EnviadoActions {

  constructor(
    private getState: () => IEnviadoConsultaGeneral,
    private setState: (newState: IEnviadoConsultaGeneral) => void,
    private documentoEnviadoService: DocumentoEnviadoService
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

  asyncFetchDocumentoEnviado = () =>{
    this.fetchBegin();
    return this.documentoEnviadoService.getEnviados().pipe(
      tap(response => {
        //console.log('CAYL getEnviados',response);
        //this.setFasesOrigen(response.fasesOrigen, mensajes);
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

  // asyncDownLoadDocumento(idArchivo: string, version: number) {
  //   this.fetchBegin();
  //   this.documentoEnviadoService.downloadDocumento(idArchivo, version)
  //     .subscribe(
  //       info => { this.fetchSucces(); },
  //       error => { this.fetchError(error); return throwError(error); });
  // }

  // asyncDeleteDocumento(trackingNumber: string, idUsuario: string, idAplicacion: string) {
  //   this.fetchBegin();
  //   return this.documentoEnviadoService.deleteDocumento(trackingNumber, idUsuario, idAplicacion).pipe(
  //     tap(response => {
  //       // console.log(response);
  //       this.fetchSucces();
  //     }),
  //     catchError(error => {
  //       this.fetchError(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // asyncGetFileInfo(id:string, version:number){
  //   this.fetchBegin();
  //   console.log(id);
  //   console.log(version);
  //   return this.documentoEnviadoService.getFileInfo(id,version).pipe(
  //     tap(response => {
  //       // console.log(response);
  //       this.fetchSucces();
  //     }),
  //     catchError(error => {
  //       this.fetchError(error);
  //       return throwError(error);
  //     })
  //   );
  // }

}
