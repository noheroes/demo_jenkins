import { InfraestructuraCantidadesStore } from './../../../store/infraestructura-cantidades/infraestructura-cantidades.store';
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { AppAudit, AppCurrentFlowStore, IFormularioModel } from "@lic/core";
import { AlertService, DialogService, FormModel, FormType, ToastService, Validators } from "@sunedu/shared";
import { IFormInfraestructuraCantidades, IMemoryData } from '../../../store/infraestructura-cantidades/infraestructura-cantidades.store.interface';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormInfraestructuraCantidades } from '../../../store/infraestructura-cantidades/infraestructura-cantidades.store.model';

const MESSAGES = {
    CONFIRM_SAVE: '¿Está seguro de GUARDAR la información de infraestructura?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información de infraestructura?',
    CONFIRM_SAVE_SUCCES: 'El registro de infraestructura se guardó correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro de infraestructura se actualizó correctamente'
};

@Component({
    selector: 'app-container-infraestructura-cantidades',
    templateUrl: './app-container-infraestructura-cantidades.component.html',
    styleUrls: ['./app-container-infraestructura-cantidades.component.scss'],
    providers: [
        InfraestructuraCantidadesStore
    ]
})
export class AppContainerInfraestructuraCantidadesComponent implements OnInit {
    @Input() configTab: any = null;
    @Input() modelData: IFormularioModel = null;
    @Input() idLocal: string;
    @Input() idSede: string;
    @Input() readOnly: boolean = false;
    esBloqueado:boolean=true;
    subscriptions: Subscription[];
    //store:InfraestructuraCantidadesStore
    formType = FormType;
    form: FormModel<any>;
    state$: Observable<IFormInfraestructuraCantidades>;

    //readonly state$ = this.infraestructuraCantidadesStore.state$;

    idLocalSelecionado: boolean;

    validators: any;
    //store: InfraestructuraCantidadesStore;
    constructor(
        private store: InfraestructuraCantidadesStore,
        private toast: ToastService,
        public dialog: DialogService,
        private alert: AlertService,
        private storeCurrent: AppCurrentFlowStore
    ) {
        this.idLocalSelecionado = true;
        console.log('infraestructura Cantidades');
        this.state$ = this.store.state$.pipe(map(x => x.infraestructuraCantidades), distinctUntilChanged());
        this.buildForm();
        //this.buildInitial();
        //this.buildValidations();
        //this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.idLocal){
          this.idLocalSelecionado = false;
          this.idLocal = changes['idLocal'].currentValue;
          const current = this.storeCurrent.currentFlowAction.get();
          const formRequest: IMemoryData = {
            idVersion: current.idVersionSolicitud,
            idSedeFilial: this.idSede,
            idLocal: this.idLocal,
            //codigoInfraestructura:
          };
          this.store.infraestructuraCantidadesActions.setInit(formRequest);
          if ((changes['idLocal'].currentValue != '') && (typeof(changes['idLocal'].currentValue) != 'undefined')) {
            //this.infraestructuraCantidadesStore.infraestructuraCantidadesActions.asyncFetchPageInfraestructura().subscribe();
            this.ngOnInit();
          }
        }else{
          this.idLocalSelecionado = true;
        }
      }

    async ngOnInit() {
      await this.loadConfiguracion();
    }
    private async loadConfiguracion(){
      this.store.infraestructuraCantidadesActions.setStateIsLoading(true);
      let promises: any[] = [];
      /*const action2 = await this.modoTypeoModal();
      promises.push(action2);*/
      const action0 = await this.setInitilData();
      promises.push(action0);
      const action3 = await this.buildValidations();
      promises.push(action3);
      /*const action4 = await this.buildForm();
      promises.push(action4);
      */const action5 = await this.subscribeToState();
      promises.push(action5);
      await Promise.all(promises).then(() => {
        console.log('asyncFetchInfraestructura');
        this.store.infraestructuraCantidadesActions.asyncFetchInfraestructura().subscribe(response=>{
            this.buildForm();
            this.store.infraestructuraCantidadesActions.setStateIsLoading(false);
          });
      });
    }
    private setInitilData = () => {
      return new Promise<void>(
        (resolve)=>{

          this.store.infraestructuraCantidadesActions.setReadOnly(this.readOnly);
        resolve();
        });
    }
    modoTypeoModal = () => {
      return new Promise<void>(
        (resolve)=>{
        const { type, memoryData } = this.store.state.infraestructuraCantidades;
        /**/
      });
    }
    subscribeToState = () => {
      return new Promise<void>(
        (resolve)=>{
        const subs = this.store.state$.pipe(map(x => x.infraestructuraCantidades.form), distinctUntilChanged())
          .subscribe(x => {
            this.form.patchValue(x);
          });
        this.subscriptions = [subs];
        resolve();
      });
    }
    private buildForm = () => {
        return new Promise<void>(
          (resolve)=>{
          const { form,type } = this.store.state.infraestructuraCantidades;
          this.buildValidations();
          this.form = new FormModel<any>(
              type,
              form,
              this.validators,
              {
                  beforeSubmit: this.beforeSubmit,
                  onSave: this.handleSave,
                  onUpdate: this.handleUpdate,
                  validateOnSave: this.handleValidateOnSave,
                  confirmOnSave: this.handleConfirmOnSave,
              }
          );
          resolve();
        });
    }
    handleConfirmOnSave = () => {
        const { type } = this.store.state.infraestructuraCantidades;
        const MESSAGE =
            type === FormType.REGISTRAR
                ? MESSAGES.CONFIRM_SAVE
                : MESSAGES.CONFIRM_UPDATE;
        return this.alert.open(MESSAGE, null, {
            confirm: true
        });
    }
    beforeSubmit = () => {
    }

    buildValidations = () => {
        this.validators = {
          numeroTotalAulas: [Validators.required],
          numeroTotalAmbientes: [Validators.required],
          numeroTotalBibliotecas: [Validators.required],
            /*
            totalLaboratorios: [Validators.required],
            totalLaboratoriosEnseñanza: [Validators.required],
            totalLaboratoriosComputo: [Validators.required],
            totalLaboratoriosInversigacion: [Validators.required],

            totalTalleres: [Validators.required],
            totalTalleresiosEnseñanza: [Validators.required],
            totalTalleresComputo: [Validators.required],
            totalTalleresInversigacion: [Validators.required],
            */
           numeroTotalLactarios: [Validators.required],
           numeroTotalAuditorios: [Validators.required],

           numeroTotalTopicos: [Validators.required],
           numeroTotalAmbienteServicioPsicopedagogico: [Validators.required],
           numeroTotalAmbienteServicioDeportivos: [Validators.required],
           numeroTotalAmbienteServicioArtisticoCulturales: [Validators.required],

           //comentario: [Validators.required],
        }
    }

    handleSubmit = () => {
        //this.setEnforceBusinessRules();
        this.form.submit();
    }

    handleValidateOnSave = (): boolean => {
        if (this.form.valid) {
            return true;
        }
        return false;
    };

    handleSave = formValue => {
        console.log('handleSave', formValue);
        return from(new Promise((resolve, reject) => {
          console.log('Promise');
          const audit = new AppAudit(this.storeCurrent);
          formValue = audit.setInsert(formValue);
          console.log('setInsert');
          this.store.infraestructuraCantidadesActions.asyncSaveInfraestructura(formValue)
            .pipe(tap(response => {
              console.log('response', response);
              this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
              this.store.infraestructuraCantidadesActions.asyncFetchInfraestructura().subscribe(response=>{
                this.buildForm();
              });
            }, error => {
              console.log('response error');
              //this.form.enable();
            })).subscribe();
        }));
        //return null;
    };

    handleUpdate = formValue => {
      console.log('handleUpdate', formValue);
      return from(new Promise((resolve, reject) => {
        console.log('Promise');
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);
        console.log('setUpdate');
        console.log(this.store.state);
        this.store.infraestructuraCantidadesActions.asyncUpdateInfraestructura(formValue)
          .pipe(tap(response => {
            console.log('setUpdate re');
            console.log(this.store.state);
            this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
            this.store.infraestructuraCantidadesActions.asyncFetchInfraestructura().subscribe(response=>{
              this.buildForm();
            });
          }, error => {
            console.log(this.store.state);
            console.log('response error');
            //this.form.enable();
          })).subscribe();
      }));
      //return null;
    };

}
