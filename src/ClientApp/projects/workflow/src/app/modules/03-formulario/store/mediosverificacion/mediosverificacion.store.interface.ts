import { IComboList, FormType } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';

export interface IFile {
  fileName: string;
  fileDate: string;
  fileVersion: string;
  estado: string;
  esIdArchivo: boolean;
  idArchivo?: string;
  trackingNumber?: string;
  idUsuario?: string;
  idAplicacion?: string;
  version?: number;
  idContenido?: number;
}

export interface IComentario {
  idComentario: string;
  idProceso: string;
  idUsuarioAutor: string;
  idRolAutor: string;
  usuarioAutorDescripcion: string;
  rolAutorDescripcion: string;
  esRolAdministrado: true;
  mensaje: string;
  fechaRegistro: string;
  clase?: string;
  derecha?: boolean;
  allowDelete?: boolean;
}

export interface IContenidoArchivoFileInfo {
  idArchivo: string;
  nombreOficial: string;
  nombre: string;
  contentType: string;
  pesoEnBytes: number;
  usuarioCreacion: string;
  fechaCreacion: string;
  historialVersiones: IHistorialVersiones[];
  lastVersion?: number;
}

export interface IHistorialVersiones {
  version: number;
  nombre: string;
  contentType: string;
  pesoEnBytes: number;
  usuarioCreacion: string;
  fechaCreacion: string;
}

export interface IContenidoArchivoMetaData {
  trackingNumber: string;
  estadoRS: number;
  formatoArchivoContenidoEnum: number;
  archivoNombre: string;
  archivoContentType: string;
  archivoPesoEnBytes: number;
  causaErrorProceso: string;
  mensajeToolTip?: string;
}

export interface IContenido {
  id: string;
  idCondicion: number;
  idComponente: number;
  idIndicador: number;
  idMedioVerificacion: number;
  idTipoMedioVerificacion: number;
  contenido: string;
  estadoContenidoEnum: number;
  contenidoArchivoFileInfo: IContenidoArchivoFileInfo; //<< OJO FALTA ESTRUCTURA
  contenidoArchivoMetadata: IContenidoArchivoMetaData;
  comentariosCount: number;
  comentarios: IComentario[];

  contenidoVersion?:number;

  esIdArchivo: boolean;
  idUsuario?: string;
  idAplicacion?: string;

  estado: string;
  nombreArchivo: string;
  fechaArchivo: string;
  versionArchivo: string;
  intentosRefresh?:number;
}

export interface ITreeNode {
  codigo: string;
  descripcion: string;
  nivel: number; // 1=CBC 2=Com 3=Ind 4=MV
  isCompleteTask: boolean;

  parent?: string;
  id?: string;
  idCondicion?: number;
  idComponente?: number;
  idIndicador?: number;
  idMedioVerificacion?: number;
  isExpanded?: boolean;
  totalCompleteTask?: number;
  totalTask?: number;
  hasDescriptionChild?: string;
  tipo?: number;
  esObligatorio?: boolean;
  excludeTask?: boolean;
  filterFile?: string;
  idFile?: string;
  url?: string;
  canDeleteUrl?:boolean;
  codigos?: string;
  allowDeleteUrl?: boolean;

  contenidos: IContenido[];
  //files?:IFile[];

  children: ITreeNode[];
}

// export var demoData: ITreeNode[] = [
//   {
//     id: 'CBC I',
//     descripcion:'Propuesta Económica',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com I.1',
//         descripcion:'Legalidad',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 1',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios cuenta con un documento de aprobación de acuerdo con lo establecido en la Ley Universitaria, el Estatuto de la universidad y que corresponda al marco normativo nacional vigente.',
//             isCompleteTask:false,
//             parent:'Com I.1',
//             children:[
//               {
//                 id:'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Resolución de Creación o Autorización de funcionamiento del programa (2)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 1',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com I.2',
//         descripcion:'Objetivos de la Facultad/Escuela',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 2',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Facultad/Escuela cuenta con propósitos u objetivos propios, definidos y aprobados.',
//             isCompleteTask:false,
//             parent:'Com I.2',
//             children:[
//               {
//                 id:'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento aprobado por la autoridad competente que evidencie los objetivos del programa, así como los objetivos de la Facultad/Escuela. (3)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 2',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com I.3',
//         descripcion:'Organización académica',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 3',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Facultad/Escuela en la que se encuentra el programa debe contar con un Consejo de facultad o un órgano de gobierno equivalente. El Decano, Director o equivalente es el responsable de la organización académica del programa y ha sido elegido o designado, según sea el caso, de manera legítima y válida, según los requisitos establecidos en la Ley Universitaria, el Estatuto de la universidad y la normativa vigente.',
//             isCompleteTask:false,
//             parent:'Com I.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documentos aprobados por la autoridad competente que evidencien la conformación y funcionamiento del Consejo de Facultad u órgano de gobierno equivalente (4)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Resolución de la elección, nombramiento o encargatura del responsable académico del programa de acuerdo con el Estatuto de la Universidad (5)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento que acredite el cumplimiento de los requisitos para ejercer el cargo de responsable del programa (6)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reglamento y/o Manual de Organización y Funciones de la Facultad/ Escuela o documento normativo equivalente aprobado por la autoridad competente que norme las funciones del responsable del programa (7)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 4',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Facultad a la que pertenece el Programa y/o Escuela de Medicina cuenta con: a. Departamentos o Unidades académicas según la estructura establecida b. Normatividad para el desarrollo de las actividades académicas y de investigación de docentes y estudiantes c. Plan de Gestión del programa de pregrado de medicina',
//             isCompleteTask:false,
//             parent:'Com I.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reglamento y/o Manual de Organización y Funciones de la Facultad o documento normativo equivalente que especifique los departamentos, escuelas profesionales o unidades académicas, aprobado por la autoridad competente (7)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 4',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Organigrama de la Facultad, aprobado por autoridad competente (7)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 4',
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento(s) aprobado(s) por autoridad competente que norma(n) el desarrollo de las actividades académicas y de investigación de docentes y estudiantes del programa de medicina (8)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 4',
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de Gestión del programa de estudios, que muestre coherencia entre los fines, objetivos, actividades y recursos, aprobados por la autoridad competente (9)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 4',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com I.4',
//         descripcion:'Plan de estudios',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 5',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa cuenta con un Plan de Estudios que debe estar aprobado por la autoridad competente, y su fecha de actualización o ratificación no debe ser mayor a tres (3) años. Además, cuenta con un responsable de la gestión curricular acorde con el contenido del plan de estudios.',
//             isCompleteTask:false,
//             parent:'Com I.4',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de Estudios vigente del Programa de Medicina y su resolución de aprobación (10)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 5',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento aprobado por autoridad competente que acredite la existencia de una instancia responsable de la gestión del Plan de Estudios (12)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 5',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 6',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La malla curricular del programa presenta adecuadamente la organización por ciclos, la secuencia de los cursos y establece los créditos: a) Los estudios generales cubren las necesidades de formación general de los estudiantes y tienen un mínimo de 35 créditos. b) Las asignaturas específicas y de especialidad de pregrado cubren las necesidades de formación específica para el ejercicio de la profesión médica. Se realiza con el cumplimiento de 245 créditos, como mínimo. c) Las prácticas en servicio comprenden créditos correspondientes a los estudios clínicos e internado. Se realizan en los campos clínicos, de gestión y sociosanitarios de los establecimientos de salud (niveles I, II y III) con los que la Facultad/Escuela tiene convenios específicos de cooperación.',
//             isCompleteTask:false,
//             parent:'Com I.4',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Malla curricular con detalle de créditos y número de horarios por asignatura vigentes según Formato P2-Sunedu (y su sub formato P2.1) (11)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 6',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Relación de docentes tutores para las prácticas clínicas en establecimientos de salud según Formato P3-Sunedu (13)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 6',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com I.5',
//         descripcion:'Plana docente',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 7',
//             descripcion:'',
//             nivel:3,
//             isCompleteTask:false,
//             hasDescriptionChild:'El programa de estudios cuenta con un plan de selección de docentes que acredite el cumplimiento del marco legal vigente (p.ej. Ley Universitaria, Ley N° 29988) para disponer de una plana docente calificada.',
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento que contenga el último plan de selección de docentes para el ciclo o año académico en curso, para satisfacer las necesidades del alumnado y las asignaturas ofrecidas, de acuerdo a los procedimientos de selección y contratación docente establecidas por la universidad y la normatividad vigente (p.ej. Ley Universitaria, Ley 29988) (15)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 7',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documentos que evidencien la implementación del plan de selección de docentes (15)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 7',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 8',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios cuenta con docentes, principalmente médicos, con grado de maestro y/o título de segunda especialidad y/o doctor. El número de docentes debe estar acorde con el número de estudiantes para las asignaturas impartidas.',
//             isCompleteTask:false,
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Relación de docentes del programa actualizado al periodo vigente, según Formato P4-Sunedu (14)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 8',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Número de horarios por asignatura según sub formato P2.1-Sunedu (11)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 8',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 9',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios cuenta con docentes a tiempo completo con labores en docencia, investigación, gestión o proyección social. El número mínimo de docentes a tiempo completo resulta de la división del 10% de las horas lectivas y no lectivas del programa entre 40 horas (dedicación de los docentes a tiempo completo).',
//             isCompleteTask:false,
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Padrón docente actualizado al periodo vigente, según Formato P4-Sunedu (14)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 9',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 10',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios asegura un (1) docente tutor para un máximo de: cinco (5) estudiantes para la práctica clínica y diez (10) estudiantes para la práctica comunitaria, con no más de dos (2) estudiantes por paciente.',
//             isCompleteTask:false,
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato P2 y sub formato P2.1 (11)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 10',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Convenios celebrados entre la Facultad o Escuela con los establecimientos de salud para la autorización de acceso a los campos clínicos, socio sanitarios y de gestión (20)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 10',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 11',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios asegura no más de quince (15) estudiantes por docente en las prácticas de laboratorio en los laboratorios del programa a cargo de la universidad.',
//             isCompleteTask:false,
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato P2 y sub formato P2.1 (11)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 11',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 12',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Facultad/Escuela tiene y aplica un proceso de evaluación de la carrera docente que considera las exigencias particulares de la enseñanza en medicina, acorde al procedimiento institucional, con fines de nombramiento, promoción, renovación de contratos, ratificación y separación.',
//             isCompleteTask:false,
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Instrumento normativo, reglamento y/u otro documento que contenga los procedimientos de evaluación de la carrera docente en medicina (16)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 12',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documentos que evidencien la aplicación de los procedimientos (17)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 12',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 13',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Universidad o Facultad/Escuela tiene y aplica un plan de formación o capacitación continua de docentes del programa, que considere especialización en ámbitos como docencia universitaria, gestión, investigación, entre otros.',
//             isCompleteTask:false,
//             parent:'Com I.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de formación o capacitación continua de docentes del programa (18)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reporte de resultados del programa de formación continua o de capacitación de docentes (19)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com I.6',
//         descripcion:'Estudiantes',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 14',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios cuenta con información accesible y actualizada a través de su portal web sobre los siguientes aspectos: a) El número de vacantes para cada proceso de admisión y por modalidades de admisión b) Perfil del ingresante, que describe las condiciones y requisitos de acceso al programa y la objetividad y transparencia en los procesos de selección y admisión c) Condiciones de permanencia y culminación d) Desarrollo de las actividades académicas del programa e) Requisitos de graduación y titulación f) Condiciones de estudio g) Condiciones para realizar trabajos de investigación h) Información sobre las líneas de investigación i) Prevención de riesgos a los que pueden estar expuestos los estudiantes durante su formación',
//             isCompleteTask:false,
//             parent:'Com I.6',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Portal web de la Facultad o Escuela, dentro del dominio de la Universidad (21)',
//                 typeBodyChild:3,
//                 isCompleteTask:false,
//                 parent:'Ind 14',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento que formaliza el número de vacantes (y requisitos) al programa de medicina aprobado por la instancia correspondiente (22)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 14',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 'CBC II',
//     descripcion:'Gestión de la Investigación',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com II.1',
//         descripcion:'',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC II',
//         children:[
//           {
//             id:'Ind 15',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios desarrolla sus líneas de investigación declaradas y aprobadas en el Licenciamiento Institucional y dispone de presupuesto, infraestructura, equipos y recursos para tal fin.',
//             isCompleteTask:false,
//             parent:'Com II.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Líneas de investigación aprobadas (24)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Registro de proyectos de investigación (25)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Relación de laboratorios de investigación de dedicación exclusiva (si los tuviera) y su equipamiento principal según formato de Licenciamiento P6 (y su sub formato P6.14) (29)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 15',
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Presupuesto y ejecución presupuestaria del programa, Facultad, Escuela o Universidad donde se verifican los montos asignados a investigación en el programa (26)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento normativo que evidencia la existencia de un Comité de Ética (de la Universidad o de otra(s) institución(es) reconocida con la que se tiene convenio(s)), que evalúa los proyectos de investigación (27)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 16',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios cuenta con al menos 5% de docentes que realizan investigación y que están incluidos en los registros nacionales correspondientes de Concytec – Renacyt',
//             isCompleteTask:false,
//             parent:'Com II.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Padrón docente actualizado al periodo vigente, según Formato de Licenciamiento P4-Sunedu, que señala a los docentes que realizan investigación y a aquellos que están registrados de Concytec – Renacyt (14)',
//                 typeBodyChild:2,
//                 isCompleteTask:false,
//                 excludeTask:true,
//                 parent:'Ind 16',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 17',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios incorpora en sus planes de estudios asignaturas vinculadas a la formación para la investigación en forma secuencial.',
//             isCompleteTask:false,
//             parent:'Com II.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de estudios indicando las asignaturas vinculadas con la formación para la investigación y sus sumillas (10)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 17',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 18',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios establece que los estudiantes desarrollen investigaciones, preferentemente relacionadas con las líneas declaradas, con asesoría de sus profesores y conducentes a la obtención de grado académico o título universitario.',
//             isCompleteTask:false,
//             parent:'Com II.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'El programa de estudios establece que los estudiantes desarrollen investigaciones, preferentemente relacionadas con las líneas declaradas, con asesoría de sus profesores y conducentes a la obtención de grado académico o título universitario.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 19',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'El programa de estudios cuenta con material bibliográfico físico y acceso a bases de datos internacionales en el campo de la medicina.',
//             isCompleteTask:false,
//             parent:'Com II.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Acervo bibliográfico físico: lista codificada del material bibliográfico físico en la biblioteca disponible para los estudiantes, tesistas y docentes del programa (Para programas vigentes: Requisito 77 del artículo 15 del Reglamento de Licenciamiento institucional (Proceso de Licenciamiento Institucional). Para programas nuevos: Requisito 42 del artículo 30 del Reglamento de Licenciamiento Institucional (Procedimiento de Modificación de Licencia))',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 19',
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Acervo bibliográfico virtual: contratos o convenios de uso del servicio de bases de datos relacionadas al campo de la medicina disponibles para los estudiantes, tesistas y docentes del programa (Para programas vigentes: Requisito 77 del artículo 15 del Reglamento de Licenciamiento institucional (Procedimiento de Licenciamiento Institucional). Para programas nuevos: Requisito 43 del artículo 30 del Reglamento de Licenciamiento Institucional (Procedimiento de Modificación de Licencia))',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 19',
//                 children:[]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 'CBC  III',
//     descripcion:'Gestión Administrativa del programa de estudios',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     totalCompleteTask:0,
//     totalTask:0,
//     children:[]
//   },
//   {
//     id:'CBC IV',
//     descripcion:'Desarrollo del programa de estudios',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     totalCompleteTask:0,
//     totalTask:0,
//     children:[]
//   },
//   {
//     id:'CBC V',
//     descripcion:'Infraestructura y equipamiento',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     totalCompleteTask:0,
//     totalTask:0,
//     children:[]
//   },
//   {
//     id:'CBC VI',
//     descripcion:'Seguridad y bienestar',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     totalCompleteTask:0,
//     totalTask:0,
//     children:[]
//   },
//   {
//     id:'CBC VII',
//     descripcion:'Transparencia',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     totalCompleteTask:0,
//     totalTask:0,
//     children:[]
//   },
//   {
//     id:'CBC VIII',
//     descripcion:'Programas Nuevos',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     totalCompleteTask:0,
//     totalTask:0,
//     children:[]
//   }
// ]

export interface IMediosVerificacion {
  isLoading: boolean;
  error: any;
  isSolicitud: string;
  modelData: IFormularioModel;
  comboLists: {
    sedes: IComboList;
  };
  //tree:ITreeNode[];
  arbol: ITreeNode[];
}
