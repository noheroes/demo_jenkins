//import { DocumentoService } from './../../../service/documento.service';
import { IModalEnviado } from './../enviado.store.interface';
import { FormType } from '@sunedu/shared';
import { DocumentoEnviadoService } from '../../../service/documento-enviado.service';


export class EnviadoModalActions {
    
    constructor(
        private getState: () => IModalEnviado,
        private setState: (newState: IModalEnviado) => void,
        private documentoEnviadoService: DocumentoEnviadoService
      ) {}
    
    setModalAdd =  (tipo:any) => {
        const state = this.getState();
        this.setState({
            ...state,
            isLoading: false,
            tipo: tipo,
            type: FormType.REGISTRAR,
            title: 'Agregar Documento'
        });
    }



}