import { DocumentoService } from './../../../service/documento.service';
import { IModalDocumento } from './../documento.store.interface';
import { FormType } from '@sunedu/shared';

export class DocumentoModalActions {
    
    constructor(
        private getState: () => IModalDocumento,
        private setState: (newState: IModalDocumento) => void,
        private documentoService: DocumentoService
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