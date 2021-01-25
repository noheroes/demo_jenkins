import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from 'src/app/core/interfaces';
import { SolicitudStore } from '../../../store/solicitud/solicitud.store';
import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService } from '@sunedu/shared';
import { AppFormMallacurricularComponent } from '../../app-form/app-form-mallacurricular/app-form-mallacurricular.component';
import { MallaCurricularStore } from '../../../store/mallacurricular/mallacurricular.store';
import { CursoStore } from '../../../store/curso/curso.store';
import { AppFormCursosComponent } from '../../app-form/app-form-cursos/app-form-cursos.component';
import { AppFormResumenMallaComponent } from '../../app-form/app-form-resumenmalla/app-form-resumenmalla.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IFormBuscardorMallaCurricular } from '../../../store/mallacurricular/mallacurricular.store.interface';
import { FormBuscardorMallaCurricular } from '../../../store/mallacurricular/mallacurricular.store.model';
import { AppFormHorariolectivoComponent } from '../../app-form/app-form-horariolectivo/app-form-horariolectivo.component';
import { AppFormPreRequisitoComponent } from '../../app-form/app-form-prerequisito/app-form-prerequisito.component';


@Component({
  selector: 'app-container-mallacurricular',
  templateUrl: './app-container-mallacurricular.component.html',
  styleUrls: ['./app-container-mallacurricular.component.scss'],
  providers: [
    SolicitudStore,
    MallaCurricularStore,
    CursoStore
  ]
})
export class AppContainerMallacurricularComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() readOnly:boolean=false;
  readonly state$ = this.solicitudStore.state$;
  readonly mallaCurricularState$ = this.mStore.state$;
  readonly cursoState$ = this.cursoStore.state$;
  hideRuleContent:boolean = false;
  constructor(
    private solicitudStore: SolicitudStore,
    private mStore: MallaCurricularStore,
    private cursoStore: CursoStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.loadPage();
  }
  private loadPage = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    const formRequest = new FormBuscardorMallaCurricular(current.idVersionSolicitud);
    this.mStore.mallaCurricularBuscadorActions.setInit(formRequest);
    this.mStore.mallaCurricularBuscadorActions.setReadOnly(this.readOnly);
    this.mStore.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular().subscribe();

  }
  handleClickAgregarMallaCurricular = () => {
    this.mStore.mallaCurricularModalActions.setModalNew();
    const dialogRef = this.dialog.openMD(AppFormMallacurricularComponent);
    dialogRef.componentInstance.store = this.mStore;

    dialogRef.afterClosed().subscribe(() => {
      this.mStore.mallaCurricularModalActions.resetModalMallaCurricular();
      this.mStore.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular().subscribe();
    });
  }

  handleLoadData = (e: IDataGridEvent) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir, 
      skip: e.skip
    };
    this.mStore.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular(pageRequest).subscribe();

  }
  handleLoadDataCurso = (e: IDataGridEvent) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir, 
      skip: e.skip
    };
    this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso(pageRequest).subscribe();
    this.cursoStore.cursoBuscadorActions.setReadOnly(this.readOnly);
    //this.mStore.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular(pageRequest).subscribe();

  }
  openModalUpdate = (mallaCurricular) => {
    this.mStore.mallaCurricularModalActions.setModalEdit(mallaCurricular.id, mallaCurricular.idPrograma);
    const dialogRef = this.dialog.openMD(AppFormMallacurricularComponent);
    dialogRef.componentInstance.store = this.mStore;
    dialogRef.afterClosed().subscribe(() => {
      this.mStore.mallaCurricularModalActions.resetModalMallaCurricular();
      this.mStore.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular().subscribe();
    });
  }
  openModalConsultar = (mallaCurricular: any) => {
    this.mStore.mallaCurricularModalActions.setModalReadOnly(mallaCurricular.id, mallaCurricular.idPrograma);

    const dialogRef = this.dialog.openMD(AppFormMallacurricularComponent, { disableClose: false });

    dialogRef.componentInstance.store = this.mStore;

    dialogRef.afterClosed().subscribe(() => {
      this.mStore.mallaCurricularModalActions.resetModalMallaCurricular();
    });
  }

  deleteMallaCurrilar = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.mStore.mallaCurricularBuscadorActions.asynDeleteMallaCurricular(id)
          .subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.mStore.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular().subscribe();
          });
      }
    });
  }

  handleIrAMaestroCurso = (mallaCurricular) => {
    let idMallaCurricular = mallaCurricular.id;
    this.solicitudStore.state.formato.currentForm = 'curso';
    const current = this.storeCurrent.currentFlowAction.get();
    this.cursoStore.cursoBuscadorActions.setInit(
      idMallaCurricular,
      current.idVersionSolicitud,
      mallaCurricular.descripcionPrograma,
      mallaCurricular.duracionProgramaSemanas
    );
    this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso().subscribe();
    this.cursoStore.cursoBuscadorActions.setReadOnly(this.readOnly);

  }
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item);
        break;
      case 'ELIMINAR':
        this.deleteMallaCurrilar(e.item.id);
        break;
      case 'AGREGAR_CURSO':
        this.handleIrAMaestroCurso(e.item);
        break;
      case 'RESUMEN_MALLA':
        this.openModalResumenMalla(e.item);
        break;
    }
  }


  handleIrAMaestroMallaCurricular = () => {
    this.solicitudStore.state.formato.currentForm = 'mallacurricular';
  }

  handleClickNuevoCurso = () => {
    const { idMallaCurricular } = this.cursoStore.state.buscadorCurso;
    const { duracionProgramaEnSemanas } = this.cursoStore.state.buscadorCurso;
    this.cursoStore.cursoModalActions.setModalNew(idMallaCurricular, duracionProgramaEnSemanas);
    const dialogRef = this.dialog.openMD(AppFormCursosComponent);
    dialogRef.componentInstance.store = this.cursoStore;

    dialogRef.afterClosed().subscribe(() => {
      this.cursoStore.cursoModalActions.resetModalCurso();
      this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso().subscribe();
    });

  }
  
  openModalUpdateCurso = (id: string) => {
    const { idMallaCurricular } = this.cursoStore.state.buscadorCurso;
    this.cursoStore.cursoModalActions.setModalEdit(id, idMallaCurricular);
    const dialogRef = this.dialog.openMD(AppFormCursosComponent);

    dialogRef.componentInstance.store = this.cursoStore;

    dialogRef.afterClosed().subscribe(() => {
      this.cursoStore.cursoModalActions.resetModalCurso();
      this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso().subscribe();
    });
  }
  openModalConsultarCurso = (id: string) => {
    const { idMallaCurricular } = this.cursoStore.state.buscadorCurso;
    this.cursoStore.cursoModalActions.setModalReadOnly(id, idMallaCurricular);

    const dialogRef = this.dialog.openMD(AppFormCursosComponent, { disableClose: false });

    dialogRef.componentInstance.store = this.cursoStore;

    dialogRef.afterClosed().subscribe(() => {
      this.cursoStore.cursoModalActions.resetModalCurso();
    });
  }

  deleteCurso = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.cursoStore.cursoBuscadorActions.asynDeleteCurso(id)
          .subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso().subscribe();
          });
      }
    });
  }
  openModalUpdateHorarioLectivo = (id: string, name: string) => {
    const { idMallaCurricular } = this.cursoStore.state.buscadorCurso;
    this.cursoStore.horariolectivaModalActions.setModalEdit(id, idMallaCurricular);
    const dialogRef = this.dialog.openMD(AppFormHorariolectivoComponent);
    dialogRef.componentInstance.store = this.cursoStore;
    dialogRef.componentInstance.readOnly=this.readOnly;
    dialogRef.componentInstance.nombre_curso = name;

    dialogRef.afterClosed().subscribe(() => {
      this.cursoStore.cursoModalActions.resetModalCurso();
      this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso().subscribe();
    });
  }
  openModalUpdatePreRequisito = (id: string, name: string) => {
    const { idMallaCurricular } = this.cursoStore.state.buscadorCurso;
    this.cursoStore.prerequisitoModalActions.setModalEdit(id, idMallaCurricular);
    const dialogRef = this.dialog.openMD(AppFormPreRequisitoComponent);
    dialogRef.componentInstance.store = this.cursoStore;
    dialogRef.componentInstance.readOnly=this.readOnly;
    dialogRef.componentInstance.nombre_curso = name;

    dialogRef.afterClosed().subscribe(() => {
      this.cursoStore.cursoModalActions.resetModalCurso();
      this.cursoStore.cursoBuscadorActions.asyncFetchPageCurso().subscribe();
    });
  }
  handleClickButtonCurso = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultarCurso(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdateCurso(e.item.id);
        break;
      case 'ELIMINAR':
        this.deleteCurso(e.item.id);
        break;
      case 'AGREGAR_CURSO':
        this.handleClickNuevoCurso();
        break;
      case 'HORARIO_LECTIVO':
        this.openModalUpdateHorarioLectivo(e.item.id, e.item.codigo +' - '+ e.item.nombre);
        break;
      case 'PRE_REQUSITO':
        this.openModalUpdatePreRequisito(e.item.id, e.item.codigo +' - '+ e.item.nombre);
        break;
    }
  }

  openModalResumenMalla = (mallaCurricular: any) => {
    this.mStore.mallaCurricularModalActions.setModalReadOnly(mallaCurricular.id, mallaCurricular.idPrograma);
    const dialogRef = this.dialog.openMD(AppFormResumenMallaComponent);
    dialogRef.componentInstance.store = this.mStore;

    dialogRef.afterClosed().subscribe(() => {
      this.mStore.mallaCurricularModalActions.resetModalMallaCurricular();
    });
  }

  toggle() {
    // toggle based on index
    this.hideRuleContent = !this.hideRuleContent;
  }
  
}
