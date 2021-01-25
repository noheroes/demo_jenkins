import { IFormularioModel } from '@lic/core';
import { FormType, IComboList, ComboList } from '@sunedu/shared';
import { IMiembroEquipoTrabajo, IAsignacionEquipoTrabajo }
  from './equipotrabajo.store.interface';

export class AsignacionEquipoTrabajo implements IAsignacionEquipoTrabajo {
  title: 'Asignación de equipo de trabajo';
  type: FormType = FormType.CONSULTAR;
  isLoading = false;
  error = null;
  //form = new TipoDocumento();
  isSolicitudVersion = null;
  modelData: IFormularioModel = null;
  usuariosDisponibles: MiembroEquipoTrabajo[] = [];
}

export class MiembroEquipoTrabajo implements IMiembroEquipoTrabajo {
  numero: number;
  rolGuid: string;
  rolDescipcion: string;
  usuarioGuid: string;
  usuarioDescripcion: string;
  usuarioNumeroDocumento: string;
  isSelected: boolean;
}

export class AsignacionEquipoTrabajoStoreModel {
  asignacionEquipoModel = new AsignacionEquipoTrabajo();
}
