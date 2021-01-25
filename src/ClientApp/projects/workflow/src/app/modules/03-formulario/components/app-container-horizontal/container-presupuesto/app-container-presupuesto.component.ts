import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { DialogService, AlertService, IDataGridEvent, IDataGridButtonEvent, IDataGridSource } from '@sunedu/shared';
import { tap, map, distinctUntilChanged, concatMap } from 'rxjs/operators';

import { PresupuestoStore } from '../../../store/presupuesto/presupuesto.store';
import { AppFormPresupuestoComponent } from '../../app-form/app-form-presupuesto/app-form-presupuesto.component';
import { IGridBandejaPresupuesto, IBandejaPresupuesto } from '../../../store/presupuesto/presupuesto.store.interface';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { RequestSolicitudVersion } from '../../../store/presupuesto/presupuesto.store.model';

@Component({
  selector: 'app-container-presupuesto',
  templateUrl: './app-container-presupuesto.component.html',
  styleUrls: ['./app-container-presupuesto.component.css'],
  providers: [
    PresupuestoStore
  ]
})
export class AppContainerPresupuestoComponent implements OnInit {

  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idSede:string;
  @Input() idLocal:string;
  @Input() tipoPresupuesto:string;
  @Input() tipoPresupuestoNombre:string;
  @Input() readOnly:boolean=false;

  state$: Observable<IBandejaPresupuesto>;
  subscriptions: Subscription[];
  list:any[];
  listReload:any[];
  idVersionSoicitud:string;
  idLocalSelecionado:boolean;
  constructor(
    private store: PresupuestoStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) {
    this.store.state.bandejaPresupuesto.isLoading=true;
    this.idLocalSelecionado = true;
   } 

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.bandejaPresupuesto), distinctUntilChanged());
    if(this.idLocal){
      const current = this.storeCurrent.currentFlowAction.get();
      this.idVersionSoicitud = current.idVersionSolicitud;
      this.store.presupuestoFormActions.setReadOnly(this.readOnly);
      this.store.presupuestoBandejaActions.setReadOnly(this.readOnly);
      const request = new RequestSolicitudVersion();
      request.idVersion = current.idVersionSolicitud;
      request.idSede = this.idSede;
      request.idLocal = this.idLocal;
      request.tipoCBCEnum = this.tipoPresupuesto;
      this.store.presupuestoBandejaActions.setformRequest(request);
      this.store.presupuestoBandejaActions.asyncFetchPage().subscribe(response=>{});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.idLocal){
      this.idLocalSelecionado = false;
      this.ngOnInit();
    }else
      this.idLocalSelecionado = true;
  }
  getCBCName(tipoCBCEnum:string){
    return "hola";
  }
  getSourceGrids(cbc:string):IDataGridSource<IGridBandejaPresupuesto>{
    //getSourceGrids(item.tipoCBCEnum)
    let fila = this.store.state.bandejaPresupuesto.sourceList.find(item=>item.tipoCBCEnum == cbc).source;
    const filaTotal = this.store.state.bandejaPresupuesto.sourceListTotales.find(item=>item.tipoCBCEnum == cbc).source;
    fila = fila.sort(
      function (a, b) {
        if (a.codigo> b.codigo)
          return 1;
        if (a.codigo < b.codigo)
          return -1;
        return 0;
      });
    fila = fila.concat(filaTotal);
    const source:IDataGridSource<IGridBandejaPresupuesto> = {
      //items: sourceNew,
      items: fila,
      page:1,
      pageSize:10, //,
      total:fila.length, //items.filter(x=>x.codigoCbc==cbc).length,
      orderBy:null,
      orderDir:null,
    };
    return source;
  }

  handleLoadData = (e: IDataGridEvent,tipoCBCEnum:any) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir, 
      skip: e.skip
    };
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.presupuestoBandejaActions.asyncFetchPage(pageRequest).subscribe(response=>{});
  }
  handleClickNuevoOtros = (tipoCBCEnum:any) => {
    this.store.presupuestoFormActions.setModalNew(tipoCBCEnum,this.idVersionSoicitud,this.idSede,this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormPresupuestoComponent);
    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.presupuestoFormActions.resetModalPresupuesto();
      this.ngOnInit();
    });
  }
  openModalUpdate = (id: string) => {
    this.store.presupuestoFormActions.setModalEdit(id,this.idVersionSoicitud,this.idSede,this.idLocal);
    const dialogRef = this.dialog.openMD(AppFormPresupuestoComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.presupuestoFormActions.resetModalPresupuesto();
      this.ngOnInit();
    });
  }
  openModalConsultar = (id: string) => {
    this.store.presupuestoFormActions.setModalReadOnly(id);
    const dialogRef = this.dialog.openMD(AppFormPresupuestoComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.presupuestoFormActions.resetModalPresupuesto();
    });
  }
  deletePresupuesto = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.presupuestoBandejaActions.asynDelete(id,this.idVersionSoicitud,this.idSede).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.ngOnInit();
        });
      }
    });
  }
  handleClickButton = (e: IDataGridButtonEvent,tipoCBCEnum:number) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item.id);
        break;
      case 'ELIMINAR':
        this.deletePresupuesto(e.item.id);
        break;
      case 'AGREGAR_CURSOS':
        // this.openCursos();
        break;
    }
  }

  // combo
  handleInputChange = ({ name, value }) => {}

}
