import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FormModel, FormType, ISubmitOptions } from '@sunedu/shared';
import { IFormBuscardorInfraestructura } from '../../../store/infraestructura/infraestructura.store.interface';
import { InfraestructuraStore } from '../../../store/infraestructura/infraestructura.store';


@Component({
  selector: 'app-form-buscar-infraestructura',
  templateUrl: './app-form-buscar-infraestructura.component.html',
  styleUrls: ['./app-form-buscar-infraestructura.component.scss']
})
export class AppFormBuscarInfraestructuraComponent implements OnInit {

  @Output('on-click-nuevo') onClickNuevoEvent: EventEmitter<any> = new EventEmitter();
  form: FormModel<IFormBuscardorInfraestructura>;
  readonly state$ = this.store.state$.pipe(map(x => x.buscadorInfraestructura), distinctUntilChanged());

  constructor(
    private formBuilder: FormBuilder,
    private store: InfraestructuraStore
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm = () => {
    const { formBuscar } = this.store.state.buscadorInfraestructura;
    this.form = new FormModel(
      FormType.BUSCAR,
      formBuscar,
      null,
      {
        onSearch: this.handleSearch
      }
    );

  }
  handleSearch = (formValue: any, options: ISubmitOptions) => {
    const { source } = this.store.state.buscadorInfraestructura;
    this.store.infraestructuraBuscadorActions.asyncFetchPageInfraestructuraSucces(source, formValue).subscribe();
  }

  HandleSubmit = () => {
    this.form.submit();
  }

  HandleLimpiar = () => {
    this.form.reset();
  }

  HandleClickNuevo = () => {
    this.onClickNuevoEvent.emit();
  }
  handleInputChange = ({ name, value }) => {

  }
}
