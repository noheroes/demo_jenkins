import { DocumentoModalActions } from './actions/documento.modal.action';
import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { DocumentoConsultaGeneralStoreModel } from './documento.store.model';
import { DocumentoActions } from './actions/documento.action';
import { DocumentoService } from '../../service/documento.service';

@Injectable()
export class DocumentoStore extends Store<DocumentoConsultaGeneralStoreModel>{
  documentoActions: DocumentoActions;
  documentoModalActions: DocumentoModalActions;

  constructor(documentoService: DocumentoService) {
    super(new DocumentoConsultaGeneralStoreModel());

    this.documentoActions = new DocumentoActions(
      this.buildScopedGetState('consultaGeneralDocumentos'),
      this.buildScopedSetState('consultaGeneralDocumentos'),
      documentoService
    );

    this.documentoModalActions = new DocumentoModalActions(
      this.buildScopedGetState('documentosModal'),
      this.buildScopedSetState('documentosModal'),
      documentoService
    );
  }
}
