import { AppFormMediosVerificacionComentariosComponent } from './../app-form-mediosverificacion-comentarios/app-form-mediosverificacion-comentarios.component';
import { Component, Inject, OnInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, LOCALE_ID } from "@angular/core";
import { DatePipe, DOCUMENT, formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { IContenidoArchivoMetaData, IContenidoArchivoFileInfo, IHistorialVersiones, ITreeNode, IContenido } from '../../../store/mediosverificacion/mediosverificacion.store.interface';
import { ISubmitOptions, AlertService, DialogService } from '@sunedu/shared';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { MediosVerificacionStore } from '../../../store/mediosverificacion/mediosverificacion.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { HttpEventType } from '@angular/common/http';

const MESSAGES = {
  MV_PROCESO: 'El archivo esta siendo procesado.',
  MV_CARGADO: 'El archivo fue registrado con éxito.',
  MV_FALLIDO: 'Ocurrió un error en el proceso de este archivo. Por favor elimine este registro y reintente.',
  URL_SUCCESS: 'La operación se realizó con éxito',
  URL_ERROR: 'Ocurrió un error en la operación'
};

@Component({
  selector: 'app-form-mediosverificacion',
  templateUrl: './app-form-mediosverificacion.component.html',
  styleUrls: ['./app-form-mediosverificacion.component.css', './app-form-mediosverificacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFormMediosverificacionComponent implements OnInit {
  @Input() readOnly:boolean=false;
  nodes: ITreeNode[] = [];

  isAllCompleteTask: boolean;
  totalCompleteTask: number;
  totalTask: number;

  esSede: boolean;
  currentSede: string;
  currentSelect: string;
  

  //urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  //urlRegex = /^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  //urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  //urlRegex = /^(?:http(s)?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  

  urlRegex = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  // urlRegex = /^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$/;

  readonly state$ = this.store.state$.pipe(map(x => x.mediosVerificacion), distinctUntilChanged());

  isAllExpand: boolean;
  sedes: any = [];

  current:any;
  idCatalogo:any;
  paramsExtraLast:any = null;

  @ViewChild('formulario') form: ElementRef;

  configFile: any = {
    tiposPermitidos: '.pdf,.xlsx,.xls',
    pesoMaximoEnMB: 50,
    puedeCargarArchivo: true,
    puedeSubirArchivo:true,
    puedeDescargarArchivo: false,
    puedeVerHistorialArchivo: false,
    usarBorradores: false,
    preservarNombreArchivo: false,
    puedeEliminarArchivo: false,
    puedeVerTags: false,
    puedeEditarTags: false,
    mostrarCajaDeTexto:true,
    version: 0 // OJO CAYL version de archivo verificar.
  };

 
  constructor(
    //@Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) locale: string,
    private storeCurrent: AppCurrentFlowStore,
    private store: MediosVerificacionStore,
    public dialog: DialogService,
    private alert: AlertService,
    public changeDetection: ChangeDetectorRef
    //private datePipe: DatePipe
  ) {
    this.isAllCompleteTask = false;
    this.totalCompleteTask = 0;
    this.totalTask = 0;
    this.isAllExpand = true;    
  }

  async ngOnInit() {
    await this.loadConfiguracion();
    //this.getParametros(this.configFile);
  }

  private async loadConfiguracion() {
    this.store.state.mediosVerificacion.isLoading = true;
    

    let promises: any[] = [];
    const action0 = await this.getSedesFiliales();
    promises.push(action0);
    //console.log('termino 0');
    const action1 = await this.getCatalogos();
    promises.push(action1);
    //console.log('termino 1');

    await Promise.all(promises).then(() => { this.store.state.mediosVerificacion.isLoading = false; });
  }

  private getSedesFiliales = () => {
    return new Promise<void>(
      (resolve) => {
        const current = this.storeCurrent.currentFlowAction.get();
        this.store.sedesFilialesActions.asyncFetchSedesFiliales(current.idVersionSolicitud)
          .subscribe(() => {
            this.store.sedesFilialesActions.getSedesFiliales()
              .subscribe(
                info => {
                  this.sedes = info;
                  //console.log(this.sedes);
                  resolve();
                }
              );
          })
      });
  }

  private getCatalogos = () => {
    return new Promise<void>(
      (resolve) => {
        const current = this.storeCurrent.currentFlowAction.get();
        this.store.sedesFilialesActions.asyncFetchCatalogos(current.idVersionSolicitud)
          .subscribe(() => {
            //console.log(this.store.sedesFilialesActions.getSedesCatalogos());
            resolve();
          })
      });
  }

  onSumTotalTask(): void {
    let totalTaskG: number = 0;
    this.nodes.forEach(nivel1 => {
      // nivel1 CBC
      let totalNivel1: number = 0;
      //console.log(nivel1);
      if (nivel1.children.length > 0) {
        nivel1.children.forEach(nivel2 => {
          // nivel2 Com
          let totalNivel2: number = 0;
          //console.log(nivel2);
          if (nivel2.children.length > 0) {
            nivel2.children.forEach(nivel3 => {
              // nivel3 Ind
              let totalNivel3: number = 0;
              //console.log(nivel3);
              if (nivel3.children.length > 0) {
                totalNivel3 = nivel3.children.length;
                nivel3.children.forEach(nivel4 => {
                  // nivel4 MV
                  //console.log(nivel4)
                  if (nivel4.excludeTask) totalNivel3 -= 1;
                })

                // Total nivel 3
                nivel3.totalCompleteTask = 0;
                nivel3.totalTask = totalNivel3;
                //console.log('Nivel 3 ==> ' +  totalNivel3);
              }
              totalNivel2 += totalNivel3;
            })
            // Total nivel 2
            nivel2.totalCompleteTask = 0;
            nivel2.totalTask = totalNivel2;
            //console.log('Nivel 2 ==> ' +  totalNivel2);
          }
          totalNivel1 += totalNivel2;
        })

        // Total Nivel 1
        nivel1.totalCompleteTask = 0;
        nivel1.totalTask = totalNivel1;
        //console.log('Nivel 1 ==> ' +  totalNivel1);
      }
      totalTaskG += totalNivel1;

    });

    this.totalTask = totalTaskG;

  }

  onSuma(): void {
    let totalTaskG: number = 0;
    for (let n1 = 0; n1 < this.nodes.length; n1++) {
      const nivel1 = this.nodes[n1];
      //console.log(nivel1);
      let totalNivel1: number = 0;

      if (nivel1.children.length > 0) {
        for (let n2 = 0; n2 < nivel1.children.length; n2++) {
          const nivel2 = nivel1.children[n2];
          let totalNivel2: number = 0;

          if (nivel2.children.length > 0) {
            for (let n3 = 0; n3 < nivel2.children.length; n3++) {
              const nivel3 = nivel2.children[n3];
              let totalNivel3: number = 0;

              if (nivel3.children.length > 0) {
                totalNivel3 = nivel3.children.length;
                for (let n4 = 0; n4 < nivel3.children.length; n4++) {
                  const nivel4 = nivel3.children[n4];
                  if (nivel4.excludeTask) totalNivel3 -= 1;
                }
                // Total nivel 3
                nivel3.totalCompleteTask = 0;
                nivel3.totalTask = totalNivel3;
                //console.log('Nivel 3 ==> ' +  totalNivel3);
              }
              totalNivel2 += totalNivel3;
            }
            // Total nivel 2
            nivel2.totalCompleteTask = 0;
            nivel2.totalTask = totalNivel2;
            //console.log('Nivel 2 ==> ' +  totalNivel2);
          }
          totalNivel1 += totalNivel2;
          //console.log('++++ finalizo nivel 2 ++++' + nivel2.id);
        }
        // Total Nivel 1
        nivel1.totalCompleteTask = 0;
        nivel1.totalTask = totalNivel1;
        //console.log('Nivel 1 ==> ' +  totalNivel1);
      }
      totalTaskG += totalNivel1;
      //console.log('++++ finalizo nivel 1 ++++' + nivel1.id);
    }
    this.totalTask = totalTaskG;
  }

  onTaskA(node: ITreeNode): void {
    if (!isNullOrUndefined(node)) {
      node.isCompleteTask = node.isCompleteTask ? false : true;
    }
    this.onTask();
  }

  onTask(): void {

    // Hallando sumatorias
    if (this.nodes.length > 0) {
      this.totalCompleteTask = 0;
      for (let n1 = 0; n1 < this.nodes.length; n1++) {
        const nivel1 = this.nodes[n1];
        nivel1.totalCompleteTask = 0;

        if (nivel1.children.length > 0) {
          for (let n2 = 0; n2 < nivel1.children.length; n2++) {
            const nivel2 = nivel1.children[n2];
            nivel2.totalCompleteTask = 0;

            //let totCompN3:number=0;
            if (nivel2.children.length > 0) {
              for (let n3 = 0; n3 < nivel2.children.length; n3++) {
                const nivel3 = nivel2.children[n3];
                nivel3.totalCompleteTask = 0;

                if (nivel3.children.length > 0) {
                  let totCompN4: number = 0;
                  for (let n4 = 0; n4 < nivel3.children.length; n4++) {
                    const nivel4 = nivel3.children[n4];
                    if (!isNullOrUndefined(nivel4.excludeTask)) {
                      if (!nivel4.excludeTask && nivel4.isCompleteTask) {
                        totCompN4 += 1;
                      }
                    } else {
                      if (nivel4.isCompleteTask) {
                        totCompN4 += 1;
                      }
                    }
                  }
                  nivel3.totalCompleteTask = totCompN4;
                  nivel3.isCompleteTask = nivel3.totalCompleteTask == nivel3.totalTask ? true : false;
                }
                nivel2.totalCompleteTask += nivel3.totalCompleteTask;
              }
              nivel2.isCompleteTask = nivel2.totalCompleteTask == nivel2.totalTask ? true : false;
            }
            nivel1.totalCompleteTask += nivel2.totalCompleteTask;
          }
          nivel1.isCompleteTask = nivel1.totalCompleteTask == nivel1.totalTask ? true : false;
        }
        this.totalCompleteTask += nivel1.totalCompleteTask;
      }
      this.isAllCompleteTask = this.totalCompleteTask == this.totalTask ? true : false;
    }

  }

  onExpand(expand: boolean): void {
    // this.nodes.forEach(nivel1=>{
    //   if(nivel1.children.length>0){
    //     nivel1.isExpanded=this.isAllExpand;
    //     nivel1.children.forEach(nivel2=>{
    //       if(nivel2.children.length>0){
    //         nivel2.isExpanded=this.isAllExpand;
    //         nivel2.children.forEach(nivel3=>{
    //           if(nivel3.children.length>0){
    //             nivel3.isExpanded=this.isAllExpand;
    //           }
    //         })
    //       }
    //     });
    //   }
    // });
    //console.log('entro a expand!');

    for (let n1 = 0; n1 < this.nodes.length; n1++) {
      const nivel1 = this.nodes[n1];
      if (nivel1.children.length > 0) {
        nivel1.isExpanded = this.isAllExpand;
        for (let n2 = 0; n2 < nivel1.children.length; n2++) {
          const nivel2 = nivel1.children[n2];
          nivel2.isExpanded = this.isAllExpand;
          for (let n3 = 0; n3 < nivel2.children.length; n3++) {
            const nivel3 = nivel2.children[n3];
            nivel3.isExpanded = this.isAllExpand;
          }
        }
      }
    }
    //console.log('salio de expand!');
    //console.log(this.isAllExpand);

    this.isAllExpand = !this.isAllExpand;
    //console.log(this.isAllExpand);
  }

  handleSearch = (formValue: any, options: ISubmitOptions) => {
    //const { comboLists } = this.store.state.mediosVerificacion;
    //this.store.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricularSucces(source, formValue).subscribe();
  }

  handleInputChange = (e: any) => {
    // console.log(e);
    // console.log(e.value);
    if (e.value == null) {
      this.esSede = false;
      this.currentSede = null;
      this.currentSelect = null;
      return;
    }
    this.esSede = true;
    this.currentSede = e.value
    this.currentSelect = e.selected['text'];
    this.current = this.storeCurrent.currentFlowAction.get();
    this.idCatalogo = this.store.sedesFilialesActions.getIdCatalogoByIdSedeFilial(this.currentSede);
    this.getArbolCbcById();
  }

  getArbolCbcById = () => {
    if (this.currentSede != null) {
      const idCatalogo = this.store.sedesFilialesActions.getIdCatalogoByIdSedeFilial(this.currentSede);
      // console.log(idCatalogo)
      const current = this.storeCurrent.currentFlowAction.get();
      this.store.mediosVerificacionActions.asyncFetchMVByIdCatalogo(idCatalogo, current.idAplicacion, MESSAGES)
        .subscribe(() => {
          this.nodes = this.store.mediosVerificacionActions.getArbolCBC();
          //console.log('CAYL nodes',this.nodes);
          this.onSuma();
          this.onTask();
        });
    }
  }

  handleChangeIdArchivo = (newId: any) => {
    //this.form.get('idArchivo').validate();
    // console.log(newId);
  }

  archivo(e) {
    //console.log('CAYL archivo');
    // console.log(e);
  }

  getParametros(node: ITreeNode):any {
    //console.log('CAYL getParametros MEDIOS');
    //const current = this.storeCurrent.currentFlowAction.get();
    //const idCatalogo = this.store.sedesFilialesActions.getIdCatalogoByIdSedeFilial(this.currentSede);
    // if(this.paramsExtraLast != null){
    //   if(
    //     this.paramsExtraLast.idUsuario === this.configFile.paramsExtra.idUsuario &&
    //     this.paramsExtraLast.idAplicacion === this.configFile.paramsExtra.idAplicacion &&
    //     this.paramsExtraLast.idCatalogo === this.configFile.paramsExtra.idCatalogo &&
    //     this.paramsExtraLast.idCondicion === this.configFile.paramsExtra.idCondicion &&
    //     this.paramsExtraLast.idComponente === this.configFile.paramsExtra.idComponente &&
    //     this.paramsExtraLast.idIndicador === this.configFile.paramsExtra.idIndicador &&
    //     this.paramsExtraLast.idMedioVerificacion === this.configFile.paramsExtra.idMedioVerificacion
    //     ) return this.configFile;
    // } 

    //this.configFile.paramsExtra = {};
    //this.paramsExtraLast = {};
    let parametros = {
      idUsuarioAutor: this.current.idUsuario,
      descUsuarioAutor: this.current.usuarioFullName,
      idRolUsuarioAutor: this.current.idRol,
      descRolUsuarioAutor: this.current.rolDescripcion,
      idAplicacion: this.current.idAplicacion.toUpperCase(), //'01E002E4-2794-45AB-A9E3-94FEAC502550',
      idCatalogo:this.idCatalogo,
      idCondicion:node.idCondicion,
      idComponente:node.idComponente,
      idIndicador:node.idIndicador,
      idMedioVerificacion:node.idMedioVerificacion,
      idProcesoOrigen:this.current.idProcesoOrigen,
      idProcesoBandejaOrigen:this.current.idProcesoBandejaOrigen,
      origenEnum:"1"
    };
    //this.configFile.paramsExtra = parametros;
    //this.paramsExtraLast = parametros;
    //console.log('CAYL getParametros MEDIOS', this.configFile);
    return parametros;
  }

  getInfoFile(e: any) {
    //console.log('CAYL getInfoFile');
    if (e != null) {
      // console.log(e);

      this.nodes.forEach(nivel1 => {
        // Opciones del Nivel 1 == CBC
        if (nivel1.children.length > 0) {
          nivel1.children.forEach(nivel2 => {
            // Opciones del Nivel 2 == Com
            if (nivel2.children.length > 0) {
              nivel2.children.forEach(nivel3 => {
                // Opciones del Nivel 3 == Ind
                if (nivel3.children.length > 0) {
                  nivel3.children.forEach(nivel4 => {
                    // Opciones del Nivel 4 == MV
                    if (nivel4.idCondicion == e['parametros'].idCondicion && nivel4.idComponente == e['parametros'].idComponente && nivel4.idIndicador == e['parametros'].idIndicador && nivel4.idMedioVerificacion == e['parametros'].idMedioVerificacion) {

                      if (isNullOrUndefined(nivel4.contenidos)) {
                        nivel4.contenidos = [];
                      }
                      let contenido = {} as IContenido;
                      contenido.id = e['fileInfo'].id;
                      contenido.contenidoArchivoMetadata = {} as IContenidoArchivoMetaData;
                      contenido.idAplicacion = e['idAplicacion'] ? e['idAplicacion'] : e['parametros'].idAplicacion;
                      contenido.idUsuario = e['idUsuario'] ? e['idUsuario'] : e['parametros'].idUsuario;
                      contenido.estado = e['estado'];
                      contenido.esIdArchivo = e['esIdArchivo'];
                      contenido.contenidoArchivoMetadata.trackingNumber = e.trackingNumber;
                      contenido.contenidoArchivoMetadata.archivoNombre = e['fileInfo'].nombre;
                      contenido.nombreArchivo = contenido.contenidoArchivoMetadata.archivoNombre;
                      contenido.intentosRefresh=0;

                      switch (contenido.estado.toUpperCase()) {
                        case 'EN PROCESO':
                          contenido.contenidoArchivoMetadata.mensajeToolTip = MESSAGES.MV_PROCESO;
                          break;
                        case 'CARGADO':
                          contenido.contenidoArchivoMetadata.mensajeToolTip = MESSAGES.MV_CARGADO;
                          nivel4.isCompleteTask = true;
                          break;

                        case 'FALLIDO':
                          contenido.contenidoArchivoMetadata.mensajeToolTip = MESSAGES.MV_FALLIDO + 'Causa:' + e['causaErrorProceso'];
                          break;
                      }

                      if (contenido.esIdArchivo) {
                        contenido.contenidoArchivoFileInfo = {} as IContenidoArchivoFileInfo;
                        //contenido.contenidoArchivoFileInfo.fechaCreacion = e['fileInfo'].fechaModificacion;
                        contenido.contenidoArchivoFileInfo.fechaCreacion =e['fileInfo'].fechaModificacion? formatDate(e['fileInfo'].fechaModificacion, 'dd/MM/yyyy hh:mm:ss', 'en-US'):'';
                        
                        //const datePipe = new DatePipe('en-US');
                        //contenido.fechaArchivo = this.datePipe.transform(contenido.contenidoArchivoFileInfo.fechaCreacion, 'dd/MM/yyyy hh:mm:ss a');
                        contenido.comentariosCount = null;
                        //contenido.fechaArchivo = contenido.contenidoArchivoFileInfo.fechaCreacion;
                        contenido.fechaArchivo = formatDate(e['fileInfo'].fechaModificacion, 'dd/MM/yyyy hh:mm:ss', 'en-US');

                        contenido.contenidoArchivoFileInfo.lastVersion = e['fileInfo'].version;

                        const ver = e['fileInfo'].version;
                        if(ver)
                        {
                          if(ver=='-Infinity'){
                            contenido.versionArchivo = '-';
                            contenido.esIdArchivo =false;
                            contenido.estado=='EN PROCESO';
                          }else{
                            contenido.versionArchivo = `v${contenido.contenidoArchivoFileInfo.lastVersion}`;
                          }
                        }
                        
                        
                        contenido.contenidoArchivoFileInfo.idArchivo = e['idArchivo'];

                        contenido.contenidoArchivoFileInfo.historialVersiones = [];
                        let historial = {} as IHistorialVersiones;
                        historial.version = e['version'] ? e['version'] : null;
                        historial.nombre = e['fileInfo'].nombre;
                        historial.usuarioCreacion = e['idUsuario'] ? e['idUsuario'] : e['parametros'].idUsuario;
                        historial.fechaCreacion = e['fileInfo'].fechaModificacion;
                        contenido.contenidoArchivoFileInfo.historialVersiones.push(historial);
                      }
                      nivel4.contenidos.push(contenido);
                      //console.log(nivel4.contenidos);
                      this.onTask();
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  }

  downloadByIdArchivo(contenido: IContenido) {
    // console.log(contenido);
    let version: number = contenido.contenidoArchivoFileInfo.lastVersion == null ? 0 : contenido.contenidoArchivoFileInfo.lastVersion;
    this.store.mediosVerificacionActions.asyncDownLoadFile(contenido.contenidoArchivoFileInfo.idArchivo, version, contenido.contenidoArchivoFileInfo.nombre);
  }

  findContenido(idContenido: string, trackingNumber: string): IContenido {
    let idContenidoVacio = (isNullOrUndefined(idContenido) || idContenido == "");
    let trackingNumberVacio = (isNullOrUndefined(trackingNumber) || trackingNumber == "");
    if (idContenidoVacio && trackingNumberVacio) return null;
    if (isNullOrUndefined(this.nodes) || !Array.isArray(this.nodes) || this.nodes.length == 0) return null;

    for (let cbcI = 0; cbcI < this.nodes.length; cbcI++) {
      let currentCBC = this.nodes[cbcI];
      if (isNullOrUndefined(currentCBC.children) || currentCBC.children.length == 0) continue;
      for (let comI = 0; comI < currentCBC.children.length; comI++) {
        let currentCom = currentCBC.children[comI];
        if (isNullOrUndefined(currentCom.children) || currentCom.children.length == 0) continue;
        for (let indI = 0; indI < currentCom.children.length; indI++) {
          let currentInd = currentCom.children[indI];
          if (isNullOrUndefined(currentInd.children) || currentInd.children.length == 0) continue;
          for (let mvI = 0; mvI < currentInd.children.length; mvI++) {
            let currentMV = currentInd.children[mvI];
            if (isNullOrUndefined(currentMV.contenidos) || currentMV.contenidos.length == 0) continue;
            for (let cntI = 0; cntI < currentMV.contenidos.length; cntI++) {
              let currentContenido: IContenido = currentMV.contenidos[cntI];
              
              if(!currentContenido.esIdArchivo){ 
                if(currentContenido.contenidoArchivoMetadata.trackingNumber == trackingNumber){
                  return currentContenido;
                }
              }else{
                if(currentContenido.id==idContenido){
                  return currentContenido;
                }
              }

              // if (idContenidoVacio == true &&
              //   !isNullOrUndefined(currentContenido.contenidoArchivoMetadata)&&
              //   currentContenido.contenidoArchivoMetadata.trackingNumber == trackingNumber) {
              //   return currentContenido;
              // }
              // if (trackingNumberVacio == true &&
              //   currentContenido.id == idContenido) {
              //   return currentContenido;
              // }
            }//for Contenidos
          }//for MVs
        }//for Inds
      }//for Coms
    }//for CBCs
    return null;
  }

  refreshByTrackingNumber(contenido: IContenido, node: ITreeNode) {
    let data: any;
    //console.log('CAYL refreshByTrackingNumber contenido',contenido);
    let trackingNumber = contenido.contenidoArchivoMetadata.trackingNumber;
    let objContenido = this.findContenido("", trackingNumber);
    //console.log('(CAYL objContenido',objContenido);
    if (isNullOrUndefined(objContenido)) return;
    
    //invocar getByTrackingNumber
    this.store.mediosVerificacionActions.getInfoByTrackinNumber(trackingNumber)
      .subscribe((reponse) => {
        //console.log('CAYL response',reponse);
        if (reponse.success) {
          let estadoContenido= reponse.contenido.estadoContenidoEnum;
          switch (estadoContenido) {
            case 0: //En proceso
              objContenido.estado = "EN PROCESO";
              objContenido.contenidoArchivoMetadata.mensajeToolTip = MESSAGES.MV_PROCESO;
              this.setIntentoRefreshNivel4(reponse.contenido, node);
              break;
            case 1: //Cargado
              objContenido.estado = "CARGADO";
              objContenido.contenidoArchivoMetadata.mensajeToolTip = MESSAGES.MV_CARGADO;
              this.setNuevoContenidoByNivel4(reponse.contenido);
              break;
            case 2: //Fallido
              objContenido.estado = "FALLIDO";
              objContenido.contenidoArchivoMetadata.mensajeToolTip = MESSAGES.MV_FALLIDO;
              break;
          }
        }
      });
  }

  setNuevoContenidoByNivel4(contenido:IContenido){
    //console.log(contenido);
    this.nodes.forEach(nivel1 => {

      if (nivel1.children.length > 0) {
        nivel1.children.forEach(nivel2 => {

          if (nivel2.children.length > 0) {
            nivel2.children.forEach(nivel3 => {

              if (nivel3.children.length > 0) {
                nivel3.children.forEach(nivel4 => {
                  // Opciones del Nivel 4 == MV
                  if (nivel4.contenidos) {
                    if (nivel4.contenidos.length > 0) {
                      const index = nivel4.contenidos.findIndex(x => x.contenidoArchivoMetadata.trackingNumber == contenido.contenidoArchivoMetadata.trackingNumber);
                      nivel4.contenidos[index] = contenido;

                      nivel4.contenidos[index].nombreArchivo = contenido.contenidoArchivoMetadata.archivoNombre;
                      nivel4.contenidos[index].fechaArchivo=contenido.contenidoArchivoFileInfo.fechaCreacion?formatDate(contenido.contenidoArchivoFileInfo.fechaCreacion, 'dd/MM/yyyy hh:mm:ss', 'en-US'):'';
                      nivel4.contenidos[index].versionArchivo = `v${contenido.contenidoVersion}`;
                      nivel4.contenidos[index].estado = "CARGADO";
                      nivel4.contenidos[index].esIdArchivo = true;
                      nivel4.contenidos[index].contenidoArchivoFileInfo.idArchivo = contenido.contenido;
                      nivel4.contenidos[index].contenidoArchivoFileInfo.nombre = contenido.contenidoArchivoMetadata.archivoNombre;

                      //console.log(nivel4.contenidos);
                      nivel4.isCompleteTask=true;
                      this.onTask();
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  setIntentoRefreshNivel4(contenido:IContenido, node:any){
    //console.log(contenido);
    this.nodes.forEach(nivel1 => {

      if (nivel1.children.length > 0) {
        nivel1.children.forEach(nivel2 => {

          if (nivel2.children.length > 0) {
            nivel2.children.forEach(nivel3 => {

              if (nivel3.children.length > 0) {
                nivel3.children.forEach(nivel4 => {
                  // Opciones del Nivel 4 == MV
                  if (nivel4.contenidos) {
                    if (nivel4.contenidos.length > 0) {
                      nivel4.contenidos.forEach(element => {
                        if(element.contenidoArchivoMetadata.trackingNumber == contenido.contenidoArchivoMetadata.trackingNumber){
                          let intentos = element.intentosRefresh;
                          intentos = intentos?intentos+1:1;
                          element.intentosRefresh = intentos;
                          //nivel4.contenidos[index].intentosRefresh = intentos;    
                        }
                      //   const index = nivel4.contenidos.findIndex(x => x.contenidoArchivoMetadata.trackingNumber == contenido.contenidoArchivoMetadata.trackingNumber);
                      // console.log(index);
                      // console.log(nivel4.contenidos[index]);
                      // let intentos = nivel4.contenidos[index].intentosRefresh;
                      // intentos = intentos?intentos+1:1;
                      // nivel4.contenidos[index].intentosRefresh = intentos;
                      });
                      // const index = nivel4.contenidos.findIndex(x => x.contenidoArchivoMetadata.trackingNumber == contenido.contenidoArchivoMetadata.trackingNumber);
                      // console.log(index);
                      // console.log(nivel4.contenidos[index]);
                      // let intentos = nivel4.contenidos[index].intentosRefresh;
                      // intentos = intentos?intentos+1:1;
                      // nivel4.contenidos[index].intentosRefresh = intentos;
                      //console.log(nivel4.contenidos[index]);
                      // nivel4.contenidos[index] = contenido;

                      // nivel4.contenidos[index].nombreArchivo = contenido.contenidoArchivoMetadata.archivoNombre;
                      // nivel4.contenidos[index].fechaArchivo = contenido.contenidoArchivoFileInfo.fechaCreacion;
                      // nivel4.contenidos[index].versionArchivo = `v${contenido.contenidoVersion}`;
                      // nivel4.contenidos[index].estado = "CARGADO";
                      // nivel4.contenidos[index].esIdArchivo = true;
                      // nivel4.contenidos[index].contenidoArchivoFileInfo.idArchivo = contenido.contenido;
                      // nivel4.contenidos[index].contenidoArchivoFileInfo.nombre = contenido.contenidoArchivoMetadata.archivoNombre;

                      // //console.log(nivel4.contenidos);
                      // nivel4.isCompleteTask=true;
                      // this.onTask();
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }


  eliminarByTrackingNumber(contenido: IContenido, node: ITreeNode) {
    // console.log(contenido);

    this.alert
      .open('¿Está seguro de eliminar el archivo?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          //let idUsuario = contenido.contenidoArchivoFileInfo.usuarioCreacion?contenido.contenidoArchivoFileInfo.usuarioCreacion:null;
          const current = this.storeCurrent.currentFlowAction.get();
          let idUsuario = current.idUsuario;

          this.store.mediosVerificacionActions
            .asyncDeleteFile(
              contenido.contenidoArchivoMetadata.trackingNumber,
              contenido.id,
              idUsuario,
              contenido.idAplicacion)
            .subscribe((reponse) => {
              if (reponse.success) {
                this.deleteFile(contenido, node);
                this.alert.open(reponse.message, null, { icon: 'success' });
              } else {
                this.alert.open(reponse.message, null, { icon: 'warning' });
              }
            });
        }
      });
  }

  deleteFile(contenido: IContenido, node: ITreeNode) {
    this.nodes.forEach(nivel1 => {

      if (nivel1.children.length > 0) {
        nivel1.children.forEach(nivel2 => {

          if (nivel2.children.length > 0) {
            nivel2.children.forEach(nivel3 => {

              if (nivel3.children.length > 0) {
                nivel3.children.forEach(nivel4 => {
                  // Opciones del Nivel 4 == MV
                  if (nivel4.idCondicion == node.idCondicion && nivel4.idComponente == node.idComponente && nivel4.idIndicador == node.idIndicador && nivel4.idMedioVerificacion == node.idMedioVerificacion) {
                    if (nivel4.contenidos) {
                      if (nivel4.contenidos.length > 0) {
                        const index = nivel4.contenidos.findIndex(x => x.id == contenido.id);
                        nivel4.contenidos.splice(index, 1);
                        if (nivel4.contenidos.length == 0) {
                          nivel4.isCompleteTask = false;
                          nivel4.contenidos = null;
                        }
                        if (nivel4.tipo == 2) {
                          nivel4.url = "";
                          nivel4.canDeleteUrl = false;
                          nivel4.isCompleteTask = false;
                          nivel4.contenidos = null;
                        }
                        // console.log(nivel4.contenidos);
                        this.onTask();
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
  }

  //messageByIdArchivo
  //eliminarByTrackingNumber
  messageByIdArchivo(contenido: IContenido, node: any, e) {
    //console.log(e);
    // this.store.representanteModalActions.loadTipoDocumentoEnum(
    //   this.tipoDocumentoEnum
    // );
    // this.store.representanteModalActions.setModalNew(this.entidad);
    const current = this.storeCurrent.currentFlowAction.get();
    const dialogRef = this.dialog.openMD(AppFormMediosVerificacionComentariosComponent);
    dialogRef.componentInstance.node = node;
    dialogRef.componentInstance.contenido = contenido;
    dialogRef.componentInstance.readOnly = this.readOnly;
    dialogRef.componentInstance.currentUserProcedimiento = current;

    dialogRef.componentInstance.cantidadMensajesEvent.subscribe(
      async (cantidad: number) => {
        //dialogRef.close();
        //console.log(cantidad,e);
        await this.setCantidadMensajes(node, contenido, cantidad);
      }
    )
    
    // dialogRef.afterClosed().subscribe(() => {
    //   // this.store.representanteModalActions.resetModalRepresentanteLegal();
    // });
  }

  setCantidadMensajes(node: ITreeNode, contenido: IContenido, cantidad: number) {
    return new Promise<void>(
      (resolve)=>{ 
        //console.log('node', node);
        //console.log('caontenido',contenido);
        //console.log('cantidad',cantidad);
        this.nodes.forEach(nivel1 => {
    
          if (nivel1.children.length > 0) {
            nivel1.children.forEach(nivel2 => {
    
              if (nivel2.children.length > 0) {
                nivel2.children.forEach(nivel3 => {
    
                  if (nivel3.children.length > 0) {
                    nivel3.children.forEach(nivel4 => {
                      // Opciones del Nivel 4 == MV
                      if (nivel4.idCondicion == node.idCondicion && nivel4.idComponente == node.idComponente && nivel4.idIndicador == node.idIndicador && nivel4.idMedioVerificacion == node.idMedioVerificacion) {
                       
                        const index = nivel4.contenidos.findIndex(x => x.id == contenido.id);
                        nivel4.contenidos[index].comentariosCount = cantidad;
                        //console.log('se puso la cantidad',nivel4, cantidad);
                        this.changeDetection.detectChanges();
                        resolve();
                        // nivel4.contenidos.forEach(element=>{
                        //   if(element.id==contenido.id){
                        //     element.comentariosCount = cantidad;
                        //     console.log('se puso la cantidad', cantidad);
                        //     this.onTask();
                            
                        //   }
                        // });
                        // if (nivel4.contenidos) {
                          
                        //   //console.log('CAAAYYYLLLL', nivel4.contenidos);

                        // }
                        //else{
                        //   nivel4.contenidos = [];
                        //   let contenido = {
                        //     comentariosCount:cantidad
                        //   }
                        //   nivel4.contenidos.push(contenido);
                        // }
                      }
                    });
                  }
                });
              }
            });
          }
        });
     
    });
    
  }

  grabarUrl = (node: ITreeNode) => {
    // console.log(node);
    if (node.url) {

      let idContenido = '';
      if (Array.isArray(node.contenidos)) {
        // console.log('isArray');
        idContenido = node.contenidos.length > 0 ? node.contenidos[0].id : '00000000-0000-0000-0000-000000000000';
      }
      // console.log(idContenido);
      const objFormData = new FormData(this.form.nativeElement);
      //console.log('CAYL objFormData', objFormData);
      const paramsExtra = this.getParametros(node);
      //objFormData.append('file', null);
      objFormData.append('IdUsuarioAutor', paramsExtra.idUsuarioAutor);
      objFormData.append('DescUsuarioAutor', paramsExtra.descUsuarioAutor);
      objFormData.append('IdRolUsuarioAutor', paramsExtra.idRolUsuarioAutor);
      objFormData.append('DescRolUsuarioAutor', paramsExtra.descRolUsuarioAutor);
      objFormData.append('IdAplicacion', paramsExtra.idAplicacion);
      objFormData.append('IdCatalogo', paramsExtra.idCatalogo);
      objFormData.append('IdProcesoOrigen', paramsExtra.idProcesoOrigen);
      objFormData.append('idProcesoBandejaOrigen', paramsExtra.idProcesoBandejaOrigen);
      objFormData.append('IdCondicion', paramsExtra.idCondicion.toString());
      objFormData.append('IdComponente', paramsExtra.idComponente.toString());
      objFormData.append('IdIndicador', paramsExtra.idIndicador.toString());
      objFormData.append('IdMedioVerificacion', paramsExtra.idMedioVerificacion.toString());
      objFormData.append('IdContenido', idContenido);
      objFormData.append('Contenido', node.url);

      // console.log(objFormData);

      this.store.mediosVerificacionActions.asyncUploadUrl(objFormData).subscribe(
        resp => {
          // console.log(resp);
          switch (resp.type) {
            // case HttpEventType.UploadProgress:
            //   this.handleUploadProgress(resp.loaded, resp.total);
            //   break;

            case HttpEventType.Response:
              const existe = resp.body.messages && resp.body.messages > 0;
              if (resp.body.success) {
                // console.log(resp);
                this.alert.open(existe ? resp.body.messages[0] : MESSAGES.URL_SUCCESS, null, { icon: 'success' });
                this.setUrlContenido(node, resp.body.data);
              } else {
                this.alert.open(existe ? resp.body.messages[0] : MESSAGES.URL_ERROR, null, { icon: 'warning' });
              }
              break;
          }

          // if (resp.success)
          // {

          //   this.alert.open(isNullOrUndefined(resp.message)?'La operación se realizó con éxito':resp.message, null, { icon: 'success' });
          //   // crear el contenido y pasarselo al node + node.allowDeleteUrl=true;
          // } else {
          //   this.alert.open(isNullOrUndefined(resp.message)?'Ocurrió un error en la operación':resp.message, null, { icon: 'warning' });
          // }
        }
      )

    }
  }

  setUrlContenido(node: ITreeNode, data: any) {
    // console.log(data);
    this.nodes.forEach(nivel1 => {

      if (nivel1.children.length > 0) {
        nivel1.children.forEach(nivel2 => {

          if (nivel2.children.length > 0) {
            nivel2.children.forEach(nivel3 => {

              if (nivel3.children.length > 0) {
                nivel3.children.forEach(nivel4 => {
                  // Opciones del Nivel 4 == MV
                  if (nivel4.idCondicion == node.idCondicion && nivel4.idComponente == node.idComponente && nivel4.idIndicador == node.idIndicador && nivel4.idMedioVerificacion == node.idMedioVerificacion) {

                    if (isNullOrUndefined(nivel4.contenidos)) {
                      nivel4.contenidos = [];
                    }

                    if (nivel4.contenidos.length > 0) {
                      //editar
                      const index = nivel4.contenidos.findIndex(x => x.id == data.idContenido);
                      nivel4.contenidos[index].contenido = node.url;
                      // console.log(nivel4.contenidos);
                    } else {
                      //nuevo
                      let contenido = {} as IContenido;
                      contenido.id = data.idContenido;
                      contenido.idCondicion = node.idCondicion;
                      contenido.idComponente = node.idComponente;
                      contenido.idIndicador = node.idIndicador;
                      contenido.idMedioVerificacion = node.idMedioVerificacion;
                      contenido.idTipoMedioVerificacion = 2;
                      contenido.contenido = node.url;
                      nivel4.contenidos.push(contenido);
                      // console.log(nivel4.contenidos);
                      nivel4.canDeleteUrl = true;
                      nivel4.isCompleteTask = true;
                      this.onTask();
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  setDeleteUrl(node: ITreeNode) {
    // console.log(node);

    this.alert
      .open('¿Está seguro de eliminar el dominio?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          //let idUsuario = contenido.contenidoArchivoFileInfo.usuarioCreacion?contenido.contenidoArchivoFileInfo.usuarioCreacion:null;
          const current = this.storeCurrent.currentFlowAction.get();
          let contenido = node.contenidos[0];

          // let estado=contenido.estado;
          // if(estado=="CARGADO"){
          //   if(contenido.contenidoArchivoMetadata)
          //   {
          //     contenido.contenidoArchivoMetadata.trackingNumber=null;
          //   }
          // }else{
          //   contenido.id = null;
          // }


          // contenido.contenidoArchivoMetadata.trackingNumber=contenido.id==null?contenido.contenidoArchivoMetadata.trackingNumber:null;

          this.store.mediosVerificacionActions.asyncDeleteFile("", contenido.id, current.idUsuario, current.idAplicacion)
            .subscribe((reponse) => {
              if (reponse.success) {
                this.deleteFile(contenido, node);
                this.alert.open(reponse.message, null, { icon: 'success' });
              } else {
                this.alert.open(reponse.message, null, { icon: 'warning' });
              }
            });
        }
      });
  }

}
