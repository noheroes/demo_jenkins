export interface IElementos
{
  codigo:string;
  valor:string;
  descripcion:string;
  esEliminado:boolean;
}
export interface IEnumerado
{
  id:string;
  idEnumerado:string;
  nombre:string;
  descripcion:string;
  elementos: IElementos[];
}

export interface IEnumeradoGeneral{
  enumerados:IEnumerado[];
}
