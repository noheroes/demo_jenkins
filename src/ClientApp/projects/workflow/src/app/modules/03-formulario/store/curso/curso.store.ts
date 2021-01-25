import { PreRequisitoModalActions } from './actions/prerequisito.mode.action';
import { Injectable } from '@angular/core';
import { Store, AppCurrentFlowStore } from '@lic/core';
import { CursoStoreModel } from './curso.store.model';
import { CursoModalActions } from './actions/curso.modal.action';
import { CursoService } from '../../service/curso.service';
import { CursoBuscadorActions } from './actions/curso.buscardor.action';
import { HorariolectivaModalActions } from './actions/horariolectiva.modal.action';

@Injectable()
export class CursoStore extends Store<CursoStoreModel> {
  cursoModalActions: CursoModalActions;
  cursoBuscadorActions: CursoBuscadorActions;
  horariolectivaModalActions: HorariolectivaModalActions;
  prerequisitoModalActions: PreRequisitoModalActions;
  constructor(cursoService: CursoService, private storeCurrent: AppCurrentFlowStore) {
    super(new CursoStoreModel());
    this.cursoModalActions = new CursoModalActions(
      this.buildScopedGetState('modalCurso'),
      this.buildScopedSetState('modalCurso'),
      cursoService,
      storeCurrent
    );
    this.cursoBuscadorActions = new CursoBuscadorActions(
      this.buildScopedGetState('buscadorCurso'),
      this.buildScopedSetState('buscadorCurso'),
      cursoService,
      storeCurrent
    );
    this.horariolectivaModalActions = new HorariolectivaModalActions(
      this.buildScopedGetState('modalHoraLectivaCurso'),
      this.buildScopedSetState('modalHoraLectivaCurso'),
      cursoService,
      storeCurrent
    );
    this.prerequisitoModalActions = new PreRequisitoModalActions(
      this.buildScopedGetState('modalPrerequisitoCurso'),
      this.buildScopedSetState('modalPrerequisitoCurso'),
      cursoService,
      storeCurrent
    )
  }
}
