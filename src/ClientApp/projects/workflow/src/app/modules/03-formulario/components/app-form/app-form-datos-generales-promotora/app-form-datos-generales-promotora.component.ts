import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-datos-generales-promotora',
  templateUrl: './app-form-datos-generales-promotora.component.html',
  styleUrls: ['./app-form-datos-generales-promotora.component.scss']
})
export class AppFormDatosGeneralesPromotoraComponent implements OnInit {
  @Input() validations: any;
  @Input() formGroup: FormGroup;
  constructor() { }

  ngOnInit() {
  }
  handleChangeInput = e => {
    //console.log(e);
  }
}
