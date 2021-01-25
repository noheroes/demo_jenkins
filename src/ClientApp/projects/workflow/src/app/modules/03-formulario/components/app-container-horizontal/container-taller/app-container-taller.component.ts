
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent } from '@sunedu/shared';
import { TallerStore } from '../../../store/taller/taller.store';
import { AppFormTallerComponent } from '../../app-form/app-form-taller/app-form-taller.component';
import { AppFormTallerProgramaComponent} from '../../app-form/app-form-taller-programa/app-form-taller-programa.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IRequestTaller } from '../../../store/taller/taller.store.interface';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { EquipamientoStore } from '../../../store/equipamiento/equipamiento.store';
import { AppFormEquipamientoComponent } from '../../app-form/app-form-equipamiento/app-form-equipamiento.component';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-container-taller',
  templateUrl: './app-container-taller.component.html',
  styleUrls: ['./app-container-taller.component.scss'],
  providers: [
    TallerStore,
    EquipamientoStore
  ]
})
export class AppContainerTallerComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal:string;
  @Input() idSede:string;
  @Input() codigoLocal: string;
  @Input() readOnly:boolean=false;
  readonly state$ = this.store.state$;

  // Enumerados
  tipoTallerEnum:any;
  idLocalSelecionado:boolean=false;
  constructor(
    private store: TallerStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado:EnumeradoGeneralStore,
    private equipamientoStore: EquipamientoStore
  ) {
    //this.idLocalSelecionado = true;
  }

  ngOnInit() {
    this.store.tallerBandejaActions.setReadOnly(this.readOnly);
  }

  handleClickNuevoTaller = () => {
    this.store.tallerFormActions.setModalNew(this.idSede, this.idLocal, this.codigoLocal);
    const dialogRef = this.dialog.openMD(AppFormTallerComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.tallerFormActions.resetModal();
      this.store.tallerBandejaActions.asyncFetchPageTaller().subscribe(response => {
      });
    });
  }

  private buildEnumerados = () =>{
    return new Promise<void>(
      (resolve)=>{
        this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOTALLER')
          .then(info=>{
            this.tipoTallerEnum = info;
          });
        resolve();
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
    this.store.tallerBandejaActions.asyncFetchPageTaller(pageRequest).subscribe();
  }
  enlazarPrograma = (id:string, name: string)=>{
    this.store.tallerProgramaFormActions.setModalNew(id, this.idSede, this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormTallerProgramaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.readOnly = this.readOnly;
    dialogRef.componentInstance.nombre_taller = name;
    dialogRef.afterClosed().subscribe(() => {
      this.store.tallerProgramaFormActions.resetModal();
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
        this.deleteTaller(e.item.id);
        break;
      case 'VER_DOCUMENTO':
        this.enlazarPrograma(e.item.id, e.item.codigo + ' - '+ e.item.nombre);
        break;
      case 'AGREGAR_EQUIPAMIENTO':
        this.openEquipamiento(e.item);
        break;
    }
  }

  openModalUpdate = (id: string) => {
    this.store.tallerFormActions.setModalEdit(id, this.idSede, this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormTallerComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.tallerFormActions.resetModal();
      this.store.tallerBandejaActions.asyncFetchPageTaller().subscribe(response => {
      });
    });
  }
  openModalConsultar = (id: string) => {
    this.store.tallerFormActions.setModalReadOnly(id, this.idSede);
    const dialogRef = this.dialog.openMD(AppFormTallerComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.tallerFormActions.resetModal();
    });
  }
  deleteTaller = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.tallerBandejaActions.asynDeleteTaller(id).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.tallerBandejaActions.asyncFetchPageTaller().subscribe(response => {
          });
        });
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if(this.idLocal){
      this.idLocalSelecionado = false;
      await this.buildEnumerados();
      this.idLocal = changes['idLocal'].currentValue;
      this.codigoLocal = changes['codigoLocal'].currentValue;
      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: IRequestTaller = {
        id: '',
        idVersion: current.idVersionSolicitud,
        idSedeFilial: this.idSede,
        idLocal: this.idLocal,
        listTipoTaller: this.tipoTallerEnum
      };
      this.store.tallerBandejaActions.setInit(formRequest);
      if ((changes['idLocal'].currentValue != '') && (typeof(changes['idLocal'].currentValue) != 'undefined')) {
        this.store.tallerBandejaActions.asyncFetchPageTaller().subscribe();
      }
    }else{
      this.idLocalSelecionado = true;
    }

  }

  //EQUIPAMIENTO
  openEquipamiento = (value: any) => {
    this.equipamientoStore.equipamientoModalActions.setModalNew(this.idSede, this.idLocal, value.codigo, "T");
    const dialogRef = this.dialog.openMD(AppFormEquipamientoComponent);
    dialogRef.componentInstance.store = this.equipamientoStore;
    dialogRef.componentInstance.readOnly = this.readOnly;
    dialogRef.afterClosed().pipe(tap(response => this.equipamientoStore.equipamientoModalActions.resetModalEquipamiento())).subscribe();
  }

}
