import { AlertService, FormModel, FormType, Validators } from '@sunedu/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { Router } from '@angular/router';

const MESSAGES = {
  CONFIRM_IR_BANDEJA: '¿Está seguro que desea retornar a bandeja?',
  CONFIRM_FINALIZAR: '¿Está seguro que desea finalizar la actividad?',
};

@Component({
  selector: 'app-general-footer',
  templateUrl: './app-general-footer.component.html',
  styleUrls: ['./app-general-footer.component.scss'],
})
export class AppGeneralFooterComponent implements OnInit {
  @Input() finalizarText: string = 'Finalizar Actividad';
  @Input() loading: boolean;
  @Output() clickFinalizar: EventEmitter<any> = new EventEmitter();
  @Output() clickBandeja: EventEmitter<any> = new EventEmitter();
  @Output() clickValidar: EventEmitter<any> = new EventEmitter();
  @Input() source: IFormularioModel = null;
  @Input() esModoConsulta:boolean=false;
  form: FormModel<any>;
  validators: any;
  constructor(private alertService: AlertService, private router: Router) {}

  ngOnInit() {
    this.buildForm();
  }

  handleValidar = () => {
    this.clickValidar.emit(null);
  };
  handleInputChange(obj): void {
    // console.log(obj);
  }

  handleFinalizar = () => {
    const conDecision = this.source.formulario.decision.conDecision;
    if (conDecision) {
      this.form.validate();
      if (!this.form.valid) {
        return false;
      }
    }
    const paramEvent = {
      ...this.form.value,
    };

    this.alertService
      .open(MESSAGES.CONFIRM_FINALIZAR, null, { confirm: true })
      .then((c) => {
        if (c) {
          this.clickFinalizar.emit(paramEvent);
        }
      });
  };

  buildForm = () => {
    const form = { seleccion: '' };
    this.form = new FormModel<any>(FormType.REGISTRAR, form, {
      seleccion: [Validators.required],
    });
  };

  handleIrBandeja = () => {
    this.alertService
      .open(MESSAGES.CONFIRM_IR_BANDEJA, null, { confirm: true })
      .then((c) => {
        if (c) {
          this.clickBandeja.emit(null);
        }
      });
  };

  handleRegresar=()=>{
    this.router.navigate(['/workflow/trazabilidad']);
  };
  
}
