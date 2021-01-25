import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { IActividadHeaderDefinition } from '../../../interfaces/actividad-layout.interface';
import { SuneduTemplateDirective } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';
@Component({
  selector: 'app-general-cabecera',
  templateUrl: './app-general-cabecera.component.html',
  styleUrls: ['./app-general-cabecera.component.scss'],
})
export class AppGeneralCabeceraComponent implements OnInit, AfterContentInit {
  // @Input() headerDefinition: IActividadHeaderDefinition;
  @Input() source: IFormularioModel;
  @Input() definition: IActividadHeaderDefinition;
  @Input() loading: boolean;
  // @Input() model: ISolicitud

  datetimeDefaultFormat: string = 'DD/MM/YYYY hh:mm a';

  // TEMPLATES
  customTemplates: any = {};

  @ContentChildren(SuneduTemplateDirective) templates: QueryList<
    SuneduTemplateDirective
  >;
  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.setHeadersTemplate();
  }
  private setHeadersTemplate = () => {
    this.definition.fields.forEach((e, i) => {
      if (e.custom) {
        const found = this.templates.find(
          (temp) => temp.getType() === e.custom
        );
        if (found) {
          this.customTemplates[i] = found.template;
        }
      }
    });
  };
}
