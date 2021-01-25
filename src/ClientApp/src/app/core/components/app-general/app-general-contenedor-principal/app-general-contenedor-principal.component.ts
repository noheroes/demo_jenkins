import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { SuneduTemplateDirective, FormModel, AlertService, FormType, Validators } from '@sunedu/shared';
import { AppCurrentFlowStore, IFormularioModel } from '@lic/core';
const MESSAGES = {
  CONFIRM_IR_BANDEJA: '¿Está seguro que desea retornar a bandeja?',
  CONFIRM_FINALIZAR: '¿Está seguro que desea finalizar la actividad?',
};

@Component({
  selector: 'app-general-contenedor-principal',
  templateUrl: './app-general-contenedor-principal.component.html',
  styleUrls: ['./app-general-contenedor-principal.component.scss'],
})
export class AppGeneralContenedorPrincipalComponent
  implements OnInit, AfterContentInit, OnChanges {
  @Input() source: IFormularioModel;
  @Input() contentSource: any;
  @Input() loading: boolean;
  @Input() disabledFinalizar:boolean;
  @Input() esConsultaSolicitud:boolean;
  //esConsultaSolicitud:boolean;

  // TEMPLATES
  overrideContentTemplate: any = null;
  contentTemplates: any = {};
  selectedIndexValue = 0;
  @ContentChildren(SuneduTemplateDirective) templates: QueryList<
    SuneduTemplateDirective
  >;
  form: FormModel<any>;
  @Output() clickFinalizar: EventEmitter<any> = new EventEmitter();
  conTabFinalizacion: boolean = false;
  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.buildForm();
  }
  ngAfterContentInit() {
    this.setContentTemplate();
    this.setOverrideContentTemplate();

    // console.log(this.templates);
  }
  ngOnChanges(changes) {
    if (changes.contentSource && changes.contentSource.currentValue) {
      this.setContentTemplate();
    }
    this.setVisibleTabFinalizar();
  }
  private setVisibleTabFinalizar() {
    this.conTabFinalizacion = false;
    if (this.source !== null) {
      if (this.source.formulario.hasOwnProperty("conDecisionAutomatica")
        && this.source.formulario.hasOwnProperty("decision")) {
        this.conTabFinalizacion = true;
      }
    }

    //const current = this.storeCurrent.currentFlowAction.get();
    //this.esConsultaSolicitud = this;
    //console.log(this.esConsultaSolicitud);
  }
  private setContentTemplate = () => {
    if (this.source) {
      // console.log(this.source);
      Object.keys(this.source.formulario.configuracionTabs).forEach((k) => {
        // console.log(k);

        if (this.templates) {
          const found = this.templates.find((temp) => temp.getType() === k);
          // console.log(found);

          if (found) {
            this.contentTemplates[k] = found.template;
          }
        }
      });
    }
  };

  private setOverrideContentTemplate = () => {
    const found = this.templates.find(
      (temp) => temp.getType() === 'override-content'
    );

    if (found) {
      this.overrideContentTemplate = found.template;
    }
  };

  handleChangeTab = (e) => {
    this.selectedIndexValue = e.index;
  };

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
      seleccion: [Validators.required]
    });
  };
  handleInputChange(obj): void {
    // console.log(obj);
  }

  modoConsulta=(e)=>{
    console.log('CAYL desde principal',e);
    
  }
}
