import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-container-solicitud-filial',
  templateUrl: './app-container-solicitud-filial.component.html',
  styleUrls: ['./app-container-solicitud-filial.component.scss']
})
export class AppContainerSolicitudFilialComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: any = null;
  /**
   *
   */
  constructor() {
  }

  ngOnInit() {
  }

}
