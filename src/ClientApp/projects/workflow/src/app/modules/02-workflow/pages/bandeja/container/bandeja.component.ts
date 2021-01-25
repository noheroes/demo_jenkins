import { BandejaStore } from '../store/bandeja.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IDataGridEvent,
  IDataGridButtonEvent,
  AlertService,
  DialogService,
  BuildGridButton,
  ToastService,
} from '@sunedu/shared';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { AppStore, IAppUser } from '@lic/core';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
  providers: [BandejaStore],
})
export class BandejaComponent implements OnInit, OnDestroy {
  readonly state$ = this.bandejaStore.state$;

  private formSearchSubscription: Subscription;
  constructor(
    private bandejaStore: BandejaStore,
    private appStore: AppStore,
    private toast: ToastService,
    public dialog: DialogService,
    private alert: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private storeCurrent: AppCurrentFlowStore
  ) {}

  async ngOnInit() {
    await this.loadConfiguracion();
  }

  private async loadConfiguracion() {
    this.bandejaStore.actionGridBandeja.fetchGetBandejaBegin();

    const promises: any[] = [];
    promises.push(await this.loadCombos());

    promises.push(await this.subscribeToFormSearch());

    await Promise.all(promises).then(() => {
      this.bandejaStore.state.buscadorBandeja.isLoading = false;
    });
  }

  handleRefresh=()=>{
    this.handleLoadData();
  }

  // ngOnInit() {
  //   setTimeout(() => {
  //     this.subscribeToFormSearch();
  //   });

  //   // const { permissions } = this.appStore.state.session.currentMenu;
  //   this.loadCombos();
  //   this.setGridButtons();
  //   this.setGridFields();
  // }

  loadCombos = () => {
    return new Promise<void>((resolve) => {
      this.bandejaStore.actionGridBandeja
        .asyncFetchListarProcedimientos()
        .then(() => {
          const procedimientos = this.bandejaStore.state.buscadorBandeja
            .filterLists.idProcedimientos;
          const flujos = procedimientos.map((x) => x.idFlujo);
          this.storeCurrent.currentFlowAction.setFlujos(
            flujos,
            procedimientos[0].idFlujo
          );
          // this.bandejaStore.actionGridBandeja.asyncFetchGetBandeja();
          resolve();
        });
    });
  };
  handleLoadData = (e?: IDataGridEvent) => {
    this.bandejaStore.actionGridBandeja
      .asyncFetchGetBandeja({
        page:e?e.page:1,
        pageSize: e?e.pageSize:10,
        orderBy: e?e.orderBy:'rowNum',
        orderDir: e?e.orderDir:'asc',
        skip: e?e.skip:0,
      })
      .subscribe();
  };

  handleClickNuevo = () => {};
  ngOnDestroy() {
    this.formSearchSubscription.unsubscribe();
  }

  private setGridButtons = () => {};

  private setGridFields = () => {};

  private subscribeToFormSearch = () => {
    return new Promise<void>((resolve) => {
      this.formSearchSubscription = this.bandejaStore.state$
        .pipe(
          map((x) => x.buscadorBandeja.formBuscar),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          const { gridSource } = this.bandejaStore.state.buscadorBandeja;
          this.bandejaStore.actionGridBandeja
            .asyncFetchGetBandeja({
              page: 1,
              skip: 0,
              orderBy: gridSource.orderBy,
              orderDir: gridSource.orderDir,
              pageSize: gridSource.pageSize,
            })
            .subscribe(() => {
              resolve();
            });
        });
    });
  };

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ATENDER':
        this.IrAProcesoBandeja(e.item);
        break;
    }
  };

  IrAProcesoBandeja(item: any) {
    //console.log("Get Item Bandeja atender CAYL", item);
    // console.log(item);
    let current = this.storeCurrent.currentFlowAction.get();
    current = {
      ...current,
      expediente: {
        codigo: item.expediente.codigo,
        fechaCreacion: item.expediente.fechaCreacion,
        fechaAsignacion: null,// item.fechaAsignacion,
        fechaSolicitud: null//item.fechaSolicitud,
      },
      idProceso: item.idProceso,
      idProcesoBandeja: item.idProcesoBandeja,
      idVersionSolicitud: item.metaDataProceso.idVersionSolicitud,
      esModoConsulta:false
    }
    // current.expediente = {
    //   codigo: item.expediente.codigo,
    //   fechaCreacion: item.expediente.fechaCreacion,
    //   fechaAsignacion: item.fechaAsignacion,
    //   fechaSolicitud: item.fechaSolicitud,
    // };
    this.storeCurrent.currentFlowAction.set(current);
    this.router.navigateByUrl('/workflow/formularios');

    // this.router.navigate(['/workflow' + item.actividad.ruta], {
    //   queryParams: {
    //     idProceso: item.idProceso,
    //     idProcesoBandeja: item.idProcesoBandeja,
    //     idVersionSolicitud: item.metaDataProceso.idVersionSolicitud,
    //   },
    // });
  }
}
