import { FormType, IComboList } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';

export interface IMiembroEquipoTrabajo {
  numero: number,
  rolGuid: string,
  rolDescipcion: string,
  usuarioGuid: string,
  usuarioDescripcion: string,
  usuarioNumeroDocumento: string,
  isSelected: boolean
}

export interface IAsignacionEquipoTrabajo {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  //form: Partial<ITipoDocumento>;
  isSolicitudVersion: string;
  modelData: IFormularioModel;
  usuariosDisponibles: IMiembroEquipoTrabajo[];
}
