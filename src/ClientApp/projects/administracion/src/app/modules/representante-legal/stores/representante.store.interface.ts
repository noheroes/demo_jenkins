import {
  FormType,
  IComboList,
  IDataGridDefinition,
  IDataGridSource,
} from '@sunedu/shared';
import {
  RepresentanteLegal,
  RepresentanteLegalCustom,
  IEntidad,
} from '../../entidades/stores/entidad.store.interface';

export interface IModalRepresentante {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<RepresentanteLegal>;
  entidad: IEntidad;
  codigo?: string;
  comboLists: {
    tipoDocumentos: IComboList;
  };
}

export interface IBuscadorRepresentante {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  gridSource: IDataGridSource<Partial<RepresentanteLegalCustom>>;
  formBuscar: Partial<IFormBuscadorRepresentante>;
}
export interface IFormBuscadorRepresentante {
  codigoTipoDocumento: string;
}

export enum TIPODOCUMENTO {
  DNI = 1,
  CE = 2
}
