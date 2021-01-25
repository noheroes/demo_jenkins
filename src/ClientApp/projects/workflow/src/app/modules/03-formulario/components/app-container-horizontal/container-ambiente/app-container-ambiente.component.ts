import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { AmbienteStore } from '../../../store/ambiente/ambiente.store';
import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService } from '@sunedu/shared';
import { AppFormAmbienteComponent } from '../../app-form/app-form-ambiente/app-form-ambiente.component';

@Component({
  selector: 'app-container-ambiente',
  templateUrl: './app-container-ambiente.component.html',
  styleUrls: ['./app-container-ambiente.component.scss'],
  providers: [
    AmbienteStore
  ]
})
export class AppContainerAmbienteComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  readonly state$ = this.store.state$;

  constructor(
    private store: AmbienteStore,
    public dialog: DialogService,
    private alert: AlertService
  ) { }

  ngOnInit() {
  }

  handleLoadData = (e: IDataGridEvent) => {

  }
  handleClickNuevoAmbiente = () => {
    this.store.ambienteModalActions.setModalNew();
    const dialogRef = this.dialog.openMD(AppFormAmbienteComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.ambienteModalActions.resetModalAmbiente();
    });
  }
  openModalUpdate = (id: string) => {
    this.store.ambienteModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(AppFormAmbienteComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.ambienteModalActions.resetModalAmbiente();
    });
  }
  openModalConsultar = (id: string) => {
    this.store.ambienteModalActions.setModalReadOnly(id);
    const dialogRef = this.dialog.openMD(AppFormAmbienteComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.ambienteModalActions.resetModalAmbiente();
    });
  }
  deleteAmbiente = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.ambienteBuscadorActions.asynDeleteAmbiente(id).subscribe(reponse => {
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
