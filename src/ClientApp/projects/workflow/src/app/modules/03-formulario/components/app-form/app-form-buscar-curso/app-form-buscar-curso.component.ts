import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { FormModel, FormType, ISubmitOptions } from '@sunedu/shared';
import { IFormBuscardorCurso } from '../../../store/curso/curso.store.interface';
import { CursoStore } from '../../../store/curso/curso.store';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';



@Component({
  selector: 'app-form-buscar-curso',
  templateUrl: './app-form-buscar-curso.component.html',
  styleUrls: ['./app-form-buscar-curso.component.scss']
})
export class AppFormBuscarCursoComponent implements OnInit {
  form: FormModel<IFormBuscardorCurso>;
  readonly state$ = this.store.state$.pipe(map(x => x.buscadorCurso), distinctUntilChanged());

  constructor(
    private formBuilder: FormBuilder,
    private store: CursoStore,
    private storeEnumerado: EnumeradoGeneralStore
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadCombos();
  }
  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOPERIODOACADEMICO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_TIPOESTUDIO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_TIPOCURSO'),
    ).pipe(
      tap(enums => {
        this.store.cursoBuscadorActions.asyncFetchCombos(enums);
      })).subscribe();
  }
  private buildForm = () => {
    const { formBuscar } = this.store.state.buscadorCurso;
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
    const { source } = this.store.state.buscadorCurso;
    this.store.cursoBuscadorActions.asyncFetchPageCurso(source, formValue).subscribe();
  }

  HandleSubmit = () => {
    this.form.submit();
  }

  HandleLimpiar = () => {
    this.form.reset();
  }


  handleInputChange = ({ name, value }) => {

  }
}
