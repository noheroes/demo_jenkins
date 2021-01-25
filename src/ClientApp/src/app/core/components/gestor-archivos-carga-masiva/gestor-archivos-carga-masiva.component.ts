import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, Output, OnInit, Renderer2, ViewChild, EventEmitter } from '@angular/core';
import { ToastService, IDataGridSource, AlertService } from '@sunedu/shared';
import { IGAInternalDisplayConfig, IGestorArchivosConfig, IGestorArchivosFriendlyConfig } from './gestor-archivos-carga-masiva.interface';
import { GaUtils, GA_MENSAJES } from './gestor-archivos-carga-masiva.utils';
import { state, trigger, transition, style, animate } from '@angular/animations';
import { Store } from '@ngxs/store';
import { EnumGaOperation, EnumEstadoControl } from './gestor-archivos-carga-masiva.enum';
import { isNullOrUndefined } from 'util';
import { GestorArchivosCargaMasivaService } from './gestor-archivos-carga-masiva.service';
import { Observable, Subscription } from 'rxjs';
import { CargaMasivaService } from '@lic/workflow/app/modules/03-formulario/service/cargamasiva.service';

@Component({
  selector: 'sunedu-gestor-archivos-carga-masiva',
  templateUrl: './gestor-archivos-carga-masiva.component.html',
  styleUrls: ['./gestor-archivos-carga-masiva.component.scss'],
  providers: [GestorArchivosCargaMasivaService],
  animations: [
    trigger('transitionMessages', [
      state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
      transition('void => enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
      ])
    ])
  ]
})
export class GestorArchivosCargaMasivaComponent  implements OnInit {
  // =============================================
  // INPUTS
  // =============================================
  /**
   * habilita el modo debug
   */
  @Input() debugMode: boolean = false;
  /**
   * indica si el control es requerido en un formulario
   */
  @Input() esRequerido: boolean = false;
  /**
   * Configuracion del componente
   */
  @Input() config: IGestorArchivosConfig;
  /**
   * idArchivo al que referencia el presente control
   */
  @Input() idArchivo: string;
  /**
   * conjunto de parámetros para ser leídos por el parent del presente control
   */
  @Input() paramsExtra: any = {};
  /**
   * objeto a serializar y enviar como parámetros para invocación a comportamiento extendido
   */
  @Input() extPayload: any = {};
  /**
   * bloque de metadatos del archivo. Espera estructura de datos idéntica a la clase "ArchivoRequestMetadata"
   */
  @Input() metadata: any = {};
  /**
   * bloque de metadatos de la version del archivo.
   */
  @Input() metadataVersion: any = {};
  /**
   * etiquetas concatenadas (separador: ','). Se almacena en campo "etiqueta" de archivo
   */
  @Input() tags: string = null;

  @Input() label: string = null;

  @Input() inputError = false;

  /**
   * Sirve unicamente para agregar el asterisco de requerido
   */
  @Input() isRequiredLabel: boolean = false;

  /**
   * si es true, cambia la apariencia para ser mas amigable al usuario
   */
  @Input() friendly: boolean = false;

  /**
   * Configuracion del componente para la vista amigable al usuario
   */
  @Input() friendlyConfig: IGestorArchivosFriendlyConfig;

  /**
   * Utiliza la ruta de negocio del gestor de archivos
   * Aplica a los metodos "UPLOAD"
   */
  @Input() useBusinnessRoute: boolean = true;

  /**
   * Deshabilita el componente
   */
  @Input() disabled: boolean = false;

  /**
   * TrackinNumber antes de ser IdArchivo
   */
  @Input() trackingNumber:string;

  /**
   * TrackinNumber antes de ser IdArchivo
   */
  @Input() cleanDataArchivo:Observable<void>;

  // =============================================
  // OUTPUTS
  // =============================================

  /**
   * se emite ante un error en los eventos upload/delete
   */
  @Output() error: EventEmitter<{ operation: EnumGaOperation }> = new EventEmitter();
  /**
   * se emite cuando los eventos upload/delete concluyeron correctamente
   */
  @Output() success: EventEmitter<{ operation: EnumGaOperation }> = new EventEmitter();
  /**
   * se emite cuando la propiedad idArchivo cambia
   */
  @Output() idArchivoChange: EventEmitter<string> = new EventEmitter();
  /**
   * se emite cuando se termina de cargar un archivo plantilla
   */
  @Output() dataArchivoChange: EventEmitter<any> = new EventEmitter();

  /**
   * se emite cuando la propiedad trackingNumber cambia
   */
  @Output() trackingNumberChange: EventEmitter<string> = new EventEmitter();

  /**
   * se emite cuando se ejecuta correctamente el archivo
   */
  @Output() sendInfoSuccess: EventEmitter<any>=new EventEmitter();
  /**
   * se emite cuando se da click en el botón ayuda
   */
  @Output() clickHelp: EventEmitter<string> = new EventEmitter();

  // =============================================
  // VIEWCHILDS
  // =============================================

  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputText') inputText: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('formulario') form: ElementRef;

  // =============================================
  // VARIABLES PUBLICAS
  // =============================================

  /**
   * se construye en base a los tipos permitidos sirve
   * para asignar en el popup de archivos los tipos permitidos
   */
  acceptedFiles: string;
  /**
   * texto que se va mostrar en el input text
   */
  displayText: string = 'Seleccione archivo';
  /**
   * contiene variables que seran controladas por el
   * propio componente
   */
  internalDisplayConfig: IGAInternalDisplayConfig;
  /**
   * indica el estado del control
   */
  estadoControl: EnumEstadoControl = EnumEstadoControl.ESTADO_INICIAL;
  /**
   * guarda el archivo seleccionado actualmente
   */
  selectedFile: any = null;
  /**
   * indica si se encuentra cargando o descargando
   */
  loading: boolean = false;

  /**
   * Mensaje que se muestra en la grilla de datos historicos
   * cuando hay algun error o no hay datos
   */
  textEmptyHistoryData: string = GA_MENSAJES.DEFAULT_EMPTY_HISTORY;

  /**
   * guarda el historial de versiones
   */
  historySource: IDataGridSource<any> = { items: [] };

  // id de la aplicacion
  idApp: string = null;

  // =============================================
  // VARIABLES PRIVADAS
  // =============================================

  /**
   * nombre original del archivo cargado, obtenido mediante "GetFileInfo"
   */
  nombreArchivoOriginal: string = null;
  private subscription: Subscription;
  constructor(
    private gaService: GestorArchivosCargaMasivaService,
    private renderer: Renderer2,
    private toastService: ToastService,
    private alertService: AlertService,
    // private appStore: AppStore,
    private store: Store,
    private cargaMasivaService: CargaMasivaService
  ) {
    this.setIdApp();
  }

  ngOnInit() {
    this.setDefaultConfig().then(() => {
      this.checkLoadData();
    });
    this.subscription = this.cargaMasivaService.notifyObservable$.subscribe(() => {
      this.resetUploadForm();
      this.setDisplayText(GA_MENSAJES.DEFAULT_TEXT);
    });
  }

  // =============================================
  // METODOS
  // =============================================

  checkLoadData = () => {
    if (this.config.usarBorradores) {
      this.deleteDraft().then(() => { this.getFile(); });
    } else {
      this.getFile();
    }
  }

  handleSelectFile = () => {
    this.inputFile.nativeElement.click();
  }



  handleChangeFile = async (e) => {
    const [file] = e.srcElement.files;
    if (!file) {
      const msg = GaUtils.buildMensajeSeleccionArchivo(
        this.config.preservarNombreArchivo ? this.nombreArchivoOriginal : null
      );
      this.resetEstadoControl();
      this.setDisplayText(msg);
      this.clearInputFile();
      this.setSelectedFile(null);
      this.blinkText();
      return false;
    }

    try {
      await GaUtils.validarArchivoSeleccionado(
        file,
        this.config.tiposPermitidos,
        this.config.preservarNombreArchivo,
        this.nombreArchivoOriginal
      );
      this.setDisplayText(file.name);
      this.setSelectedFile(file);
      this.estadoControl = EnumEstadoControl.SELECIONADO_NO_SUBIDO;
    } catch (e) {
      this.resetEstadoControl();
      this.setDisplayText(e.msg);
      this.blinkText();
      return false;
    }

  }

  handleUploadFile = async () => {
    try {
      // validacion del archivo antes de subir
      await GaUtils.validarArchivoParaSubir(
        this.selectedFile,
        this.config.pesoMaximoEnMB,
        this.config.tiposPermitidos
      );
    } catch (msg) {
      this.toastService.warning(msg);
      return false;
    }

    const formData = this.prepareFormData();

    this.showLoading();
    this.internalDisplayConfig.barraProgresoVisible = true;
    this.gaService.upload(formData, this.useBusinnessRoute).subscribe(resp => {
      // console.log(resp);

      switch (resp.type) {
        case HttpEventType.UploadProgress:
          this.handleUploadProgress(resp.loaded, resp.total);
          break;

        case HttpEventType.Response:
          // console.log(resp);
          if (resp.body.success) {
            this.handleUploadSuccess(resp.body);
          } else {
            const hasServerMessage = resp.body.messages && resp.body.messages.length > 0;
            const errorMessage = hasServerMessage ?
              resp.body.messages[0] :
              GA_MENSAJES.ERROR_INFORMACION_ARCHIVO;
            this.handleUploadError(errorMessage);
          }

          break;
      }
    }, err => {
      // console.log('error', err);
      const errorMessage = err && err.error
        // por verificar el campo state
        && err.error.state && err.error.state === 'rejected' ?
        GA_MENSAJES.ERROR_ARCHIVO_REJECTED :
        GA_MENSAJES.ERROR_CARGA_ARCHIVO;
      this.handleUploadError(errorMessage);
    });
  }

  /**
   * Controla la descarga de un archivo
   */
  handleDownloadFile = (version: number = null, nombre: string = null) => {
    if (!this.idArchivo) {
      // console.log(this.idArchivo);
      this.toastService.warning(GA_MENSAJES.DESCARGA_NO_AUTORIZADA);
      return;
    }
    // console.log(this.idArchivo);
  this.showLoading();
    this.gaService.download(
      this.idArchivo,
      version ? version : this.config.version,
      this.config.usarBorradores,
      nombre ? nombre : this.nombreArchivoOriginal
    ).subscribe(() => {
      this.hideLoading();
    }, err => {
      this.hideLoading();
      this.toastService.error(GA_MENSAJES.ERROR_DOWNLAOD_FILE);
    });
  }

  /**
   * Controla eliminacion de un archivo
   */
  handleDeleteFile = () => {
    if (!this.idArchivo) {
      this.toastService.warning(GA_MENSAJES.ELIMINAR_NO_AUTORIZADO);
      return;
    }

    const onConfirmDelete = () => {
      this.showLoading();
      this.gaService.deleteFile({
        id: this.idArchivo,
        idAplicacion: this.idApp,
      }).subscribe(response => {
        if (response.Success) {
          this.setIdArchivo(null);
          this.setTags('');
          this.setDisplayText(GA_MENSAJES.DEFAULT_TEXT);
          this.resetEstadoControl();

          const msg = response.Messages && response.Messages.length > 0 ?
            response.Messages[0] : GA_MENSAJES.DELETE_SUCCESS;

          if (this.config.mostrarAlertasExito) {
            this.toastService.success(msg);
          } else {
            this.setDisplayText(msg);
          }

          this.success.emit({ operation: EnumGaOperation.DELETE_FILE });

        } else {

          const errorMessage = response.Messages && response.Messages.length > 0 ?
            `${GA_MENSAJES.ERROR_ELIMINAR_ARCHIVO}: ${response.Messages[0]}` :
            GA_MENSAJES.ERROR_ELIMINAR_ARCHIVO;

          this.toastService.error(errorMessage);

          this.error.emit({ operation: EnumGaOperation.DELETE_FILE });

        }
        this.hideLoading();
      }, () => {
        this.toastService.error(GA_MENSAJES.ERROR_ELIMINAR_ARCHIVO);
        this.hideLoading();
      });
    };

    this.alertService.open(GA_MENSAJES.CONFIRM_ELIMINAR, null, { confirm: true })
      .then(c => {
        if (c) { onConfirmDelete(); }
      });
  }

  /**
   * Controla el cambio de tags (agregar/eliminar)
   */
  handleChangeTags = (tags) => {
    this.setTags(tags);
  }

  handleUpdateTags = () => {
    if (!this.idArchivo) {
      this.toastService.warning(GA_MENSAJES.OPERACION_INVALIDA);
      return;
    }

    const onConfirmUpdateTag = () => {
      this.showLoading();
      this.gaService.updateTags({
        id: this.idArchivo,
        etiqueta: this.tags,
      }).subscribe(response => {
        if (response.Success) {

          this.toastService.success(GA_MENSAJES.SUCCESS_UPDATE_TAGS);

        } else {

          const errorMessage = response.Messages && response.Messages.length > 0 ?
            `${GA_MENSAJES.ERROR_UPDATE_TAGS}: ${response.Messages[0]}` :
            GA_MENSAJES.ERROR_UPDATE_TAGS;

          this.toastService.error(errorMessage);

        }
        this.hideLoading();
      }, () => {
        this.toastService.error(GA_MENSAJES.ERROR_UPDATE_TAGS);
        this.hideLoading();
      });
    };

    this.alertService.open(GA_MENSAJES.CONFIRM_UPDATE_TAGS, null, { confirm: true })
      .then(c => {
        if (c) { onConfirmUpdateTag(); }
      });
  }

  handleClickFriendly = () => {
    if (!this.idArchivo) {
      this.handleSelectFile();
    } else {
      this.handleDownloadFile();
    }
  }

  /**
   * Asignar los valores por defectos para todas las propiedades
   * del parametro config
   */
  private setDefaultConfig = async () => {
    this.internalDisplayConfig = GaUtils.buildDefaultInternalDisplayConfig();
    const serverDefaults = { tiposPermitidos: null, pesoMaximoEnMB: null };

    this.config = this.config ?
      { ...GaUtils.buildDefaultConfig(), ...this.config } :
      GaUtils.buildDefaultConfig();

    const { tiposPermitidos, pesoMaximoEnMB } = this.config;

    if (!tiposPermitidos || !pesoMaximoEnMB) {
      // Si no se han personalizado tipos de archivos permitidos
      // o tamaño màximo de archivo, obtener valores por defecto
      try {
        this.showLoading();
        const response = await this.gaService.getFileSettings().toPromise();
        serverDefaults.tiposPermitidos = response.tiposPermitidos;
        serverDefaults.pesoMaximoEnMB = response.pesoMaximoEnMB;
        this.hideLoading();
      } catch (e) { this.hideLoading(); }
    }

    this.config = {
      ...this.config,
      tiposPermitidos: tiposPermitidos ?
        tiposPermitidos : serverDefaults.tiposPermitidos,
      pesoMaximoEnMB: pesoMaximoEnMB ?
        pesoMaximoEnMB : serverDefaults.pesoMaximoEnMB
    };

    this.setAceptedFiles();

    this.friendlyConfig = this.friendlyConfig ?
      { ...GaUtils.buildDefaultFriendlyConfig(), ...this.friendlyConfig } :
      GaUtils.buildDefaultFriendlyConfig();
  }

  private setAceptedFiles = () => {
    return new Promise(
      (resolve)=>{
        this.acceptedFiles = GaUtils.convertirExtensionAString(this.config.tiposPermitidos);
      resolve();
    });
  }

  private blinkText = () => {
    return new Promise(
      (resolve)=>{
        if (this.container) {
          this.renderer.addClass(this.container.nativeElement, 'blinking');
          setTimeout(() => {
            this.renderer.removeClass(this.container.nativeElement, 'blinking');
          }, 400);
        }
      resolve();
    });
  }

  private clearInputFile = () => {
    return new Promise(
      (resolve)=>{
        this.inputFile.nativeElement.value = null;
      resolve();
    });
  }

  private resetEstadoControl = () => {
    return new Promise(
      (resolve)=>{
        this.estadoControl = this.esRequerido ?
        EnumEstadoControl.OBLIGATORIO_NO_SELECCIONADO :
        EnumEstadoControl.ESTADO_INICIAL;
        resolve();
    });
  }

  private prepareFormData = () => {

    const objFormData = new FormData(this.form.nativeElement);
    //objFormData.append(this.selectedFile.name, this.selectedFile);
    objFormData.append('file', this.selectedFile);

    // console.log(objFormData);

    const paramsRequestMerged = {
      id: this.idArchivo,
      usuarioCreacion: 'system',
      ...this.paramsExtra
    };

    const mergedPayload = {
      op: (!this.idArchivo ? 'I' : 'U'),
      ...this.extPayload
    };

    const mergedRequestData = JSON.stringify({
      ...paramsRequestMerged,
      metadata: this.metadata,
      metadataVersion: this.metadataVersion,
      etiqueta: this.tags,
      idAplicacion: this.idApp,
      tgpl: window.btoa(JSON.stringify(mergedPayload))
    });

    // objFormData.append('request', mergedRequestData);
    // objFormData.append('maxfileMB', `${this.config.pesoMaximoEnMB}`);
    // objFormData.append('esBorrador', `${this.config.usarBorradores}`);

    objFormData.append('IdUsuarioAutor', this.paramsExtra.idUsuarioAutor);
    objFormData.append('DescUsuarioAutor', this.paramsExtra.descUsuarioAutor);
    objFormData.append('IdRolUsuarioAutor', this.paramsExtra.idRolUsuarioAutor);
    objFormData.append('DescRolUsuarioAutor', this.paramsExtra.descRolUsuarioAutor);
    objFormData.append('IdAplicacion',this.paramsExtra.idAplicacion);
    objFormData.append('IdCatalogo',this.paramsExtra.idCatalogo);
    objFormData.append('IdCondicion',this.paramsExtra.idCondicion);
    objFormData.append('IdComponente',this.paramsExtra.idComponente);
    objFormData.append('IdIndicador',this.paramsExtra.idIndicador);
    objFormData.append('IdMedioVerificacion',this.paramsExtra.idMedioVerificacion);

    // console.log(objFormData);
    return objFormData;
  }

  /**
   * Controla la accion al subir correctamente un archivo
   */
  private handleUploadSuccess = (response: any) => {
    // console.log(response);
    // formatear peso archivo
    //const pesoArchivo = GaUtils.formatearPesoArchivo(response.data.pesoEnBytes);
    // asignar texto a mostrar
    //this.setDisplayText(`${response.data.nombreOficial} (${pesoArchivo})`);
    // asignar id archivo generado
    this.setDataArchivo(response.data);
    //this.setIdArchivo(response.data.idArchivo);
    //this.setIdArchivo("8F305806-1C37-4C7F-8CDB-6E49F8E3205F");

    if (this.config.mostrarAlertasExito) {
      const mensajeExito = response.messages && response.messages.length > 0 ?
        response.messages[0] : GA_MENSAJES.SUCCESS_ARCHIVO_SUBIDO;
      this.toastService.success(mensajeExito);
    }

    this.success.emit({ operation: EnumGaOperation.UPLOAD_FILE });

    this.estadoControl = EnumEstadoControl.OK;

    this.hideLoading();

    this.internalDisplayConfig.barraProgresoVisible = false;

    this.internalDisplayConfig.barraProgresoPorcentaje = 0;

    //this.resetUploadForm();

    //this.getFile();
  }

  /**
   * Controla el error al subir un archivo
   */
  private handleUploadError = (msg: string) => {
    this.internalDisplayConfig.barraProgresoVisible = false;
    this.internalDisplayConfig.barraProgresoPorcentaje = 0;
    this.hideLoading();
    this.toastService.error(msg);
    this.resetEstadoControl();
    this.error.emit({ operation: EnumGaOperation.UPLOAD_FILE });
  }

  private handleUploadProgress = (procesado, total) => {
    this.internalDisplayConfig.barraProgresoPorcentaje = Math.round((procesado / total) * 100);
  }

  private resetUploadForm = () => {
    this.form.nativeElement.reset();
    this.clearInputFile();
    this.setSelectedFile(null);
  }

  private getFile = () => {
    // if (!this.idArchivo) {
    //   const { defaultDisplayText } = this.config;
    //   this.setDisplayText(defaultDisplayText ? defaultDisplayText : GA_MENSAJES.DEFAULT_TEXT);
    //   return false;
    // }

    if (!this.trackingNumber) {
      // console.log(this.config);
      const { defaultDisplayText } = this.config;
      this.setDisplayText(defaultDisplayText ? defaultDisplayText : GA_MENSAJES.DEFAULT_TEXT);
      return false;
    }

    this.estadoControl = EnumEstadoControl.OK;

    this.showLoading();

    this.gaService.getInfoByTrackinNumber(this.trackingNumber).subscribe(responseTracking=>{
      // console.log(responseTracking);

      if(responseTracking){
        const idArchivo = responseTracking['contenido'].contenido;
        // console.log(idArchivo);
        if(isNullOrUndefined(idArchivo)) return;

        if(!(idArchivo=="00000000-0000-0000-0000-000000000000")){
          //si trae id archivo???
          this.setIdArchivo(idArchivo);
          this.gaService.getFileInfo({
            id: this.idArchivo,
            version: this.config.version,
            buscarBorrador: this.config.usarBorradores,
            modo: this.config.puedeVerHistorialArchivo ? 2 : 1,
            pageSize: this.config.maxVersionesHistorial
          }).subscribe(response => {
            this.hideLoading();
            // console.log(response);
            if (response.success) {
              this.assimilateFileInfo(response.data);

              if (this.config.puedeVerHistorialArchivo && response.HistoryPayload) {
                this.assimilateHistoryInfo(response.HistoryPayload);
              }
              if (this.config.puedeVerHistorialArchivo && response.historialVersiones) {
                this.assimilateHistoryInfo(response.historialVersiones);
              }
            } else {
              const msg = response.messages && response.messages.length > 0 ?
                response.messages[0] :
                GA_MENSAJES.ERROR_INFORMACION_ARCHIVO;

              //this.setDisplayText(msg);

              if (response.data && response.data.reemplazarDatos) {
                this.setIdArchivo(null);
              }
            }
          }, error => {
            const errorText = error && error.statusText ? `${error.statusText} (${error.status})` : '';
            this.setDisplayText(`${GA_MENSAJES.ERROR_OBTENER_INFO_ARCHIVO} ${errorText}`);
            this.hideLoading();
          });
        }
        else{
          this.hideLoading();
          this.assimilateFileTrackingNumber(responseTracking,this.selectedFile.name);
        }
      }
    });
  }

  private deleteDraft = () => {
    return new Promise((resolve, reject) => {
      if (!this.idArchivo) {
        resolve();
        return;
      }
      this.gaService.deleteDraft(this.idArchivo).subscribe(() => {
        resolve();
      }, () => {
        this.toastService.error(GA_MENSAJES.ERROR_ELIMINAR_BORRADOR);
        reject();
      });
    });
  }

  private assimilateFileInfo = (fileInfo: any) => {
    if (!fileInfo) { return; }
    // const pesoArchivo = GaUtils.formatearPesoArchivo(fileInfo.pesoEnBytes);
    // //this.setNombreArchivoOriginal(fileInfo.nombreOficial);
    // this.setNombreArchivoOriginal(fileInfo.nombre);
    // this.setDisplayText(`${this.nombreArchivoOriginal} (${pesoArchivo})`);
    // this.setTags(fileInfo.etiqueta);
    return new Promise(
      async (resolve)=>{
        const informacion = {
          parametros: this.paramsExtra,
          fileInfo: fileInfo,
          estado:"Cargado",
          esIdArchivo:true,

          idArchivo:fileInfo.id,
          idUsuario:fileInfo.usuarioCreacion,
          idAplicacion:fileInfo.idAplicacion,
          version:fileInfo.version
        }

        await this.setIdArchivo(null);
        await this.setTrackingNumber(null);
        await this.setTags('');
        await this.setDisplayText(GA_MENSAJES.DEFAULT_TEXT);

        await this.resetEstadoControl();
        await this.clearInputFile();
        await this.setSelectedFile(null);
        await this.blinkText();

        // console.log(informacion);
        this.sendInfoSuccess.emit(informacion);
      resolve();
    });
  }

  private assimilateFileTrackingNumber = async (fileInfo:any, nombre:string)=>{
    if (!fileInfo) { return; }
    fileInfo.nombre=nombre;

    let estado = fileInfo.contenido.contenidoArchivoMetadata.estadoRS;
    let nombreEstado:string='';
    if(estado==0) nombreEstado='EN PROCESO';
    if(estado==2) nombreEstado='FALLIDO';

    const informacion = {
      parametros: this.paramsExtra,
      fileInfo: fileInfo,
      estado:nombreEstado,
      esIdArchivo:false,
      trackingNumber:fileInfo.contenido.contenidoArchivoMetadata.trackingNumber,
      causaErrorProceso:fileInfo.contenido.contenidoArchivoMetadata.causaErrorProceso
    }
    await this.setIdArchivo(null);
    await this.setTrackingNumber(null);
    await this.setTags('');
    await this.setDisplayText(GA_MENSAJES.DEFAULT_TEXT);

    await this.resetEstadoControl();
    await this.clearInputFile();
    await this.setSelectedFile(null);
    await this.blinkText();

    // console.log(informacion);
    this.sendInfoSuccess.emit(informacion);
  }

  private assimilateHistoryInfo = (historyData: any) => {

    if (!historyData) {
      this.textEmptyHistoryData = GA_MENSAJES.ERROR_LOAD_HISTORY_DATA;
      this.historySource = { items: [] };
      return;
    }

    if (!historyData.Status.Success) {
      this.textEmptyHistoryData = historyData.Status.Messages && historyData.Status.Messages.length > 0 ?
        historyData.Status.Messages.join(',') : GA_MENSAJES.ERROR_LOAD_HISTORY_DATA;
      this.historySource = { items: [] };
      return;
    }

    if (historyData.Status.Success && historyData.Data && historyData.Data.length === 0) {
      this.textEmptyHistoryData = GA_MENSAJES.DEFAULT_EMPTY_HISTORY;
      this.historySource = { items: [] };
      return;
    }

    this.historySource = {
      items: historyData.Data.map(x => ({
        version: x.version,
        nombre: x.nombre,
        usuarioCreacion: (x.metadata && JSON.parse(x.metadata).NombreUsuario) ?
          JSON.parse(x.metadata).NombreUsuario : x.usuarioCreacion,
        pesoEnBytes: x.pesoEnBytes,
        fechaCreacion: x.fechaCreacion
      }))
    };
  }

  private setNombreArchivoOriginal = (nombre: string) => {
    this.nombreArchivoOriginal = nombre;
  }

  private setSelectedFile = (file: any) => {
    return new Promise(
      (resolve)=>{
        this.selectedFile = file;
      resolve();
    });
  }

  private setDisplayText = (msg: string) => {
    return new Promise(
      (resolve)=>{
        this.displayText = msg;
      resolve();
    });
  }

  private showLoading = () => {
    return new Promise(
      (resolve)=>{
        this.loading = true;
      resolve();
    });
  }

  private hideLoading = () => {
    return new Promise(
      (resolve)=>{
        this.loading = false;
      resolve();
    });
  }



  private setDataArchivo = (data: any) => {
    return new Promise(
      (resolve)=>{
          this.dataArchivoChange.emit(data);
      resolve();
    });
  }

  private setIdArchivo = (id: string) => {
    return new Promise(
      (resolve)=>{
        // console.log(this.idArchivo);
        // console.log(id);
        if (this.idArchivo !== id) {
          this.idArchivoChange.emit(id);
        }
        this.idArchivo = id;
        // console.log(this.idArchivo);
      resolve();
    });
  }

  private setTrackingNumber = (tracking:string)=>{
    return new Promise(
      (resolve)=>{
        // console.log(this.trackingNumber);
        // console.log(tracking);
        if (this.trackingNumber !== tracking) {
          this.trackingNumberChange.emit(tracking);
        }
        this.trackingNumber = tracking;
      resolve();
    });
  }

  private setTags = (tags: string) => {
    return new Promise(
      (resolve)=>{
        this.tags = tags;
      resolve();
    });
  }

  private setIdApp = () => {
    // console.log(this.appStore.state);
    // this.idApp = this.appStore.state.globalConfig.configuration.punku.guidSistema;
    this.idApp = this.store.selectSnapshot(s => s.appStore.globalConfig.configuration.punku.guidSistema);
  }

}
