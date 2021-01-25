import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SolicitudStore } from '../../../store/solicitud/solicitud.store';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormModel, FormType, ISubmitOptions } from '@sunedu/shared';
import { ProgramaSeStore } from '../../../store/programase/programase.store';
import { IEntidadBuscador } from '../../../store/programase/programase.store.interface';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { ProgramaSeBuscadorActions } from './../../../store/programase/actions/programase.buscador.action';
@Component({
  selector: 'app-form-buscar-programa-se',
  templateUrl: './app-form-buscar-programa-se.component.html',
  styleUrls: ['./app-form-buscar-programa-se.component.scss']
})
export class AppFormBuscarProgramaSeComponent implements OnInit {
  @Output('on-click-nuevo') onClickNuevoEvent: EventEmitter<any> = new EventEmitter();
  form: FormModel<IEntidadBuscador>;
  readonly state$ = this.store.state$.pipe(map(x => x.buscadorProgramaSe), distinctUntilChanged());
  subscriptions: Subscription[];
  constructor(
    private formBuilder: FormBuilder,
    private store: ProgramaSeStore,
    private storeEnumerado: EnumeradoGeneralStore,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.subscribeToState();
    //this.loadCombos();
  }
  private loadCombos = () => {
    /*forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDMODALIDADESTUDIO'),
    ).pipe(tap(enums => {
      this.store.programaSeBuscadorActions.asyncFetchCombos(enums);
    })).subscribe();*/
  }
  private buildForm = () => {
    //console.log('buildForm');
    const { form } = this.store.state.buscadorProgramaSe;

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
    const subs = this.store.state$.pipe(map(x => x.buscadorProgramaSe.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  handleSearch = (formValue: any, options: ISubmitOptions) => {
    //console.log(formValue);
    this.store.programaSeBandejaActions.asyncFetchPageSearch(formValue).subscribe(
      response =>{
        //this.store.ProgramaSeBandejaActions.ngon
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
