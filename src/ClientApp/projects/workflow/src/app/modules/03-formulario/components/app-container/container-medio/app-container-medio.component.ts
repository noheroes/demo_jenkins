import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IFormularioModel } from '@lic/core';
import { MediosVerificacionStore } from '../../../store/mediosverificacion/mediosverificacion.store';


@Component({
  selector: 'app-container-medio',
  templateUrl: './app-container-medio.component.html',
  providers: [
    MediosVerificacionStore
  ]
  //styleUrls: ['./app-container-medio.component.scss']
})
export class AppContainerMedioComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  //store: MedioVerificacionStore;
  subscriptions: Subscription[];
  readOnly:boolean=false;

  readonly state$ = this.mediosVerificacionStore.state$;

  constructor(
    private mediosVerificacionStore: MediosVerificacionStore,
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
    this.mediosVerificacionStore.mediosVerificacionActions.setInit(this.modelData);
    this.readOnly=this.configTab.readOnly || this.modelData.formulario.subsanacionReadonly;;
    //this.buildValidations();
    //this.buildForm();
    this.subscribeToState();
  }

  subscribeToState = () => {
    const subs2 = this.mediosVerificacionStore.state$.pipe(map(x => x.mediosVerificacion), distinctUntilChanged())
      .subscribe(x => {
        // this.form.get('formDatosGenerales').patchValue(x.formDatosGenerales);
        // this.form.get('formDomicilioLegal').patchValue(x.formDomicilioLegal);
        // this.form.get('formPromotora').patchValue(x.formPromotora);
      });
    this.subscriptions = [subs2];
  }

}
