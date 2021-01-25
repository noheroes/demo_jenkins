import { ProgramaBuscadorActions } from './../../../store/programa/actions/programa.buscador.action';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SolicitudStore } from '../../../store/solicitud/solicitud.store';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormModel, FormType, ISubmitOptions } from '@sunedu/shared';
import { ProgramaStore } from '../../../store/programa/programa.store';
import { IEntidadBuscador } from '../../../store/programa/programa.store.interface';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';

@Component({
  selector: 'app-form-buscar-programa',
  templateUrl: './app-form-buscar-programa.component.html',
  styleUrls: ['./app-form-buscar-programa.component.scss']
})
export class AppFormBuscarProgramaComponent implements OnInit {
  @Output('on-click-nuevo') onClickNuevoEvent: EventEmitter<any> = new EventEmitter();
  form: FormModel<IEntidadBuscador>;
  readonly state$ = this.store.state$.pipe(map(x => x.buscadorPrograma), distinctUntilChanged());
  subscriptions: Subscription[];
  constructor(
    private formBuilder: FormBuilder,
    private store: ProgramaStore,
    private storeEnumerado: EnumeradoGeneralStore,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDMODALIDADESTUDIO'),
    ).pipe(tap(enums => {
      this.store.programaBuscadorActions.asyncFetchCombos(enums);
    })).subscribe();
  }
  private buildForm = () => {
    //console.log('buildForm');
    const { form } = this.store.state.buscadorPrograma;

    this.form = new FormModel(
      FormType.BUSCAR,
      form,
      null,
      {
        onSearch: this.handleSearch
      }
    );
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.buscadorPrograma.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  handleSearch = (formValue: any, options: ISubmitOptions) => {
    //console.log(formValue);
    this.store.programaBandejaActions.asyncFetchPageSearch(formValue).subscribe(
      response =>{
        //this.store.programaBandejaActions.ngon
      }
    );
  }
  HandleSubmit = () => {
    //console.log('HandleSubmit');
    this.form.submit();
  }

  HandleLimpiar = () => {
    this.form.reset();
  }

  HandleClickNuevo = () => {
    //this.onClickNuevoEvent.emit();
  }
  handleInputChange = ({ name, value }) => {

  }
}
