export interface ILocales{
  addedAtUtc:string;
  aforo:number;
  areaConstruida:number;
  areaTerreno:number;
  cantidadEstudiantes:number;
  codigo:string;
  codigoSedeFilial:string;
  comentarios:string;
  descripcionUbigeo:string;
  direccion:string;
  esActivo:boolean;
  esEliminado:boolean;
  esOtroServicio:boolean;
  esServicioEducativo:boolean;
  esServicioEducativoComplementario:boolean;
  fechaAutorizacion:string;
  fechaCreacion:string;
  id:string;
  numero:string;
  otroServicio: string;
  referencia:string;
  resolucionAutorizacion:string;
  telefono: string;
  ubicacion: string;
  ubigeo: string;
  version: number;
}

export interface ISedeFilial{
  addedAtUtc: string;
  codigo: string;
  descripcionUbigeo: string;
  esActivo: boolean;
  esEliminado: boolean;
  esRegistro: boolean;
  esSedeFilial: boolean;
  fechaCreacion: string;
  id: string;
  ubigeo: string;
  version: number;
  locales:ILocales[];
}
export interface IFormatoBody{
  isLoading: boolean;
  error: any
  id:string;
  idVersion:string;
  sedeFilialLocales:ISedeFilial[];
}
