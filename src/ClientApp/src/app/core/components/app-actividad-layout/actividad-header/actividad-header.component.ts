import { IActividadHeaderDefinition } from './../actividad-layout.interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-actividad-header',
  templateUrl: './actividad-header.component.html',
  styleUrls: ['./actividad-header.component.scss']
})
export class ActividadHeaderComponent implements OnInit {

  @Input() source: any;
  @Input() definition: IActividadHeaderDefinition;
  @Input() templates: any;
  @Input() loading: boolean;

  datetimeDefaultFormat: string = 'DD/MM/YYYY HH:mm:ss';

  constructor() { }

  ngOnInit() {
  }

}
