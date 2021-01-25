import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
import { IEntidadLaboratorio } from '../laboratorio/laboratorio.store.interface';

export interface IBuscardorInfraestructura {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorInfraestructura>>;
  formBuscar: Partial<IFormBuscardorInfraestructura>;
  comboLists: {
    sedeFilial: IComboList;
  };
  bloquearRegistro:boolean;
  readOnly?:boolean;
}
export interface IGridBuscardorInfraestructura {
    numero: string;
    numeroLaboratorioComputo: string;
    numeroLaboratorioEnsenanza: string;
    numeroLaboratorioInvestigacion: string;
    numeroBibliotecas: string;
    numeroAulas: string;
}
export interface IFormBuscardorInfraestructura {
  id: string;
  idVersion: string;
  idSedeFilial: string;
  idLocal: string;
}


export interface IFormInfraestructura {
    id: string;
    idLocal: string;
    numeroLaboratorioComputo: string;
    numeroLaboratorioEnsenanza: string;
    numeroLaboratorioInvestigacion: string;
    numeroTalleresEnsenanza: string;
    numeroBibliotecas: string;
    numeroAulas: string;
    numeroAmbientesDocentes: string;
    numeroTopicos: string;
    denominacionAmbienteComplementario: string;
    denominacionAmbienteServicio: string;
    comentario: string;
}


export interface IModalInfraestructura {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormInfraestructura>;
  codigoInfraestructura?: string;
  idVersion?: string;
  idSedeFilial?: string;
  idLocal?: string;
}
