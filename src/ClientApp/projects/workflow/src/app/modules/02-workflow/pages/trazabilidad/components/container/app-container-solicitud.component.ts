import { Store } from './../../../../../../../../../../src/app/core/store/store';
import { APP_FORM_VALIDATOR } from './../../../../../../../../../../src/app/core/constants/app.constant';
import { EnumeradoGeneralStore } from './../../../../../03-formulario/store/maestro/enumerado/enumerado.store';
import { AppContainerTrazabilidadComponent } from './../container-trazabilidad/app-container-trazabilidad.component';
import { TrazabilidadService } from './../../service/trazabilidad.service';
import { IBuscardorBandejaSolicitud, IBandejaSolicitud, IBuscadorBandejaTrazabilidad } from './../../store/trazabilidad.store.interface';
import { Component, OnInit, Input } from '@angular/core';

import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService, ToastService, FormModel, FormType, ISubmitOptions, Validators } from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { TrazabilidadStore } from '../../store/trazabilidad.store';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container-solicitud',
  templateUrl: './app-container-solicitud.component.html',
  styleUrls: ['./app-container-solicitud.component.scss'],
  providers: [
    TrazabilidadStore,
    TrazabilidadService
  ]
})
export class AppContainerSolicitudTrazabilidadComponent implements OnInit {
  //readonly state$ = this.solicitudStore;
  formBuscar: FormModel<IBuscardorBandejaSolicitud>;
  state$: Observable<IBandejaSolicitud>;
  subscriptions: Subscription[];
  validators: any;
  ocultarFiltro:boolean;
  constructor(
    public dialog: DialogService,
    private alert: AlertService,
    private toast: ToastService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado: EnumeradoGeneralStore,
    private store: TrazabilidadStore,
    private router: Router
  ) {
    this.state$ = this.store.state$.pipe(map(x => x.bandejaSolicitud), distinctUntilChanged());
    this.ocultarFiltro = this.storeCurrent.currentFlowAction.get().idTipoUsuario == "E";
  }

  async ngOnInit() {
    await this.loadConfiguracion();
  }
  private async loadConfiguracion() {
    this.store.solicitudBandejaActions.setStateIsLoading(true);
    let promises: any[] = [];

    const action4 = await this.buildForm();
    promises.push(action4);

    const action5 = await this.subscribeToState();
    promises.push(action5);
    const action6 = await this.loadCombos();
    promises.push(action6);
    await Promise.all(promises).then(() => {
      this.setCombos();
      this.fechtBandejaSolicitud();
    }, reason => {
      this.store.solicitudBandejaActions.fetchError(reason);
    });
  }
  private loadCombos = () => {
    return new Promise(
      (resolve) => {
        forkJoin(
          this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_ESTADOS_SOLICITUD'),
          this.store.solicitudBandejaActions.getEntidades()
        ).pipe(tap(enums => {
          return enums;
        })).subscribe(enums => {
          resolve(enums);
        }
        );
      }).then((enums) => {
        this.store.solicitudBandejaActions.setDataMemory(enums);
      });
  }
  buildValidations = () => {
    /*return new Promise(
      (resolve) => {
        this.validators = {
          numeroSolicitud: [Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_SOLICITUD_LINU))],
        };
        resolve();
      });*/
  };
  subscribeToState = () => {
    return new Promise<void>(
      (resolve) => {
        const subs = this.store.state$.pipe(map(x => x.bandejaSolicitud.formBuscar), distinctUntilChanged())
          .subscribe(x => {
            this.formBuscar.patchValue(x);
          });
        this.subscriptions = [subs];
        resolve();
      });
  }
  private setCombos = () => {
    this.store.solicitudBandejaActions.setCombos();
  }
  private fechtBandejaSolicitud = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest: Partial<IBuscardorBandejaSolicitud> = {
      tipoUsuario: current.idTipoUsuario,
      numeroSolicitud: '',
      idEntidad: current.idEntidad,
    };
    this.store.solicitudBandejaActions.setInit(formRequest);
    this.store.solicitudBandejaActions.asyncFetchListSolicitudes().subscribe(response => {
      this.store.solicitudBandejaActions.setStateIsLoading(false);
    });
  }
  /**Componente */
  private buildForm = () => {
    return new Promise<void>(
      (resolve) => {
        const { formBuscar } = this.store.state.bandejaSolicitud;
        this.formBuscar = new FormModel<any>(
          FormType.BUSCAR,
          formBuscar,
          this.validators,
          {
            onSearch: this.handleSearch
          }
        );
        resolve();
      });
  }

  /**Filtros */
  HandleLimpiar = () => {
    console.log('HandleLimpiar');
    this.formBuscar.reset();
  }
  HandleSubmit = () => {
    this.formBuscar.submit();
  }
  handleInputChange = () => {
  }
  handleSearch = (formValue: IBuscardorBandejaSolicitud, options: ISubmitOptions) => {
    const { source } = this.store.state.bandejaSolicitud;
    source.page=1;
    formValue.idEntidad = (formValue.idEntidad == "" || formValue.idEntidad == null) ? '00000000-0000-0000-0000-000000000000' : formValue.idEntidad;
    formValue.tipoUsuario = this.storeCurrent.currentFlowAction.get().idTipoUsuario;
    this.store.solicitudBandejaActions.asyncFetchListSolicitudes(source, formValue).subscribe();
  }

  /**Bandeja*/
  handleClickButton = (e: IDataGridButtonEvent) => {
    console.log(e);
    switch (e.action) {
      case 'VER_TRAZABILIDAD':
        this.openModalVerTrazabilidad(e.item.idProceso);
        break;
        case 'CONSULTAR':
          this.IrAProcesoBandeja(e.item);
          break;
    }
  };
  private openModalVerTrazabilidad = (idProceso: string) => {

    const formRequest: Partial<IBuscadorBandejaTrazabilidad> = {
      idProceso : idProceso
    };
    this.store.trazabilidadBandejaActions.setDataMemory(formRequest);
    const dialogRef = this.dialog.openMD(AppContainerTrazabilidadComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed().subscribe(() => {
      this.store.trazabilidadBandejaActions.resetModal();
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
    this.store.solicitudBandejaActions.asyncFetchListSolicitudes(pageRequest).subscribe();
  }

  IrAProcesoBandeja(item: any) {
    //console.log("CAYL IrAProcesoBandeja traza item", item);
    // console.log(item);
    let current = this.storeCurrent.currentFlowAction.get();
    current = {
      ...current,
      expediente: {
        codigo: item.numeroSolicitud,
        fechaCreacion: item.fechaSolicitud, //item.expediente.fechaCreacion, // falta
        fechaAsignacion:null, //item.fechaAsignacion, // null
        fechaSolicitud: null, // OK
      },
      idProceso: item.idProceso,
      esModoConsulta: true // ok
      // idProcesoBandeja: item.idProcesoBandeja, // falta
      // idVersionSolicitud: item.metaDataProceso.idVersionSolicitud // falta
    }
    // current.expediente = {
    //   codigo: item.expediente.codigo,
    //   fechaCreacion: item.expediente.fechaCreacion,
    //   fechaAsignacion: item.fechaAsignacion,
    //   fechaSolicitud: item.fechaSolicitud,
    // };
    this.storeCurrent.currentFlowAction.set(current);
    this.router.navigateByUrl('/workflow/formularios');
    // const ruta = "/Formularios/TransRegistroSolicitudRevisionPreliminar/v01_CONSULTA_SOLICITUD_LICENCIAMIENTO"
    // this.router.navigate(['/workflow' + ruta], {
    //   queryParams: {
    //     idProceso: item.idProceso,
    //     // idProcesoBandeja: item.idProcesoBandeja,
    //     // idVersionSolicitud: item.metaDataProceso.idVersionSolicitud,
    //     esModoConsulta: true
    //   },
    // });
  }

}
