import { IActividadFormularioModel } from '../../../../interfaces/actividad-model.interface';
import { IFormularioModel, WorkflowService, IFormularioRequest } from '@lic/core';

export class ActividadFormularioActions {
    constructor(
        private getState: () => IActividadFormularioModel,
        private setState: (newState: IActividadFormularioModel) => void,
        private workflowService: WorkflowService,
        // private entidadService: EntidadService,
        // private tablaService: TablaMaestraService,
        // private ordenEvaluacionService: OrdenEvaluacionService,
        // private appStore: AppStore
    ) {
    }

    getFormularioModelStart = () => {
        const state = this.getState();
        this.setState({ ...state, isLoading: true, error: null });
    }

    getFormularioModelSuccess = (value: IFormularioModel) => {
        const state = this.getState();
        this.setState({ ...state, isLoading: false, formulario: value });
    }

    getFormularioModelError = (error: any) => {
        const state = this.getState();
        this.setState({ ...state, isLoading: false, error: error });
    }

    asyncGetFormularioModel = (formularioRequest: IFormularioRequest) => {
        this.getFormularioModelStart();
        this.workflowService.getFormaluarioModel(formularioRequest ).subscribe(
            x => {
                const data = {
                    ...x
                };
                this.getFormularioModelSuccess(data);
            },
            error => {
                this.getFormularioModelError(error);
            }
        );
    }
}
