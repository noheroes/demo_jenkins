import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FormModel, FormType, ISubmitOptions } from '@sunedu/shared';
import { IFormBuscardorEquipamiento } from '../../../store/equipamiento/equipamiento.store.interface';
import { EquipamientoStore } from '../../../store/equipamiento/equipamiento.store';


@Component({
  selector: 'app-form-buscar-equipamiento',
  templateUrl: './app-form-buscar-equipamiento.component.html',
  styleUrls: ['./app-form-buscar-equipamiento.component.scss']
})
export class AppFormBuscarEquipamientoComponent implements OnInit {

  @Output('on-click-nuevo') onClickNuevoEvent: EventEmitter<any> = new EventEmitter();
  form: FormModel<IFormBuscardorEquipamiento>;
  readonly state$ = this.store.state$.pipe(map(x => x.buscadorEquipamiento), distinctUntilChanged());

  constructor(
    private formBuilder: FormBuilder,
    private store: EquipamientoStore
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm = () => {
    const { formBuscar } = this.store.state.buscadorEquipamiento;
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
    const { source } = this.store.state.buscadorEquipamiento;
    this.store.equipamientoModalActions.asyncFetchPageEquipamientoSucces(source, formValue).subscribe();
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
