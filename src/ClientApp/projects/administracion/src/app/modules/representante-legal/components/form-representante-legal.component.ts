import { Component, OnInit, Input } from '@angular/core';
import {
  DialogService,
  AlertService,
  IDataGridEvent,
  IDataGridButtonEvent,
  ToastService,
} from '@sunedu/shared';
import { ComboList } from '@sunedu/shared';

import { RepresentanteStore } from '../stores/representante.store';
import { IAdministracionModelADM } from '../../stores/administracion.interface';
import { FormModalRepresentanteLegalComponent } from '../modals/form-modal-representante-legal.component';

import {
  IEntidad,
  RepresentanteLegal,
} from '../../entidades/stores/entidad.store.interface';
import { map, distinctUntilChanged, tap, skip } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../../../../workflow/src/app/modules/03-formulario/store/maestro/enumerado/enumerado.store';
import { EntidadStore } from '../../entidades/stores/entidad.store';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

@Component({
  selector: 'form-representante-legal',
  templateUrl: './form-representante-legal.component.html',
  styleUrls: [],
  providers: [RepresentanteStore],
})
export class FormRepresentanteLegalComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IAdministracionModelADM = null;
  readonly state$ = this.store.state$;

  entidad: IEntidad = null;
  entidades: IEntidad[] = [];
  entidadesEnum: ComboList;
  tipoDocumentoEnum: ComboList;
  seleccionoEntidad: boolean = false;
  esEditable: boolean = true;  

  constructor(
    private store: RepresentanteStore,
    private storeEnumerado: EnumeradoGeneralStore,
    public dialog: DialogService,
    private alert: AlertService,
    private toast: ToastService,
    private storeCurrent: AppCurrentFlowStore
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  handleLoadData = (e: IDataGridEvent) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    var items = this.entidad.representanteLegales;
    //console.log('CAYL handleLoadData', items);
    this.store.representanteBuscadorActions.fetchPageRepresentanteLegal( this.tipoDocumentoEnum,
      items,
      items?items.length:0,
      {
        page: pageRequest.page,
        skip: pageRequest.skip,
        orderBy: pageRequest.orderBy,
        orderDir: pageRequest.orderDir,
        pageSize: pageRequest.pageSize,
      });
  };

  handleClickNuevoRepresentanteLegal = () => {
    this.store.representanteModalActions.loadTipoDocumentoEnum(
      this.tipoDocumentoEnum
    );
    this.store.representanteModalActions.setModalNew(this.entidad);
    const dialogRef = this.dialog.openMD(FormModalRepresentanteLegalComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.entidadEvent.subscribe((entidad: IEntidad) => {
      if (entidad !== null) {
        // Mandar al back guardar la Entidad Completa aca!!!

        this.putRepresentantes(entidad.representanteLegales);
        this.sendToBack(entidad);
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.store.representanteModalActions.resetModalRepresentanteLegal();
    });
  };
  openModalUpdate = (id: string) => {
    this.store.representanteModalActions.loadTipoDocumentoEnum(
      this.tipoDocumentoEnum
    );
    this.store.representanteModalActions.setModalEdit(id, this.entidad);
    const dialogRef = this.dialog.openMD(FormModalRepresentanteLegalComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.entidadEvent.subscribe((entidad: IEntidad) => {
      if (entidad !== null) {
        // Mandar al back guardar la Entidad Completa aca!!!

        this.putRepresentantes(entidad.representanteLegales);

        this.sendToBack(entidad);
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.store.representanteModalActions.resetModalRepresentanteLegal();
    });
  };
  openModalConsultar = (id: string) => {
    this.store.representanteModalActions.loadTipoDocumentoEnum(
      this.tipoDocumentoEnum
    );
    this.store.representanteModalActions.setModalReadOnly(id, this.entidad);
    const dialogRef = this.dialog.openMD(FormModalRepresentanteLegalComponent);

    dialogRef.componentInstance.store = this.store;

    dialogRef.afterClosed().subscribe(() => {
      this.store.representanteModalActions.resetModalRepresentanteLegal();
    });
  };
  deleteRepresentanteLegal = (id: string) => {
    this.alert
      .open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          //console.log('CAYL old entidad',this.entidad);
          const index = this.entidad.representanteLegales.findIndex(
            (d) => d.id === id
          );

          let entidad = this.entidad.representanteLegales[index];
          
          const audit = new AppAudit(this.storeCurrent);
          entidad = audit.setDelete(entidad);

          //console.log('CAYL index',entidad);

          this.entidad.representanteLegales.forEach(element=>{
            if(element.id==entidad.id){
              element=entidad;
            }
          })

          //console.log('CAYL new entidad',this.entidad);

          //this.entidad.representanteLegales.splice(index, 1);
          // Mandar al back guardar la Entidad Completa aca!!!
          this.putRepresentantes(this.entidad.representanteLegales);
          //this.onGetRepresentantes();
          this.sendToBack(this.entidad);
        }
      });
  };
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item.id);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item.id);
        break;
      case 'ELIMINAR':
        this.deleteRepresentanteLegal(e.item.id);
        break;
    }
  };

  // Combo Cambia universidades
  handleInputChange = ({ name, value }) => {
    this.putRepresentantesByEntidad(value, this.entidades);
  };

  //#region Private Methods

  private loadInitialData = () => {
    /*
    this.storeEntidad.entidadBuscadorActions
      .getEntidadesFromState()
      .subscribe((resp) => {
        //console.log(resp);
      });
      */
    this.entidadesEnum = new ComboList([]);

    // Enumerado
    this.storeEnumerado.currentEnumeradoActions
      .getEnumeradoByNombre('ENU_IDTIPODOCUMENTO')
      .then(resp => {
        this.tipoDocumentoEnum = resp;
      });

    this.store.representanteBuscadorActions
      .asyncFetchEntidades()
      .pipe(
        tap((response) => {
          this.entidades = response;
          // Armar Combo universidades
          if (response.length > 0) {
            const list = [];
            response.map((element) => {
              list.push({
                value: element.id,
                text: element.nombre,
              });
            });
            this.entidadesEnum = new ComboList(list);
          }
        })
      )
      .subscribe();
  };

  private putRepresentantesByEntidad = (id: string, entidades: IEntidad[]) => {
    //console.log('CAYL putRepresentantesByEntidad', id,entidades);
    // Representantes de la universidad seleccionada
    const ent = entidades.find((x) => x.id === id);
    this.entidad = ent;
    this.seleccionoEntidad = true;
    this.esEditable = ent.esEditable;
    this.putRepresentantes(ent.representanteLegales);
  };

  private putRepresentantes = (items: Array<RepresentanteLegal>) => {
    const { gridSource } = this.store.state.buscadorRepresentante;

    this.store.representanteBuscadorActions.fetchPageRepresentanteLegal(
      this.tipoDocumentoEnum,
      items,
      1,
      {
        page: 1,
        skip: 0,
        orderBy: gridSource.orderBy,
        orderDir: gridSource.orderDir,
        pageSize: gridSource.pageSize,
      }
    );
  };

  private sendToBack = (entidad: IEntidad) => {
    this.store.representanteModalActions
      .asynUpdateEntidad(entidad)
      .pipe(
        tap((response) => {
          /*if (response.success) {
            //this.onGetRepresentantes();
            this.toast.success(response.message);
          } else {
            this.toast.warning(response.message);
          }*/
        })
      )
      .subscribe();
  };

  // onGetRepresentantes=()=>{
  //   this.store.representanteBuscadorActions
  //     .asyncFetchEntidades().pipe(map(
  //       entidades=>{
  //         if(entidades){
  //           this.entidades = entidades;
  //           const entidad = this.entidades.find(x=>x.id==this.entidad.id);
  //           this.entidad = entidad;
  //           // const pageRequest = {
  //           //   page: 1,
  //           //   pageSize: 10,
  //           //   orderBy: 'rowNum',
  //           //   orderDir: 'asc',
  //           //   skip:0
  //           // };
  //           // this.handleLoadData(pageRequest);
            
  //         }
          
  //       }
  //     ))
  // }
  //#endregion
}
