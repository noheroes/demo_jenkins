import { FormType } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { InfraestructuraService } from '../../../service/infraestructura.service';
import { IModalInfraestructura, IFormInfraestructura } from '../infraestructura.store.interface';
import { FormInfraestructura, ModalInfraestructura } from '../infraestructura.store.model';
import * as uuid from 'uuid';

export class InfraestructuraModalActions {
  constructor(
    private getState: () => IModalInfraestructura,
    private setState: (newState: IModalInfraestructura) => void,
    private InfraestructuraService: InfraestructuraService
  ) {

  }

  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      //idLocal
      form: {
        ...state.form
      }
    });
  }

  setModalEdit = (id: string, idSedeFilial: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoInfraestructura: id,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      type: FormType.EDITAR,
      title: 'Modificar infraestructura'
    });

  }
  setModalReadOnly = (id: string, idSedeFilial: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoInfraestructura: id,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      type: FormType.CONSULTAR,
      title: 'Consulta infraestructura'
    });
  }

  setModalNew = (idSedeFilial: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,      
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      isLoading: false
    });
  }
  resetModalInfraestructura = () => {
    this.setState(new ModalInfraestructura());
  };

  private fetchInfraestructuraBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchInfraestructuraSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataInfraestructura = (data: any) => {
    this.fetchInfraestructuraSucces(data);
  }

  asynFetchInfraestructura = (codigoInfraestructura: string): Observable<IFormInfraestructura> => {
    const state = this.getState();
    return this.InfraestructuraService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      map(response => {
        var formInfraestructura = response.infraestructuras.find(item => item.id == codigoInfraestructura);
        formInfraestructura.numeroLaboratorioComputo = response.laboratorios.filter(item => item.idLocal == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 1).length;
        formInfraestructura.numeroLaboratorioEnsenanza = response.laboratorios.filter(item => item.idLocal == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 2).length;
        formInfraestructura.numeroLaboratorioInvestigacion = response.laboratorios.filter(item => item.idLocal == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 3).length;
        formInfraestructura.numeroTalleresEnsenanza = response.talleres.filter(item => item.idLocal == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 2).length;
        return formInfraestructura;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynFetchLaboratorioTaller = (): Observable<any> => {
    const state = this.getState();
    return this.InfraestructuraService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      map(response => {        
        var formInfraestructura = new FormInfraestructura();
        formInfraestructura.numeroLaboratorioComputo = response.laboratorios.filter(item => item.idLocal.toUpperCase() == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 1).length;
        formInfraestructura.numeroLaboratorioEnsenanza = response.laboratorios.filter(item => item.idLocal.toUpperCase() == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 2).length;
        formInfraestructura.numeroLaboratorioInvestigacion = response.laboratorios.filter(item => item.idLocal.toUpperCase() == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 3).length;
        formInfraestructura.numeroTalleresEnsenanza = response.talleres.filter(item => item.idLocal.toUpperCase() == state.idLocal.toUpperCase() && !item.esEliminado && item.tipoLaboratorioTallerEnum == 2).length;
        return formInfraestructura;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  asynSaveInfraestructura = (form: IFormInfraestructura): Observable<IFormInfraestructura> => {
    this.crudInfraestructuraBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.InfraestructuraService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {          
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "infraestructura",
              "prefijo": "INFRA",
              "idVersion": state.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"infraestructuras",
              "idElemento": idElemento
            },
            infraestructuras: [{
              "id": idElemento,
              "idLocal": state.idLocal, //Falta establecer el ID local
              "numeroLaboratorioComputo": form.numeroLaboratorioComputo,
              "numeroLaboratorioEnsenanza": form.numeroLaboratorioEnsenanza,
              "numeroLaboratorioInvestigacion": form.numeroLaboratorioInvestigacion,
              "numeroTalleresEnsenanza": form.numeroTalleresEnsenanza,
              "numeroBibliotecas": form.numeroBibliotecas,
              "numeroAulas": form.numeroAulas,
              "numeroAmbientesDocentes": form.numeroAmbientesDocentes,
              "numeroTopicos": form.numeroTopicos,
              "denominacionAmbienteComplementario": form.denominacionAmbienteComplementario,
              "denominacionAmbienteServicio": form.denominacionAmbienteServicio,
              "comentario": form.comentario,               
              "usuarioCreacion": form["usuarioCreacion"],                   
              "fechaCreacion": form["fechaCreacion"],      
              "tipoOperacion": form["tipoOperacion"], 
              "token": form["token"],             
            }, ...response.infraestructuras]
          };
          return request;
        }),        
        concatMap(request => this.InfraestructuraService.setUpdateFormatoDetalle(request)
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

  asynUpdateInfraestructura = (form: IFormInfraestructura): Observable<IFormInfraestructura> => {
    this.crudInfraestructuraBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.InfraestructuraService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.infraestructuras.findIndex(item => item.id == form.id);
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
            datosNumeracion: {
              "nombre": "infraestructura",              
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": state.idLocal
            },
            datosProceso:{
              "nombre":"infraestructuras",
              "idElemento": idElemento
            }, 
            infraestructuras: infraestructuraUpdate
          };
          return request;
        }),
        concatMap(request => this.InfraestructuraService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.crudInfraestructuraSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },        
        error: { $set: mensajes }
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
}
