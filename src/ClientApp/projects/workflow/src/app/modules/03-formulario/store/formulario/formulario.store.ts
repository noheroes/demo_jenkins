import { Injectable, } from '@angular/core';
import { Store, TablaMaestraService, AppStore, WorkflowService } from '@lic/core';
import { FormularioStoreModel } from './formulario.store.model';
import { ActividadFormularioActions } from './actions/actividad-formulario.action';

@Injectable()
export class FormularioStore extends Store<FormularioStoreModel> {


    actionActividadFormulario: ActividadFormularioActions;
    constructor(
        workflowService: WorkflowService
    ){
        super(new FormularioStoreModel());


        this.actionActividadFormulario = new ActividadFormularioActions(
            this.buildScopedGetState('actividadFormularioModel'),
            this.buildScopedSetState('actividadFormularioModel'),
            workflowService,
            // entidadService,
            // tablaService,
            // ordenEvaluacionService,
            // appStore
          );


    }



}

