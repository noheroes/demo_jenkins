import { Store } from './../../../../../../../../src/app/core/store/store';
import { EnviadoModalActions } from './actions/enviado.modal.action';
import { Injectable } from '@angular/core';
//import { Store } from '@lic/core';
import { EnviadoConsultaGeneralStoreModel } from './enviado.store.model';
import { EnviadoActions } from './actions/enviado.action';
import { DocumentoEnviadoService } from '../../service/documento-enviado.service';
//import { DocumentoService } from '../../service/documento.service';

@Injectable()
export class EnviadoStore extends Store<EnviadoConsultaGeneralStoreModel>{
  enviadoActions: EnviadoActions;
  enviadoModalActions: EnviadoModalActions;

  constructor(documentoEnviadoService: DocumentoEnviadoService) {
    super(new EnviadoConsultaGeneralStoreModel());

    this.enviadoActions = new EnviadoActions(
      this.buildScopedGetState('consultaGeneralDocumentos'),
      this.buildScopedSetState('consultaGeneralDocumentos'),
      documentoEnviadoService
    );

    this.enviadoModalActions = new EnviadoModalActions(
      this.buildScopedGetState('enviadoModal'),
      this.buildScopedSetState('enviadoModal'),
      documentoEnviadoService
    );
  }
}
