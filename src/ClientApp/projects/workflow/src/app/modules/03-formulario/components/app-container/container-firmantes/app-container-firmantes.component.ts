import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { FirmatesStore } from '../../../store/firmante/firmante.store';
import {
  IDataGridEvent,
  IDataGridButtonEvent,
  DialogService,
} from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IFormBuscardorFirmante } from '../../../store/firmante/firmante.store.interface';
import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
//import { debug } from 'console';

@Component({
  selector: 'app-container-firmantes',
  templateUrl: './app-container-firmantes.component.html',
  styleUrls: ['./app-container-firmantes.component.scss'],
  providers: [FirmatesStore],
})
export class AppContainerFirmantesComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() firmantes: Array<any>;

  @Output() getFirmantes: EventEmitter<any> = new EventEmitter();

  readonly state$ = this.store.state$;
  constructor(
    private store: FirmatesStore,
    public dialog: DialogService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest: IFormBuscardorFirmante = {
      id: '',
      idVersion: current.idVersionSolicitud,
      codApp: current.idAplicacion,
      codArea: current.idEntidad,
      codRol: current.idRol,
      idProceso: current.idProceso,
      idUsuario: current.idUsuario
    };
    this.store.firmanteBuscadorActions.setInit(formRequest);
    this.store.firmanteBuscadorActions
      .asyncFetchPageLFirmante()
      .pipe(
        tap((response: any[]) => {
          // console.log(response);
          // console.log(this.firmantes);
          this.store.firmanteBuscadorActions.setFirmanteSeleccionados(this.firmantes);
          const firmantes = this.store.firmanteBuscadorActions.getFirmantes();
          
          this.firmantes = firmantes;
          //console.log('CAYL Firmantes',this.firmantes);
          this.getFirmantes.emit(this.firmantes);
          //this.firmantes = this.store.firmanteBuscadorActions.
          // this.modelData = {
          //   ...this.modelData
          //   seleccionFirmantes: response.map(item =◘> ({ userName: item.userName, codRol: null }))
          // }
        })
      )
      .subscribe();
  }

  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip,
    };
    this.store.firmanteBuscadorActions
      .asyncFetchPageLFirmante(pageRequest)
      .subscribe();
  };

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
    }
  };

  openModalConsultar = (id: string) => { };

  openModalUpdate = (id: string) => { };

  deleteLaboratorio = (id: string) => { };

  handleChangeSeleccion = (e: any, data: any) => {
    data.seleccionado = e.checked;
    const existeFirmante = this.firmantes.some(
      (item) => item.userName == data.userName
    );
    if (!existeFirmante)
      this.firmantes.push({
        userName: data.userName.toUpperCase(),
        codRol: data.codRol,
        seleccionado: true,
      });
    else {
      this.firmantes.forEach(
        (item) =>
          (item.seleccionado =
            item.userName == data.userName ? e.checked : item.seleccionado)
      );
    }
    //console.log('CAYL Firmantes',this.firmantes);
    this.getFirmantes.emit(this.firmantes);
  };
}
