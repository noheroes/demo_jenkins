import { Component, Input } from '@angular/core';
import { IAdministracionModelADM } from '../../stores/administracion.interface';

@Component({
  selector: 'app-container-entidades',
  templateUrl: './entidades.component.html',
})
export class EntidadesComponent {
  @Input() configTab: any = null;
  @Input() modelData: IAdministracionModelADM = null;
}
