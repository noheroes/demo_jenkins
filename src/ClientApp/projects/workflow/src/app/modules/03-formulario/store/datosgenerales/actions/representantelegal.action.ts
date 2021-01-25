import { IDatosGenerales, IBuscarRepresentanteLegal } from '../datosgenerales.store.interface';
import { DatosGeneralesService } from '../../../service/datos-generales.service';
//import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';
import { IDataGridPageRequest } from '@sunedu/shared/lib/interfaces';

export class RepresentantenLegalActions {

  constructor(
    private getState: () => IBuscarRepresentanteLegal,
    private setState: (newState: IBuscarRepresentanteLegal) => void,
    private datosGeneralesService: DatosGeneralesService
  ) {

  }

  // asyncFetchRepresentanteLegal = (
  //   pageRequest: IDataGridPageRequest = {
  //     page: this.getState().source.page,
  //     pageSize: this.getState().source.pageSize,
  //     orderBy: this.getState().source.orderBy,
  //     orderDir: this.getState().source.orderDir,
  //   },
  //   filters = this.getState().formBuscar) => {

  //   this.fetchPersonsBegin();

  //   this.personService.fetchPersons(pageRequest, filters).subscribe(response => {

  //     this.fetchRepresentanteLegalSuccess(
  //       response.persons,
  //       response.total,
  //       pageRequest.page,
  //       pageRequest.pageSize,
  //       pageRequest.orderBy,
  //       pageRequest.orderDir
  //     );

  //   }, (error) => {
  //     // this.fetchPersonsError(error);

  //   });
  // }

  // fetchRepresentanteLegalSuccess = (persons, total, page, pageSize, orderBy, orderDir) => {

  //   const state = this.getState();

  //   // const new_state = update(state, {
  //   //   isLoading: { $set: false },
  //   //   source: {
  //   //     items: { $set: persons },
  //   //     total: { $set: total },
  //   //     page: { $set: page },
  //   //     pageSize: { $set: pageSize },
  //   //     orderBy: { $set: orderBy },
  //   //     orderDir: { $set: orderDir }
  //   //   },
  //   // });

  //   const new_state = {
  //     ...state,
  //     isLoading: false,
  //     source: {
  //       ...state.source,
  //       items: persons,
  //       total: total,
  //       page: page,
  //       pageSize: pageSize,
  //       orderBy: orderBy,
  //       orderDir: orderDir
  //     }
  //   };

  //   this.setState(new_state);
  // }
}
