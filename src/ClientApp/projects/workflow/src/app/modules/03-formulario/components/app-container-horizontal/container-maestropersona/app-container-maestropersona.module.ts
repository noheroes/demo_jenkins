import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerMaestroperosnaComponent } from './app-container-maestroperosna.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormMaestroPersonaComponent } from '../../app-form/app-form-maestro-persona/app-form-maestro-persona.component';
import { AppFormGradoacademicoComponent } from '../../app-form/app-form-gradoacademico/app-form-gradoacademico.component';
import { AppFormProgramadocenteComponent } from '../../app-form/app-form-programadocente/app-form-programadocente.component';
import { AppFormHorarioactividadComponent } from '../../app-form/app-form-horarioactividad/app-form-horarioactividad.component';
import { AppFormNodocenteComponent } from '../../app-form/app-form-nodocente/app-form-nodocente.component';
import { AppFormAgregarPersonaComponent } from '../../app-form/app-form-agregar-persona/app-form-agregar-persona.component';
import { AppFormProgramanodocenteComponent } from '../../app-form/app-form-programanodocente/app-form-programanodocente.component';
import { NumberLettersOnlyDirective } from '../../../store/maestropersona/actions/NumberLettersOnlyDirective';
import { LettersSpaceOnlyDirective } from '../../../store/maestropersona/actions/LettersSpaceOnlyDirective';


@NgModule({
  declarations: [AppContainerMaestroperosnaComponent,
    AppFormMaestroPersonaComponent,
    AppFormGradoacademicoComponent,
    AppFormProgramadocenteComponent,
    AppFormProgramanodocenteComponent,
    AppFormHorarioactividadComponent,
    AppFormNodocenteComponent,
    AppFormAgregarPersonaComponent,
    NumberLettersOnlyDirective,
    LettersSpaceOnlyDirective],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerMaestroperosnaComponent],
  entryComponents: [AppFormMaestroPersonaComponent,
    AppFormGradoacademicoComponent,
    AppFormProgramadocenteComponent,
    AppFormProgramanodocenteComponent,
    AppFormHorarioactividadComponent,
    AppFormNodocenteComponent]
})
export class AppContainerMaestropersonaModule { }
