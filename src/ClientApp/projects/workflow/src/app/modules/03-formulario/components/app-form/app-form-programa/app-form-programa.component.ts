import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormType, FormModel, ISubmitOptions,IDataGridButtonEvent,IDataGridEvent,AlertService } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Subscription, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProgramaStore } from '../../../store/programa/programa.store'; 
import { IBandejaPrograma } from '../../../store/programa/programa.store.interface';
@Component({
    selector: 'app-form-programa',
    templateUrl: './app-form-programa.component.html',
    styleUrls: ['./app-form-programa.component.scss']
})
export class AppFormProgramaComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<IBandejaPrograma>;
    //formBuscar: FormModel<IFormBuscadorPrograma>;
    readonly state$ = this.store.state$.pipe(map(x => x.bandejaPrograma), distinctUntilChanged());
    readonly stateBuscar$ = this.store.state$.pipe(map(x => x.buscadorPrograma), distinctUntilChanged());
    //state$: Observable<IPrograma>;
    subscriptions: Subscription[];
    validators: any;

    constructor(
      private formBuilder: FormBuilder,
      private store: ProgramaStore,
      private alert: AlertService
    ) { }
  
    ngOnInit() {
      //this.state$ = this.store.state$.pipe(map(x => x.modalMallaCurricular), distinctUntilChanged());
      //this.modoTypeoModal();
      //this.buildValidations();
      this.buildForm();
      //this.subscribeToState();
    }
    ngOnDestroy(): void {
      
    }
    private buildForm = () => {
      const { form } = this.store.state.bandejaPrograma;
      this.form = new FormModel<any>(
        FormType.BUSCAR,
        form,
        null,
        {
          //onSearch: this.handleSearch
        }
      );
      /*const { formBuscar } = this.store.state.buscadorPrograma;
      this.formBuscar = new FormModel<any>(
        FormType.BUSCAR,
        formBuscar,
        null,
        {
          onSearch: this.handleSearch
        }
      );*/
    }
    handleSearch = (formValue: any, options: ISubmitOptions) => {
      const { source } = this.store.state.bandejaPrograma;
      this.store.programaBandejaActions.asyncFetchPageProgramaSucces(source, formValue).subscribe();
    };
    handleInputChange = ({ name, value }) => {
    };
    handleClickNuevoProgramaMencion = () => {
      
    };
    handleLoadData = (e: IDataGridEvent) => {

    };
    handleClickButton = (e: IDataGridButtonEvent) => {
      switch (e.action) {
        case 'ELIMINAR':
          this.deletePrograma(e.item._id);
          break;
      }
    };
    deletePrograma = (id: string) => {
      this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
        if (confirm) {
          this.store.programaBandejaActions.asynDeleteMaestroPrograma(id).subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
          });
        }
      });
    };
    handleClickAgregarPrograma = () => {
      this.alert.open('!No se puede asociar el programa por que no tiene malla curricular asociada¡', null, { icon: 'warning' });
    };
    
  }
  