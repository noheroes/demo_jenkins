import { IDataGridDefinition, IDataGridSource, FormType } from '@sunedu/shared';
import { IBandejaActividad } from '../../../interfaces/bandeja.interface';
export interface IFormBuscarBandeja {
  idProcedimiento: any;
  idEntidad: any;
  numeroSolicitud: any;
}

export interface IBuscadorBandeja {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  gridSource: IDataGridSource<IBandejaActividad>;
  formBuscar: IFormBuscarBandeja;
  filterLists: {
    idProcedimientos: any[];
    idEntidades: any[];
  };
}
