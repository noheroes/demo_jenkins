import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators,IDataGridButtonEvent, IDataGridEvent } from '@sunedu/shared';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { AppAudit, AppCurrentFlowStore, APP_CLOSE_MODAL } from '@lic/core';
import { MaestroProgramaSegundaStore } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store';
import { IBandejaMaestroProgramaVinculado } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store.interface';
import { EntidadMaestroProgramaVinculado } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store.model';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';

const MESSAGES = {
    CONFIRM_SAVE: '¿Está seguro de GUARDAR un registro de segunda especialidad?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de segunda especialidad?',
    CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
  };
  
@Component({
    selector: 'app-form-maestro-programa-vin',
    templateUrl: './app-form-maestro-programa-vin.component.html',
    styleUrls: ['./app-form-maestro-programa-vin.component.scss']
})
export class AppFormMaestroProgramaVinComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<EntidadMaestroProgramaVinculado>;
    store: MaestroProgramaSegundaStore; 
    state$: Observable<IBandejaMaestroProgramaVinculado>;
    subscriptions: Subscription[];
    validators: any;
    desabilitar:boolean;
    readOnly:boolean; 
    nombre_segEspecialidad: string;
    regimenEstudioEnum:any;
    readonly CLOSE_MODAL = APP_CLOSE_MODAL;
    constructor(
      public dialogRef: MatDialogRef<AppFormMaestroProgramaVinComponent>,
      private toast: ToastService,
      private alert: AlertService,
      private storeCurrent: AppCurrentFlowStore,
      private storeEnumerado: EnumeradoGeneralStore,
    ) { }
    async ngOnInit() {
      this.setInitilData();
      this.buildValidations();
      this.buildForm();
      this.subscribeToState();
      await this.loadConfiguracion();
      
      forkJoin(
        this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDREGIMENESTUDIO')
      ).pipe(tap(enums => {
        
        this.regimenEstudioEnum = enums[0].list;
      })).subscribe();
    }
    private setInitilData = () => {
      return new Promise<void>(
        (resolve)=>{
          this.desabilitar=true;
          this.state$ = this.store.state$.pipe(map(x => x.bandejaMaestroProgramaVinculado), distinctUntilChanged());
          this.store.vinculadoBandejaActions.setReadOnly(this.readOnly);
        resolve();
      });      
    }
    private async loadConfiguracion() {
      this.store.vinculadoBandejaActions.setStateIsLoading(true);
      let promises: any[] = [];
      // const action0 = await this.setInitilData();
      // promises.push(action0);
      // const action3 = await this.buildValidations();
      // promises.push(action3);
      // const action5 = await this.subscribeToState();
      //promises.push(action5);
      const action6 = await this.loadBandeja();
      promises.push(action6);
     
      await Promise.all(promises).then(() => { 
        this.loadConfiguracion2();
      });
    }
    private async loadConfiguracion2() {
      let promises2: any[] = [];
        // const action4 = await this.buildForm();
        // promises2.push(action4);
        const action7 = await this.loadCombos();
        promises2.push(action7);
      await Promise.all(promises2).then(() => { this.store.vinculadoBandejaActions.setStateIsLoading(false); });
    }
    private loadBandeja=()=>{
      return new Promise<void>(
        (resolve)=>{
          this.store.vinculadoBandejaActions.asyncFetchPageMaestroProgramaSegunda().subscribe(response=>{         
          });
        resolve();
        });
    }
    private buildForm = () => {
      return new Promise<void>(
        (resolve)=>{
        const { form,type} = this.store.state.bandejaMaestroProgramaVinculado;
        this.buildValidations();
        this.form = new FormModel<EntidadMaestroProgramaVinculado>(
          type,
          form,
          this.validators,
        );
        resolve();
      });
    };
    private loadCombos = () => {
      return new Promise<void>(
        (resolve)=>{
        this.store.vinculadoBandejaActions.asyncFetchCombos();
        resolve();
      });
    };
    handleInputChange = ({ name, value }) => {
      this.store.vinculadoBandejaActions.setProgramaId(value);
    };
    ngOnDestroy(): void {
      this.subscriptions.forEach(x => {
        x.unsubscribe();
      });
    }
    subscribeToState = () => {
      return new Promise<void>(
        (resolve)=>{
        const subs = this.store.state$.pipe(map(x => x.bandejaMaestroProgramaVinculado.form), distinctUntilChanged())
          .subscribe(x => {
            this.form.patchValue(x);
          });
        this.subscriptions = [subs];
        resolve();
      });
    }
   
    
    buildValidations = () => {
      return new Promise<void>(
        (resolve)=>{
          this.validators = {
            id: [Validators.required],
          };
        resolve();
      });
    }
    handleSubmit = () => {
      this.form.submit();
    }
  
    handleClose = () => {
      this.dialogRef.close();
      /*const { type } = this.store.state.modalMaestroProgramaSe;
      if (type !== FormType.CONSULTAR) {
        this.alert.open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, { confirm: true }).then(confirm => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
      } else {
        this.dialogRef.close();
      }
      */
    }
    handleClickButton = (e: IDataGridButtonEvent) => {
      switch (e.action) {
        case 'ELIMINAR':
          this.deletePrograma(e.item.id);
          break;
      }
    }
    deletePrograma = (id: string) => {
      this.alert.open('¿Está seguro de eliminar el programa vinculado?', null, { confirm: true }).then(confirm => {
        if (confirm) {
          this.store.vinculadoBandejaActions.asynDeleteMaestroProgramaSegunda(id).subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.store.vinculadoBandejaActions.asyncFetchPageMaestroProgramaSegunda().subscribe(response=>{
              this.buildForm();
              this.loadCombos();  
            });   
            this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(this.regimenEstudioEnum).subscribe(response=>{
            });
          });
        }
      });
    }
    handleAgregarPrograma=()=>{
      this.form.validate();
      if(this.form.valid){ 
        this.alert.open('¿Está seguro que desea agregar el programa selecionado?', 'Confirmación', { confirm: true }).then(confirm => {
          if(this.store.state.bandejaMaestroProgramaVinculado.source.items.findIndex(item=>item.id==this.store.vinculadoBandejaActions.getProgramaId())==-1)
          if (confirm) {   
            var programa = this.store.vinculadoBandejaActions.getProgramas().filter(element => element.id==this.store.vinculadoBandejaActions.getProgramaId())[0];
            this.store.vinculadoBandejaActions.asynSavePrograma(programa).subscribe(response=>{
              this.alert.open('Programa agregado', null, { icon: 'success'});
              this.store.vinculadoBandejaActions.asyncFetchPageMaestroProgramaSegunda().subscribe(response=>{
                this.buildForm();
                this.loadCombos();
                this.store.vinculadoBandejaActions.setStateIsLoading(false);
              });
              this.store.segundaBandejaActions.asyncFetchPageMaestroProgramaSegunda(this.regimenEstudioEnum).subscribe(response=>{
              });

            });
            
          }
        });
      }
    }
    handleLoadData = (e: IDataGridEvent) => {
      const pageRequest = {
        page: e.page,
        pageSize: e.pageSize,
        orderBy: e.orderBy,
        orderDir: e.orderDir,
        skip: e.skip
      };
      this.store.vinculadoBandejaActions.asyncFetchPageMaestroProgramaSegunda(pageRequest).subscribe();
    }
  }
  