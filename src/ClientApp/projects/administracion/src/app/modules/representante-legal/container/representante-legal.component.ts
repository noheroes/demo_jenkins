import { Component, Input } from '@angular/core';
import { IAdministracionModelADM } from '../../stores/administracion.interface';

@Component({
  selector: 'app-container-representante-legal',
  templateUrl: './representante-legal.component.html',
})
export class RepresentanteLegalComponent {
  @Input() configTab: any = null;
  @Input() modelData: IAdministracionModelADM = null;
}
