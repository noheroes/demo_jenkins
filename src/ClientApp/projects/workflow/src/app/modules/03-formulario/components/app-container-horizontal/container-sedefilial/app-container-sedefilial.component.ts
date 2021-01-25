import { Component, OnInit, Input } from '@angular/core';
import { SedeFilialStore } from '../../../store/sedefilial/sedefilial.store';
import { AppAudit, IFormularioModel } from '@lic/core';
import { DialogService, AlertService, IDataGridEvent, IDataGridButtonEvent } from '@sunedu/shared';
import { AppFormSedefilialComponent } from '../../app-form/app-form-sedefilial/app-form-sedefilial.component';
import { LocalStore } from '../../../store/local/local.store';
import { AppFormLocalComponent } from '../../app-form/app-form-local/app-form-local.component';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IFormBuscardorSedeFilial } from '../../../store/sedefilial/sedefilial.store.interface';

@Component({
  selector: 'app-container-sedefilial',
  templateUrl: './app-container-sedefilial.component.html',
  styleUrls: ['./app-container-sedefilial.component.scss'],
  providers: [
    SedeFilialStore,
    LocalStore
  ]
})
export class AppContainerSedefilialComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() readOnly:boolean=false;
  readonly state$ = this.store.state$;
  readonly localState$ = this.localStore.state$;
  constructor(
    private store: SedeFilialStore,
    public dialog: DialogService,
    private alert: AlertService,
    private localStore: LocalStore,
    private storeUbigeo:UbigeoGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  //identificador de la sede filial
  codigoSedeFilial : any;
  ubigeo: string;
  codigo: string;
  paginador: IDataGridEvent;  

  ngOnInit() {
    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest: IFormBuscardorSedeFilial = {
      id: '',
      idVersion: current.idVersionSolicitud
    };
    this.store.sedeFilialBuscadorActions.setInit(formRequest);
    this.store.sedeFilialBuscadorActions.setReadOnly(this.readOnly);
    this.store.sedeFilialBuscadorActions.asyncFetchPageSedeFilial().subscribe();
  }

  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.store.sedeFilialBuscadorActions.asyncFetchPageSedeFilial(pageRequest).subscribe();
  }

  handleLoadLocalData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.localStore.localBuscadorActions.asyncFetchPageLocal(pageRequest).subscribe();
  }

  handleClickNuevoSedeFilial = () => {
    this.store.sedeFilialModalActions.setModalNew(this.store.sedeFilialBuscadorActions.getSedesBandeja());
    const dialogRef = this.dialog.openMD(AppFormSedefilialComponent);

    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;

    dialogRef.afterClosed().subscribe(() => {
      this.store.sedeFilialModalActions.resetModalSedeFilial();
      this.store.sedeFilialBuscadorActions.asyncFetchPageSedeFilial().subscribe(response => {
      });
    });
  }
  openModalUpdate = (id: string) => {
    this.store.sedeFilialModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(AppFormSedefilialComponent);

    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;

    dialogRef.afterClosed().subscribe(() => {
      this.store.sedeFilialModalActions.resetModalSedeFilial();
      this.store.sedeFilialBuscadorActions.asyncFetchPageSedeFilial().subscribe(response => {
      });
    });
  }
  openModalConsultar = (id: string) => {
    this.store.sedeFilialModalActions.setModalReadOnly(id);
    const dialogRef = this.dialog.openMD(AppFormSedefilialComponent);

    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;

    dialogRef.afterClosed().subscribe(() => {
      this.store.sedeFilialModalActions.resetModalSedeFilial();
    });
  }
  deleteAmbiente = (formValue: any) => {
    //Está seguro de eliminar el registro 
    
    this.alert.open('¿Está seguro de eliminar el registro? '+"\n"+'Al aceptar se eliminarán todos los datos asociados a la sede/filial.', null, { confirm: true }).then(confirm => {
      if (confirm) {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setDelete(formValue);
        this.store.sedeFilialBuscadorActions.asynDeleteSedeFilial(formValue).subscribe(reponse => {
          if (reponse['success']){
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.store.sedeFilialBuscadorActions.asyncFetchPageSedeFilial().subscribe();
          } else {
            this.alert.open(reponse['message'], null, { icon: 'error' });
          }   
          
        });
      }
    });
  }
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item.id);
        break;
      case 'ELIMINAR':
        this.deleteAmbiente(e.item);
        break;
      case 'AGREGAR_LOCAL':
        this.openLocales(e.item.id, e.item.ubigeo, e.item.codigo);
        break;
    }
  }

  retornar = () => {
    this.store.state.formato.currentForm = 'sedeFilial';
    this.store.sedeFilialBuscadorActions.asyncFetchPageSedeFilial().subscribe();    
  }

  handleClickButtonLocal = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultarLocal(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdateLocal(e.item.id);
        break;
      case 'ELIMINAR':
         this.deleteLocal(e.item.id);
        break;
    }
  }
  openLocales = (idSedeFilial : string, ubigeo: string, codigo: string) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest: IFormBuscardorSedeFilial = {
      id: idSedeFilial,
      idVersion: current.idVersionSolicitud
    };
    this.codigoSedeFilial = idSedeFilial;
    this.ubigeo = ubigeo;
    this.codigo = codigo;
    this.localStore.localBuscadorActions.setInit(formRequest);
    this.localStore.localBuscadorActions.setReadOnly(this.readOnly);
    this.localStore.localBuscadorActions.asyncFetchPageLocal().subscribe();
    this.store.state.formato.currentForm = 'local';   

  }

  handleClickNuevoLocal = () => {
    this.localStore.localModalActions.setModalNew(this.codigoSedeFilial, this.ubigeo, this.codigo);
    const dialogRef = this.dialog.openMD(AppFormLocalComponent);
    dialogRef.componentInstance.store = this.localStore;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;
    dialogRef.afterClosed().subscribe(() => {
      this.localStore.localModalActions.resetModalLocal();
      this.localStore.localBuscadorActions.asyncFetchPageLocal().subscribe(response => {});
    });
  }

  openModalConsultarLocal = (id: string) => {
    this.localStore.localModalActions.setModalReadOnly(id, this.codigoSedeFilial);

    const dialogRef = this.dialog.openMD(AppFormLocalComponent, { disableClose: false });

    dialogRef.componentInstance.store = this.localStore;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;

    dialogRef.afterClosed().subscribe(() => {
      this.localStore.localModalActions.resetModalLocal();
    });
  }

  openModalUpdateLocal = (id: string) => {
    this.localStore.localModalActions.setModalEdit(id, this.codigoSedeFilial);
    const dialogRef = this.dialog.openMD(AppFormLocalComponent);

    dialogRef.componentInstance.store = this.localStore;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;

    dialogRef.afterClosed().subscribe(() => {
      this.localStore.localModalActions.resetModalLocal();
      this.localStore.localBuscadorActions.asyncFetchPageLocal().subscribe(response => {});
    });
  }

  deleteLocal = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.localStore.localBuscadorActions.asynDeleteLocal(id, this.codigoSedeFilial)
          .subscribe(reponse => {            
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.localStore.localBuscadorActions.asyncFetchPageLocal().subscribe(response => {});
          });
      }
    });
  }

}
