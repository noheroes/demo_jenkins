import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent } from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { LaboratorioStore } from '../../../store/laboratorio/laboratorio.store';
import { AppFormLaboratorioComponent } from '../../app-form/app-form-laboratorio/app-form-laboratorio.component';
import { AppFormLaboratorioProgramaComponent } from '../../app-form/app-form-laboratorio-programa/app-form-laboratorio-programa.component';
import { IRequestLaboratorio } from '../../../store/laboratorio/laboratorio.store.interface';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { EquipamientoStore } from '../../../store/equipamiento/equipamiento.store';
import { AppFormEquipamientoComponent } from '../../app-form/app-form-equipamiento/app-form-equipamiento.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-container-laboratorio',
  templateUrl: './app-container-laboratorio.component.html',
  styleUrls: ['./app-container-laboratorio.component.scss'],
  providers: [
    LaboratorioStore,
    EquipamientoStore
  ]
})
export class AppContainerLaboratorioComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal: string;
  @Input() idSede: string;
  @Input() codigoLocal: string;
  @Input() readOnly:boolean=false;
  readonly state$ = this.store.state$;
  readonly equipamientoState$ = this.equipamientoStore.state$;
  decripcionLabTaller: string;
  idLocalSelecionado:boolean;
  // Enumerados
  tipoLaboratorioEnum:any;

  constructor(
    private store: LaboratorioStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado:EnumeradoGeneralStore,
    private equipamientoStore: EquipamientoStore,

  ) {
    this.idLocalSelecionado = true;
   }

  ngOnInit() {
    this.store.laboratorioBandejaActions.setReadOnly(this.readOnly);
  }

  private buildEnumerados = () =>{
    return new Promise<void>(
      (resolve)=>{
        this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOTALLER')
          .then(info=>{
            this.tipoLaboratorioEnum = info;
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
    this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio(pageRequest).subscribe();
  }
  handleClickNuevoLaboratorio = () => {
    this.store.laboratorioFormActions.setModalNew(this.idSede, this.idLocal, this.codigoLocal);
    const dialogRef = this.dialog.openMD(AppFormLaboratorioComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.laboratorioFormActions.resetModal();
      this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio().subscribe(response => {
      });
    });
  }

  enlazarPrograma = (id: string, name: string) => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.laboratorioProgramaFormActions.setModalNew(id, current.idVersionSolicitud, this.idSede);
    const dialogRef = this.dialog.openMD(AppFormLaboratorioProgramaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.readOnly = this.readOnly;
    dialogRef.componentInstance.nombre_laboratorio = name;
    dialogRef.afterClosed().subscribe(() => {
      this.store.laboratorioProgramaFormActions.resetModal();
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
        this.deleteLaboratorio(e.item.id);
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
    this.store.laboratorioFormActions.setModalEdit(id, this.idSede, this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormLaboratorioComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.laboratorioFormActions.resetModal();
      this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio().subscribe(response => {
      });
    });
  }
  openModalConsultar = (id: string) => {
    this.store.laboratorioFormActions.setModalReadOnly(id, this.idSede);
    const dialogRef = this.dialog.openMD(AppFormLaboratorioComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.laboratorioFormActions.resetModal();
    });
  }

  deleteLaboratorio = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.laboratorioBandejaActions.asynDeleteLaboratorio(id).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio().subscribe(response => {
          });
        });
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if(this.idLocal){
      this.idLocalSelecionado = false;
      await this.buildEnumerados();
      this.codigoLocal = changes['codigoLocal'].currentValue;
      this.idLocal = changes['idLocal'].currentValue;

      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: IRequestLaboratorio = {
        id: '',
        idVersion: current.idVersionSolicitud,
        idSedeFilial: this.idSede,
        idLocal: this.idLocal,
        listTipoLaboratorio: this.tipoLaboratorioEnum,
        codigoLocal: this.codigoLocal
      };
      this.store.laboratorioBandejaActions.setInit(formRequest);
      if ((changes['idLocal'].currentValue != '') && (typeof (changes['idLocal'].currentValue) != 'undefined')) {
        this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio().subscribe();
      }
    }
    else{
      this.idLocalSelecionado = true;

    }
  }

  retornar = () => {
    this.store.state.formato.currentForm = 'laboratorio';
  }

  //EQUIPAMIENTO
  openEquipamiento = (value: any) => {
    this.equipamientoStore.equipamientoModalActions.setModalNew(this.idSede, this.idLocal, value.codigo, "L");
    const dialogRef = this.dialog.openMD(AppFormEquipamientoComponent);
    dialogRef.componentInstance.store = this.equipamientoStore;
    dialogRef.componentInstance.readOnly = this.readOnly;
    dialogRef.afterClosed().pipe(tap(response => this.equipamientoStore.equipamientoModalActions.resetModalEquipamiento())).subscribe();
  }

}
