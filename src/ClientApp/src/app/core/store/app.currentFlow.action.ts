
import { ICurrentFlow, IFrontSetttings } from './app.state.interface';
import { LocalStorageService } from '../services';
import { APP_LOCAL_STORAGE } from '../constants';
import { ComboList } from '@sunedu/shared';

export class AppCurrentFlowActions {
  constructor(
    private getState: () => ICurrentFlow,
    private localStorage: LocalStorageService,
    private setState: (newState: ICurrentFlow) => void
  ) {}

  set = (newValue: ICurrentFlow) => {
    const state = this.getFromLocalStorage();
    const newState = {
      ...state,
      idSesion: newValue.idSesion,
      idUsuario: newValue.idUsuario,
      idEntidad: newValue.idEntidad,
      idFlujo: newValue.idFlujo,
      idTipoUsuario: newValue.idTipoUsuario,
      esResponsable: newValue.esResponsable,
      idVersionSolicitud: newValue.idVersionSolicitud,
      descripcionSede: newValue.descripcionSede,
      codigoFlujos: newValue.codigoFlujos,
      fechaDesde: newValue.fechaDesde,
      fechaHasta: newValue.fechaHasta,
      codigoActividad: newValue.codigoActividad,
      page: newValue.page,
      pageSize: newValue.pageSize,
      idAplicacion: newValue.idAplicacion,
      usuarioFullName: newValue.usuarioFullName,
      usuarioNumeroDocumento: newValue.usuarioNumeroDocumento,
      usuarioEsRolAdministrado: newValue.usuarioEsRolAdministrado,
      idRol: newValue.idRol,
      rolDescripcion: newValue.rolDescripcion,
      idProceso: newValue.idProceso,
      idProcesoBandeja:newValue.idProcesoBandeja,
      expediente: newValue.expediente,
      cabecera: newValue.cabecera,
      documento: newValue.documento,
      programaOne: newValue.programaOne,
      programaTwo: newValue.programaTwo,
      esFirmadoDocumento: newValue.esFirmadoDocumento,
      subsanacionReadonly: newValue.subsanacionReadonly,
      esFirmaAT:newValue.esFirmaAT,
      conActualizacionColaboradores:newValue.conActualizacionColaboradores,
      idProcesoOrigen:newValue.idProceso,
      idProcesoBandejaOrigen:newValue.idProcesoBandeja,
      esModoConsulta:newValue.esModoConsulta,
      idVersionFlujo:newValue.idVersionFlujo,
      conFinalizacionFirma:newValue.conFinalizacionFirma
    };

    this.setState(newState);
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_CURRENT_PROC_KEY, newState);
  };

  setFlujos(flujos: string[], idFlujo: string) {
    const state = this.getFromLocalStorage();
    const newState = {
      ...state,
      codigoFlujos: flujos,
      idFlujo: idFlujo,
    };

    this.setState(newState);
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_CURRENT_PROC_KEY, newState);
  }

  setExternalPrograma(one:any[], two:any[]){
    //console.log('CAYL setExternalPrograma', one, two);
    const state = this.getFromLocalStorage();

    const cineOne = this.getListCine(one);
    const cineTwo = this.getListCine(two);

    const newState = {
      ...state,
      programaOne:cineOne,
      programaTwo:cineTwo,
    }
    //console.log(newState);

    this.setState(newState);
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_CURRENT_PROC_KEY, newState);
  }

  setFrontSettings(settings:IFrontSetttings){
    const state = this.getFromLocalStorage();
    const newState = {
      ...state,
      frontSettings:settings
    }
    //console.log('CAYL setFrontSettings',newState);

    this.setState(newState);
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_CURRENT_PROC_KEY, newState);
  }

  getListCine(cine:any[]){
    let listaCINE  = new ComboList([]);
    if(cine.length!=0){
      let list=[];
      cine.map(element=>{
        list.push({
          text:element.denominacionCompleta,
          value:element.id
        });
      });
      /*list.push({
        text:"Otra denominación del programa",
        value:-1
      });*/
      
      listaCINE = new ComboList(list); 
      return listaCINE;
    }   
  }

  setChangeVersionSolicitud(idVersionSolicitud:string){
    const state = this.getFromLocalStorage();
    const newState = {
      ...state,
      idVersionSolicitud
    }
    this.setState(newState);
    this.localStorage.set(APP_LOCAL_STORAGE.LIC_CURRENT_PROC_KEY, newState);
  }

  /** storage methods  */

  get = () => {
    //return this.getState();
    return this.getFromLocalStorage();
  };

  getFromLocalStorage = () => {
    const cp = this.localStorage.get<ICurrentFlow>(
      APP_LOCAL_STORAGE.LIC_CURRENT_PROC_KEY
    );
    return cp;
  };
}
