import { IBuscadorBandeja } from '../bandeja.store.interface';
import {
  IDataGridPageRequest,
  IDataGridButton,
  AlertService,
  ToastService,
} from '@sunedu/shared';
import { FormBuscarBandeja } from '../bandeja.store.model';
import { WorkflowService, IFiltroBandejaModel, ICurrentFlow } from '@lic/core';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { isNullOrUndefined } from 'util';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class GridBandejaActions {
  constructor(
    private getState: () => IBuscadorBandeja,
    private setState: (newState: IBuscadorBandeja) => void,
    private workflowService: WorkflowService,
    private storeCurrent: AppCurrentFlowStore
  ) {}

  fetchGetBandejaBegin = () => {
    const state = this.getState();
    this.setState({ ...state, isLoading: true, error: null });
  };

  fetchGetBandejaSuccess = (
    items,
    total: number,
    pageRequest: IDataGridPageRequest
    //,descripcionSede: string
  ) => {
    /*
    const list = items.map((itm) => {
      itm.descripcionSede = isNullOrUndefined(descripcionSede)
        ? ''
        : descripcionSede;

      return itm;
    });
    */
    // console.log(list);

    const state = this.getState();
    const newState = {
      ...state,
      isLoading: false,
      gridSource: {
        ...state.gridSource,
        items: items,
        total: total,
        page: pageRequest.page,
        pageSize: pageRequest.pageSize,
        orderBy: pageRequest.orderBy,
        orderDir: pageRequest.orderDir,
        skip: pageRequest.skip,
      },
    };
    this.setState(newState);
  };

  fetchGetBandejaError = (error: any) => {
    const state = this.getState();
    const newState = {
      ...state,
      isLoading: false,
      error: error,
      gridSource: {
        ...state.gridSource,
        items: [],
      },
    };
    this.setState(newState);
  };

  resetFormBuscar = () => {
    const state = this.getState();
    this.setState({ ...state, formBuscar: new FormBuscarBandeja() });
  };

  // fetchGetIdVersion=(idProceso:string, idBandeja:string)=>{
  //   const state = this.getState();
  //   state.gridSource.items.forEach(item => {
  //     if(item.IdProceso==idProceso && item.IdProcesoBandeja==idBandeja){
  //       return item.
  //     }
  //   });
  // }

  // ====================================================
  // ACCIONES ASINCRONAS
  // ====================================================
  asyncFetchListarEntidades = () => {
    this.workflowService.listarEntidades().subscribe(
      (resp) => {
        const state = this.getState();
        // this.setState(
        //     update(state, { filterLists: { tipoEntidad: { $set: resp } } })
        // );
        this.setState({
          ...state,
          filterLists: { ...state.filterLists, idEntidades: resp },
        });
      },
      (error) => {}
    );
  };

  asyncFetchListarProcedimientos = () => {
    return new Promise<void>((resolve) => {
      this.workflowService.listarProcedimientos().subscribe(
        (resp) => {
          const state = this.getState();
          // console.log(resp);
          // this.setState(
          //     update(state, { filterLists: { entidad: { $set: resp } } })
          // );
          this.setState({
            ...state,
            filterLists: { ...state.filterLists, idProcedimientos: resp },
          });
          resolve();
        },
        (error) => {}
      );
    });
  };

  asyncFetchGetBandeja2 = (filters = this.getState().formBuscar) => {
    const pageRequest: IDataGridPageRequest = {
      page: this.getState().gridSource.page,
      pageSize: this.getState().gridSource.pageSize,
      orderBy: this.getState().gridSource.orderBy,
      orderDir: this.getState().gridSource.orderDir,
      skip: this.getState().gridSource.skip,
    };
    const xcurrent = this.storeCurrent.currentFlowAction.get();

    const requet = {
      codigoFlujos: filters.idProcedimiento,
      numeroSolicitud: filters.numeroSolicitud,
      idEntidad: filters.idEntidad,
      idUsuario: xcurrent.idUsuario,
      page: pageRequest.page,
      pageSize: pageRequest.pageSize,
    };

    return this.workflowService.getBandejaDetalle(requet).pipe(
      map((x) => {
        this.fetchGetBandejaSuccess(
          x.data,
          x.totalRows,
          {
            page: pageRequest.page,
            pageSize: pageRequest.pageSize,
          }
          //,xcurrent.descripcionSede
        );
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  };
  asyncFetchGetBandeja = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().gridSource.page,
      pageSize: this.getState().gridSource.pageSize,
      orderBy: this.getState().gridSource.orderBy,
      orderDir: this.getState().gridSource.orderDir,
      skip: this.getState().gridSource.skip,
    },
    filters = this.getState().formBuscar
  ) => {
    this.fetchGetBandejaBegin();
    // this.workflowService.getBandejaDetalle(pageRequest, filterWorkflow).subscribe(
    //     x => {
    //         this.fetchGetBandejaSuccess(
    //             x.data,
    //             x.count,
    //             pageRequest
    //         );
    //     },
    //     error => {
    //         this.fetchGetBandejaError(error);
    //     }
    // );

    // items: items,
    //         total: total,
    //         page: pageRequest.page,
    //         pageSize: pageRequest.pageSize,
    //         orderBy: pageRequest.orderBy,
    //         orderDir: pageRequest.orderDir,
    //         skip: pageRequest.skip

    // let current = this.storeCurrent.state.currentProcedimiento;
    const current = this.storeCurrent.currentFlowAction.get();

    return this.workflowService.getBandejaDetalle(current).pipe(
      map((x) => {
        // console.log(x.data);
        x.data.forEach((element) => {
          element.procedimiento = element.procedimiento.toUpperCase();
          element.metaDataProceso.entidad.nombre = element.metaDataProceso.entidad.nombre.toUpperCase();
          element.actividad.nombre = element.actividad.nombre.toUpperCase();
          element.dsEstado = element.dsEstado.toUpperCase();
        });
        this.fetchGetBandejaSuccess(
          x.data,
          x.totalRows,
          {
            page: 1,
            pageSize: 10,
          },
          //,current.descripcionSede
        );
      }),
      catchError((error) => {
        return throwError(error);
      })
    );

    // return this.workflowService.getBandejaDetalle(current).subscribe(
    //   (x) => {
    //     console.log('Get Bandeja BACK CAYL');
    //     console.log(x.data);
    //     this.fetchGetBandejaSuccess(
    //       x.data,
    //       x.totalRows,
    //       {
    //         page: 1,
    //         pageSize: 10,
    //       },
    //       current.descripcionSede
    //     );
    //   },
    //   (error) => {
    //     this.fetchGetBandejaError(error);
    //   }
    // );
  };
}
