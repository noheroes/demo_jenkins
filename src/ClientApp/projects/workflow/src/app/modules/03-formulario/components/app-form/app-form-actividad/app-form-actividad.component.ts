import { Component, OnInit } from '@angular/core';
import { CargaMasivaStore } from '../../../store/cargamasiva/cargamasiva.store';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IBuscardorCargaMasivaActividad } from '../../../store/cargamasiva/cargamasiva.store.interface';
import { FormType, AlertService, IDataGridButtonEvent } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { APP_CLOSE_MODAL } from '@lic/core';

@Component({
  selector: 'app-form-actividad',
  templateUrl: './app-form-actividad.component.html',
  styleUrls: ['./app-form-actividad.component.scss'],
  providers: [
    CargaMasivaStore
  ]
})
export class AppFormActividadComponent implements OnInit {
  store: CargaMasivaStore;
  state$: Observable<IBuscardorCargaMasivaActividad>;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormActividadComponent>,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.buscadorCargaMasivaActividad), distinctUntilChanged());
  }

  handleClose = () => {
    const { type } = this.store.state.buscadorCargaMasivaActividad;
    if (type !== FormType.CONSULTAR) {
      this.alert.open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, { confirm: true }).then(confirm => {
        if (confirm) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
  handleSubmit = () => {
    // this.form.submit();
  }
  handleClickButton = (e: IDataGridButtonEvent) => {
    // switch (e.action) {
    //   case 'ELIMINAR':
    //     this.handleDelete(e.item.id);
    //     break;
    // }
  }
}
