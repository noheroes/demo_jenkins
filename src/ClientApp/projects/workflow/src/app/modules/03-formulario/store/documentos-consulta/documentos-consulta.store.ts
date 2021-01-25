import { Store } from './../../../../../../../../src/app/core/store/store';
import { Injectable } from '@angular/core';
import { DocumentosConsultaStoreModel } from './documentos-consulta.store.model';
import { DocumentosConsultaActions } from './actions/documentos-consulta.action';
import { DocumentosConsultaBuscadorActions } from './actions/documentos-consulta.buscador.action'
import { DocumentosConsultaService } from '../../service/documentos-consulta.service';
import { DocumentosConsultaModalActions } from './actions/documentos-consulta.modal.action';

@Injectable()
export class DocumentosConsultaStore extends Store<DocumentosConsultaStoreModel>{
  documentosConsultaActions: DocumentosConsultaActions;
  documentosConsultaBuscadorActions: DocumentosConsultaBuscadorActions;
  documentosConsultaModalActions: DocumentosConsultaModalActions;

  constructor(documentosConsultaService: DocumentosConsultaService) {
    super(new DocumentosConsultaStoreModel());

    this.documentosConsultaActions = new DocumentosConsultaActions(
      this.buildScopedGetState('documentosConsulta'),
      this.buildScopedSetState('documentosConsulta'),
      documentosConsultaService
    );

    this.documentosConsultaBuscadorActions = new DocumentosConsultaBuscadorActions(
      this.buildScopedGetState('documentosConsutlaBusqueda'),
      this.buildScopedSetState('documentosConsutlaBusqueda'),
      documentosConsultaService
    );

    this.documentosConsultaModalActions = new DocumentosConsultaModalActions(
      this.buildScopedGetState('documentosConsultaModal'),
      this.buildScopedSetState('documentosConsultaModal'),
      documentosConsultaService
    );

  }
}
