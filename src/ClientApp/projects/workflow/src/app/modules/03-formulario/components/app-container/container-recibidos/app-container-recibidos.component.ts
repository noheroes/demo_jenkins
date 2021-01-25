import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IFormularioModel } from '@lic/core';
import { DocumentoStore } from '../../../store/documento/documento.store';


@Component({
  selector: 'app-container-recibidos',
  templateUrl: './app-container-recibidos.component.html',
  providers: [
    DocumentoStore
  ]
  //styleUrls: ['./app-container-medio.component.scss']
})
export class AppContainerRecibidosComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  subscriptions: Subscription[];

  readonly state$ = this.documentoStore.state$;

  constructor(
    private documentoStore: DocumentoStore,
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
    this.documentoStore.documentoActions.setInit(this.modelData);
    //this.buildValidations();
    //this.buildForm();
    this.subscribeToState();
  }

  subscribeToState = () => {
    const subs2 = this.documentoStore.state$.pipe(map(x => x.documentosPorFasesOrigen), distinctUntilChanged())
      .subscribe(x => {
        // this.form.get('formDatosGenerales').patchValue(x.formDatosGenerales);
        // this.form.get('formDomicilioLegal').patchValue(x.formDomicilioLegal);
        // this.form.get('formPromotora').patchValue(x.formPromotora);
      });
    this.subscriptions = [subs2];
  }

}
