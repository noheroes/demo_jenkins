import { IEntidadPresupuesto, IRequestSolicitudVersion } from './../presupuesto.store.interface';
import { EntidadPresupuesto, GridMultiSourcePresupuesto, DataGridSource } from './../presupuesto.store.model';
import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest, IDataGridSource } from '@sunedu/shared';

import { IBandejaPresupuesto,IGridBandejaPresupuesto,IGridMultiSourcePresupuesto } from '../presupuesto.store.interface';
import { PresupuestoService } from '../../../service/presupuesto.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class PresupuestoBandejaActions {
  constructor(
    private getState: () => IBandejaPresupuesto,
    private setState: (newState: IBandejaPresupuesto) => void,
    private presupuestoService: PresupuestoService,
    private storeCurrent: AppCurrentFlowStore
  ) {  };
  setModalEditar = (id: string) => {
    const state = this.getState();
  };
  setModalConsultar = (id: string) => {
    const state = this.getState();
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  setformRequest=(formRequest:IRequestSolicitudVersion)=>{
    const state = this.getState();
    this.setState({
      ...state,
      formRequest:formRequest
    });
  }
  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
  private fetchSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  asyncFetchPage = (pageRequest: IDataGridPageRequest = {
    page: this.getState().source.page,
    pageSize: this.getState().source.pageSize,
    orderBy: this.getState().source.orderBy,
    orderDir: this.getState().source.orderDir,
  },formRequest = this.getState().formRequest): Observable<any> => {
    this.fetchBegin();
    return this.presupuestoService.getFormatoDetalleByVersion(formRequest.idVersion,formRequest.idSede).pipe(
      tap(response =>{
        if(response.presupuestos!=null){
          //response.presupuestos.concepto.toUpperCase
          return this.fetchPageSucces(response.presupuestos,formRequest.idLocal, formRequest.tipoCBCEnum,pageRequest);
        };
        return null;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  };
  private setsourceList = (list:IGridMultiSourcePresupuesto[],listTotales:IGridMultiSourcePresupuesto[]) => {
    this.setState(
      update(this.getState(), {
        sourceList: { $set: list },
        sourceListTotales: { $set: listTotales },
      })
    );
  };
  private getSourceList = () => {
    return this.getState().sourceList;
  };
  private getSourceGrid=(item:IGridBandejaPresupuesto)=>{
    //console.log("getSourceGrid");
    let items =[];
    items.push(item);
    //console.log(items);
    let source = new DataGridSource();
    source.items = items;
    source.page = 1;
    source.pageSize=10;
    source.total=items.length;
    source.orderBy=null;
    source.orderDir=null;
    return source;
  }
  private getCBCName = (tipoCBCEnum:any)=>{
    const CBCListName = [
      "CBC I. MODELO EDUCATIVO DE LA UNIVERSIDAD"
      ,"CBC II. CONSTITUCIÓN, GOBIERNO Y GESTIÓN DE LA UNIVERSIDAD"
      ,"CBC III. LA OFERTA ACADÉMICA, RECURSOS EDUCATIVOS Y DOCENCIA"
      ,"CBC IV. PROPUESTA EN INVESTIGACIÓN"
      ,"CBC V. RESPONSABILIDAD SOCIAL UNIVERSITARIA Y BIENESTAR UNIVERSITARIO"
      ,"CBC VI. TRANSPARENCIA"
    ];
    let name;
    switch (tipoCBCEnum) {
      case 10:
        name = CBCListName[0];
        break;
      case 20:
        name = CBCListName[1];
        break;
      case 30:
        name = CBCListName[2];
        break;
      case 40:
        name = CBCListName[3];
        break;
      case 51:
        name = CBCListName[4];
        break;
      case 60:
        name = CBCListName[5];
        break;
      default:
        break;
    }
    return name;
  }
  private addMutiSource=(item:any)=>{
    let itemNew = new GridMultiSourcePresupuesto();
    itemNew.tipoCBCEnum = item.tipoCBCEnum;
    itemNew.tipoCBCName =this.getCBCName(item.tipoCBCEnum);
    /*itemNew.pageRequest = {
      page: 1,
      pageSize: 10,
      orderBy: null,
      orderDir: null,
    }*/
    itemNew.source  = this.getSourceGrid(item);
    return itemNew;
  }
  private getRequest_tipoCBCEnum(){

  }
  private setSource = (items:any[],idLocal:string)=>{
    //debugger;
    let sourceNew:IGridMultiSourcePresupuesto[];
    let sourceNewTotales:IGridMultiSourcePresupuesto[];
    sourceNew = [];
    sourceNewTotales = [];
    const state = this.getState();
    items.forEach(item => {
      if(!item.esEliminado && item.idLocal == idLocal){
        if(item.concepto!="Total"){
          const poscicion = sourceNew.findIndex(element=>element.tipoCBCEnum==item.tipoCBCEnum);
          if(poscicion==-1){
            sourceNew.push(this.addMutiSource(item));
          }else{
            sourceNew[poscicion].source.items.push(item);
            sourceNew[poscicion].source.items = sourceNew[poscicion].source.items.sort(
              function (a, b) {
                if (a.codigo> b.codigo)
                  return 1;
                if (a.codigo < b.codigo)
                  return -1;
                return 0;
              });
          }
        }else{
          item.codigo='';
          const poscicion = sourceNewTotales.findIndex(element=>element.tipoCBCEnum==item.tipoCBCEnum);
          if(poscicion==-1){
            sourceNewTotales.push(this.addMutiSource(item));
          }else{
            sourceNewTotales[poscicion].source.items.push(item);
          }
        }
      }
      item.readOnly = state.readOnly;
    });
    sourceNew = sourceNew.sort(
      function (a, b) {
        if (a.tipoCBCEnum> b.tipoCBCEnum)
          return 1;
        if (a.tipoCBCEnum < b.tipoCBCEnum)
          return -1;
        return 0;
      });
    sourceNew.forEach(item => {
      const itemTotal = sourceNewTotales.find(element=>element.tipoCBCEnum==item.tipoCBCEnum);

      itemTotal.source.items[0].anioCuatroPresupuesto = item.source.items.reduce((accum,item) => Number((accum + item.anioUnoPresupuesto).toFixed(2)), 0);
      itemTotal.source.items[0].anioUnoEjecucion = item.source.items.reduce((accum,item) => Number((accum + item.anioUnoEjecucion).toFixed(2)), 0);
      itemTotal.source.items[0].anioDosPresupuesto = item.source.items.reduce((accum,item) => Number((accum + item.anioDosPresupuesto).toFixed(2)), 0);
      itemTotal.source.items[0].anioTresPresupuesto = item.source.items.reduce((accum,item) => Number((accum + item.anioTresPresupuesto).toFixed(2)), 0);
      itemTotal.source.items[0].anioCuatroPresupuesto = item.source.items.reduce((accum,item) => Number((accum + item.anioCuatroPresupuesto).toPrecision(2)), 0);
      itemTotal.source.items[0].anioCincoPresupuesto = item.source.items.reduce((accum,item) => Number((accum + item.anioCincoPresupuesto).toFixed(2)), 0);
      itemTotal.source.items[0].anioSeisPresupuesto = item.source.items.reduce((accum,item) => Number((accum + item.anioSeisPresupuesto).toFixed(2)), 0);

      item.source.items = item.source.items;//.slice((item.pageRequest.page - 1) * item.pageRequest.pageSize, item.pageRequest.page * item.pageRequest.pageSize);
      item.source.items = item.source.items.concat(itemTotal.source.items);
      item.source.page=1;
      item.source.pageSize=item.source.items.length-1;
      item.source.total = item.source.items.length-1;
    });

    this.setsourceList(sourceNew,sourceNewTotales);
    return sourceNew;
  };

  asynDelete = (id: string,idVersionSoicitud:string,idSede:string): Observable<any> => {
    this.fetchBegin();
    const state = this.getState();
    return this.presupuestoService.getFormatoDetalleByVersion(idVersionSoicitud,idSede)
      .pipe(
        map(response => {
          const index = response.presupuestos.findIndex(item => item.id == id);
          let form = response.presupuestos[index];
          form.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          //form.tipoOperacion = "3";

          const programasUpdate = [...response.presupuestos.slice(0, index), form, ...response.presupuestos.slice(index + 1)];
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PRESUPUESTOS",
              "idElemento": form.id
            },
            presupuestos: programasUpdate
          };

          return request;
        }),
        concatMap(request => this.presupuestoService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchPageSucces = (items: any, idLocal:string,tipoCBCEnum:string, pageRequest: IDataGridPageRequest) => {
    items = (items || []).filter(item => !item.esEliminado && item.idLocal == idLocal&& item.tipoCBCEnum == tipoCBCEnum && item.concepto!="Total");

    let itemTotalSuma = new EntidadPresupuesto();
    itemTotalSuma.concepto ="TOTAL";
    itemTotalSuma.anioUnoPresupuesto = items.reduce((accum,item) => Number((accum + item.anioUnoPresupuesto).toFixed(2)), 0);
    itemTotalSuma.anioUnoEjecucion = items.reduce((accum,item) => Number((accum + item.anioUnoEjecucion).toFixed(2)), 0);
    itemTotalSuma.anioDosPresupuesto = items.reduce((accum,item) => Number((accum + item.anioDosPresupuesto).toFixed(2)), 0);
    itemTotalSuma.anioTresPresupuesto = items.reduce((accum,item) => Number((accum + item.anioTresPresupuesto).toFixed(2)), 0);
    itemTotalSuma.anioCuatroPresupuesto = items.reduce((accum,item) => Number((accum + item.anioCuatroPresupuesto).toFixed(2)), 0);
    itemTotalSuma.anioCincoPresupuesto = items.reduce((accum,item) => Number((accum + item.anioCincoPresupuesto).toFixed(2)), 0);
    itemTotalSuma.anioSeisPresupuesto = items.reduce((accum,item) => Number((accum + item.anioSeisPresupuesto).toFixed(2)), 0);
    itemTotalSuma.readOnly = true;

    let elementos = items
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
      const state = this.getState();
      state.gridDefinition.columns.forEach(column=>{
        if(column.label=='Acciones'){
          column.buttons.forEach(button=>{
            if(button.action=='EDITAR'){
              button.hidden = item=>state.readOnly  || (item.concepto == "TOTAL")  ;
            }
            if(button.action=='ELIMINAR'){
              button.hidden = item=>state.readOnly || (!item.esOtroconcepto);
            }
          })
        }
      });
    elementos = elementos.concat(itemTotalSuma);
    console.log(elementos);
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
          total: { $set: items.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };
}
