export interface IFormCurso {
  nombreCurso: string,
  codigoTipoEstudio: string,
  codigoTipoCurso: string,
  codigoPeriodoAcdemico: string,
  numeroTotalSemanas: string
}
export interface ICurso {
  formCurso: IFormCurso,
  buscar:any
}
export interface IFormato {
  curso: ICurso
}
