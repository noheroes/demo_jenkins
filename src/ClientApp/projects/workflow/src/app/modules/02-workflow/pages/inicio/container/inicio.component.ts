import { Component, OnInit } from '@angular/core';
import { InicioStore } from '../store/inicio.store';
import { DialogService, AlertService, ToastService } from '@sunedu/shared';
import { FormIniciarProcedimientoComponent } from '../components/form-iniciar-procedimiento/form-iniciar-procedimiento.component';
import { ITrakingProcedimiento } from '../store/inicio.store.interface';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { BandejaStore } from '../../bandeja/store/bandeja.store';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [InicioStore, BandejaStore],
})
export class InicioComponent implements OnInit {
  readonly state$ = this.inicioStore.state$;
  disabledLicenciamiento:boolean=false;
  disabledEmision:boolean=false;

  constructor(
    private inicioStore: InicioStore,
    public dialog: DialogService,
    private alert: AlertService,
    private toast: ToastService,
    private storeCurrent: AppCurrentFlowStore,
    private bandejaStore: BandejaStore
  ) {}

  async ngOnInit() {

    const current = this.storeCurrent.currentFlowAction.get();
    //console.log(current);
    if(current.idTipoUsuario=="E"){
      this.disabledLicenciamiento=false;
      //this.disabledEmision=true;
    }else{
      this.disabledLicenciamiento=true;
      //this.disabledEmision=false;
    }
    
    //await this.loadCombos();
  }

  openModalIniciarProcedimiento = () => {
    // this.inicioStore.actionModalInicio.setModalConsultar(id);
    
    const dialogRef = this.dialog.openMD(FormIniciarProcedimientoComponent);
    dialogRef.componentInstance.inicioStore = this.inicioStore;
    dialogRef.componentInstance.storeCurrent = this.storeCurrent;
    dialogRef.afterClosed().subscribe(() => {
      this.inicioStore.actionModalInicioProcedimiento.resetModalInicioProcedimiento();
    });
  };

  loadCombos = () => {
    return new Promise<void>((resolve) => {
      this.bandejaStore.actionGridBandeja
        .asyncFetchListarProcedimientos()
        .then(() => {
          const procedimientos = this.bandejaStore.state.buscadorBandeja
            .filterLists.idProcedimientos;
          // console.log(procedimientos);
          const flujos = procedimientos.map((x) => x.idFlujo);
          // console.log(flujos);
          this.storeCurrent.currentFlowAction.setFlujos(
            flujos,
            procedimientos[0].idFlujo
          );
          // this.bandejaStore.actionGridBandeja.asyncFetchGetBandeja();
          resolve();
        });
    });
  };

  onIniciarProcedimiento = () => {
    this.alert
      .open(
        '¿Está seguro de que desea iniciar el procedimiento seleccionado?',
        'Confirmación',
        { confirm: true }
      )
      .then(async (confirm) => {
        if (confirm) {
          await this.loadCombos();
          this.inicioStore.actionModalInicioProcedimiento
            .asyncIniciarProcedimiento(null)
            .then((response: any) => {
              // this.inicioStore.actionBuscadorPersonas.asyncFetchPersons();

              //this.dialogRef.close();
              //console.log(response);
              let traking: ITrakingProcedimiento = response;
              if (traking.success) {
                // Ir a bandeja
                this.alert.open(traking.message, '', { icon: 'success' });
              } else {
                //this.toast.warning(traking.Message); //<<== ojo ver
                //console.log(traking.Message);
                this.alert.open(traking.message, '', { icon: 'warning' });
              }
              // this.router.navigate([response.data.actividad.formulario], {
              //   queryParams: {'idProceso': response.data.proceso.idProceso, 'idProcesoBandeja': response.data.idProcesoBandeja}
              // }); <<==ojo ver
            });
        }
      });
    // console.log("SET HC usuario y procedimiento CAYL");
    // let current:ICurrentFlow={
    //   userName:"667d27da-7d1d-44a3-b858-0ed6d0edd275",
    //   idEntidad:"667d27da-7d1d-44a3-b858-0ed6d0edd275",
    //   idFlujo:"5e824fa91233b5522056512d",
    //   tipoUsuario:"E",
    //   codigoFlujos:['5e824fa91233b5522056512d'],
    //   codigoActividad:'5e8250d71233b5522056512f-1vH8ZeFLrbSpM7zFWmNc-10',
    //   page:1,
    //   pageSize:10
    // }

    // //this.storeCurrent.state.currentProcedimiento = current;
    // this.storeCurrent.currentFlowAction.set(current);
  };
}
