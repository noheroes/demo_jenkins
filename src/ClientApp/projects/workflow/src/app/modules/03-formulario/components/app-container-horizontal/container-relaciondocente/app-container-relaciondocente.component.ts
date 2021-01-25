import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { RelacionDocenteStore } from '../../../store/relaciondocente/relaciondocente.store';
import { DialogService, AlertService, IDataGridEvent, IDataGridButtonEvent, IMsgValidations, ValidateFormFields } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-container-relaciondocente',
  templateUrl: './app-container-relaciondocente.component.html',
  styleUrls: ['./app-container-relaciondocente.component.scss'],
  providers: [
    RelacionDocenteStore
  ]
})
export class AppContainerRelaciondocenteComponent implements OnInit, OnChanges {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() idLocal: string;
  @Input() idSede: string;
  @Input() readOnly:boolean=false;

  @Output() handleItemsGrilla:EventEmitter<any> = new EventEmitter();
  items:any[];
  readonly state$ = this.store.state$;
  form: FormGroup;
  msgValidations: IMsgValidations;
  idLocalSelecionado:boolean;
  constructor(
    private store: RelacionDocenteStore,    
    public dialog: DialogService,
    private alert: AlertService,
    private fb: FormBuilder,
    private storeCurrent: AppCurrentFlowStore,
    private formBuilder: FormBuilder,

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
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.relacionDocenteAgregarActions.setInit(current.idVersionSolicitud, this.idSede, this.idLocal);
    this.store.relacionDocenteBuscadorActions.setInit(current.idVersionSolicitud, this.idSede, this.idLocal);
    this.store.relacionDocenteBuscadorActions.setReadOnly(this.readOnly);
  }

  // private contextProcedimiento = () => {
  //   const current = this.storeCurrent.currentFlowAction.get();
  //   this.store.relacionDocenteBuscadorActions.setInit(current.idVersionSolicitud, this.idSede,this.idLocal);
    
  // }

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

  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.store.relacionDocenteBuscadorActions.asyncFetchPageMaestroPersona(pageRequest).subscribe();
  }

  reloadRelacionDocente = () => {
    //Grilla
    this.store.relacionDocenteBuscadorActions.asyncFetchPageMaestroPersona().subscribe();
  }

  onGetPersonas=()=>{
    //console.log('CAYL onGetPersonas');
    // const itemsGrilla = this.store.relacionDocenteBuscadorActions.getItems();
    this.store.relacionDocenteAgregarActions.asyncFetchPersonas().subscribe();
  }
  

  deleteRelacionDocente = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then(confirm => {
        if (confirm) {
          this.store.relacionDocenteBuscadorActions.asynDeleteRelacionDocente(id).subscribe(reponse => {
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
    this.alert.open('¿Está seguro de agregar el docente?', null, { confirm: true })
      .then(confirm => {
        if (confirm) {          
          this.store.relacionDocenteAgregarActions.asynUpdate(this.form.value)
            .pipe(
              tap(response => {
                this.form.reset();
                if (!response.success) {
                  return this.alert.open('El docente ya esta agregada en un local.', null, {
                    confirm: false,
                    icon: 'info'
                  });
                }
                this.reloadRelacionDocente();
                this.onGetPersonas();
              })
            ).subscribe();
        }
      });
  }

}
