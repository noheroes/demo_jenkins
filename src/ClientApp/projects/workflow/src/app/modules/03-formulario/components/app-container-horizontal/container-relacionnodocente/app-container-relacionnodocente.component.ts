import { RelacionNoDocenteStore } from '../../../store/relacionnodocente/relacionnodocente.store';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMsgValidations, AlertService, DialogService, IDataGridButtonEvent, IDataGridEvent, ValidateFormFields } from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-container-relacionnodocente',
  templateUrl: './app-container-relacionnodocente.component.html',
  styleUrls: ['./app-container-relacionnodocente.component.scss'],
  providers: [
    RelacionNoDocenteStore
  ]

})
export class AppContainerRelacionnodocenteComponent implements OnInit, OnChanges {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal: string;
  @Input() idSede: string;
  @Input() readOnly:boolean=false;
  readonly state$ = this.store.state$;
  form: FormGroup;
  msgValidations: IMsgValidations;
  idLocalSelecionado:boolean;
  constructor(
    private store: RelacionNoDocenteStore,
    public dialog: DialogService,
    private alert: AlertService,
    private fb: FormBuilder,
    private storeCurrent: AppCurrentFlowStore,
    private formBuilder: FormBuilder

  ) {
    this.idLocalSelecionado = true;
   }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.idLocal){
      this.idLocalSelecionado = false;
      this.contextProcedimiento();
      
      this.buildValidations();
      this.buildForm();
      this.reloadRelacionDocente();
      this.onGetPersonas();
    }else{
      this.idLocalSelecionado = true;
    }
  }

  ngOnInit() {
    this.contextProcedimiento();
    
    this.buildValidations();
      this.buildForm();
      this.reloadRelacionDocente();
      this.onGetPersonas();
    // this.form = this.fb.group({
    //   name: ['', Validators.required],
    // });
    // this.msgValidations = {
    //   name: [
    //     { name: 'required', message: 'El campo es requerido' },
    //   ]
    // };
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.relacionNoDocenteAgregarActions.setInit(current.idVersionSolicitud, this.idSede, this.idLocal);
    this.store.relacionNoDocenteBuscadorActions.setInit(current.idVersionSolicitud, this.idSede, this.idLocal);
    this.store.relacionNoDocenteBuscadorActions.setReadOnly(this.readOnly);
  }

  buildForm = () => {
    this.form = this.formBuilder.group({
      idPersona: ['', Validators.required],
    });
  }
  buildValidations = () => {
    this.msgValidations = {
      idPersona: [
        { name: 'required', message: 'El campo es requerido' },
      ]
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
    this.store.relacionNoDocenteBuscadorActions.asyncFetchPageMaestroPersona(pageRequest).subscribe();
  }

  reloadRelacionDocente = () => {
    this.store.relacionNoDocenteBuscadorActions.asyncFetchPageMaestroPersona().subscribe();
  }
  
  onGetPersonas=()=>{
    this.store.relacionNoDocenteAgregarActions.asyncFetchPersonas().subscribe();
  }

  deleteRelacionDocente = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then(confirm => {
        if (confirm) {
          this.store.relacionNoDocenteBuscadorActions.asynDeleteRelacionNoDocente(id).subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.reloadRelacionDocente();
            this.onGetPersonas();
          });
        }
      });
  }
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.deleteRelacionDocente(e.item.id);
        break;
    }
  }

  handleClickAgregarDocente = () => {
    //debugger;
    if (this.idSede == '' || this.idSede == undefined || this.idLocal == '' || this.idLocal == undefined) {
      return this.alert.open('Seleccione al sede/filial y local.', null, {
        confirm: false,
        icon: 'info'
      });
    }
    ValidateFormFields(this.form);
    if (!this.form.valid) {
      return;
    }
    this.alert.open('¿Está seguro de agregar el no docente?', null, { confirm: true })
      .then(confirm => {
        if (confirm) {
          this.store.relacionNoDocenteAgregarActions.asynUpdate(this.form.value)
            .pipe(
              tap(response => {
                this.form.reset();
                if (!response.success) {
                  return this.alert.open('El no docente ya esta agregada en un local.', null, {
                    confirm: false,
                    icon: 'info'
                  });
                }
                //this.handleLoadRelacionDocente.emit();
                this.reloadRelacionDocente();
                this.onGetPersonas();
              })
            ).subscribe();
        }
      });
  }

}
