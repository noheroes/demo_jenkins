export interface IUbigeo
{
  referencia:string;
  codigo:string;
  nombre:string;
}

export interface IUbigeoGeneral{
  ubigeos:IUbigeo[];
}

export interface IUbigeoDepartamento{
  departamentos: IUbigeo[];
}

export interface IUbigeoProvincia{
  provincias: IUbigeo[];
}

export interface IUbigeoDistrito{
  distritos: IUbigeo[];
}
