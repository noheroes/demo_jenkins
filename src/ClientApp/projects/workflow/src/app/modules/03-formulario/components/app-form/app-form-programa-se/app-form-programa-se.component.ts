import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormType, FormModel, ISubmitOptions,IDataGridButtonEvent,IDataGridEvent,AlertService } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Subscription, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProgramaSeStore } from '../../../store/programase/programase.store'; 
import { IBandejaProgramaSe } from '../../../store/programase/programase.store.interface';
@Component({
    selector: 'app-form-programa-se',
    templateUrl: './app-form-programa-se.component.html',
    styleUrls: ['./app-form-programa-se.component.scss']
})
export class AppFormProgramaSeComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<IBandejaProgramaSe>;
    //formBuscar: FormModel<IFormBuscadorProgramaSe>;
    readonly state$ = this.store.state$.pipe(map(x => x.bandejaProgramaSe), distinctUntilChanged());
    readonly stateBuscar$ = this.store.state$.pipe(map(x => x.buscadorProgramaSe), distinctUntilChanged());
    //state$: Observable<IProgramaSe>;
    subscriptions: Subscription[];
    validators: any;

    constructor(
      private formBuilder: FormBuilder,
      private store: ProgramaSeStore,
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
      const { form } = this.store.state.bandejaProgramaSe;
      this.form = new FormModel<any>(
        FormType.BUSCAR,
        form,
        null,
        {
          //onSearch: this.handleSearch
        }
      );
      /*const { formBuscar } = this.store.state.buscadorProgramaSe;
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
      const { source } = this.store.state.bandejaProgramaSe;
      this.store.programaSeBandejaActions.asyncFetchPageProgramaSeSucces(source, formValue).subscribe();
    };
    handleInputChange = ({ name, value }) => {
    };
    handleClickNuevoProgramaSeMencion = () => {
      
    };
    handleLoadData = (e: IDataGridEvent) => {

    };
    handleClickButton = (e: IDataGridButtonEvent) => {
      switch (e.action) {
        case 'ELIMINAR':
          this.deleteProgramaSe(e.item._id);
          break;
      }
    };
    deleteProgramaSe = (id: string) => {
      this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
        if (confirm) {
          this.store.programaSeBandejaActions.asynDeleteMaestroProgramaSe(id).subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
          });
        }
      });
    };
    handleClickAgregarProgramaSe = () => {

      this.alert.open('!No se puede asociar el ProgramaSe por que no tiene malla curricular asociada¡', null, { icon: 'warning' });
    };
    
  }
  