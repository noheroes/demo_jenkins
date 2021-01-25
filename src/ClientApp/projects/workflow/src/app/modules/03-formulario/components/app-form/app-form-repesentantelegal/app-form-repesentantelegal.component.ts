import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, Validators, ISubmitOptions, ComboList } from '@sunedu/shared';
import { IModalRepresentanteLegal, IFormRepresentanteLegal } from '../../../store/datosgenerales/datosgenerales.store.interface';
import { DatosGeneralesStore } from '../../../store/datosgenerales/datosgenerales.store';
import { Observable, Subscription, from, merge, of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { distinctUntilChanged, map, tap, concatMap } from 'rxjs/operators';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
import { isNullOrUndefined } from 'util';
import { IUbigeo } from '../../../store/external/ubigeo/ubigeo.interface';
import { ITrakingProcedimiento } from '@lic/workflow/app/modules/02-workflow/pages/inicio/store/inicio.store.interface';
import { AppAudit, AppCurrentFlowStore, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el representante legal?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro del representante legal?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({
  selector: 'app-form-repesentantelegal',
  templateUrl: './app-form-repesentantelegal.component.html',
  styleUrls: ['./app-form-repesentantelegal.component.scss']
})
export class AppFormRepesentantelegalComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<any>;
  store: DatosGeneralesStore;
  storeUbigeo:UbigeoGeneralStore
  state$: Observable<IModalRepresentanteLegal>;
  subscriptions: Subscription[];
  validators: any;
  isRepresentante:boolean;

  //readonly state$ = this.store.state.modalRepresentanteLegal;
  // Ubigeos
  departamentos= new ComboList([]);
  provincias= new ComboList([]);
  distritos= new ComboList([]);

  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  //readonly state$ = this.store.state$.pipe(map(x => x.modalRepresentanteLegal), distinctUntilChanged());

  @Output() succesEvent = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AppFormRepesentantelegalComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  async ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalRepresentanteLegal), distinctUntilChanged());
    // console.log(this.state$);
    this.isRepresentante=true; // bloquea los datos de representante
    this.buildValidations();
    this.buildForm();
    //console.log(this.departamentos);
    await this.loadConfiguracion();

    //await this.modoTypeoModal();

    //this.loadCombos();
    // this.modoTypeoModal();
    // this.buildValidations();
    // this.buildForm();
    // this.subscribeToState();
  }

  private async loadConfiguracion(){
    //this.store.state.modalRepresentanteLegal.isLoading=true;
    //this.state$ = this.store.state$.pipe(map(x => x.modalRepresentanteLegal), distinctUntilChanged());
    //this.isRepresentante=true; // bloquea los datos de representante

    let promises: any[] = [];

    // const action8 = await this.initial();
    // promises.push(action8);
    // console.log('termino 8');

    const action6 = await this.modoTypeoModal();
    promises.push(action6);
    //console.log('termino 6');

    // const action3 = await this.buildValidations();
    // promises.push(action3);
    // //console.log('termino 3');
    // const action4 = await this.buildForm();
    // promises.push(action4);
    //console.log('termino 4');

    const action5 = await this.subscribeToState();
    promises.push(action5);
    //console.log('termino 5');

    const action7 = await this.buildDepartamentos();
    promises.push(action7);
    //console.log('termino 7');

    const action8 = await this.ubigeoMatch(this.store.state.modalRepresentanteLegal.form.ubigeo);
    promises.push(action8);
    //console.log('termino 8');

    await Promise.all(promises).then(()=>{this.store.state.datosGenerales.isLoading=false;});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  private initial=()=>{
    return new Promise<void>(
      (resolve)=>{

      resolve();
    });
  }

  private buildDepartamentos = ()=>{
    return new Promise<void>(
      (resolve)=>{
        this.storeUbigeo.currentUbigeoActions.getDepartamentos().then(
          (info)=>{
            //console.log(info);
            if(info){
              this.departamentos = info['value'];
              resolve();
            }    
          }
        );
      }
    );
  }

  ubigeoMatch = (ubigeo:string)=>{
    return new Promise<void>(
      (resolve)=>{
        if(!isNullOrUndefined(ubigeo)){
          // buscar el distrito;
          let distrito:IUbigeo;
          //console.log(ubigeo);
          this.storeUbigeo.currentUbigeoActions.getInformacionUbigeoByCodigo(ubigeo)
          .subscribe(dist=>{
            distrito = dist;
            //console.log(dist);
            if(distrito!=null){
              this.storeUbigeo.currentUbigeoActions.getInformacionUbigeoByCodigo(distrito.referencia)
              .subscribe(provincia=>{
                //console.log(provincia);
                this.storeUbigeo.currentUbigeoActions.getInformacionUbigeoByCodigo(provincia.referencia)
                .subscribe(departamento=>{
                  //console.log(departamento);
                  this.form.get('nombreDepartamento').setValue(departamento.codigo);
                  this.storeUbigeo.currentUbigeoActions.getProvincias(departamento.codigo)
                  .subscribe(prov=>{
                      this.provincias= new ComboList([]);
                      this.distritos= new ComboList([]);
                      this.provincias=prov;
                    this.form.get('nombreProvincia').setValue(provincia.codigo);
                    this.storeUbigeo.currentUbigeoActions.getDistritos(provincia.codigo)
                    .subscribe(dist=>{
                      this.distritos= new ComboList([]);
                      this.distritos=dist;
                      this.form.get('nombreDistrito').setValue(distrito.codigo);
                    });
                  });
                });
              });
            }
          });
        }
      resolve();
    });
  }

  private modoTypeoModal = () => {
    return new Promise<void>(
      (resolve)=>{

        const { type, tipoDocumento, numeroDocumento } = this.store.state.modalRepresentanteLegal;

        if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
          this.store.actionDatoGenerales.asynFetchRepresentanteLegal(tipoDocumento, numeroDocumento)
            .pipe(tap(response => {
              this.store.representantenLegalModalActions.loadDataRepresentanteLegal(response);

              resolve();
            }))
            .subscribe();
        }
    });

  }
  private buildValidations = () => {
    return new Promise<void>(
      (resolve)=>{
        this.validators = {
          nombresApellidos: [Validators.required],
          tipoDocumento: [Validators.required],
          numeroDocumento: [Validators.required],
          //cargo: [Validators.required],
          oficinaRegistral: [Validators.required],
          numeroPartida: [Validators.required],
          asiento: [Validators.required],
          domicilioLegal: [Validators.required],
          nombreDepartamento: [Validators.required],
          nombreProvincia: [Validators.required],
          nombreDistrito: [Validators.required],
          telefono: [Validators.required],
          correo: [Validators.required]
        };
      resolve();
    });

  }
  private buildForm = () => {
    return new Promise<void>(
      (resolve)=>{
        const { form, type } = this.store.state.modalRepresentanteLegal;
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
    const { type } = this.store.state.modalRepresentanteLegal;
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
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormRepresentanteLegal> => {
    return from(new Promise((resolve, reject) => {
      //console.log(formValue);
      // console.log(options);
      //debugger;
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setUpdate(formValue);
      
      this.store.actionDatoGenerales.setUpdateRepresentanteLegal(formValue).then(()=>{
        this.store.actionDatoGenerales.asyncSetDatosGenerales().then((response: any) => {
          //this.dialogRef.close();
          // console.log(response);
          let traking:ITrakingProcedimiento = response;
          if(traking.success){
            // Ir a bandeja
            this.alert.open(traking.message, 'Representante Legal', { icon: 'success'});
            this.succesEvent.emit(true);
            this.dialogRef.close();
          }else{
            this.alert.open(traking.message, 'Representante Legal', { icon: 'warning'});
            this.succesEvent.emit(false);
            this.dialogRef.close();
          }
          resolve();
        });
      });

      // this.store.representantenLegalModalActions.asynUpdateRepresentanteLegal(formValue).pipe(
      //   tap(response => {
      //     this.dialogRef.close();
      //     this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
      //   }),
      //   concatMap(response =>
      //     this.store.representanteLegalBuscadorActions.asyncFetchRepresentanteLegal()
      //   )).subscribe();
    }));
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormRepresentanteLegal> => {
    // return from(new Promise((resolve, reject) => {
    //   this.store.representantenLegalModalActions.asynSaveRepresentanteLegal(formValue).pipe(
    //     tap(response => {
    //       this.dialogRef.close();
    //       this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
    //     }),
    //     concatMap(response => this.store.representanteLegalBuscadorActions.asyncFetchRepresentanteLegal()
    //     )
    //   ).subscribe();
    // }));
    return of(null); // esta linea no va! cayl
  }
  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  }
  private subscribeToState = () => {
    return new Promise<void>(
      (resolve)=>{
        const subs1 = this.store.state$.pipe(map(x => x.modalRepresentanteLegal.form), distinctUntilChanged())
        .subscribe(x => {
          this.form.patchValue(x);
        });
      this.subscriptions = [subs1];
      resolve();
    });
  }

  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalRepresentanteLegal;
    if (type !== FormType.CONSULTAR) {
      this.alert.open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, { confirm: true })
        .then(confirm => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }


  handleInputChange = ({ name, value }) => {
    // console.log(name);
    // console.log(value);

    if(value==null) return;

    switch (name) {
      case "nombreDepartamento":
      {
        this.provincias = new ComboList([]);
        this.form.get('nombreProvincia').setValue(null);
        this.distritos = new ComboList([]);
        this.form.get('nombreDistrito').setValue(null);
        this.storeUbigeo.currentUbigeoActions.getProvincias(value)
        .subscribe(
          info=>{
            this.provincias = !info? new ComboList([]):info;
            //console.log(this.provincias);
          }
        )
        // this.provincias =  this.storeUbigeo.currentUbigeoActions.getProvincias(value)==null?[]:this.storeUbigeo.currentUbigeoActions.getProvincias(value);
        // console.log(this.provincias);
      }
      break;

      case "nombreProvincia":
      {
        this.distritos = new ComboList([]);
        this.form.get('nombreDistrito').setValue(null);
        if(value==null) return;
        this.storeUbigeo.currentUbigeoActions.getDistritos(value)
        .subscribe(
          info=>{
            this.distritos = !info? new ComboList([]):info;
            // console.log(this.distritos);
          })
          // this.distritos =  this.storeUbigeo.currentUbigeoActions.getDistritos(value)==null?[]:this.storeUbigeo.currentUbigeoActions.getDistritos(value);
          // console.log(this.distritos);
      }
      break;

      default:
        break;
    }
  };

}
