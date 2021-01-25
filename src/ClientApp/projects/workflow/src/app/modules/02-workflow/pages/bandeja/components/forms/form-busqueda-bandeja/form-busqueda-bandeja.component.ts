import { BandejaStore } from '../../../store/bandeja.store';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IMsgValidations, ValidateFormFields, ComboList } from '@sunedu/shared';
import { APP_FORM_VALIDATOR, AppSessionState } from '@lic/core';
import { ToastService, isNullOrEmptyArray } from '@sunedu/shared';
import { Store } from '@ngxs/store';
import { isNullOrUndefined } from 'util';
import { IFormBuscarBandeja } from '../../../store/bandeja.store.interface';

@Component({
  selector: 'app-form-busqueda-bandeja',
  templateUrl: './form-busqueda-bandeja.component.html',
  styleUrls: ['./form-busqueda-bandeja.component.scss'],
})
export class FormBusquedaBandejaComponent implements OnInit {
  readonly appSession$ = this.appStore
    .select(AppSessionState.session)
    .pipe(distinctUntilChanged());
  readonly state$ = this.store.state$.pipe(
    map((x) => x.buscadorBandeja),
    distinctUntilChanged()
  );

  @Output('on-click-nuevo') onClickNuevoEvent: EventEmitter<
    any
  > = new EventEmitter();

  @Output('on-click-exportar') onClickExportarEvent: EventEmitter<
    any
  > = new EventEmitter();

  form: FormGroup;
  msgValidations: IMsgValidations;
  procedimientos: ComboList;
  entidades: ComboList;
  procedimientosAll: any = [];

  modelBuscar: IFormBuscarBandeja = {
    idProcedimiento: null,
    idEntidad: null,
    numeroSolicitud: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private store: BandejaStore,
    private appStore: Store,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.buildValidations();
    await this.loadCombos();
  }

  buildForm = () => {
    this.form = this.formBuilder.group({
      idProcedimiento: [null],
      idEntidad: [null],
      numeroSolicitud: [
        null,
        [Validators.pattern(APP_FORM_VALIDATOR.LIC_RE_NUM_SOLICITUD)],
      ],
    });
  };

  private buildValidations = () => {
    this.msgValidations = {
      numeroSolicitud: [
        {
          name: 'pattern',
          message:
            'El formato de número de solicitud no es válido [ej: 1234-SOLPRO15 o 1234]',
        },
      ],
    };
  };

  HandleSubmit = () => {
    ValidateFormFields(this.form);

    if (!this.form.valid) {
      return false;
    }
    this.modelBuscar.numeroSolicitud = this.form.get('numeroSolicitud').value;

    this.store.actionGridBandeja
      .asyncFetchGetBandeja2(this.modelBuscar)
      .subscribe();
  };

  HandleLimpiar = () => {
    this.form.reset();
    this.modelBuscar.idProcedimiento = this.procedimientosAll;
    this.store.actionGridBandeja.resetFormBuscar();
    // this.store.actionGridBandeja.asyncFetchGetBandeja().subscribe();
  };
  HandleClickNuevo = () => {};

  loadCombos = () => {
    this.procedimientos = new ComboList([]);
    this.entidades = new ComboList([]);
    return new Promise((resolve) => {
      // Procedimientos

      this.store.actionGridBandeja.asyncFetchListarProcedimientos().then(() => {
        const p = this.store.state.buscadorBandeja.filterLists.idProcedimientos;
        const list = [];
        p.map((x) => {
          this.procedimientosAll.push(x.idFlujo);
          list.push({
            value: x.idFlujo,
            text: x.nombre,
          });
        });
        this.procedimientos = new ComboList(list);
        this.modelBuscar.idProcedimiento = this.procedimientosAll;
        resolve();
      });

      // Universidades
    });
  };
  handleInputChangeProcedimiento = ({ value }) => {
    if (isNullOrEmptyArray(value)) {
      this.modelBuscar.idProcedimiento = this.procedimientosAll;
    } else {
      this.modelBuscar.idProcedimiento = value;
    }
  };
  handleInputChangeEntidad = ({ value }) => {
    if (isNullOrUndefined(value)) {
      this.modelBuscar.idEntidad = null;
    } else {
      this.modelBuscar.idEntidad = value;
    }
  };
}
