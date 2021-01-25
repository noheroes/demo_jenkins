import { AppAudit, AppCurrentFlowStore } from '@lic/core';
import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent, FormModel, FormType, ISubmitOptions, ToastService, ValidateFormFields, IMsgValidations,Validators } from '@sunedu/shared';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProgramaStore } from '../../../store/programa/programa.store';
import { IBandejaPrograma } from '../../../store/programa/programa.store.interface';
import { EntidadPrograma } from '../../../store/programa/programa.store.model';
import { IRequestSolicitudVersion } from '../../../store/programa/programa.store.interface';

@Component({
  selector: 'app-container-programa',
  templateUrl: './app-container-programa.component.html',
  styleUrls: ['./app-container-programa.component.scss'],
  providers: [
    ProgramaStore
  ]
})
export class AppContainerProgramaComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal:string;
  @Input() idSede:string;
  @Input() readOnly:boolean=false;
  state$: Observable<IBandejaPrograma>;
  validators: any;
  form: FormModel<EntidadPrograma>;
  formType = FormType;
  subscriptions: Subscription[];
  formGroup:FormGroup;
  msgValidations: IMsgValidations;
  entidadPrograma : EntidadPrograma;
  idLocalSelecionado:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private store: ProgramaStore,
    public dialog: DialogService,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) {
    this.store.state.bandejaPrograma.isLoading=true;
    this.idLocalSelecionado = true;
   }
  ngOnChanges(changes: SimpleChanges) {

    if(this.idLocal){
      this.idLocalSelecionado = false;
      this.ngOnInit();
    }else
      this.idLocalSelecionado = true;
  }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.bandejaPrograma), distinctUntilChanged());

    if(this.idLocal!=undefined){
      const current = this.storeCurrent.currentFlowAction.get();
      const formRequest: IRequestSolicitudVersion = {
        idVersion: current.idVersionSolicitud
      };
      this.store.programaBandejaActions.setInit(formRequest);
      this.store.programaBandejaActions.setReadOnly(this.readOnly);
      this.store.programaBandejaActions.asyncFetchPage(this.idSede,this.idLocal).subscribe(response=>{
        this.store.programaBandejaActions.asyncFetchPageSearch(formRequest.idVersion).subscribe(
          response =>{
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
        const { form, type } = this.store.state.bandejaPrograma;

        this.buildValidations();
        this.form = new FormModel<EntidadPrograma>(
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
    this.store.programaBandejaActions.asyncFetchPage(this.idSede,this.idLocal,pageRequest).subscribe();
  };
  handleInputChange = ({ name, value }) => {
    this.store.programaBandejaActions.setProgramaId(value);
  };
  handleClickAgregar = () => {
    this.form.validate();
    if(this.form.valid){
      let element = new EntidadPrograma();
      var programa = this.store.programaBandejaActions.getProgramas().filter(element => element.id==this.store.programaBandejaActions.getProgramaId())[0];
      const audit = new AppAudit(this.storeCurrent);
      element = audit.setInsert(element);
      element.id=programa.id;
      element.denominacionPrograma = programa.denominacionPrograma;
      element.idFacultad = programa.idFacultad;
      element.denominacionGradoAcademico = programa.denominacionGradoAcademico;
      element.denominacionTituloOtorgado = programa.denominacionTituloOtorgado;
      this.store.programaBandejaActions.asynSavePrograma(element,this.idSede,this.idLocal).subscribe(response=>{
        this.store.programaBandejaActions.asyncFetchPage(this.idSede,this.idLocal).subscribe(response=>{
          const current = this.storeCurrent.currentFlowAction.get();
          const formRequest: IRequestSolicitudVersion = {
            idVersion: current.idVersionSolicitud
          };
          this.store.programaBandejaActions.asyncFetchPageSearch(formRequest.idVersion).subscribe(
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
        this.store.programaBandejaActions.asyncDelete(id,this.idSede).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.programaBandejaActions.asyncFetchPage(this.idSede,this.idLocal).subscribe(response=>{
          });
        });
      }
    });
  };
}
