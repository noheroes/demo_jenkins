import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMsgValidations, AlertService, ValidateFormFields } from '@sunedu/shared';
import { Observable } from 'rxjs';
import { IAgregarRelacionNoDocente } from '../../../store/relacionnodocente/relacionnodocente.store.interface';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { RelacionNoDocenteStore } from '../../../store/relacionnodocente/relacionnodocente.store';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-form-agregar-nodocente',
  templateUrl: './app-form-agregar-nodocente.component.html',
  styleUrls: ['./app-form-agregar-nodocente.component.scss'],
  providers: [
    RelacionNoDocenteStore
  ]
})
export class AppFormAgregarNodocenteComponent implements OnInit , OnChanges {
  form: FormGroup;
  msgValidations: IMsgValidations;
  state$: Observable<IAgregarRelacionNoDocente>;
  @Input() idLocal: string;
  @Input() idSede: string;
  @Input() readOnly:boolean=false;
  @Output() handleLoadRelacionDocente = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private store: RelacionNoDocenteStore,
    private storeCurrent: AppCurrentFlowStore,
    private alert: AlertService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.contextProcedimiento();
  }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.agregarRelacionNoDocente), distinctUntilChanged());
    this.contextProcedimiento();
    this.buildForm();
    this.buildValidations();
    this.store.relacionNoDocenteAgregarActions.asyncFetchPersonas().subscribe();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.relacionNoDocenteAgregarActions.setInit(current.idVersionSolicitud, this.idSede, this.idLocal);
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
                this.handleLoadRelacionDocente.emit();
              })
            ).subscribe();
        }
      });
  }
}
