import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { RepresentanteLegalComponent } from './container/representante-legal.component';
import { FormRepresentanteLegalComponent } from './components/form-representante-legal.component';
import { FormModalRepresentanteLegalComponent } from './modals/form-modal-representante-legal.component';
import { NumberLettersOnlyDirective } from '@lic/workflow/app/modules/03-formulario/store/maestropersona/actions/NumberLettersOnlyDirective';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    RepresentanteLegalComponent
  ],
  declarations: [
    RepresentanteLegalComponent,
    FormRepresentanteLegalComponent,
    FormModalRepresentanteLegalComponent,
    NumberLettersOnlyDirective
  ],
  entryComponents: [
    FormModalRepresentanteLegalComponent
  ]
})
export class RepresentanteLegalModule { }
