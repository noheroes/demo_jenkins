import { APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from './../../../../../../../../../../src/app/core/constants/app.constant';
import { EnumeradoGeneralStore } from './../../../../../03-formulario/store/maestro/enumerado/enumerado.store';
import { MatDialogRef } from '@angular/material/dialog';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { IBandejaTrazabilidad, IBuscadorBandejaTrazabilidad } from './../../store/trazabilidad.store.interface';
import { TrazabilidadService } from './../../service/trazabilidad.service';
import { TrazabilidadStore } from './../../store/trazabilidad.store';
import { Component, OnInit, Input } from '@angular/core';

import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService, ToastService, ISubmitOptions, FormModel, FormType, Validators } from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Component({
  selector: 'app-container-trazabilidad',
  templateUrl: './app-container-trazabilidad.component.html',
  styleUrls: ['./app-container-trazabilidad.component.scss'],
  providers: [
    TrazabilidadStore,
    TrazabilidadService
  ]
})
export class AppContainerTrazabilidadComponent implements OnInit {
  formType = FormType;
  formBuscar: FormModel<IBuscadorBandejaTrazabilidad>;
  store: TrazabilidadStore;
  state$: Observable<IBandejaTrazabilidad>;
  fechaInicio_MinDate : any;
  fechaInicio_MaxDate : any;
  fechaFin_MinDate : any;
  fechaFin_MaxDate : any;
  subscriptions: Subscription[];
  validators: any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  readonly typeConsultar = FormType.CONSULTAR;
  //store:TrazabilidadStore;
  constructor(
    public dialogRef: MatDialogRef<AppContainerTrazabilidadComponent>,
      private alert: AlertService,
      private toast: ToastService,
      private storeEnumerado: EnumeradoGeneralStore,
      private storeCurrent: AppCurrentFlowStore,

  ) {
    //console.log('constructor traza');
  }

  async ngOnInit() {
    console.log('ngOnInit');
    await this.loadConfiguracion();
  }
  private setInitilData = () => {
    return new Promise<void>(
      (resolve)=>{
        //console.log('set state')
        this.state$ = this.store.state$.pipe(map(x => x.bandejaTrazabilidad), distinctUntilChanged());

        const { formBuscar,type } = this.store.state.bandejaTrazabilidad;
        this.formBuscar = new FormModel<any>(
          type,
          formBuscar,
          this.validators,
          {
            onSearch: this.handleSearch
          }
        );
        this.formBuscar.get('fechaMaximo').disabled = true;
        //console.log('set state ...')
        //this.state$ = this.store.state$.pipe(map(x => x.bandejaTrazabilidad), distinctUntilChanged());
        //this.formBuscar.get('fechaMaximo').disabled = true;
      resolve();
      });
  }
  private async loadConfiguracion(){
    this.store.trazabilidadBandejaActions.setStateIsLoading(true);
    let promises: any[] = [];
    //console.log('setInitilData')
    const action0 = await this.setInitilData();
    promises.push(action0);
    /*const action3 = await this.buildValidations();
    promises.push(action3);*/
    //console.log('buildForm')
    /*const action4 = await this.buildForm();
    promises.push(action4);*/
    /*const action5 = await this.subscribeToState();
    promises.push(action5);*/
    const action6 = await this.loadDataTrazabilidad();
    promises.push(action6);
    //console.log('promises.push(action6)')
    await Promise.all(promises).then(() => {
      //console.log('this.setCombos();');
      this.setCombos();
      this.setFechas('');
      //this.fechtBandejaTrazabilidad();
      //this.loadDataTrazabilidad();
    },reason => {
      this.store.trazabilidadBandejaActions.fetchError(reason);
    });
  }
  buildValidations = () => {
    return new Promise<void>(
      (resolve)=>{
      /*this.validators = {
        numeroSolicitud: [Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_SOLICITUD_LINU))],
      };*/
      resolve();
        });
    };
    private setCombos = () => {
      this.store.trazabilidadBandejaActions.setCombos();
    }
    private setFechas = (fechaMin) =>{
      var dataMemory=this.store.trazabilidadBandejaActions.getDataMemory();

      let fechaMinimo = new Date(dataMemory.fechamin);
      this.fechaInicio_MinDate = new Date(fechaMinimo.getFullYear(), fechaMinimo.getMonth(), fechaMinimo.getDate());
      this.fechaFin_MinDate = new Date(fechaMinimo.getFullYear(), fechaMinimo.getMonth(), fechaMinimo.getDate());
        if(dataMemory.fechamax!=null){
          let fechaMaximo = new Date(dataMemory.fechamax);
          this.fechaInicio_MaxDate = new Date(fechaMaximo.getFullYear(), fechaMaximo.getMonth(), fechaMaximo.getDate());
          this.fechaFin_MaxDate = new Date(fechaMaximo.getFullYear(), fechaMaximo.getMonth(), fechaMaximo.getDate());
        }
    }
    private loadDataTrazabilidad = () => {
      return new Promise<void>(
        (resolve) => {
          const current = this.storeCurrent.currentFlowAction.get();
          const formRequest: Partial<IBuscadorBandejaTrazabilidad> = {
            tipoUsuario: current.idTipoUsuario,
            idProceso: this.store.state.bandejaTrazabilidad.dataMemory.idProceso,
            fechaMinimo:null,
            fechaMaximo:null,
            pasoNombre:'',
            responsable:'',
            rol:'',
            estado:'',
            page:1,
            pageSize:1000,
          };
          this.store.trazabilidadBandejaActions.setInit(formRequest);
          this.store.trazabilidadBandejaActions.asyncFetchListTrazabilidad().subscribe(response => {
              // console.log('loadDataTrazabilidad')
              // console.log();
              this.store.solicitudBandejaActions.setStateIsLoading(false);
              resolve();
          });
        }).then(() => {
          // console.log('then((response)');
        });
    }

    private fechtBandejaTrazabilidad = () => {
      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: Partial<IBuscadorBandejaTrazabilidad> = {
        tipoUsuario: current.idTipoUsuario,
        idProceso: this.store.state.bandejaTrazabilidad.dataMemory.idProceso,
        fechaMinimo:null,
        fechaMaximo:null,
        pasoNombre:'',
        responsable:'',
        rol:'',
        estado:'',
        page:1,
        pageSize:1000,
      };
      this.store.trazabilidadBandejaActions.setInit(formRequest);
      this.store.trazabilidadBandejaActions.asyncFetchListTrazabilidad();
        //.subscribe(response => {this.store.trazabilidadBandejaActions.setStateIsLoading(false);})
    }



  /**Componente */
  private buildForm = () => {
    return new Promise<void>(
      (resolve) => {
        const { formBuscar } = this.store.state.bandejaTrazabilidad;
        this.formBuscar = new FormModel<any>(
          FormType.CONSULTAR,
          formBuscar,
          this.validators,
          {
            onSearch: this.handleSearch
          }
        );
        resolve();
      });
  }
  /*subscribeToState = () => {
    return new Promise(
      (resolve) => {
        const subs = this.store.state$.pipe(map(x => x.bandejaTrazabilidad.formBuscar), distinctUntilChanged())
          .subscribe(x => {
            this.formBuscar.patchValue(x);
          });
        this.subscriptions = [subs];
        resolve();
      });
  }*/
/**Filtros */
handleLimpiar = () => {
  this.formBuscar.reset();
}
handleSubmitFilter = () => {
  //console.log('handleSubmitFilter');
  //this.formBuscar.submit();
  const current = this.storeCurrent.currentFlowAction.get();
  const formRequest: Partial<IBuscadorBandejaTrazabilidad> = {
    tipoUsuario: current.idTipoUsuario,
    idProceso: this.store.state.bandejaTrazabilidad.dataMemory.idProceso,
    fechaMinimo:this.formBuscar.get('fechaMinimo').value,
    fechaMaximo:this.formBuscar.get('fechaMaximo').value,
    pasoNombre:this.formBuscar.get('pasoNombre').value,
    responsable:this.formBuscar.get('responsable').value,
    rol:this.formBuscar.get('rol').value,
    estado:this.formBuscar.get('estado').value,
    page:1,
    pageSize:1000,
  };
  this.store.trazabilidadBandejaActions.setInit(formRequest);
  const { source } = this.store.state.bandejaTrazabilidad;
  source.page=1;
this.store.trazabilidadBandejaActions.asyncFetchListTrazabilidad(source).subscribe();
}
handleClose = () => {
  //const { type } = this.store.state.bandejaTrazabilidad;
  this.dialogRef.close();
}
handleInputChange = () => {
}
handleSearch = (formValue: any, options: ISubmitOptions) => {
  const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: Partial<IBuscadorBandejaTrazabilidad> = {
        tipoUsuario: current.idTipoUsuario,
        idProceso: this.store.state.bandejaTrazabilidad.dataMemory.idProceso,
        fechaMinimo:this.formBuscar.get('fechaMinimo').value,
        fechaMaximo:this.formBuscar.get('fechaMaximo').value,
        pasoNombre:this.formBuscar.get('pasoNombre').value,
        responsable:this.formBuscar.get('responsable').value,
        rol:this.formBuscar.get('rol').value,
        estado:this.formBuscar.get('estado').value,
        page:1,
        pageSize:1000,
      };
      this.store.trazabilidadBandejaActions.setInit(formRequest);
  this.store.trazabilidadBandejaActions.asyncFetchListTrazabilidad().subscribe();
}
handleChangeInput = (e) => {
  if (e.name == "fechaMinimo") {
    this.formBuscar.get('fechaMaximo').setValue('');
    this.formBuscar.get('fechaMaximo').disabled = false;
    this.setFechas(e.value);
  }
}

/**Bandeja*/
handleClickButton = (e: IDataGridButtonEvent) => {


  };
  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    // console.log('pageRequest');
    // console.log(pageRequest);
    this.store.trazabilidadBandejaActions.asyncFetchListTrazabilidad(pageRequest).subscribe();
  }
}
