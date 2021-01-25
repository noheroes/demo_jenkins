
import { IUbigeo, IUbigeoDepartamento } from '../ubigeo.interface';

export class UbigeoDepartamentoActions {

  constructor(
    private getState: () => IUbigeoDepartamento,
    private setState: (newState: IUbigeoDepartamento) => void,
    //private storeUbigeoGeneral: AppUbigeoGeneral
    //private personService: PersonService
    ) {
  }

  setValueDepartamentos = (newValue: IUbigeo[]) => {



    // const newState = update(state, {
    //   persona: { $set: newValue }
    // });

    const state = this.getState();
    const newState = {
      ...state,
      departamentos: newValue
    }
    // const newState = {
    //   ...state,

    //   referencia:newValue.referencia,
    //   codigo:newValue.codigo,
    //   nombre:newValue.nombre,
    //   idTipoUsuario:newValue.idTipoUsuario,
    //   descripcionSede:newValue.descripcionSede,
    //   codigoFlujos:newValue.codigoFlujos,
    //   fechaDesde:newValue.fechaDesde,
    //   fechaHasta:newValue.fechaHasta,
    //   codigoActividad:newValue.codigoActividad,
    //   page:newValue.page,
    //   pageSize:newValue.pageSize
    // };


    this.setState(newState);
  }

  // resetProcedimiento = () => {
  //   this.setState({
  //     idUsuario:null,
  //     idEntidad:null,
  //     idFlujo:null,
  //     idTipoUsuario:null,
  //     descripcionSede:null,
  //     codigoFlujos:null,
  //     fechaDesde:null,
  //     fechaHasta:null,
  //     codigoActividad:null,
  //     page:null,
  //     pageSize:null
  //   });
  // }

  getDepartamentos = ()=>{
    // let current = this.storeUbigeoGeneral.currentFlowAction.get();
    return this.getState();
  }

  // setModalConsultar = (id: string) => {
  //   const state = this.getState();
  //   this.setState({
  //     ...state,
  //     title: 'Consultar Persona',
  //     idPersona: id,
  //     type: FormType.CONSULTAR
  //   });
  // }

  // setModalEditar = (id: string) => {
  //   const state = this.getState();
  //   this.setState({
  //     ...state,
  //     title: 'Editar Persona',
  //     idPersona: id,
  //     type: FormType.EDITAR
  //   });
  // }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================




  // asyncGetPerson = (id: string) => {

  //   this.setState({ ...this.getState(), isLoading: true, error: null });

  //   this.personService.getPerson(id).subscribe(persona => {

  //     const state = this.getState();

  //     // const newState = update(state, {
  //     //   isLoading: { $set: false },
  //     //   persona: { $set: persona }
  //     // });

  //     const newState = { ...state, isLoading: false, persona: persona };

  //     this.setState(newState);

  //   }, (error) => {

  //     const state = this.getState();

  //     // const newState = update(state, {
  //     //   isLoading: { $set: false },
  //     //   error: { $set: error }
  //     // });

  //     const newState = { ...state, isLoading: false, error: error };

  //     this.setState(newState);

  //   });
  // }

  // asyncSavePerson = (person: IPerson) => {
  //   return new Promise((resolve) => {

  //     this.setState({ ...this.getState(), isLoading: true, error: null });

  //     this.personService.savePerson(person).subscribe(
  //       response => {

  //         const state = this.getState();

  //         this.setState({ ...state, isLoading: false, error: null });

  //         resolve();

  //       },
  //       error => {

  //         const state = this.getState();

  //         this.setState({ ...state, isLoading: false, error: error.errors });

  //       }
  //     );
  //   });
  // }

}
