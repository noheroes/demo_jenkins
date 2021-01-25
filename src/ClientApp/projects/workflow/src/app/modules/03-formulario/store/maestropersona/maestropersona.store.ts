import { Injectable } from '@angular/core';
import { Store } from '@lic/core';
import { MaestroPersonaStoreModel } from './maestropersona.store.model';
import { MaestroPersonaBuscadorActions } from './actions/maestropersona.buscador.action';
import { MaestroNoDocenteaBuscadorActions } from './actions/maestronodocente.buscador.action';
import { MaestroPersonaModalActions } from './actions/maestropersona.modal.action';
import { GradoAcademicoModalActions } from './actions/gradoacademico.modal.action';
import { ProgramaDocenteModalActions } from './actions/programadocente.modal.action';
import { ProgramaNoDocenteModalActions } from './actions/programanodocente.modal.action';
import { HoraActividadModalActions } from './actions/horaactividad.modal.action';
import { MaestroNoDocenteModalActions } from './actions/maestronodocente.modal.action';
import { MaestroPersonaAgregarActions } from './actions/maestropersona.agregar.action';
import { MaestropersonaService } from '../../service/maestropersona.service';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';
@Injectable()
export class MaestroPersonaStore extends Store<MaestroPersonaStoreModel> {
  maestroNoDocenteBuscadorActions: MaestroNoDocenteaBuscadorActions;
  maestroPersonaBuscadorActions: MaestroPersonaBuscadorActions;
  maestroPersonaModalActions: MaestroPersonaModalActions;
  gradoAcademicoModalActions: GradoAcademicoModalActions;
  programaDocenteModalActions: ProgramaDocenteModalActions;
  programaNoDocenteModalActions: ProgramaNoDocenteModalActions;
  horaActividadModalActions: HoraActividadModalActions;
  maestroNoDocenteModalActions: MaestroNoDocenteModalActions;
  maestroPersonaAgregarActions: MaestroPersonaAgregarActions;

  constructor(
    maestropersonaService: MaestropersonaService,
    private storeCurrent: AppCurrentFlowStore
  ) {
    super(new MaestroPersonaStoreModel());

    this.maestroPersonaBuscadorActions = new MaestroPersonaBuscadorActions(
      this.buildScopedGetState('buscadorMaestroPersona'),
      this.buildScopedSetState('buscadorMaestroPersona'),
      maestropersonaService,
      storeCurrent
    );
    this.maestroNoDocenteBuscadorActions = new MaestroNoDocenteaBuscadorActions(
      this.buildScopedGetState('buscadorMaestroNoDocente'),
      this.buildScopedSetState('buscadorMaestroNoDocente'),
      maestropersonaService,
      storeCurrent
    );

    this.maestroPersonaModalActions = new MaestroPersonaModalActions(
      this.buildScopedGetState('modalMaestroPersona'),
      this.buildScopedSetState('modalMaestroPersona'),
      maestropersonaService,
      storeCurrent
    );
    this.gradoAcademicoModalActions = new GradoAcademicoModalActions(
      this.buildScopedGetState('modalGradoAcademico'),
      this.buildScopedSetState('modalGradoAcademico'),
      maestropersonaService,
      storeCurrent
    );
    this.programaDocenteModalActions = new ProgramaDocenteModalActions(
      this.buildScopedGetState('modalProgramaDocente'),
      this.buildScopedSetState('modalProgramaDocente'),
      maestropersonaService,
      storeCurrent
    );
    this.programaNoDocenteModalActions = new ProgramaNoDocenteModalActions(
      this.buildScopedGetState('modalProgramaNoDocente'),
      this.buildScopedSetState('modalProgramaNoDocente'),
      maestropersonaService,
      storeCurrent
    );
    this.horaActividadModalActions = new HoraActividadModalActions(
      this.buildScopedGetState('modalHoraAsignadaDocente'),
      this.buildScopedSetState('modalHoraAsignadaDocente'),
      maestropersonaService,
      storeCurrent
    );
    this.maestroNoDocenteModalActions = new MaestroNoDocenteModalActions(
      this.buildScopedGetState('modalMaestroNoDocente'),
      this.buildScopedSetState('modalMaestroNoDocente'),
      maestropersonaService,
      storeCurrent
    );
    this.maestroPersonaAgregarActions = new MaestroPersonaAgregarActions(
      this.buildScopedGetState('agregarPersona'),
      this.buildScopedSetState('agregarPersona')
    );
  }
}
