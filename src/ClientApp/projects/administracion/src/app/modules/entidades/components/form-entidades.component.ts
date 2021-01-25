import { skip } from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  IDataGridEvent,
  IDataGridButtonEvent,
  DialogService,
  AlertService,
} from '@sunedu/shared';
import { IAdministracionModelADM } from '../../stores/administracion.interface';
import { EntidadStore } from '../stores/entidad.store';
import { IEntidad } from '../stores/entidad.store.interface';
import { FormModalEntidadComponent } from '../modals/form-modal-entidad.component';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

@Component({
  selector: 'form-entidades',
  templateUrl: './form-entidades.component.html',
  styleUrls: [],
  providers: [EntidadStore],
})
export class FormEntidadesComponent implements OnInit, OnDestroy {
  @Input() configTab: any = null;
  @Input() modelData: IAdministracionModelADM = null;
  readonly state$ = this.store.state$;

  constructor(
    private store: EntidadStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }
  ngOnDestroy() {}
  handleLoadData = (e: IDataGridEvent) => {
    // Acciones del Footer (Paginado) de la grilla
    this.store.entidadBuscadorActions.asyncFetchEntidades({
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip,
    });
  };

  private loadInitialData = () => {
    // Leer toda las entidades
    this.store.entidadBuscadorActions.asyncFetchEntidades();
  };

  handleClickNuevoUniversidad = () => {
    this.store.entidadModalActions.setModalNew();
    const dialogRef = this.dialog.openMD(FormModalEntidadComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.succesEvent.subscribe((success) => {
      if (success === true) {
        this.loadInitialData();
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.store.entidadModalActions.resetModalEntidad();
    });
  };
  openModalUpdate = (id: string) => {
    this.store.entidadModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(FormModalEntidadComponent);

    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.succesEvent.subscribe((success) => {
      if (success === true) {
        this.loadInitialData();
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.store.entidadModalActions.resetModalEntidad();
    });
  };
  openModalConsultar = (id: string) => {
    this.store.entidadModalActions.setModalReadOnly(id);
    const dialogRef = this.dialog.openMD(FormModalEntidadComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.entidadModalActions.resetModalEntidad();
    });
  };
  deleteUniversidad = (item: IEntidad) => {
    this.alert
      .open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          const audit = new AppAudit(this.storeCurrent);
          item = audit.setDelete(item);

          this.store.entidadBuscadorActions
            .asynDeleteEntidad(item)
            .subscribe((reponse) => {
              this.loadInitialData();
              if (reponse.success) {
                this.alert.open(reponse.message, null, { icon: 'success' });
              } else {
                this.alert.open(reponse.message, null, { icon: 'warning' });
              }
            });
        }
      });
  };
  handleClickButton = (e: IDataGridButtonEvent) => {
    const item = e.item as IEntidad;
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(item.id);
        break;
      case 'EDITAR':
        this.openModalUpdate(item.id);
        break;
      case 'ELIMINAR':
        this.deleteUniversidad(item);
        break;
    }
  };

  handleClickFirma = () => {};
}
