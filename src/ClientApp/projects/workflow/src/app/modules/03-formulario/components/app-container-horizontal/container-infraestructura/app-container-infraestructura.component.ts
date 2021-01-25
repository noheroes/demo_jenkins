import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IFormularioModel } from 'src/app/core/interfaces';
import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService } from '@sunedu/shared';
import { InfraestructuraStore } from '../../../store/infraestructura/infraestructura.store';
import { AppFormInfraestructuraComponent } from '../../app-form/app-form-infraestructura/app-form-infraestructura.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IFormBuscardorInfraestructura } from '../../../store/infraestructura/infraestructura.store.interface';


@Component({
  selector: 'app-container-infraestructura',
  templateUrl: './app-container-infraestructura.component.html',
  styleUrls: ['./app-container-infraestructura.component.scss'],
  providers: [
    InfraestructuraStore
  ]
})
export class AppContainerInfraestructuraComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal:string;
  @Input() idSede:string;
  @Input() readOnly:boolean=false;
  
  readonly state$ = this.infraestructuraStore.state$;
  idLocalSelecionado:boolean;
  constructor(
    private infraestructuraStore: InfraestructuraStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { 
    this.idLocalSelecionado = true;
  }

  ngOnInit() {
    this.infraestructuraStore.infraestructuraBuscadorActions.setReadOnly(this.readOnly);
  }


  handleClickNuevoInfraestructura = () => {
    this.infraestructuraStore.infraestructuraModalActions.setModalNew(this.idSede, this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormInfraestructuraComponent);
    dialogRef.componentInstance.store = this.infraestructuraStore;

    dialogRef.afterClosed().subscribe(() => {
      this.infraestructuraStore.infraestructuraModalActions.resetModalInfraestructura();
      this.infraestructuraStore.infraestructuraBuscadorActions.asyncFetchPageInfraestructura().subscribe(response => {
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
    this.infraestructuraStore.infraestructuraBuscadorActions.asyncFetchPageInfraestructura(pageRequest).subscribe();
  }
  openModalUpdate = (id: string) => {
    this.infraestructuraStore.infraestructuraModalActions.setModalEdit(id, this.idSede, this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormInfraestructuraComponent);

    dialogRef.componentInstance.store = this.infraestructuraStore;

    dialogRef.afterClosed().subscribe(() => {
        this.infraestructuraStore.infraestructuraModalActions.resetModalInfraestructura();
        this.infraestructuraStore.infraestructuraBuscadorActions.asyncFetchPageInfraestructura().subscribe(response => {
        });
    });
  }
  openModalConsultar = (id: string) => {

    this.infraestructuraStore.infraestructuraModalActions.setModalReadOnly(id, this.idSede, this.idLocal);

    const dialogRef = this.dialog.openMD(AppFormInfraestructuraComponent, { disableClose: false });

    dialogRef.componentInstance.store = this.infraestructuraStore;

    dialogRef.afterClosed().subscribe(() => {
      this.infraestructuraStore.infraestructuraModalActions.resetModalInfraestructura();
    });
  }

  deleteInfraestructura = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.infraestructuraStore.infraestructuraBuscadorActions.asynDeleteInfraestructura(id)
          .subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.infraestructuraStore.infraestructuraBuscadorActions.asyncFetchPageInfraestructura().subscribe(response => {
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
         this.deleteInfraestructura(e.item.id);
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {    
    if(this.idLocal){
      this.idLocalSelecionado = false;
      this.idLocal = changes['idLocal'].currentValue;

      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: IFormBuscardorInfraestructura = {
        id: '',
        idVersion: current.idVersionSolicitud,
        idSedeFilial: this.idSede,
        idLocal: this.idLocal
      };
      this.infraestructuraStore.infraestructuraBuscadorActions.setInit(formRequest);
      if ((changes['idLocal'].currentValue != '') && (typeof(changes['idLocal'].currentValue) != 'undefined')) {
        this.infraestructuraStore.infraestructuraBuscadorActions.asyncFetchPageInfraestructura().subscribe();
      }
    }else
      this.idLocalSelecionado = true;    
  }
}
