import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { DialogService, AlertService, IDataGridEvent, IDataGridButtonEvent } from '@sunedu/shared';
import { LocalStore } from '../../../store/local/local.store';
import { AppFormLocalComponent } from '../../app-form/app-form-local/app-form-local.component';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';

@Component({
  selector: 'app-container-local',
  templateUrl: './app-container-local.component.html',
  providers: [
    LocalStore
  ]
})
export class AppContainerLocalComponent implements OnInit {

  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  readonly state$ = this.store.state$;

  constructor(
    private store: LocalStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeUbigeo:UbigeoGeneralStore
  ) { }

  ngOnInit() {
    // this.store.sedeFilialBuscadorActions.asyncFetchLocal();
  }

  handleLoadData = (e: IDataGridEvent) => {
  }
  handleClickNuevoLocal = () => {
    this.store.localModalActions.setModalNew('','','');
    const dialogRef = this.dialog.openMD(AppFormLocalComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;
    dialogRef.afterClosed().subscribe(() => {
      this.store.localModalActions.resetModalLocal();
    });
  }
  openModalUpdate = (id: string) => {
    this.store.localModalActions.setModalEdit(id, '');
    const dialogRef = this.dialog.openMD(AppFormLocalComponent);

    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;
    dialogRef.afterClosed().subscribe(() => {
      this.store.localModalActions.resetModalLocal();
    });
  }
  openModalConsultar = (id: string) => {
    this.store.localModalActions.setModalReadOnly(id, '');
    const dialogRef = this.dialog.openMD(AppFormLocalComponent);
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;
    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.localModalActions.resetModalLocal();
    });
  }
  deleteAmbiente = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.localBuscadorActions.asynDeleteLocal(id, '').subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
        });
      }
    });
  }
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item._id);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item._id);
        break;
      case 'ELIMINAR':
        this.deleteAmbiente(e.item._id);
        break;
      case 'AGREGAR_CURSOS':
        // this.openCursos();
        break;
    }
  }

}
