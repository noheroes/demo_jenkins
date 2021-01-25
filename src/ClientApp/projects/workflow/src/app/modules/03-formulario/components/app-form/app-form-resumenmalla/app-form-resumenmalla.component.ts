import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators } from '@sunedu/shared';
import { Observable, Subscription, from } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map } from 'rxjs/internal/operators/map';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { IModalResumenMalla } from '../../../store/mallacurricular/mallacurricular.store.interface';
import { MallaCurricularStore } from '../../../store/mallacurricular/mallacurricular.store';
import { APP_CLOSE_MODAL } from '@lic/core';

@Component({
  selector: 'app-app-form-resumenMalla',
  templateUrl: './app-form-resumenmalla.component.html',
  styleUrls: ['./app-form-resumenmalla.component.scss']
})
export class AppFormResumenMallaComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalResumenMalla>;
  store: MallaCurricularStore;
  state$: Observable<IModalResumenMalla>;
  subscriptions: Subscription[];
  validators: any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormResumenMallaComponent>,
    private toast: ToastService,
    private alert: AlertService
  ) { }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalResumenMalla), distinctUntilChanged());
    this.buildForm();
    this.subscribeToState();
  }
  private loadCombos = () => {
  };
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalResumenMalla.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalResumenMalla;
    this.form = new FormModel<any>(
      type,
      form,
      this.validators,
      {
      }
    );
  }


  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalResumenMalla;
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

}
