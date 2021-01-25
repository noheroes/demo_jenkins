import { MaestroProgramaSegundaStore } from './../../../store/maestroprogramasegunda/maestroprogramasegunda.store';
import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent } from '@sunedu/shared';
import { AppFormMaestroProgramaComponent } from '../../app-form/app-form-maestro-programa/app-form-maestro-programa.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppFormMaestroProgramaSeComponent } from '../../app-form/app-form-maestro-programa-se/app-form-maestro-programa-se.component';
import { AppFormMaestroProgramaVinComponent } from '../../app-form/app-form-maestro-programa-vin/app-form-maestro-programa-vin.component';
import { IRequestSolicitudVersion } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store.interface';
@Component({
  selector: 'app-container-maestro-programa-segunda',
  templateUrl: './app-container-maestro-programa-segunda.component.html',
  styleUrls: ['./app-container-maestro-programa-segunda.component.scss'],
  providers: [
    MaestroProgramaSegundaStore
  ]
})
export class AppContainerMaestroProgramaSegundaComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() readOnly:boolean=false;
  //state$: Observable<IBandejaMaestroPrograma>;
  readonly state$ = this.store.state$;
  regimenEstudioEnum:any;
  //storeCurrent: AppCurrentFlowStore
  constructor(
    private store: MaestroProgramaSegundaStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado: EnumeradoGeneralStore,
  ) { }

  ngOnInit() {

    //this.state$ = this.store.state$.pipe(map(x => x.bandejaMaestroPrograma), distinctUntilChanged());
    const current = this.storeCurrent.currentFlowAction.get();
    //console.log('CAYL current', current);
    const formRequest: IRequestSolicitudVersion = {
      idVersion: current.idVersionSolicitud
    };
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDREGIMENESTUDIO')
    ).pipe(tap(enums => {
      this.regimenEstudioEnum = enums[0].list;
      this.store.programaBandejaActions.setInit(formRequest);
      this.store.programaBandejaActions.setReadOnly(this.readOnly);

      this.store.programaBandejaActions.asyncFetchPageMaestroPrograma(
        this.regimenEstudioEnum
      ).subscribe();

      this.store.segundaBandejaActions.setInit(formRequest);
      this.store.segundaBandejaActions.setReadOnly(this.readOnly);
      this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(this.regimenEstudioEnum).subscribe();

    })).subscribe();
  }

  handleClickNuevoProgramaMencion = () => {
    this.store.programaFormActions.setModalNew(
      this.store.programaBandejaActions.getCodigoGenerado(),
      this.store.programaBandejaActions.getFormResponse(),
      this.store.state.bandejaMaestroPrograma.formRequest.idVersion
      );
    const dialogRef = this.dialog.openMD(AppFormMaestroProgramaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.programaFormActions.resetModal();
      this.store.programaBandejaActions.asyncFetchPageMaestroPrograma(this.regimenEstudioEnum).subscribe(response => {
      });
    });
  }
  handleLoadDataPrograma = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.store.programaBandejaActions.asyncFetchPageMaestroPrograma(this.regimenEstudioEnum,pageRequest).subscribe();
  }
  private openModalUpdatePrograma = (id: string) => {
    this.store.programaFormActions.setModalEdit(
      id,
      this.store.state.bandejaMaestroPrograma.formRequest.idVersion,
      this.store.state.bandejaMaestroPrograma.formResponse
      );
    const dialogRef = this.dialog.openMD(AppFormMaestroProgramaComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.programaFormActions.resetModal();
      this.store.programaBandejaActions.asyncFetchPageMaestroPrograma(this.regimenEstudioEnum).subscribe(response => {
      });
    });
  }
  private openModalConsultarPrograma = (id: string) => {
    this.store.programaFormActions.setModalReadOnly(
      id,
      this.store.state.bandejaMaestroPrograma.formRequest.idVersion,
      this.store.state.bandejaMaestroPrograma.formResponse
    );
    const dialogRef = this.dialog.openMD(AppFormMaestroProgramaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.programaFormActions.resetModal();
    });
  }
  deletePrograma = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.programaBandejaActions.asynDeleteMaestroPrograma(id).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.programaBandejaActions.asyncFetchPageMaestroPrograma(this.regimenEstudioEnum).subscribe();
        });
      }
    });
  }

  handleClickButtonPrograma = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultarPrograma(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdatePrograma(e.item.id);
        break;
      case 'ELIMINAR':
        this.deletePrograma(e.item.id);
        break;
    }
  }


  /** SEGUNDA */

  handleClickNuevoSegundaSegunda = () => {
    this.store.segundaFormActions.setModalNew(
      this.store.segundaBandejaActions.getCodigoGenerado(),
      this.store.segundaBandejaActions.getFormResponse(),
      this.store.state.bandejaMaestroProgramaSegunda.formRequest.idVersion
      );
    const dialogRef = this.dialog.openMD(AppFormMaestroProgramaSeComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.segundaFormActions.resetModal();
      this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(
        this.regimenEstudioEnum
      ).subscribe(response => {
      });
    });
  }
  handleLoadDataSegunda = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(this.regimenEstudioEnum,pageRequest).subscribe();
  }
  private openModalUpdateSegunda = (id: string) => {
    this.store.segundaFormActions.setModalEdit(
      id,
      this.store.state.bandejaMaestroProgramaSegunda.formRequest.idVersion,
      this.store.state.bandejaMaestroProgramaSegunda.formResponse
      );
    const dialogRef = this.dialog.openMD(AppFormMaestroProgramaSeComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.segundaFormActions.resetModal();
      this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(
        this.regimenEstudioEnum
      ).subscribe(response => {
      });
    });
  } 
  private openModalVincular = (id: string, name: string) => {
    const formRequest: IRequestSolicitudVersion = {
      idVersion: this.store.state.bandejaMaestroProgramaSegunda.formRequest.idVersion
    };
    this.store.vinculadoBandejaActions.setInit(formRequest);
    this.store.vinculadoBandejaActions.setModalVinculado(id).subscribe(reponse => {
      const dialogRef = this.dialog.openMD(AppFormMaestroProgramaVinComponent);
      dialogRef.componentInstance.store = this.store;
      dialogRef.componentInstance.readOnly = this.readOnly;
      dialogRef.componentInstance.nombre_segEspecialidad = name;
      dialogRef.afterClosed().subscribe(() => {
        this.store.vinculadoBandejaActions.resetModal();
      });
    });
  }
  private openModalConsultarSegunda = (id: string) => {
    this.store.segundaFormActions.setModalReadOnly(
      id,
      this.store.state.bandejaMaestroProgramaSegunda.formRequest.idVersion,
      this.store.state.bandejaMaestroProgramaSegunda.formResponse
    );
    const dialogRef = this.dialog.openMD(AppFormMaestroProgramaSeComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.segundaFormActions.resetModal();
    });
  }

  
  deleteProgramaSe = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.segundaBandejaActions.asynDeleteMaestroProgramaSegunda(id).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(
            this.regimenEstudioEnum
          ).subscribe();
        });
      }
    });
  }

  handleClickButtonSegunda = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultarSegunda(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdateSegunda(e.item.id);
        break;
      case 'ELIMINAR':
        this.deleteProgramaSe(e.item.id);
        break;
        case 'PROGRAMA_VINCULADO':
          this.openModalVincular(e.item.id, e.item.codigo +' - '+ e.item.denominacionPrograma);
          break;
    }
  }

}
