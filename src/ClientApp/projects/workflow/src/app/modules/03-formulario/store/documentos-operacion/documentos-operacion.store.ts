//import { Store } from './../../../../../../../../src/app/core/store/store';
import { DocumentosOperacionModalActions } from './actions/documentos-operacion.modal.action';
import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { DocumentosOperacionStoreModel } from './documentos-operacion.store.model';
import { DocumentosOperacionActions } from './actions/documentos-operacion.action';
import { DocumentosOperacionService } from '../../service/documentos-operacion.service';
//import { DocumentoService } from '../../service/documento.service';

@Injectable()
export class DocumentosOperacionStore extends Store<DocumentosOperacionStoreModel>{
  documentosOperacionActions: DocumentosOperacionActions;
  documentosOperacionModalActions: DocumentosOperacionModalActions;

  constructor(documentosOperacionService: DocumentosOperacionService) {
    super(new DocumentosOperacionStoreModel());

    this.documentosOperacionActions = new DocumentosOperacionActions(
      this.buildScopedGetState('documentosOperacion'),
      this.buildScopedSetState('documentosOperacion'),
      documentosOperacionService
    );

    this.documentosOperacionModalActions = new DocumentosOperacionModalActions(
      this.buildScopedGetState('documentosOperacionModal'),
      this.buildScopedSetState('documentosOperacionModal'),
      documentosOperacionService
    );
  }
}
