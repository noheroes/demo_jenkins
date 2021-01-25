import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-container-solicitud',
  templateUrl: './app-container-solicitud.component.html',
  styleUrls: ['./app-container-solicitud.component.scss']
})
export class AppContainerSolicitudComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: any = null;
  /**
   *
   */
  constructor() { }

  ngOnInit() {
  }

}
