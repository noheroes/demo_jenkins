import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IMsgValidations, ValidateFormFields, AlertService } from '@sunedu/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RelacionDocenteStore } from '../../../store/relaciondocente/relaciondocente.store';
import { Observable } from 'rxjs';
import { IAgregarRelacionDocente, IBuscardorRelacionDocente } from '../../../store/relaciondocente/relaciondocente.store.interface';
import { distinctUntilChanged, map, tap, switchMap, concatMap } from 'rxjs/operators';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

@Component({
  selector: 'app-form-agregar-docente',
  templateUrl: './app-form-agregar-docente.component.html',
  styleUrls: ['./app-form-agregar-docente.component.scss'],
  providers: [
    RelacionDocenteStore
  ]
})
export class AppFormAgregarDocenteComponent implements OnInit, OnChanges {
  form: FormGroup;
  msgValidations: IMsgValidations;
  state$: Observable<IAgregarRelacionDocente>;
  @Input() idLocal: string;
  @Input() idSede: string;
  @Input() readOnly:boolean=false;
  @Input() itemsGrilla:any;
  @Output() handleLoadRelacionDocente = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private store: RelacionDocenteStore,
    private storeCurrent: AppCurrentFlowStore,
    private alert: AlertService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.contextProcedimiento();
  }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.agregarRelacionDocente), distinctUntilChanged());
    this.contextProcedimiento();
    this.buildForm();
    this.buildValidations();
    this.store.relacionDocenteAgregarActions.asyncFetchPersonas().subscribe();
    //this.onGetPersonas();
  }
  onGetPersonas=(items:any)=>{
    //console.log('CAYL onGetPersonas', items);
    //const itemsGrilla = this.store.relacionDocenteBuscadorActions.getItems();
    this.store.relacionDocenteAgregarActions.asyncFetchPersonas().subscribe();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.relacionDocenteAgregarActions.setInit(current.idVersionSolicitud, this.idSede, this.idLocal);
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
                this.handleLoadRelacionDocente.emit();
              })
            ).subscribe();
        }
      });
  }
}
