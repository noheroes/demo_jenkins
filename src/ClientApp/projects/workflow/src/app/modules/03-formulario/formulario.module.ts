import { DocumentosConsultaService } from './service/documentos-consulta.service';
import { AppContainerDocumentosOperacionModule } from './components/app-container/container-documentos-operacion/app-container-documentos-operacion.module';
import { AppContainerDocumentosConsultaModule } from './components/app-container/container-documentos-consulta/app-container-documentos-consulta.module';
import { MaestroProgramaSegundaService } from './service/maestroprogramasegunda.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioRoutingModule } from './formulario-routing.module';
import { SharedModule } from '@sunedu/shared';
import { DatosGeneralesService } from './service/datos-generales.service';
import { AmbienteService } from './service/ambiente.service';
import { MallaCurricularService } from './service/mallacurricular.service';
import { RepresentanteLegalService } from './service/representantelegal.service';

import { AppGeneralModule } from '@lic/core';
import { FormularioComponent } from './formulario.component';
import { AppContainerSolicitudModule } from './components/app-container/container-solicitud/app-container-solicitud.module';
// import { AppContainerSolicitudFilialModule } from './components/app-container/container-solicitud-filial/app-container-solicitud-filial.module';

import { AppContainerDatosgeneralesModule } from './components/app-container/container-datosgenerales/app-container-datosgenerales.module';
import { AppContainerFormatoModule } from './components/app-container/container-formato/app-container-formato.module';
import { AppContainerMedioModule } from './components/app-container/container-medio/app-container-medio.module';
import { MediosVerificacionService } from './service/mediosverificacion.service';

//import { AppContainerDocumentosModule } from './components/app-container/container-documentos/app-container-documentos.module';
import { AppContainerRecibidosModule } from './components/app-container/container-recibidos/app-container-recibidos.module';
import { AppContainerEnviadosModule } from './components/app-container/container-enviados/app-container-enviados.module';
import { DocumentoService } from './service/documento.service';

import { AppContainerEquipoTrabajoModule } from './components/app-container/container-equipotrabajo/app-container-equipotrabajo.module';
import { EquipoTrabajoService } from './service/equipotrabajo.service';

import { SedeFilialService } from './service/sedefilial.service';
import { PresupuestoService } from './service/presupuesto.service';
// import { AppContainerPresupuestoModule } from './components/app-container-horizontal/container-presupuesto/app-container-presupuesto.module';
import { CursoService } from './service/curso.service';
import { LocalService } from './service/local.service';
import { InfraestructuraService } from './service/infraestructura.service';
import { EquipamientoService } from './service/equipamiento.service';
import { MaestropersonaService } from './service/maestropersona.service';
import { LaboratorioService } from './service/laboratorio.service';
import { MaestroFacultadService } from './service/maestrofacultad.service';
import { MaestroProgramaService } from './service/maestroprograma.service';
import { MaestroProgramaSeService } from './service/maestroprogramase.service';
import { RelacionDocenteService } from './service/relaciondocente.service';
import { ProgramaService } from './service/programa.service';
import { ProgramaSeService } from './service/programase.service';
import { TallerService } from './service/taller.service';
import { AppContainerFirmantesModule } from './components/app-container/container-firmantes/app-container-firmantes.module';
import { FirmantesService } from './service/firmantes.service';
import { AppContainerCargamasivaModule } from './components/app-container/container-cargamasiva/app-container-cargamasiva.module';
import { CargaMasivaService } from './service/cargamasiva.service';
import { AppContainerFirmarMedioModule } from './components/app-container/container-firmarmedio/app-container-firmarmedio.module';
import { AppContainerFinalizarActividadModule } from './components/app-container/container-finalizar-actividad/app-container-finalizar-actividad.module';
import { ArchivoTestigoService } from './service/archivoTestigo.service';
import { DocumentoEnviadoService } from './service/documento-enviado.service';
import { DocumentosOperacionService } from './service/documentos-operacion.service';
import { InfraestructuraCantidadesService } from './service/infraestructura-cantidades.service';

const IMPORTS_COMPONENTES_CORE = [AppGeneralModule];

const IMPORTS_COMPONENTES_TAB = [
  AppContainerDatosgeneralesModule,
  AppContainerFormatoModule,
  AppContainerMedioModule,
  AppContainerSolicitudModule,
  AppContainerFirmantesModule,
  AppContainerCargamasivaModule,
  AppContainerFirmarMedioModule,
  //AppContainerDocumentosModule,
  // AppContainerEnviadosModule,
  // AppContainerRecibidosModule,
  AppContainerDocumentosOperacionModule,
  AppContainerDocumentosConsultaModule,

  AppContainerFinalizarActividadModule,
  AppContainerEquipoTrabajoModule
];

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormularioRoutingModule,
    ...IMPORTS_COMPONENTES_CORE,
    ...IMPORTS_COMPONENTES_TAB,
  ],
  providers: [
    DatosGeneralesService,
    AmbienteService,
    MallaCurricularService,
    RepresentanteLegalService,
    MediosVerificacionService,
    SedeFilialService,
    CursoService,
    LocalService,
    PresupuestoService,
    InfraestructuraService,
    InfraestructuraCantidadesService,
    EquipamientoService,
    MaestropersonaService,
    LaboratorioService,
    MaestroFacultadService,
    MaestroProgramaService,
    MaestroProgramaSeService,
    MaestroProgramaSegundaService,

    ProgramaService,
    ProgramaSeService,
    RelacionDocenteService,
    // ProgramaService

    TallerService,
    FirmantesService,
    CargaMasivaService,
    //DocumentoService,
    DocumentosConsultaService,
    DocumentosOperacionService,
    DocumentoEnviadoService,
    EquipoTrabajoService,
    ArchivoTestigoService
  ],
})
export class FormularioModule { }
