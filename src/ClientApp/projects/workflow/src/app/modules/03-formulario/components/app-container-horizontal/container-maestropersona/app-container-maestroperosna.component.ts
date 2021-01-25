import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
//import { IModalProgramaDocente } from '../maestropersona.store.interface';
import {
  DialogService,
  AlertService,
  IDataGridButtonEvent,
  IDataGridEvent,
} from '@sunedu/shared';
import { AppFormMaestroPersonaComponent } from '../../app-form/app-form-maestro-persona/app-form-maestro-persona.component';
import { AppFormGradoacademicoComponent } from '../../app-form/app-form-gradoacademico/app-form-gradoacademico.component';
import { AppFormProgramadocenteComponent } from '../../app-form/app-form-programadocente/app-form-programadocente.component';
import { AppFormHorarioactividadComponent } from '../../app-form/app-form-horarioactividad/app-form-horarioactividad.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import {
  IFormBuscardorMaestroPersona,
  TIPO_PERSONA,
  IModalGradoAcademico,
  TIPO_AUTPORIZACION_ENTIDAD,
  ESTADO_VIGENCIA_ENTIDAD,
  IModalProgramaDocente
} from '../../../store/maestropersona/maestropersona.store.interface';
import { AppFormNodocenteComponent } from '../../app-form/app-form-nodocente/app-form-nodocente.component';
import { AppFormProgramanodocenteComponent } from '../../app-form/app-form-programanodocente/app-form-programanodocente.component';
import { tap, concatMap, distinctUntilChanged } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { Observable, forkJoin } from 'rxjs';
import { EntidadGeneralStore } from '../../../store/external/entidad/entidad.store';
import { PaisGeneralStore } from '../../../store/external/pais/pais.store';

@Component({
  selector: 'app-container-maestroperosna',
  templateUrl: './app-container-maestroperosna.component.html',
  styleUrls: ['./app-container-maestroperosna.component.scss'],
  providers: [MaestroPersonaStore],
})
export class AppContainerMaestroperosnaComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() readOnly: boolean = false;
  readonly state$ = this.store.state$;
  readonly stateGradoAcademico$ = this.store.state$;

  // Enumerados
  listSexoEnum: any;
  codigoMaestroPersona: string;
  nommbre_docente: string;
  constructor(
    private store: MaestroPersonaStore,
    private dialog: DialogService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado: EnumeradoGeneralStore,
    private entidadGeneralStore: EntidadGeneralStore,
    private paisGeneralStore: PaisGeneralStore    
  ) { }

  async ngOnInit() {
    await this.buildEnumerados();
    const current = this.storeCurrent.currentFlowAction.get();
    //console.log('CAYL current 2',current);
    const formRequest: IFormBuscardorMaestroPersona = {
      id: '',
      idVersion: current.idVersionSolicitud,
      listSexoEnum: this.listSexoEnum,
    };
    this.store.maestroPersonaBuscadorActions.setInit(formRequest);
    this.store.maestroPersonaBuscadorActions.setReadOnly(this.readOnly);
    this.store.gradoAcademicoModalActions.setReadOnly(this.readOnly);
    this.store.programaDocenteModalActions.setReadOnly(this.readOnly);
    this.store.programaNoDocenteModalActions.setReadOnly(this.readOnly);
    this.store.horaActividadModalActions.setReadOnly(this.readOnly);
    this.store.maestroPersonaBuscadorActions
      .asyncFetchPageMaestroPersona()
      .subscribe();
    this.store.maestroNoDocenteBuscadorActions.setInit(formRequest);
    this.store.maestroNoDocenteBuscadorActions.setReadOnly(this.readOnly);
    this.store.maestroNoDocenteBuscadorActions
      .asyncFetchPageMaestroNoDocente()
      .subscribe();
  }

  private buildEnumerados = () => {
    return new Promise((resolve) => {
      this.storeEnumerado.currentEnumeradoActions
        .getEnumeradoByNombre('ENU_IDSEXO')
        .then((info) => {
          this.listSexoEnum = info;
        });
      resolve();
    });
  };

  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip,
    };
    this.store.maestroPersonaBuscadorActions
      .asyncFetchPageMaestroPersona(pageRequest)
      .subscribe();
  };
  handleLoadDataNoDocente = (e: IDataGridEvent) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip,
    };
    this.store.maestroNoDocenteBuscadorActions.asyncFetchPageMaestroNoDocente(pageRequest).subscribe();
  };
  handleLoadDataGradoAcademico = (e: IDataGridEvent) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip,
    };
    this.store.gradoAcademicoModalActions.asyncFetchPage(pageRequest)
    .subscribe();
  };
  openModalUpdate = (id: string) => {
    this.store.maestroPersonaModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(AppFormMaestroPersonaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef
      .afterClosed()
      .pipe(
        tap((response) => this.store.maestroPersonaModalActions.resetModal()),
        concatMap((response) =>
          this.store.maestroPersonaBuscadorActions.asyncFetchPageMaestroPersona()
        )
      )
      .subscribe();
  };
  openModalUpdateNoDocente = (id: string) => {
    this.store.maestroNoDocenteModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(AppFormNodocenteComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef
      .afterClosed()
      .pipe(
        tap((response) => this.store.maestroNoDocenteModalActions.resetModal()),
        concatMap((response) =>
          this.store.maestroNoDocenteBuscadorActions.asyncFetchPageMaestroNoDocente()
        )
      )
      .subscribe();
  };
  openModalConsultar = (id: string) => {
    this.store.maestroPersonaModalActions.setModalReadOnly(id);
    const dialogRef = this.dialog.openMD(AppFormMaestroPersonaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef
      .afterClosed()
      .pipe(
        tap((response) => this.store.maestroPersonaModalActions.resetModal())
      )
      .subscribe();
  };
  openModalConsultarNoDocente = (id: string) => {
    this.store.maestroNoDocenteModalActions.setModalReadOnly(id);
    const dialogRef = this.dialog.openMD(AppFormNodocenteComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef
      .afterClosed()
      .pipe(
        tap((response) => this.store.maestroNoDocenteModalActions.resetModal())
      )
      .subscribe();
  };
  deleteDocente = (id: string) => {
    this.alert
      .open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          this.store.maestroPersonaBuscadorActions
            .asynDeleteMaestroPersona(id)
            .pipe(
              tap((response) =>
                this.alert.open('Registro eliminado', null, { icon: 'success' })
              ),
              concatMap((response) =>
                this.store.maestroPersonaBuscadorActions.asyncFetchPageMaestroPersona()
              )
            )
            .subscribe();
        }
      });
  };
  deleteNoDocente = (id: string) => {
    this.alert
      .open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          this.store.maestroNoDocenteBuscadorActions
            .asynDeleteMaestroNoDocente(id)
            .pipe(
              tap((response) =>
                this.alert.open('Registro eliminado', null, { icon: 'success' })
              ),
              concatMap((response) =>
                this.store.maestroNoDocenteBuscadorActions.asyncFetchPageMaestroNoDocente()
              )
            )
            .subscribe();
        }
      });
  };

  // openModalGradoAcademicoUpdate = (id: string) => {
  //   this.store.gradoAcademicoModalActions.setModalEdit(id);
  //   const dialogRef = this.dialog.openMD(AppFormGradoacademicoComponent);
  //   dialogRef.componentInstance.store = this.store;
  //   dialogRef
  //     .afterClosed()
  //     .pipe(
  //       tap((response) => this.store.maestroPersonaModalActions.resetModal())
  //     )
  //     .subscribe();
  // };
  openModalProgramaDocenteUpdate = (id: string, name: string) => {
    this.store.programaDocenteModalActions.setModalEdit(id);
   
    const dialogRef = this.dialog.openMD(AppFormProgramadocenteComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.nombre_docente = name;
    dialogRef
      .afterClosed()
      .pipe(
        tap((response) => this.store.programaDocenteModalActions.resetModal())
      )
      .subscribe();
  };
  openModalProgramaNoDocenteUpdate = (id: string, name: string) => {
    this.store.programaNoDocenteModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(AppFormProgramanodocenteComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.nombre_nodocente = name;
    dialogRef
      .afterClosed()
      .pipe(
        tap((resonponse) =>
          this.store.programaNoDocenteModalActions.resetModal()
        )
      )
      .subscribe();
  };
  openModalHorarioAsignacionUpdate = (id: string, name: string) => {
    this.store.horaActividadModalActions.setModalEdit(id);
    const dialogRef = this.dialog.openMD(AppFormHorarioactividadComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.nombre_docente = name;
    dialogRef
      .afterClosed()
      .pipe(
        tap((response) => this.store.horaActividadModalActions.resetModal())
      )
      .subscribe();
  };
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        if (e.item.tipoPersonaEnum == TIPO_PERSONA.DOCENTE)
          this.openModalConsultar(e.item.id);
        else this.openModalConsultarNoDocente(e.item.id);
        break;
      case 'EDITAR':
        if (e.item.tipoPersonaEnum == TIPO_PERSONA.DOCENTE)
          this.openModalUpdate(e.item.id);
        else this.openModalUpdateNoDocente(e.item.id);
        break;
      case 'ELIMINAR':
        if (e.item.tipoPersonaEnum == TIPO_PERSONA.DOCENTE)
          this.deleteDocente(e.item.id);
        else this.deleteNoDocente(e.item.id);
        break;
      case 'GRADO_ACADEMICO':
        this.openGradoAcademico(e.item.id, e.item.apellidoPaterno +' '+ e.item.apellidoMaterno +', '+ e.item.nombres);
        break;
      case 'PROGRAMA_DOCENTE':
        if (e.item.tipoPersonaEnum == TIPO_PERSONA.DOCENTE) 
          this.openModalProgramaDocenteUpdate(e.item.id, e.item.apellidoPaterno +' '+ e.item.apellidoMaterno +', '+ e.item.nombres);
        else this.openModalProgramaNoDocenteUpdate(e.item.id, e.item.apellidoPaterno +' '+ e.item.apellidoMaterno +', '+ e.item.nombres);
        break;
      case 'HORARIO_ASIGNACION':
        this.openModalHorarioAsignacionUpdate(e.item.id, e.item.apellidoPaterno +' '+ e.item.apellidoMaterno +', '+ e.item.nombres);
        break;
    }
  };
  get TIPOPERSONA() {
    return TIPO_PERSONA;
  }

  //GRADO ACADEMICO
  retornar = () => {
    this.store.state.formato.currentForm = 'maestroPersona';
  }

  private loadData = (id: string) => {
    this.codigoMaestroPersona = id;
    this.store.gradoAcademicoModalActions.setCodigoMaestroPersona(this.codigoMaestroPersona);
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_TIPOGRADO'),
      this.entidadGeneralStore.entidadActions.asyncGetEntidad(TIPO_AUTPORIZACION_ENTIDAD.VIGENTES, ESTADO_VIGENCIA_ENTIDAD.LICENCIADA),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPORESPUESTA'),
      this.paisGeneralStore.paisActions.asyncGetPaisTodos()
    ).pipe(
      tap(enums => {
        this.store.gradoAcademicoModalActions.asyncFetchCombos(enums);
        this.store.gradoAcademicoModalActions.asyncFetchPage().subscribe();
      })
    ).subscribe();
  }

  openGradoAcademico = (id: string, name: string) => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.loadData(id);
    this.nommbre_docente = name;
    this.store.gradoAcademicoModalActions.setInit(current.idVersionSolicitud);
    this.store.state.formato.currentForm = 'gradoAcademico';
  }

  handleClickButtonGradoAcademico = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.handleDeleteGradoAcademico(e.item.id);
        break;
      case 'CONSULTAR':
        this.handleConsultarGradoAcademico(e.item);
        break;
      case 'EDITAR':
        this.handleEditarGradoAcademico(e.item);
        break;
    }
  }

  handleConsultarGradoAcademico = (id: any) => {
    this.store.gradoAcademicoModalActions.setModalReadOnly(this.codigoMaestroPersona, id);
    const dialogRef = this.dialog.openMD(AppFormGradoacademicoComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.nombre_docente = this.nommbre_docente;
    dialogRef.afterClosed().subscribe(() => {
      this.store.gradoAcademicoModalActions.asyncFetchPage().subscribe(response => { });
    });
  };

  handleEditarGradoAcademico = (id: any) => {
    this.store.gradoAcademicoModalActions.setModalEdit(this.codigoMaestroPersona, id);
    const dialogRef = this.dialog.openMD(AppFormGradoacademicoComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.nombre_docente = this.nommbre_docente;
    dialogRef.afterClosed().subscribe(() => {
      this.store.gradoAcademicoModalActions.asyncFetchPage().subscribe(response => { });
    });
  };

  handleDeleteGradoAcademico = (id: string) => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.gradoAcademicoModalActions.setInit(current.idVersionSolicitud);
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.gradoAcademicoModalActions.asynDelete(id)
          .pipe(
            tap(responose => this.alert.open('Registro eliminado', null, { icon: 'success' })),
            concatMap(response => this.store.gradoAcademicoModalActions.asyncFetchPage()))
          .subscribe();
      }
    });
  }

  handleClickNuevoGradoAcademico = () => {
    this.store.gradoAcademicoModalActions.setModalNew();
    const dialogRef = this.dialog.openMD(AppFormGradoacademicoComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.nombre_docente = this.nommbre_docente;
    dialogRef.afterClosed().subscribe(() => {
      this.store.gradoAcademicoModalActions.asyncFetchPage().subscribe(response => { });
    });
  }

}
