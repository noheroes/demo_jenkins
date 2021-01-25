import { AppAudit, AppCurrentFlowStore } from '@lic/core'; 
import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent, FormModel, FormType, ISubmitOptions, ToastService, ValidateFormFields, IMsgValidations,Validators } from '@sunedu/shared';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProgramaSeStore } from '../../../store/programase/programase.store';
import { IBandejaProgramaSe } from '../../../store/programase/programase.store.interface';
import { EntidadProgramaSe } from '../../../store/programase/programase.store.model';
import { IRequestSolicitudVersion } from '../../../store/programase/programase.store.interface';

@Component({
  selector: 'app-container-programa-se',
  templateUrl: './app-container-programa-se.component.html',
  styleUrls: ['./app-container-programa-se.component.scss'],
  providers: [
    ProgramaSeStore
  ]
})
export class AppContainerProgramaSeComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal:string;
  @Input() idSede:string;
  @Input() readOnly:boolean=false;
  state$: Observable<IBandejaProgramaSe>;
  validators: any;
  form: FormModel<EntidadProgramaSe>;
  formType = FormType;
  subscriptions: Subscription[];
  formGroup:FormGroup;
  msgValidations: IMsgValidations;
  entidadProgramaSe : EntidadProgramaSe;
  idLocalSelecionado:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private store: ProgramaSeStore,
    public dialog: DialogService,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) {
    this.idLocalSelecionado = true;
   }
  ngOnChanges(changes: SimpleChanges) {
    if(this.idLocal){
      this.idLocalSelecionado = false;
      this.ngOnInit();
    }else{
      this.idLocalSelecionado = true;
    }
  }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.bandejaProgramaSe), distinctUntilChanged());
    if(this.idLocal!=undefined){
      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: IRequestSolicitudVersion = {
        idVersion: current.idVersionSolicitud
      };
      this.store.programaSeBandejaActions.setInit(formRequest);
      this.store.programaSeBandejaActions.setReadOnly(this.readOnly);
      this.store.programaSeBandejaActions.asyncFetchPage(this.idSede,this.idLocal).subscribe(response=>{
        this.store.programaSeBandejaActions.asyncFetchPageSearch(formRequest.idVersion).subscribe(
          response =>{
            //this.store.ProgramaSeBandejaActions.ngon
          }
        );
      });
    }
    this.buildValidations();
    this.buildForm();
  }
  private buildForm = () => {
    return new Promise(
      (resolve)=>{
        const { form, type } = this.store.state.bandejaProgramaSe;
        this.buildValidations();
        this.form = new FormModel<EntidadProgramaSe>(
          type,
          form,
          this.validators,
          // {
          //   beforeSubmit: this.beforeSubmit,
          //   onSave: this.handleSave,
          //   onUpdate: this.handleUpdate,
          //   validateOnSave: this.handleValidateOnSave,
          //   confirmOnSave: this.handleConfirmOnSave,
          // }
        );
      resolve();
    });
  }

  buildValidations = () => {
    this.validators = {
      id:[Validators.required],
    };
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
    this.store.programaSeBandejaActions.asyncFetchPage(this.idSede,this.idLocal,pageRequest).subscribe();
  };
  handleInputChange = ({ name, value }) => {
    this.store.programaSeBandejaActions.setProgramaSeId(value);
  };
  handleClickAgregar = () => {
    this.form.validate();
    if(this.form.valid){
      let element = new EntidadProgramaSe();
      var programaSe = this.store.programaSeBandejaActions.getProgramaSes().filter(element => element.id==this.store.programaSeBandejaActions.getProgramaSeId())[0];
      const audit = new AppAudit(this.storeCurrent);
      element= audit.setInsert(element);
      element.id=programaSe.id;
      element.denominacionPrograma = programaSe.denominacionPrograma;
      element.idFacultad = programaSe.idFacultad;
      element.denominacionGradoAcademico = programaSe.denominacionGradoAcademico;
      element.denominacionTituloOtorgado = programaSe.denominacionTituloOtorgado;
      
      this.store.programaSeBandejaActions.asynSaveProgramaSe(element,this.idSede,this.idLocal).subscribe(response=>{
        this.store.programaSeBandejaActions.asyncFetchPage(this.idSede,this.idLocal).subscribe(response=>{
          const current = this.storeCurrent.currentFlowAction.get();
          const formRequest: IRequestSolicitudVersion = {
            idVersion: current.idVersionSolicitud
          };
          this.store.programaSeBandejaActions.asyncFetchPageSearch(formRequest.idVersion).subscribe(
            response =>{
              this.buildForm();
            }
          );
        });
      });
    }
  }
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.delete(e.item.id);
        break;
    }
  };
  delete = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.programaSeBandejaActions.asyncDelete(id,this.idSede).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.programaSeBandejaActions.asyncFetchPage(this.idSede,this.idLocal).subscribe(response=>{
          });
        });
      }
    });
  };
}
