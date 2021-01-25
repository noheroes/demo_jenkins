import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';

export interface IBuscardorEquipamiento {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorEquipamiento>>;
  formBuscar: Partial<IFormBuscardorEquipamiento>;
  comboLists: {
    sedeFilial: IComboList;
  };
}
export interface IGridBuscardorEquipamiento {
    numero: string;
    codigoLaboratorioTaller: string;
    numeroEqMobSoft: string;
    nombreEqMobSoft: string;
    tipoEquipoMobiliarioEnum: string;
}
export interface IFormBuscardorEquipamiento {
  id: string;
  idVersion: string;
  idSedeFilial: string;
  idLocal: string;
  listEquipoMobiliario: any;
}


export interface IFormEquipamiento {
  id: string;
  idLocal: string;
  decripcionLabTaller: string;
  codigoLaboratorioTaller: string;
  numeroEqMobSoft: number | null;
  nombreEqMobSoft: string;
  tipoEquipoMobiliarioEnum: number | null;
  valorizacion: number | null;
  comentario: string;
}
export interface IModalEquipamiento {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormEquipamiento>;
  codigoEquipamiento?: string;
  idVersion?: string;
  idSedeFilial?: string;
  idLocal?: string;
  codigoLaboratorioTaller?: string;
  tipoEquipoMobiliarioEnum?: any;
  gridDefinition: IDataGridDefinition;
  formBuscar: Partial<IFormBuscardorEquipamiento>;
  source: IDataGridSource<Partial<IGridBuscardorEquipamiento>>;
  comboLists: {
    codigoLaboratorio: IComboList;
    codigoTipoEquipos: IComboList;
  };
  readOnly?:boolean;
  tipoEquipamiento: string;
}
