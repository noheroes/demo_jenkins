import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IFormularioModel } from 'src/app/core/interfaces';
import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService } from '@sunedu/shared';
import { EquipamientoStore } from '../../../store/equipamiento/equipamiento.store';
import { AppFormEquipamientoComponent } from '../../app-form/app-form-equipamiento/app-form-equipamiento.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IFormBuscardorEquipamiento } from '../../../store/equipamiento/equipamiento.store.interface';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';


@Component({
  selector: 'app-container-equipamiento',
  templateUrl: './app-container-equipamiento.component.html',
  styleUrls: ['./app-container-equipamiento.component.scss'],
  providers: [
    EquipamientoStore
  ]
})
export class AppContainerEquipamientoComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal:string;
  @Input() idSede:string;

  // Enumerados
  tipoEquipoMobiliarioEnum:any;

  readonly state$ = this.equipamientoStore.state$;
  constructor(
    private equipamientoStore: EquipamientoStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeEnumerado:EnumeradoGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
  }

  private buildEnumerados = () =>{
    return new Promise(
      (resolve)=>{
        this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPOEQUIPOMOBILIARIO')
          .then(info=>{
            this.tipoEquipoMobiliarioEnum = info;
          });
        resolve();
      });
  }

  handleClickNuevoEquipamiento = () => {
    this.equipamientoStore.equipamientoModalActions.setModalNew(this.idSede, this.idLocal,"","");
    const dialogRef = this.dialog.openMD(AppFormEquipamientoComponent);
    dialogRef.componentInstance.store = this.equipamientoStore;

    dialogRef.afterClosed().subscribe(() => {
      this.equipamientoStore.equipamientoModalActions.resetModalEquipamiento();
      this.equipamientoStore.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe(response => {
      });
    });

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
    this.equipamientoStore.equipamientoModalActions.asyncFetchPageEquipamiento(pageRequest).subscribe();

  }
  openModalUpdate = (id: string) => {
    this.equipamientoStore.equipamientoModalActions.setModalEdit(id, this.idSede, this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormEquipamientoComponent);

    dialogRef.componentInstance.store = this.equipamientoStore;

    dialogRef.afterClosed().subscribe(() => {
        this.equipamientoStore.equipamientoModalActions.resetModalEquipamiento();
        this.equipamientoStore.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe(response => {
        });
    });
  }
  openModalConsultar = (id: string) => {

    this.equipamientoStore.equipamientoModalActions.setModalReadOnly(id, this.idSede, this.idLocal);

    const dialogRef = this.dialog.openMD(AppFormEquipamientoComponent, { disableClose: false });

    dialogRef.componentInstance.store = this.equipamientoStore;

    dialogRef.afterClosed().subscribe(() => {
      this.equipamientoStore.equipamientoModalActions.resetModalEquipamiento();
    });
  }

  deleteEquipamiento = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.equipamientoStore.equipamientoBuscadorActions.asynDeleteEquipamiento(id)
          .subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.equipamientoStore.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe(response => {
            });
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
         this.deleteEquipamiento(e.item.id);
        break;
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.buildEnumerados();
    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest: IFormBuscardorEquipamiento = {
      id: '',
      idVersion: current.idVersionSolicitud,
      idSedeFilial: this.idSede,
      idLocal: this.idLocal,
      listEquipoMobiliario: this.tipoEquipoMobiliarioEnum
    };
    this.equipamientoStore.equipamientoBuscadorActions.setInit(formRequest);
    if ((changes['idLocal'].currentValue != '') && (typeof(changes['idLocal'].currentValue) != 'undefined')) {
      this.equipamientoStore.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe();
    }
  }
}
