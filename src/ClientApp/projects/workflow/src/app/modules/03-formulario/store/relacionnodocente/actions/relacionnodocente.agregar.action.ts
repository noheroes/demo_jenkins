import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, concatMap, filter } from 'rxjs/operators';
import { IAgregarRelacionNoDocente, TIPO_PERSONA } from '../relacionnodocente.store.interface';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import { RelacionDocenteService } from '../../../service/relaciondocente.service';
import * as uuid from 'uuid';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';

export class RelacionNoDocenteAgregarActions {
  constructor(
    private getState: () => IAgregarRelacionNoDocente,
    private setState: (newState: IAgregarRelacionNoDocente) => void,
    private maestropersonaService: MaestropersonaService,
    private relacionDocenteService: RelacionDocenteService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (idversion: string, codigoSedeFilial: string, codigoLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      idSedeFilial: codigoSedeFilial,
      form: {
        ...state.form,
        idLocal: codigoLocal,
      }
    });
  }
  resetForm = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: {
        ...state.form,
        idPersona: null
      }
    });
  }
  asynUpdate = (form: any): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    const requestFormatoDetalle = {
      idVersion: state.idVersion,
      idSedeFilial: state.idSedeFilial
    };
    //debugger;
    return this.relacionDocenteService.getFormatoDetalleByVersionSedeFilial(requestFormatoDetalle)
      .pipe(
        map(response => {
          //const persona = maestroPersona.personas.find(item => item.id == form.idPersona);
          const descripcionMayorGrado = "";//persona.noDocente.descripcionGradoAcademicoMayor;
          const nombreApellido = "";//persona.tipoDocumentoEnum + ' ' + persona.numeroDocumento + ' - ' + persona.nombres + ' ' + persona.apellidoPaterno + ' ' + persona.apellidoMaterno;
          const indexPersona = (response.personaLocales || []).findIndex(item => item.idPersona == form.idPersona && !item.esEliminado);
          if (indexPersona != -1) {
            return of({ actualiza: false });
          }
          let personalLocalUpdate = {
            ...form,
            id: idElemento,
            idLocal: state.form.idLocal,
            descripcionDocente: nombreApellido,
            mayorGrado: descripcionMayorGrado,
            tipoPersonaEnum: TIPO_PERSONA.NODOCENTE
          };

          const audit = new AppAudit(this.storeCurrent);
          personalLocalUpdate = audit.setInsert(personalLocalUpdate);
          
          const personalLocalesUpdate = [
            personalLocalUpdate,
            ...response.personaLocales];
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "personasLocal",
              "prefijo": "PELOCAL",
              "idVersion": state.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"personasLocales",
              "idElemento": idElemento
            },
            personaLocales: personalLocalesUpdate,
            actualiza: true
          };
          return request;
          
        }),
        concatMap(request => {
          if (request.actualiza) {
            return this.relacionDocenteService.setUpdateFormatoDetalle(request);
          } else {
            return new Observable<any>(subscriber => {
              subscriber.next({ success: request.value.actualiza });
              subscriber.complete();
            });
          }
        }),
        tap(response => {
          this.crudSucces();
          return response;
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  private crudBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true },
        error: { $set: null }
      })
    );
  }

  private crudSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: null },
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
  asyncFetchPersonas = (): Observable<any> => {
    this.fetchDocenteBegin();
    const state = this.getState();
    const requestFromatoDetalle = {
      idVersion: state.idVersion,
      idSedeFilial: state.idSedeFilial
    };
    let responseFormato;
    //debugger;
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
    .pipe(
      map(response => {
        responseFormato = response;
        return response;
      }),
      concatMap(responseA => {
        return this.relacionDocenteService.getFormatoDetalleByVersionSedeFilial(requestFromatoDetalle)
      }),
      tap(responseFormatoDetalle => {        
        responseFormato.personas.forEach(element => {
            element.esEliminado = responseFormatoDetalle.personaLocales.filter(item =>!item.esEliminado && item.idPersona ==  element.id).length != 0;
        });  
        responseFormato.personas = responseFormato.personas.filter(item=>!item.esEliminado)
        this.fetchPersonasSucces(responseFormato.personas);
        return responseFormato;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  private fetchDocenteBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }
  private fetchPersonasSucces = data => {
    const state = this.getState();
    //console.log('CAYL noDocente',data);
    const newState = {
      ...state,
      isLoading: false,
      comboLists: {
        ...state.comboLists,
        personas: data.filter(item => item.tipoPersonaEnum == TIPO_PERSONA.NODOCENTE && item.esEliminado == false).map(item => {
          return {
            label: item.descripcionTipoDocumento + ' ' + item.numeroDocumento + ' - ' + item.nombres + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno,
            value: item.id
          }
        })
      },

    };
    this.setState(newState);
  }
}
