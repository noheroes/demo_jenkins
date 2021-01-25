import { FormType, IComboList } from '@sunedu/shared';
import { IInicioProcedimiento } from '../../../interfaces/inicio.interface';
export interface IModalIniciarProcedimiento {
    title: string;
    isLoading: boolean;
    error: any;
    type: FormType;
    inicioProcedimiento: IInicioProcedimiento;
    tieneSubFlujo:boolean;
    // idOrdenEvaluacion?: string;
    filterLists: {
        entidad: IComboList;
        solicitud: IComboList;
        procedimiento: IComboList;
        subFlujo: IComboList;
    };
}

export interface ITrakingProcedimiento{
  trackingNumber:string;
  success: boolean;
  message: string;
  details: string;
}
