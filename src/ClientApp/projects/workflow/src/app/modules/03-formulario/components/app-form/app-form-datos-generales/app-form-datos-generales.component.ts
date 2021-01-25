import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { DatosGeneralesStore } from '../../../store/datosgenerales/datosgenerales.store';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APP_FORM_VALIDATOR } from '@lic/core';

@Component({
  selector: 'app-form-datos-generales',
  templateUrl: './app-form-datos-generales.component.html',
  styleUrls: ['./app-form-datos-generales.component.scss']
})
export class AppFormDatosGeneralesComponent implements OnInit {
  @Input() validations: any;
  @Input() formGroup: FormGroup;
  constructor() {
  }

  ngOnInit() {
    //console.log(this.formGroup.controls);
    //this.buildValidators();
  }

  buildValidators(){
    let datos = this.formGroup.controls['tipoGestion'];
    let datosDoc = this.formGroup.controls['numeroDocumentoCreacion'];
    
    // console.log(datos);
    // console.log(this.validations);
    this.formGroup.controls['tipoGestion'].setValidators([Validators.required]);
    this.formGroup.controls['numeroDocumentoCreacion'].setValidators([Validators.pattern(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION)]);
    datos = this.formGroup.controls['tipoGestion'];
    datosDoc = this.formGroup.controls['numeroDocumentoCreacion'];
    // console.log(datos);
  }

  handleChangeInput = e => {
    //console.log(e);
  }
}
