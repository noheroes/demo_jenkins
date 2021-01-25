import { IDatosGenerales, IDatosGeneralesBody, IFormRepresentanteLegal, IRepresentantesLegales } from '../datosgenerales.store.interface';
import { DatosGeneralesService } from '../../../service/datos-generales.service';
import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

import * as uuid from 'uuid';
export class DatosGeneralesActions {

  constructor(
    private getState: () => IDatosGenerales,
    private setState: (newState: IDatosGenerales) => void,
    private datosGeneralesService: DatosGeneralesService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (modelData: IFormularioModel) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      modelData: modelData,
    });
  }

  setDatosGeneralesBody=(datosGeneralesBody:IDatosGeneralesBody)=>{
    this.setState(
      update(this.getState(),{
        datosGeneralesBody: { $set: datosGeneralesBody }
      })
    );

    // const state = this.getState();
    // this.setState({
    //   ...state,
    //   datosGeneralesBody:datosGeneralesBody ,
    // });


  }

  getDatosGeneralesBody=()=>{
    const state = this.getState();
    return state.datosGeneralesBody;
  }

  setUpdateRepresentanteLegal=(representanteLegal:IFormRepresentanteLegal)=>{
    return new Promise(
      (resolve)=>{
        const state = this.getState();
        //var idElemento = uuid.v4();
        let originales = state.datosGeneralesBody.representantesLegales;
        // console.log(originales);
        //debugger;
        if(Object.keys(originales).length === 0){
          // vacio
          // guardar un push
          let representante: IRepresentantesLegales = {
            tipoDocumentoEnum:representanteLegal.tipoDocumentoEnum,
            numeroDocumento:representanteLegal.numeroDocumento,
            nombres:representanteLegal.nombres,
            apellidoPaterno:representanteLegal.apellidoPaterno,
            apellidoMaterno:representanteLegal.apellidoMaterno,
            telefono:representanteLegal.telefono,
            correo:representanteLegal.correo,
            numeroCasillaElectronica:representanteLegal.numeroCasillaElectronica,
            cargo:representanteLegal.cargo,
            oficinaRegistral:representanteLegal.oficinaRegistral,
            numeroPartida:representanteLegal.numeroPartida,
            asiento:representanteLegal.asiento,
            domicilioLegal:representanteLegal.domicilioLegal,
            ubigeo:representanteLegal.nombreDistrito, 
            esResponsable:representanteLegal.esResponsable
          }

          const audit = new AppAudit(this.storeCurrent);
          representante = audit.setInsert(representante);

          state.datosGeneralesBody.representantesLegales.push(representante);
          this.setState({
            ...state,
            datosGeneralesBody:state.datosGeneralesBody
          });
        }else{
          // buscar y reemplazar
          originales.forEach(rep => {
            if(rep.numeroDocumento==representanteLegal.numeroDocumento){
              // modificar solo los datos necesarios
              //rep.cargo = representanteLegal.cargo;
              rep.oficinaRegistral = representanteLegal.oficinaRegistral;
              rep.numeroPartida = representanteLegal.numeroPartida;
              rep.asiento = representanteLegal.asiento;
              rep.domicilioLegal = representanteLegal.domicilioLegal;
              rep.ubigeo = representanteLegal.nombreDistrito; 
              //rep.tipoOperacion = "2";
              rep.usuarioModificacion = representanteLegal["usuarioModificacion"];
              rep.fechaModificacion = representanteLegal["fechaModificacion"];
              rep.tipoOperacion = representanteLegal["tipoOperacion"];
              rep.token = uuid.v4();
            }
          });          

          state.datosGeneralesBody.representantesLegales = originales;
          // console.log(state.datosGeneralesBody.representantesLegales);
          this.setState({
            ...state,
          });
        }
        resolve();
      });
  }


  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }

  private fetchSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }


  asyncGetDatosGenerales = (idVersion:string) =>{
    return new Promise(
      (resolve)=>{
        this.fetchBegin();
        this.datosGeneralesService.getDetalleSolicitudByVersion(idVersion)
        .subscribe(
          info=> {
            // console.log(info);
            this.setDatosGeneralesBody(info)
            this.fetchSucces();
            resolve();
          },
          error => {
            this.fetchSucces();
            return throwError(error);
          }
        )
      });

  }

  asyncSetDatosGenerales=()=>{
    return new Promise(
      (resolve)=>{
        this.fetchBegin();
        const {datosGeneralesBody} = this.getState();
        this.datosGeneralesService.setModificacionDatosGenerales(datosGeneralesBody)
        .subscribe(
          info=>{
            // console.log(info);
            this.fetchSucces();
            resolve(info);
          },
          error => {
            this.fetchSucces();
            return throwError(error);
          }
        )
    });
  }

  asynFetchRepresentanteLegal = (tipoDocumento:string, numeroDocumento: string):Observable<IFormRepresentanteLegal> => {
    // console.log(numeroDocumento);
    const {representantesLegales } = this.getDatosGeneralesBody();
    let item = representantesLegales.find(x=>x.numeroDocumento==numeroDocumento);
    // console.log(item);
    let legal:IFormRepresentanteLegal={
      tipoDocumento:tipoDocumento,
      tipoDocumentoEnum:item.tipoDocumentoEnum,
      numeroDocumento:item.numeroDocumento,
      nombres:item.nombres,
      apellidoPaterno:item.apellidoPaterno,
      apellidoMaterno:item.apellidoMaterno,
      cargo:item.cargo,
      oficinaRegistral:item.oficinaRegistral,
      numeroPartida:item.numeroPartida,
      asiento:item.asiento,
      domicilioLegal:item.domicilioLegal,
      ubigeo:item.ubigeo,
      telefono:item.telefono,
      correo:item.correo,
      nombreDepartamento:'',
      nombreDistrito:'',
      nombreProvincia:'',
      numeroCasillaElectronica:item.numeroCasillaElectronica,
      esResponsable:''
    };
    return of(legal);
  };

}
