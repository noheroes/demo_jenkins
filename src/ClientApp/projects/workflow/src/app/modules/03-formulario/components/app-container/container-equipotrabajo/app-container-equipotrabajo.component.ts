import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IFormularioModel } from '@lic/core';
import { EquipoTrabajoStore } from '../../../store/equipotrabajo/equipotrabajo.store';


@Component({
  selector: 'app-container-equipotrabajo',
  templateUrl: './app-container-equipotrabajo.component.html',
  providers: [
    EquipoTrabajoStore
  ]
  //styleUrls: ['./app-container-medio.component.scss']
})
export class AppContainerEquipoTrabajoComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  //store: MedioVerificacionStore;
  subscriptions: Subscription[];

  readonly state$ = this.equipoTrabajoStore.state$;

  constructor(
    private equipoTrabajoStore: EquipoTrabajoStore,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  ngOnInit() {
    // console.log(this.configTab);
    // this.configTab.name='Medios de Verificación'; // Corrigiendo error de acento "�"
    // console.log(this.configTab);
    this.equipoTrabajoStore.equipoTrabajoActions.setInit(this.modelData);
    //this.buildValidations();
    //this.buildForm();
    this.subscribeToState();
  }

  subscribeToState = () => {
    const subs2 = this.equipoTrabajoStore.state$.pipe(map(x => x.asignacionEquipoModel), distinctUntilChanged())
      .subscribe(x => {
        // this.form.get('formDatosGenerales').patchValue(x.formDatosGenerales);
        // this.form.get('formDomicilioLegal').patchValue(x.formDomicilioLegal);
        // this.form.get('formPromotora').patchValue(x.formPromotora);
      });
    this.subscriptions = [subs2];
  }

}
