import { IDataGridDefinition, IDataGridSource, FormType, IComboList } from '@sunedu/shared';
export interface IFormAmbiente {
  codigoLocalRef: string;
  codigo: string;
  ubicacion: string;
  aforo: string;
  cantidadDocente: string;
  tieneInternet: string;
  cantidadSillas: string;
  cantidadMesas: string;
  tipoRegimenDedicacionEnum: string;
  otroEquipamentoMobiliario: string;
  comentario: string;
}
export interface IModalAmbiente {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormAmbiente>;
  codigoAmbiente?: string;
  comboLists: {
    locales: IComboList;
    tieneInternet: IComboList;
    regimenDedicaciones: IComboList;
  };
}

export interface IBuscardorAmbiente {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorAmbiente>>;
  formBuscar: Partial<IFormBuscardorAmbiente>;

}
export interface IGridBuscardorAmbiente {
  codigoLocal: string;
  codigoAmbiente: string;
  ubicacion: string;
  aforo: string;
  cantidadDocente: string;
  cantidadSillas: string;
  cantidadMesas: string;
  tieneInternet: string;
  registroDocentes: string;
}
export interface IFormBuscardorAmbiente {
  codigoSedeFilial: string;
}
// export interface IAmbiente {
//   modalAmbiente: IModalAmbiente;
//   buscarAmbiente: IBuscardorAmbiente;
// }
