import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SolicitudStore } from '../../../store/solicitud/solicitud.store';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { FormModel, FormType, ISubmitOptions } from '@sunedu/shared';
import { MallaCurricularStore } from '../../../store/mallacurricular/mallacurricular.store';
import { IFormBuscardorMallaCurricular } from '../../../store/mallacurricular/mallacurricular.store.interface';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Component({
  selector: 'app-form-buscar-mallacurricular',
  templateUrl: './app-form-buscar-mallacurricular.component.html',
  styleUrls: ['./app-form-buscar-mallacurricular.component.scss']
})
export class AppFormBuscarMallacurricularComponent implements OnInit {

  @Output('on-click-nuevo') onClickNuevoEvent: EventEmitter<any> = new EventEmitter();
  form: FormModel<IFormBuscardorMallaCurricular>;
  readonly state$ = this.store.state$.pipe(map(x => x.buscadorMallaCurricular), distinctUntilChanged());

  constructor(
    private formBuilder: FormBuilder,
    private store: MallaCurricularStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.contextProcedimiento();
    this.buildForm();
    this.loadCombos();
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.mallaCurricularModalActions.setInit(current.idVersionSolicitud);
  }


  private loadCombos = () => {
    forkJoin(
      this.store.mallaCurricularModalActions.asyncFetchAllProgramas()
    ).pipe(tap(enums => {
      this.store.mallaCurricularBuscadorActions.asyncFetchCombos(enums);
    })).subscribe();
  }

  private buildForm = () => {
    const { formBuscar } = this.store.state.buscadorMallaCurricular;
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
    const { source } = this.store.state.buscadorMallaCurricular;
    this.store.mallaCurricularBuscadorActions.asyncFetchPageMallaCurricular(source, formValue).subscribe();
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
  handleInputChange = () => {
  }
}
