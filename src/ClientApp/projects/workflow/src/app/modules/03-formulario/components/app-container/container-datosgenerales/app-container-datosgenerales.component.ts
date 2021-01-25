import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatosGeneralesStore } from '../../../store/datosgenerales/datosgenerales.store';
import { IFormularioModel } from '@lic/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMsgValidations, NoWhitespaceValidator, FormModel, IDataGridButtonEvent, IDataGridEvent, DialogService, AlertService } from '@sunedu/shared';
import { map } from 'rxjs/internal/operators/map';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { DatosGeneralesStoreModel } from '../../../store/datosgenerales/datosgenerales.store.model';
import { AppFormRepesentantelegalComponent } from '../../app-form/app-form-repesentantelegal/app-form-repesentantelegal.component';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
@Component({
  selector: 'app-container-datosgenerales',
  templateUrl: './app-container-datosgenerales.component.html',
  styleUrls: ['./app-container-datosgenerales.component.scss'],
  providers: [
    DatosGeneralesStore
  ]
})
export class AppContainerDatosgeneralesComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  readonly state$ = this.datosGeneralesStore.state$;

  readOnly:boolean = false;

  constructor(private datosGeneralesStore: DatosGeneralesStore
  ) { }

  ngOnInit() {
    this.readOnly=this.configTab.readOnly || this.modelData.formulario.subsanacionReadonly;
  }


  handleChangeInput = e => {
    //console.log(e);
  }

  handleClickGuardar = () => {
  }

  handleLoadData = (e: IDataGridEvent) => {
  }

}
