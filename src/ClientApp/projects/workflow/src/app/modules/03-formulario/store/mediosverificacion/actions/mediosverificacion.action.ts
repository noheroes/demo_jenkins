import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';
import { IMediosVerificacion, ITreeNode } from '../mediosverificacion.store.interface';
import { MediosVerificacionService } from '../../../service/mediosverificacion.service';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import update from 'immutability-helper';
import { isNullOrUndefined } from 'util';
import { formatDate } from '@angular/common';

export class MediosVerificacionActions {

  constructor(
    private getState: () => IMediosVerificacion,
    private setState: (newState: IMediosVerificacion) => void,
    private mediosVerificacionService: MediosVerificacionService
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

  setArbolCBC = (arbol: ITreeNode[], idAplicacion: string, mensajes: Object) => {
    const state = this.getState();
    // console.log(arbol);

    //let arbol = catalog['condiciones'];

    arbol.forEach(nivel1 => {
      // Opciones del Nivel 1 == CBC
      nivel1.id = `CBC ${nivel1.codigo}`;
      nivel1.isCompleteTask = false;

      if (nivel1.children.length > 0) {
        nivel1.children.forEach(nivel2 => {
          // Opciones del Nivel 2 == Com
          nivel2.id = `Com ${nivel2.codigo}`;
          nivel2.isCompleteTask = false;

          if (nivel2.children.length > 0) {
            nivel2.children.forEach(nivel3 => {
              // Opciones del Nivel 3 == Ind
              nivel3.id = `Ind ${nivel3.codigo}`;
              nivel3.isCompleteTask = false;

              if (nivel3.children.length > 0) {
                nivel3.children.forEach(nivel4 => {
                  // Opciones del Nivel 4 == MV

                  nivel4.id = `${nivel4.codigo}`;
                  nivel4.isCompleteTask = false;
                  nivel4.canDeleteUrl = false;
                  nivel4.hasDescriptionChild = nivel4.descripcion;
                  nivel4.descripcion = '';
                  nivel4.excludeTask = nivel4.tipo == 4 ? true : false;
                  nivel4.children = [];
                  nivel4.codigos = `CBC ${nivel1.codigo} - Com ${nivel2.codigo} - Ind ${nivel3.codigo}`;
                  

                  // Revisar contenidos
                  if (nivel4.tipo == 1 || nivel4.tipo == 3) {
                    if (nivel4.contenidos.length > 0) {
                      nivel4.contenidos.forEach(contenido => {
                        contenido.intentosRefresh = 0;
                        if (!isNullOrUndefined(contenido.contenidoArchivoMetadata)) {
                          contenido.esIdArchivo = contenido.contenidoArchivoMetadata.estadoRS == 1 ? true : false;
                          contenido.nombreArchivo = contenido.contenidoArchivoMetadata.archivoNombre;
                          contenido.idAplicacion = idAplicacion;
                          switch (contenido.contenidoArchivoMetadata.estadoRS) {
                            case 0:
                              contenido.esIdArchivo = false;
                              contenido.estado = "EN PROCESO";
                              nivel4.isCompleteTask = true;
                              contenido.contenidoArchivoMetadata.mensajeToolTip = mensajes['MV_PROCESO'];
                              break;
                            case 1:
                              contenido.esIdArchivo = true;
                              contenido.estado = "CARGADO";
                              //contenido.fechaArchivo = contenido.contenidoArchivoFileInfo.fechaCreacion;
                              contenido.fechaArchivo =contenido.contenidoArchivoFileInfo.fechaCreacion? formatDate(contenido.contenidoArchivoFileInfo.fechaCreacion, 'dd/MM/yyyy hh:mm:ss', 'en-US'):'';
                              contenido.contenidoArchivoFileInfo.lastVersion = Math.max.apply(Math, contenido.contenidoArchivoFileInfo.historialVersiones.map(function (o) { return o.version; }));
                              contenido.versionArchivo = `v${contenido.contenidoArchivoFileInfo.lastVersion}`;
                              contenido.contenidoArchivoMetadata.mensajeToolTip = mensajes['MV_CARGADO'];
                              nivel4.isCompleteTask = true;
                              break;
                            case 2:
                              contenido.esIdArchivo = false;
                              contenido.estado = "FALLIDO";
                              contenido.contenidoArchivoMetadata.mensajeToolTip = `${mensajes['MV_FALLIDO']}Causa:${contenido.contenidoArchivoMetadata.causaErrorProceso}`;
                              break;
                          }
                        }
                      });
                    }
                  }

                  if (nivel4.tipo == 2) {
                    if (nivel4.contenidos.length > 0) {
                      let contenido = nivel4.contenidos[0];
                      if (contenido && contenido.contenido) {
                        nivel4.isCompleteTask = true;
                        nivel4.url = contenido.contenido;
                        nivel4.canDeleteUrl = true;
                      }
                    }
                  }

                });
              }
            });
          }
        });
      }
    });


    this.setState({
      ...state,
      arbol: arbol
    })
  }

  getArbolCBC = () => {
    const state = this.getState();
    return state.arbol;
  }

  getInfoByTrackinNumber = (trackingNumber: string) => {
    return this.mediosVerificacionService.getInfoByTrackinNumber(trackingNumber);
  }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  asyncFetchMVByIdCatalogo = (idCatalogo: string, idAplicacion: string, mensajes: Object) => {
    this.fetchBegin();
    return this.mediosVerificacionService.getMediosVerificacionByIdCatalogo(idCatalogo).pipe(
      tap(response => {
        // console.log(idCatalogo);
        // console.log(response);
        // console.log(response.catalog['condiciones']);
        this.setArbolCBC(response.catalog['condiciones'], idAplicacion, mensajes);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }


  asyncFetchMVDiagnostic = (idSolicitudVersion:string)=>{
    return this.mediosVerificacionService.mediosVerificacionDiagnostic(idSolicitudVersion);
  }

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

  asyncDownLoadFile(idArchivo: string, version: number, name: string) {
    this.fetchBegin();
    this.mediosVerificacionService.downloadFile(idArchivo, version, name)
      .subscribe(
        info => { this.fetchSucces(); },
        error => { this.fetchError(error); return throwError(error); });
  }

  asyncDeleteFile(trackingNumber: string, idContenido: string, idUsuario: string, idAplicacion: string) {
    this.fetchBegin();
    return this.mediosVerificacionService.deleteFile(trackingNumber, idContenido, idUsuario, idAplicacion).pipe(
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

  asyncUploadUrl(fromData: any) {
    this.fetchBegin();
    return this.mediosVerificacionService.uploadUrl(fromData, true).pipe(
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


}
