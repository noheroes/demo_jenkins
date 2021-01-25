import { FormType } from "@sunedu/shared";
import { IFormInfraestructuraCantidades, IEntidadInfraestructuraCantidades, IMemoryData } from "./infraestructura-cantidades.store.interface";
export class MemoryData implements IMemoryData{
  idVersion?: string;
  idSedeFilial: string;
  idLocal?: string;
  codigoInfraestructura?: string;
}
export class EntidadInfraestructuraCantidades implements IEntidadInfraestructuraCantidades{
  idLocal='';
  numeroTotalAulas=0;
  numeroTotalAmbientes=0;
  numeroTotalBibliotecas=0;

  numeroTotalLaboratorios=0;
  numeroLaboratorioComputo=0;
  numeroLaboratorioEnsenanza=0;
  numeroLaboratorioInvestigacion=0;

  numeroTotalTalleres=0;
  numeroTalleresComputo=0;
  numeroTalleresEnsenanza=0;
  numeroTalleresInvestigacion=0;

  numeroTotalLactarios=0;
  numeroTotalAuditorios=0;

  numeroTotalTopicos=0;
  numeroTotalAmbienteServicioPsicopedagogico=0;
  numeroTotalAmbienteServicioDeportivos=0;
  numeroTotalAmbienteServicioArtisticoCulturales=0;
  comentario= '';
}
export class FormInfraestructuraCantidades implements IFormInfraestructuraCantidades {
    title = 'Registrar infraestructura';
    isLoading = false;
    error = null;
    type = FormType.REGISTRAR;
    form = new EntidadInfraestructuraCantidades();
    memoryData = new MemoryData();
}

export class InfraestructuraCantidadesStoreModel {
    infraestructuraCantidades = new FormInfraestructuraCantidades();
}
