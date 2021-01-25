import { IFormularioModel } from "@lic/core";
import { FormType } from "@sunedu/shared";
export interface IMemoryData{
  idVersion?: string;
  idSedeFilial: string;
  idLocal?: string;
  codigoInfraestructura?: string;
}
export interface IEntidadInfraestructuraCantidades {
  idLocal:string;
  numeroTotalAulas:number;
  numeroTotalAmbientes:number;
  numeroTotalBibliotecas:number;

  numeroTotalLaboratorios:number;
  numeroLaboratorioComputo:number;
  numeroLaboratorioEnsenanza:number;
  numeroLaboratorioInvestigacion:number;

  numeroTotalTalleres:number;
  numeroTalleresComputo:number;
  numeroTalleresEnsenanza:number;
  numeroTalleresInvestigacion:number;

  numeroTotalLactarios:number;
  numeroTotalAuditorios:number;

  numeroTotalTopicos:number;
  numeroTotalAmbienteServicioPsicopedagogico:number;
  numeroTotalAmbienteServicioDeportivos:number;
  numeroTotalAmbienteServicioArtisticoCulturales:number;
  comentario: string;
}

export interface IFormInfraestructuraCantidades {
    title: string;
    isLoading: boolean;
    error: any;
    type: FormType;
    form: Partial<IEntidadInfraestructuraCantidades>;
    memoryData: Partial<IMemoryData>;
    readOnly?:boolean;
}

