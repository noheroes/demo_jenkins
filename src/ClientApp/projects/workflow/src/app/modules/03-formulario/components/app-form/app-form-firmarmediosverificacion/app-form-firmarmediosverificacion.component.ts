import { Component, OnInit, Input } from '@angular/core';
import { DialogService, AlertService } from '@sunedu/shared';
import { AppCurrentFlowStore } from '../../../../../../../../../src/app/core/store/app.currentFlow.store';
import {
  ModalFirmaComponent,
  StatusFirma,
} from '../../../../../../../../../src/app/core/components/app-modal/app-modal-firma/app-modal-firma.component';

import { MediosVerificacionStore } from '../../../store/mediosverificacion/mediosverificacion.store';
import { ArchivoTestigoStore } from '../../../store/archivoTestigo/archivoTestigo.store';
import { ICurrentFlow } from 'src/app/core/store/app.state.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentosOperacionStore } from '../../../store/documentos-operacion/documentos-operacion.store';

@Component({
  selector: 'app-form-firmarmediosverificacion',
  templateUrl: './app-form-firmarmediosverificacion.component.html',
  providers: [MediosVerificacionStore, ArchivoTestigoStore, DocumentosOperacionStore],
})
export class AppFormFirmarMediosverificacionComponent implements OnInit {
  @Input() configTab: any;
  @Input() modelData: any;

  inProcess: boolean = false;
  readonly state$ = this.mvStore.state$;
  current: any;
  idVersionSolicitud: string;
  items: any = [];
  mvDisabled:boolean = false;
  atDisabled:boolean = false;
  docDisabled:boolean = false;
  tieneMV:boolean=false;
  requestReplicate: any;
  requestReplicateMV:any;
  requestReplicateAT: any;
  esFirmadoDocumento:boolean=false;
  title:string;
  esFirmaAT:boolean=false;

  constructor(
    private mvStore: MediosVerificacionStore,
    private atStore: ArchivoTestigoStore,
    private docStore: DocumentosOperacionStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) {}

  ngOnInit() {
    this.mvStore.firmarMediosVerificacionActions.setInit(this.modelData);
    this.atStore.firmarArchivoTestigoActions.setInit(this.modelData);
    this.docStore.documentosOperacionActions.setInit(this.modelData);
    // console.log('CAYL configTab', this.configTab);
    // console.log('CAYL modelData', this.modelData);
    this.onEstadoFirma();
  }

  onEstadoFirma = () =>{
    this.current = this.storeCurrent.currentFlowAction.get();
    //console.log('CAYL onEstadoFirma current', this.current);
    this.mvStore.firmarMediosVerificacionActions.asyncGetEstadoFirma(this.current).subscribe(
      estado=> {
        //console.log('CAYL estado', estado);
        this.mvDisabled = estado?estado.conFirmaMV:false;
        this.atDisabled = estado?estado.conFirmaArchivoTestigo:false;
        this.docDisabled = estado?estado.conDocumento:false;
      }
    );
    // Deshabilitando
    this.esFirmadoDocumento = this.current.esFirmadoDocumento;
    this.esFirmaAT=this.current.esFirmaAT;
    this.title = this.esFirmadoDocumento? "":"Firmar los medios de verificación para todas las sede/filiales y archivo testigo del registro de la solicitud";

  }

  handleClickFirma = async () => {
    this.inProcess = true;
    this.tieneMV = false;
    await this.loadTieneMV();
    if(!this.tieneMV){
      this.inProcess = false;
      this.alert.open('No existe ningún archivo cargado en Medios de Verificación', null, { confirm: false, icon: 'info' });
      return;
    }

    //this.current = this.storeCurrent.currentFlowAction.get();
    this.current = this.storeCurrent.currentFlowAction.get();
    this.requestReplicateMV = {
      idVersionSolicitud: this.current.idVersionSolicitud,
      idUsuario: this.current.idUsuario,
      idRolAutor: this.current.idRol,
      usuarioAutorDescripcion: this.current.usuarioFullName,
      rolAutorDescripcion: this.current.rolDescripcion,
      idEntidad:  this.current.usuarioEsRolAdministrado ? this.current.idEntidad :  this.current.usuarioNumeroDocumento,
      excluirYaFirmados: true, 
      idProcesoOrigen:this.current.idProcesoOrigen,
      idProcesoBandejaOrigen: this.current.idProcesoBandejaOrigen
    }
    this.items = [];

    this.mvStore.firmarMediosVerificacionActions
      .asyncReplicateToFtp(this.requestReplicateMV)
      .subscribe((reponse) => {
        this.items = reponse.items;

        //this.inProcess = false;
        if (reponse.success) {
          this.callModalFirma(this.current.idEntidad);
        } else {
          this.inProcess = false;
          this.alert.open(reponse.message, null, { icon: 'warning' });
        }
      });
  };
  async loadTieneMV(){
    return new Promise<void>((resolve)=>{
      // CAYL aqui en la validacion;
      this.tieneMV=false;
      const current = this.storeCurrent.currentFlowAction.get();
      //console.log('CAYL current',current);
      this.mvStore.mediosVerificacionActions.asyncFetchMVDiagnostic(current.idVersionSolicitud).subscribe(response=>{
        //console.log('CAYL response',response);
        if(response){
          this.tieneMV = response.cantidadElementosValidos<1?false:true;
          resolve();
        }
      })
    })
  }
  callModalFirma(idEntidad: string) {
    const dialogRef = this.dialog.openMD(ModalFirmaComponent);

    dialogRef.componentInstance.model = {
      nroDocumento: '', // para busqueda de certificado
      rutaOrigen: idEntidad + '/', //  '41053336/' =>  carpeta de usuario en el servidor de firmas
      rutaDestino: idEntidad + '/', // '41053336/' =>  carpeta de usuario en el servidor de firmas
      nombreArchivos: '',
    };

    dialogRef.componentInstance.succesEvent.subscribe((status: StatusFirma) => {
      if (status.success === true) {
        this.inProcess = true;
        const cloneCurrent = Object.assign({}, this.requestReplicateMV);
        cloneCurrent.items = this.items;

        this.mvStore.firmarMediosVerificacionActions
          .asyncReplicateFromFtp(cloneCurrent)
          .subscribe((reponse) => {
            this.inProcess = false;

            if (reponse.success) {
              this.alert.open(reponse.message, null, { icon: 'success' });
              this.onUpdateEstadoFirma(2); // 2 == medios de verificacion
              //this.onEstadoFirma();
              this.mvDisabled=true;
            } else {
              this.alert.open(reponse.message, null, { icon: 'warning' });
            }
          });
      } else {
        this.alert.open(status.message, null, { icon: 'warning' });
      }
      dialogRef.close();
    });

    // dialogRef.afterClosed().subscribe(() => {});
  }

  handleClickFirmaArchivoTestigo = () => {
    this.current = this.storeCurrent.currentFlowAction.get();
    this.requestReplicateAT = {
      idVersionSolicitud: this.current.idVersionSolicitud,      
      idUsuario: this.current.idUsuario,
      idEntidad:  this.current.usuarioEsRolAdministrado ? this.current.idEntidad :  this.current.usuarioNumeroDocumento,
      excluirYaFirmados: true, 
      idProcesoOrigen:this.current.idProcesoOrigen,
      idProcesoBandejaOrigen: this.current.idProcesoBandejaOrigen
    }    
    this.inProcess = true;
    this.items = [];
    
    this.atStore.firmarArchivoTestigoActions
      .asyncReplicateToFtp(this.requestReplicateAT)
      .subscribe((reponse) => {
        this.items = reponse.items;

        //this.inProcess = false;
        if (reponse.success) {
          this.callModalFirmaArchivoTestigo(this.requestReplicateAT.idEntidad);
        } else {
          this.inProcess = false;
          this.alert.open(reponse.message, null, { icon: 'warning' });
        }
      });
  };
  callModalFirmaArchivoTestigo(idEntidad: string) {
    const dialogRef = this.dialog.openMD(ModalFirmaComponent);

    dialogRef.componentInstance.model = {
      nroDocumento: '', // para busqueda de certificado
      rutaOrigen: idEntidad + '/', //  '41053336/' =>  carpeta de usuario en el servidor de firmas
      rutaDestino: idEntidad + '/', // '41053336/' =>  carpeta de usuario en el servidor de firmas
      nombreArchivos: '',
    };

    dialogRef.componentInstance.succesEvent.subscribe((status: StatusFirma) => {
      if (status.success === true) {
        this.inProcess = true;
        const cloneCurrent = Object.assign({}, this.requestReplicateAT);
        cloneCurrent.items = this.items;

        this.atStore.firmarArchivoTestigoActions
          .asyncReplicateFromFtp(cloneCurrent)
          .subscribe((reponse) => {
            this.inProcess = false;

            if (reponse.success) {
              this.alert.open(reponse.message, null, { icon: 'success' });
              this.onUpdateEstadoFirma(1); // 1 == archivo testigo
              //this.onEstadoFirma();
              this.atDisabled=true;
            } else {
              this.alert.open(reponse.message, null, { icon: 'warning' });
            }
          });
      } else {
        this.alert.open(status.message, null, { icon: 'warning' });
      }
      dialogRef.close();
    });

    // dialogRef.afterClosed().subscribe(() => {});
  }

  onUpdateEstadoFirma = (tipoFirma:number)=>{
    this.current = this.storeCurrent.currentFlowAction.get();
    this.mvStore.firmarMediosVerificacionActions.asyncSetUpdateEstadoFirma(this.current, tipoFirma).subscribe();
  }

  /* FIRMAR DOCUMENTOS */
  handleClickFirmaDocumento = () => {
    this.current = this.storeCurrent.currentFlowAction.get();    
    this.inProcess = true;    
    this.items = [];
    this.requestReplicate = {
      idVersionSolicitud: this.current.idVersionSolicitud,
      numeroDocumento: this.current.usuarioNumeroDocumento,
      idUsuario: this.current.idUsuario,
      idsSubtiposDocumento: this.current.documento.listarSubtipos,
      idsEstadosDocumento: this.current.documento.listarEstados,
      excluirYaFirmados: true,
      idProcesoOrigen: this.current.idProcesoOrigen, 
      idProcesoBandejaOrigen: this.current.idProcesoBandejaOrigen
    }   
    this.docStore.documentosOperacionActions
      .asyncReplicateToFtp(this.requestReplicate)
      .subscribe((reponse) => {
        this.items = reponse.items;

        //this.inProcess = false;
        if (reponse.success) {
          this.callModalFirmaDocumento(this.current.usuarioNumeroDocumento);
        } else {
          this.inProcess = false;
          this.alert.open(reponse.message, null, { icon: 'warning' });
        }
      });
  }

  callModalFirmaDocumento(idEntidad: string) {
    const dialogRef = this.dialog.openMD(ModalFirmaComponent);

    dialogRef.componentInstance.model = {
      nroDocumento: '', // para busqueda de certificado
      rutaOrigen: idEntidad + '/', //  '41053336/' =>  carpeta de usuario en el servidor de firmas
      rutaDestino: idEntidad + '/', // '41053336/' =>  carpeta de usuario en el servidor de firmas
      nombreArchivos: '',
    };

    dialogRef.componentInstance.succesEvent.subscribe((status: StatusFirma) => {
      if (status.success === true) {
        this.inProcess = true;
        const cloneCurrent = Object.assign({}, this.requestReplicate);
        cloneCurrent.items = this.items;
        cloneCurrent.idRolAutor = this.current.idRol;
        cloneCurrent.rolAutorDescripcion = this.current.rolDescripcion;
        cloneCurrent.usuarioAutorDescripcion = this.current.usuarioFullName;
        cloneCurrent.esRolAdministrado = this.current.usuarioEsRolAdministrado;

        this.docStore.documentosOperacionActions
          .asyncReplicateFromFtp(cloneCurrent)
          .subscribe((reponse) => {
            this.inProcess = false;

            if (reponse.success) {
              this.alert.open(reponse.message, null, { icon: 'success' });
              this.onUpdateEstadoFirma(3); // 3 == documento
              this.docDisabled=true;
              //this.onEstadoFirma();
              
            } else {
              this.alert.open(reponse.message, null, { icon: 'warning' });
            }
          });
      } else {
        this.alert.open(status.message, null, { icon: 'warning' });
      }
      dialogRef.close();
    });
  }
}
