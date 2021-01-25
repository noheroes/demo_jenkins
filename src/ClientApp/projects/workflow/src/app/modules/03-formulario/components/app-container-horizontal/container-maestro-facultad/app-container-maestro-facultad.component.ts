import { AppAudit, AppCurrentFlowStore, APP_FORM_VALIDATOR } from '@lic/core'; 
import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent, FormModel, FormType, ISubmitOptions, ToastService, ValidateFormFields, IMsgValidations } from '@sunedu/shared';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { MaestroFacultadStore } from '../../../store/maestrofacultad/maestrofacultad.store';
import { EntidadMaestroFacultad } from '../../../store/maestrofacultad/maestrofacultad.store.model';
import { IEntidadMaestroFacultad, IBandejaMaestroFacultad, IRequestSolicitudVersion, IFormMaestroFacultad } from './../../../store/maestrofacultad/maestrofacultad.store.interface';
import { AppFormMaestroFacultadComponent } from '../../app-form/app-form-maestro-facultad/app-form-maestro-facultad.component';
@Component({
  selector: 'app-container-maestro-facultad',
  templateUrl: './app-container-maestro-facultad.component.html',
  styleUrls: ['./app-container-maestro-facultad.component.scss'],
  providers: [
    MaestroFacultadStore
  ]
})
export class AppContainerMaestroFacultadComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() readOnly:boolean=false;
  //readonly state$ = this.store.state$;
  state$: Observable<IBandejaMaestroFacultad>;
  //validators: any;
  //formType = FormType;
  //form: FormModel<IBandejaMaestroFacultad>;
  constructor(
    private store: MaestroFacultadStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.bandejaMaestroFacultad), distinctUntilChanged());

    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest: Partial<IRequestSolicitudVersion> = {
      idVersion: current.idVersionSolicitud
    };
    this.store.maestroFacultadBandejaActions.asyncFetchPageMaestroFacultad(formRequest).subscribe();
    this.store.maestroFacultadBandejaActions.setReadOnly(this.readOnly);
  }
  

  handleClickButton = (e: IDataGridButtonEvent) => {

    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultarFacultad(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdateFacultad(e.item.id);
        break;
      case 'ELIMINAR':
        this.deleteMaestroFacultad(e.item.id);
        break;
    }
  };
  private openModalUpdateFacultad = (id: string) => {
   
    const formRequest: IRequestSolicitudVersion = {
      idVersion: this.storeCurrent.currentFlowAction.get().idVersionSolicitud,
      idElemento:id
    };
    this.store.maestroFacultadFormActions.setModalEdit(formRequest);
    const dialogRef = this.dialog.openMD(AppFormMaestroFacultadComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.maestroFacultadFormActions.resetModal();
      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: Partial<IRequestSolicitudVersion> = {
        idVersion: current.idVersionSolicitud
      };
      this.store.maestroFacultadBandejaActions.asyncFetchPageMaestroFacultad(formRequest).subscribe();
    });
  }
  private openModalConsultarFacultad = (id: string) => {
    
    const formRequest: IRequestSolicitudVersion = {
      idVersion: this.storeCurrent.currentFlowAction.get().idVersionSolicitud,
      idElemento:id
    };
    this.store.maestroFacultadFormActions.setModalReadOnly(formRequest);
    const dialogRef = this.dialog.openMD(AppFormMaestroFacultadComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.maestroFacultadFormActions.resetModal();
    });
  }
  deleteMaestroFacultad = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.maestroFacultadBandejaActions.asynDeleteMaestroFacultad(id,this.storeCurrent.currentFlowAction.get().idVersionSolicitud).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          const formRequest: IRequestSolicitudVersion = {
            idVersion: this.storeCurrent.currentFlowAction.get().idVersionSolicitud,
            idElemento:id
          };
          this.store.maestroFacultadBandejaActions.asyncFetchPageMaestroFacultad(formRequest).subscribe();
        });
      }
    });
  };
  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    const formRequest: IRequestSolicitudVersion = {
      idVersion: this.storeCurrent.currentFlowAction.get().idVersionSolicitud,
      idElemento:"0"
    };
    this.store.maestroFacultadBandejaActions.asyncFetchPageMaestroFacultad(formRequest,pageRequest).subscribe();
  };
  handleClickAgregarFacultad = () => {
    const formRequest: Partial<IRequestSolicitudVersion> = {
      idVersion: this.storeCurrent.currentFlowAction.get().idVersionSolicitud
    };
    this.store.maestroFacultadFormActions.setModalNew(
      formRequest
      );
    const dialogRef = this.dialog.openMD(AppFormMaestroFacultadComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.maestroFacultadFormActions.resetModal();
      this.store.maestroFacultadBandejaActions.asyncFetchPageMaestroFacultad(formRequest).subscribe(response => {
      });
    });
  }
}

