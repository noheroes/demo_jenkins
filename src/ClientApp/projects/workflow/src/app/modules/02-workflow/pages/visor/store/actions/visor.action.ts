import { WorkflowService } from './../../../../../../../../../../src/app/core/services/business/workflow.service';
import {IVisorForm} from '../visor.store.interface'
import { AppCurrentFlowStore } from '../../../../../../../../../../src/app/core/store';
import { VisorForm } from '../visor.store.model';

export class VisorActions {
    constructor(
        private getState: () => IVisorForm,
        private setState: (newState: IVisorForm) => void,
        private workflowService: WorkflowService,
        private storeCurrent: AppCurrentFlowStore
    ) {

    }

    setModalErrors = error => {
        const state = this.getState();

        this.setState({
            ...state,
            error: error
        });
    }

    resetVisor = () => {
        this.setState(new VisorForm());
    }

    saveVisorSuccess = () => {
        const state = this.getState();

        this.setState({
            ...state,
            isLoading: false,
            error: null
        });
    }

    saveVisorError = error => {
        const state = this.getState();

        this.setState({
            ...state,
            isLoading: false,
            error: error
        });
    }


    // asyncFetchListarEntidades = () => {
    //     this.workflowService.listarEntidades().subscribe(
    //         resp => {
    //             const state = this.getState();
    //             //console.log(resp);
    //             // this.setState(
    //             //     update(state, { filterLists: { tipoEntidad: { $set: resp } } })
    //             // );
    //             this.setState({ ...state, filterLists: { ...state.filterLists, entidad: resp } });
    //         },
    //         error => { }
    //     );
    // }

    // asyncFetchListarProcedimientos = () => {
    //     this.workflowService.listarProcedimientos().subscribe(
    //         resp => {
    //             const state = this.getState();
    //             // this.setState(
    //             //     update(state, { filterLists: { entidad: { $set: resp } } })
    //             // );
    //             this.setState({ ...state, filterLists: { ...state.filterLists, idProcedimiento: resp } });
    //         },
    //         error => { }
    //     );
    // }

    // asyncIniciarProcedimiento = (inicioProcedimiento: IInicioProcedimiento) => {
    //     return new Promise((resolve) => {
    //         this.setState({ ...this.getState(), isLoading: true, error: null });

    //         //const ui = this.store.state.ui.currentProcedimiento;
    //         const current = this.storeCurrent.currentFlowAction.get();

    //         //this.store..select(SetCurrentProcedimiento);

    //         //console.log(current);

    //         this.workflowService.iniciarProcedimiento(current
    //         ).subscribe(
    //             response => {
    //                 const state = this.getState();
    //                 this.setState({ ...state, isLoading: false, error: null });
    //                 resolve(response);
    //             },
    //             error => {
    //                 const state = this.getState();
    //                 this.setState({ ...state, isLoading: false, error: error.errors });
    //             }
    //         );
    //     });
    // }



}
