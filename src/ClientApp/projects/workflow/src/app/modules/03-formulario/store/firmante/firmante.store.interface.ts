import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';
export interface IGridBuscardorFirmante {
  id: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  tipoSexoEnum: string;
  tipoDocumetoEnum: string;
  numeroDocumento: string;
  codigoNacionalidad: string;
  tipoPersonaEnum: string;
  seleccionado?:boolean;
}
export interface IFormBuscardorFirmante {
  id: string;
  idVersion: string;
  codApp: string;
  codArea: string;
  codRol: string;
  //Datos de la bandeja
  idUsuario: string;
  idProceso: string;  
}
export interface IFirmante{
  codRol:string;
  dsRol:string;
  idUsuario:string;
}
export interface IBuscardorFirmante {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorFirmante>>;
  formBuscar: Partial<IFormBuscardorFirmante>;
  tipoPersona: string;
  firmantes:IFirmante[]
}
