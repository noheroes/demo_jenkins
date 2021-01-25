import { Router } from '@angular/router';
import { Component, OnInit, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { IActividadHeaderDefinition } from './actividad-layout.interface';
import { SuneduTemplateDirective, DialogService, ToastService } from '@sunedu/shared';
import { WorkflowService } from './../../services/business/workflow.service';
import { ActividadGridErrorsComponent } from './actividad-grid-errors/actividad-grid-errors.component';
import { AppCurrentFlowStore } from '../../store/app.currentFlow.store';
import { IFormularioRequest } from '@lic/core';

const MESSAGES = {
  VALIDACION_SUCCESS: 'Se validó correctamente',
  FINALIZAR_SUCCESS: 'Se finalizó la actividad correctamente'
};

@Component({
  selector: 'app-actividad-layout',
  templateUrl: './actividad-layout.component.html',
  styleUrls: ['./actividad-layout.component.scss']
})
export class ActividadLayoutComponent implements OnInit, AfterContentInit {

  @Input() debugMode: boolean = false;
  @Input() title: string;
  @Input() headerDefinition: IActividadHeaderDefinition;
  @Input() idProceso: string;
  @Input() idProcesoBandeja: string;
  @Input() hideTabs: any = {};
  @Input() rutaBandeja: string = '/workflow/bandeja';

  customHeaderTemplates: any = {};
  contentTemplates: any = {};
  overrideContentTemplate: any = null;
  headerSource: any = null;
  formularioSource: any = null;
  contentSource: any = null;
  loading: boolean = false;


  @ContentChildren(SuneduTemplateDirective) templates: QueryList<
    SuneduTemplateDirective
  >;

  constructor(
    private workflowService: WorkflowService,
    private router: Router,
    private dialogService: DialogService,
    private toastService: ToastService,
    private storeCurrent: AppCurrentFlowStore
    ) { }

  ngOnInit() {
    setTimeout(() => this.loadConfiguration());
  }

  ngAfterContentInit() {
    this.setHeadersTemplate();
    this.setOverrideContentTemplate();
  }

  handleChangeTab = (e) => {

  }

  handleIrBandeja = (e) => {
    this.router.navigate([this.rutaBandeja]);
  }

  handleValidar = (e) => {
    this.loading = true;
    this.workflowService.validarActividad().subscribe(resp => {
      this.loading = false;
      this.toastService.success(MESSAGES.VALIDACION_SUCCESS);
    }, err => {
      this.loading = false;
      this.dialogService.openLG(ActividadGridErrorsComponent, {
        data: {
          errors: err.errors
        }
      });
    });
  }

  handleFinalizar = (e) => {
    this.loading = true;
    this.workflowService.finalizarActividad().subscribe(resp => {
      this.loading = false;
      this.toastService.success(MESSAGES.FINALIZAR_SUCCESS);
      this.router.navigate([this.rutaBandeja]);
    }, err => {
      // console.log(err);
      this.loading = false;
      this.dialogService.openLG(ActividadGridErrorsComponent, {
        data: {
          errors: err.errors
        }
      });
    });
  }

  private setHeadersTemplate = () => {
    this.headerDefinition.fields
      .forEach((e, i) => {
        if (e.custom) {
          const found = this.templates.find(
            temp => temp.getType() === e.custom
          );
          if (found) {
            this.customHeaderTemplates[i] = found.template;
          }
        }
      });
  };

  private setContentTemplate = () => {
    Object.keys(this.formularioSource.formulario.configuracionTabs)
      .forEach((k) => {
        const found = this.templates.find(
          temp => temp.getType() === k
        );

        if (found) {
          this.contentTemplates[k] = found.template;
        }
      });
  }

  private setOverrideContentTemplate = () => {
    const found = this.templates.find(
      temp => temp.getType() === 'override-content'
    );

    if (found) {
      this.overrideContentTemplate = found.template;
    }
  }

  private loadConfiguration = () => {
    this.loading = true;
    let current = this.storeCurrent.currentFlowAction.get();
    // console.log(current);
    let proceso:IFormularioRequest={
      idProceso: this.idProceso,
      idProcesoBandeja:this.idProcesoBandeja,
      idUsuario:current.idUsuario,
      idVersion:current.idVersionSolicitud
    }
    this.workflowService.getFormaluarioModel(proceso).subscribe((response: any) => {
      this.headerSource = {
        ...response.detalleBandeja,
        ...response.solicitud
      };

      this.setContentSource(response);
      this.loading = false;
    }, err => {
      // console.log(err);
      this.loading = false;
    });
  }

  private setContentSource = (source) => {
    this.formularioSource = source;
    this.contentSource = Object.keys(source.formulario.configuracionTabs).map(k => ({
      key: k,
      ...source.formulario.configuracionTabs[k]
    }));

    this.setContentTemplate();
  }

  hideTab = (key) => {
    return this.hideTabs && this.hideTabs[key] === true;
  }

  get showTareas() {
    return this.formularioSource &&
      this.formularioSource.tareas &&
      this.formularioSource.tareas.length > 0;
  }

}
