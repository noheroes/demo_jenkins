
import { AppCurrentFlowStore } from '@lic/core';
import update from 'immutability-helper';
import { InfraestructuraCantidadesService } from './../../../service/infraestructura-cantidades.service';
import { IFormInfraestructuraCantidades, IEntidadInfraestructuraCantidades, IMemoryData } from '../infraestructura-cantidades.store.interface'
import { FormType } from '@sunedu/shared';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import { map } from 'rxjs/operators';
import { concatMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EntidadInfraestructuraCantidades, FormInfraestructuraCantidades } from '../infraestructura-cantidades.store.model';
export class InfraestructuraCantidadesActions {

    constructor(
        private getState: () => IFormInfraestructuraCantidades,
        private setState: (newState: IFormInfraestructuraCantidades) => void,
        private infraestructuraCantidadesService: InfraestructuraCantidadesService,
        private storeCurrent: AppCurrentFlowStore
    ) { }

    setInit = (memoryData: IMemoryData) => {
      const state = this.getState();
      this.setState({
        ...state,
        isLoading: true,
        memoryData: memoryData,
      });
    }
    setStateIsLoading = (isLoading: boolean) => {
      this.setState(
        update(this.getState(), {
          isLoading: { $set: isLoading }
        })
      );
    };
    setReadOnly=(readOnly:boolean)=>{
      const state = this.getState();
      this.setState({
        ...state,
        readOnly:readOnly
      });
    }

    private fetchInfraestructuraSuccess = (data: IEntidadInfraestructuraCantidades,type:FormType,idElemento:string) => {
      this.setState(
        update(this.getState(), {
          form: { $set: data },
          type:{ $set:  type},
          memoryData:{codigoInfraestructura:{ $set: idElemento}}
        })
      );
    };
    asyncFetchInfraestructura = (memoryData = this.getState().memoryData): Observable<IEntidadInfraestructuraCantidades> => {
      const state = this.getState();
      return this.infraestructuraCantidadesService.getFormatoDetalleByVersion(memoryData.idVersion, memoryData.idSedeFilial).pipe(
        tap(response => {
          if (Object.entries(response).length != 0){
            let elementos = (response.infraestructuras || []).filter(x => x.idLocal == memoryData.idLocal && !x.esEliminado);
            if(elementos.length!=0){
              this.fetchInfraestructuraSuccess(elementos[0],FormType.EDITAR,elementos[0].id);
            }else{
              const defaultModel:IEntidadInfraestructuraCantidades = {
                idLocal:'',
                numeroTotalAulas:0,
                numeroTotalAmbientes:0,
                numeroTotalBibliotecas:0,

                numeroTotalLaboratorios:0,
                numeroLaboratorioComputo:0,
                numeroLaboratorioEnsenanza:0,
                numeroLaboratorioInvestigacion:0,

                numeroTotalTalleres:0,
                numeroTalleresComputo:0,
                numeroTalleresEnsenanza:0,
                numeroTalleresInvestigacion:0,

                numeroTotalLactarios:0,
                numeroTotalAuditorios:0,

                numeroTotalTopicos:0,
                numeroTotalAmbienteServicioPsicopedagogico:0,
                numeroTotalAmbienteServicioDeportivos:0,
                numeroTotalAmbienteServicioArtisticoCulturales:0,
                comentario: ''
              };
              this.fetchInfraestructuraSuccess(defaultModel,FormType.REGISTRAR,'');
            }
          }
        }),
        catchError(error => {
          this.crudError(error)
          return throwError(error);
        })
      );
    }

    asyncSaveInfraestructura = (form: EntidadInfraestructuraCantidades): Observable<EntidadInfraestructuraCantidades> => {
      console.log("asynSaveInfraestructura",form);
      this.crudInfraestructuraBegin();
      const state = this.getState();
      var idElemento = uuid.v4();
      return this.infraestructuraCantidadesService.getFormatoDetalleByVersion(state.memoryData.idVersion, state.memoryData.idSedeFilial)
        .pipe(
          map(response => {
            const request = {
              ...response,
              datosProceso:{
                "nombre":"INFRAESTRUCTURAS",
                "idElemento": idElemento
              },
              infraestructuras: [{
                "id": idElemento,
                "idLocal": state.memoryData.idLocal, //Falta establecer el ID local
                "numeroTotalAulas": form.numeroTotalAulas,
                "numeroTotalAmbientes": form.numeroTotalAmbientes,
                "numeroTotalBibliotecas": form.numeroTotalBibliotecas,

                "numeroTotalLaboratorios": form.numeroTotalLaboratorios,
                "numeroLaboratorioComputo": form.numeroLaboratorioComputo,
                "numeroLaboratorioEnsenanza": form.numeroLaboratorioEnsenanza,
                "numeroLaboratorioInvestigacion": form.numeroLaboratorioInvestigacion,

                "numeroTotalTalleres": form.numeroTotalTalleres,
                "numeroTalleresComputo": form.numeroTalleresComputo,
                "numeroTalleresEnsenanza": form.numeroTalleresEnsenanza,
                "numeroTalleresInvestigacion": form.numeroTalleresInvestigacion,

                "numeroTotalLactarios": form.numeroTotalLactarios,
                "numeroTotalAuditorios": form.numeroTotalAuditorios,

                "numeroTotalTopicos": form.numeroTotalTopicos,
                "numeroTotalAmbienteServicioPsicopedagogico": form.numeroTotalAmbienteServicioPsicopedagogico,
                "numeroTotalAmbienteServicioDeportivos": form.numeroTotalAmbienteServicioDeportivos,
                "numeroTotalAmbienteServicioArtisticoCulturales": form.numeroTotalAmbienteServicioArtisticoCulturales,

                "comentario": form.comentario,
                "usuarioCreacion": form["usuarioCreacion"],
                "fechaCreacion": form["fechaCreacion"],
                "tipoOperacion": form["tipoOperacion"],
                "token": form["token"],
              }, ...response.infraestructuras]
            };
            return request;
          }),
          concatMap(request => this.infraestructuraCantidadesService.setUpdateFormatoDetalle(request)
          ),
          tap(response => {
            this.crudInfraestructuraSucces();
          }),
          catchError(error => {
            this.crudError(error);
            return throwError(error);
          })
        );

    }
    asyncUpdateInfraestructura = (form: EntidadInfraestructuraCantidades): Observable<EntidadInfraestructuraCantidades> => {
      this.crudInfraestructuraBegin();
      const state = this.getState();
      var idElemento = state.memoryData.codigoInfraestructura;
      /*if(idElemento=='' || idElemento == undefined)
        idElemento = uuid.v4();*/
      return this.infraestructuraCantidadesService.getFormatoDetalleByVersion(state.memoryData.idVersion, state.memoryData.idSedeFilial)
        .pipe(
          map(response => {
            const index = response.infraestructuras.findIndex(item => item.id == idElemento);
            let infraestructuraUpdate = null;
            if (-1 === index) {
              infraestructuraUpdate = [...response.infraestructuras, form];
            } else {
              infraestructuraUpdate = [...response.infraestructuras.slice(0, index),
                form,
              ...response.infraestructuras.slice(index + 1)];
            }
            const request = {
              ...response,

              datosProceso:{
                "nombre":"INFRAESTRUCTURAS",
                "idElemento": idElemento
              },
              infraestructuras: infraestructuraUpdate
            };
            return request;
          }),
          concatMap(request => this.infraestructuraCantidadesService.setUpdateFormatoDetalle(request)),
          tap(response => {
            this.crudInfraestructuraSucces();
          }),
          catchError(error => {
            this.crudError(error);
            return throwError(error);
          })
        );
    }
    private crudInfraestructuraBegin = () => {
      this.setState(
        update(this.getState(), {
          isLoading: { $set: true }
        })
      );
    };
    private crudInfraestructuraSucces = () => {
      this.setState(
        update(this.getState(), {
          isLoading: { $set: false }
        })
      );
    };
    private crudError = ({ error }) => {
      const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
      this.setState(
        update(this.getState(), {
          isLoading: { $set: false },
          error: { $set: mensajes }
        })
      );
    }

}
