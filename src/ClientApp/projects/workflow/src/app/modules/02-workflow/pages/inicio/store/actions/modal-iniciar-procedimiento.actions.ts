import { ComboList, FormType } from '@sunedu/shared';
// import update from 'immutability-helper';

import * as _moment from 'moment';
const moment = _moment;
import { AppStore, ProcedimientoRequest, IAppUi} from '@lic/core';
import { map } from 'rxjs/operators';
// import { InicioService } from '../../../../services/inicio.service';
import { ModalIniciarProcedimiento } from '../inicio.store.model';
import { IModalIniciarProcedimiento } from '../inicio.store.interface';
import { IInicioProcedimiento } from '../../../../interfaces/inicio.interface';
import { WorkflowService } from 'src/app/core/services/business/workflow.service';

import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { of } from 'rxjs';
import { isArray } from 'rxjs/internal/util/isArray';

export class ModalInicioProcedimientoActions {
    constructor(
        private getState: () => IModalIniciarProcedimiento,
        private setState: (newState: IModalIniciarProcedimiento) => void,
        private workflowService: WorkflowService,
        // private tablaService: TablaMaestraService,
        // private InicioService: InicioService,
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

    resetModalInicioProcedimiento = () => {
        this.setState(new ModalIniciarProcedimiento());
    }

    saveIniciarProcedimientoSuccess = () => {
        const state = this.getState();

        this.setState({
            ...state,
            isLoading: false,
            error: null
        });
    }

    saveIniciarProcedimientoError = error => {
        const state = this.getState();

        this.setState({
            ...state,
            isLoading: false,
            error: error
        });
    }


    asyncIniciarProcedimiento = (inicioProcedimiento: IInicioProcedimiento) => {
        return new Promise((resolve) => {
            this.setState({ ...this.getState(), isLoading: true, error: null });

            //const ui = this.store.state.ui.currentProcedimiento;
            const current = this.storeCurrent.currentFlowAction.get();

            //this.store..select(SetCurrentProcedimiento);

            //console.log(current);

            this.workflowService.iniciarProcedimiento(current
            ).subscribe(
                response => {
                    const state = this.getState();
                    this.setState({ ...state, isLoading: false, error: null });
                    resolve(response);
                },
                error => {
                    const state = this.getState();
                    this.setState({ ...state, isLoading: false, error: error.errors });
                }
            );
        });
    }

    getEntidadComboList(entidades:any[]){
        let list=[];
        if(entidades.length){
          entidades.map(item=>{
            list.push({
              text:`${item.nombre}`,
              value:item.id
            });
          });
        }
        return new ComboList(list);
    }

    getSolicitudComboList(solicitudes:any[]){
        let list=[];
        if(solicitudes.length){
            solicitudes.map(item=>{
            list.push({
              text:`${item.nombre}`,
              value:item.idFlujo
            });
          });
        }
        return new ComboList(list);
    }

    asyncFetchCleanListar = (nameCombo:any)=>{
        switch (nameCombo) {
            case "idEntidad":{
                const state = this.getState();
                this.setState({ ...state, 
                    tieneSubFlujo:false,
                    filterLists: { 
                        ...state.filterLists, 
                        solicitud: new ComboList([]),
                        procedimiento: new ComboList([]),
                        subFlujo: new ComboList([]) 
                    } 
                });
                break;
            }
            case "idSolicitud":{
                const state = this.getState();
                this.setState({ ...state, 
                    tieneSubFlujo:false,
                    filterLists: { 
                        ...state.filterLists, 
                        procedimiento: new ComboList([]),
                        subFlujo: new ComboList([]) 
                    } 
                });
                break;
            }
            case "idProcedimiento":{
                const state = this.getState();
                this.setState({ ...state, 
                    tieneSubFlujo:false,
                    filterLists: { 
                        ...state.filterLists, 
                        subFlujo: new ComboList([]) 
                    } 
                });
                break;
            }
            default:
                break;
        }
    }

    asyncFetchListarEntidadInicio = (parametros:any) => {
        this.workflowService.listarEntidadesInicio(parametros).subscribe(
            resp => {
                const state = this.getState();
                console.log(resp);
                const list = this.getEntidadComboList(resp);
                this.setState({ ...state, filterLists: { ...state.filterLists, entidad: list } });
            },
            error => { }
        );
    }

    asyncFetchListarSolicitudInicio = (parametros:any) => {
        this.workflowService.listarSolicitudesInicio(parametros).subscribe(
            resp => {
                const state = this.getState();
                console.log(resp);
                resp.forEach((element) => {
                    element.text = element.text.toUpperCase();
                });
                this.setState({ ...state, filterLists: { ...state.filterLists, solicitud:  new ComboList(resp) } });
            },
            error => { }
        );
    }

    asyncFetchListarProcedimientoInicio = (parametros:any) => {
        this.workflowService.listarProcedimientosInicio(parametros).subscribe(
            resp => {
                const state = this.getState();
                console.log(resp);
                resp.forEach((element) => {
                    element.text = element.text.toUpperCase();
                });
                this.setState({ ...state, filterLists: { ...state.filterLists, procedimiento:  new ComboList(resp) } });
            },
            error => { }
        );
    }

    asyncFetchListarSubFlujoInicio = (parametros:any) => {
        this.workflowService.listarSubFlujoInicio(parametros).subscribe(
            resp => {
                const state = this.getState();
                console.log(resp);
                if(isArray(resp)){
                    if(resp.length){
                        resp.forEach((element) => {
                            element.text = element.text.toUpperCase();
                        });
                        this.setState({ ...state, tieneSubFlujo:true, filterLists: { ...state.filterLists, subFlujo:  new ComboList(resp) } });
                    }
                }
                
            },
            error => { }
        );
    }

    asyncFetchInicioFlujoSeleccionado=(parametros:any)=>{
        return new Promise(
            (resolve)=>{ 
                this.workflowService.inicioFlujoSeleccionado(parametros).subscribe(
                    resp => {
                        console.log(resp);
                        resolve(resp);
                    },
                    error => { }
                );
        });
    }

}
