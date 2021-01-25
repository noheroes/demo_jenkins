import { IComboList } from '@sunedu/shared';

export interface IFormMallaCurricular {
  codigoPrograma: string,
  codigoModalidadEstudio: string,
  fechaPlanCurricular: Date,
  codigoRegimenEstudio: string,
  periodoAcademico: string,
  duracionProgramaAnios: string,
  duracionProgramaSemanas: string,
  valorCreditoHorasTeoricas: string,
  valorCreditoHorasPracticas: string
}
export interface IMallaCurricular {
  formMallaCurricular: IFormMallaCurricular,
  buscar:any
}
export interface IFormato {
  mallaCurricular: IMallaCurricular,
  comboList?:{
    sedes:IComboList;
  }
}


