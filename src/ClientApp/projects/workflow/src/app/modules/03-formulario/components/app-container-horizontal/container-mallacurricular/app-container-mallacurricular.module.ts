import { AppFormPreRequisitoComponent } from './../../app-form/app-form-prerequisito/app-form-prerequisito.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerMallacurricularComponent } from './app-container-mallacurricular.component';

import { SharedModule } from '@sunedu/shared';
import { AppFormBuscarMallacurricularComponent } from '../../app-form/app-form-buscar-mallacurricular/app-form-buscar-mallacurricular.component';
import { AppFormMallacurricularComponent } from '../../app-form/app-form-mallacurricular/app-form-mallacurricular.component';
import { AppFormCursosComponent } from '../../app-form/app-form-cursos/app-form-cursos.component';
import { AppFormBuscarCursoComponent } from '../../app-form/app-form-buscar-curso/app-form-buscar-curso.component';
//import { AppFormResumenMallaComponent } from '../../app-form/app-form-resumenmalla/app-form-resumenmalla.component';
import { AppFormHorariolectivoComponent } from '../../app-form/app-form-horariolectivo/app-form-horariolectivo.component';

@NgModule({
  declarations: [AppContainerMallacurricularComponent,
                  AppFormMallacurricularComponent,
                  AppFormBuscarMallacurricularComponent,
                  AppFormCursosComponent,
                  AppFormBuscarCursoComponent,
                  AppFormHorariolectivoComponent,
                  AppFormPreRequisitoComponent
                 ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerMallacurricularComponent],
  entryComponents:[
    AppFormMallacurricularComponent,
    AppFormCursosComponent,
    AppFormHorariolectivoComponent,
    AppFormPreRequisitoComponent
  ]
})
export class AppContainerMallacurricularModule { }
