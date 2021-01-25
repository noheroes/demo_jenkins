import { ComboList, FormType } from '@sunedu/shared';
import { IFormularioModel } from '@lic/core';
import {
  ITreeNode,
  IMediosVerificacion,
} from './mediosverificacion.store.interface';
import { ISedesFiliales } from './sedes-filiales.store.interface';

export class TreeData {
  arbolCBC: ITreeNode[] = []; //treeData;
}

// export var treeData: ITreeNode[] = [
//   {
//     id: 'CBC I',
//     descripcion:'MODELO EDUCATIVO DE LA UNIVERSIDAD',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com 1.1',
//         descripcion:'Modelo Educativo',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC I',
//         children:[
//           {
//             id:'Ind 1',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con un modelo educativo en el que define su propuesta filosófica, humanística, científica, tecnológica y pedagógica respecto del proceso formativo que da sustento al desarrollo de sus procesos misionales, estratégicos y de soporte, entre otros. ',
//             isCompleteTask:false,
//             parent:'Com 1.1',
//             children:[
//               {
//                 id:'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Modelo Educativo de la universidad, aprobado por autoridad competente, que defina mecanismos y medios para su implementación. Contiene, como mínimo, los siguientes componentes:
//                 (i) Conceptualización y justificación de su propuesta educativa, incluyendo descripción del contexto en el que se sitúa.
//                 (ii) Descripción y justificación de la organización de los estudios (niveles de enseñanza y modalidades de estudio), así como la diferenciación entre formación específica y de especialidad,
//                 (iii) Conceptualización y desarrollo de su propuesta respecto a investigación, la responsabilidad social, cuidado del medio ambiente, los enfoques de interculturalidad, inclusión, género, entre otros,
//                 (iv) Definición de los actores que conforman la comunidad educativa (perfil de estudiantes, egresados y docentes), y
//                 (v) Mecanismos y medios para la implementación del modelo educativo

//                 Si la universidad tiene varias sedes o filiales deberá demostrar cómo éstas se integran en el modelo educativo que proponen.
//                 `,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 1',
//                 filterFile:'',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[
//                   {
//                     fileName:'archivo_001.pdf',
//                     fileDate:'2019-04-30',
//                     fileVersion:'v1'
//                   },
//                   {
//                     fileName:'archivo_002.pdf',
//                     fileDate:'2019-05-31',
//                     fileVersion:'v2'
//                   },
//                   {
//                     fileName:'archivo_003.pdf',
//                     fileDate:'2020-01-16',
//                     fileVersion:'v3'
//                   },
//                   {
//                     fileName:'archivo_004.pdf',
//                     fileDate:'2020-02-29',
//                     fileVersion:'v4'
//                   },
//                   {
//                     fileName:'archivo_005.pdf',
//                     fileDate:'2020-03-10',
//                     fileVersion:'v5'
//                   }
//                 ],
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
//     descripcion:'CONSTITUCIÓN, GOBIERNO Y GESTIÓN DE LA UNIVERSIDAD ',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com 2.1',
//         descripcion:'Constitución, Estructura Orgánica y Gestión',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC II',
//         children:[
//           {
//             id:'Ind 2',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con un estatuto inscrito en los Registros Públicos.',
//             isCompleteTask:false,
//             parent:'Com 2.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Estatuto de la Universidad, de ser el caso, inscrito en Registros Públicos. ',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 2',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 3',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con documentos normativos, de gestión y planificación institucional que definen: (i) su estructura orgánica, (ii) las funciones generales y específicas de todos sus órganos, (iii) los perfiles de los puestos vinculados, (iv) las relaciones de dependencia y coordinación entre sus distintas instancias, (v) orientan sus acciones y recursos para la implementación, seguimiento, evaluación y logro de sus objetivos institucionales.',
//             isCompleteTask:false,
//             parent:'Com 2.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reglamento General de la Universidad',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato de declaración de cumplimiento de obligaciones supervisables de la Ley Universitaria.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan Estratégico Institucional a 3 años y evidencias de cumplimiento. Para el caso de las universidades privadas éste debe contar con objetivos institucionales vinculados al modelo educativo. En caso de contar con filiales, se evidencia que son integradas dentro de la planificación institucional. ',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan Operativo Institucional Multianual (3 años) y evidencias de su cumplimiento.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan Operativo Institucional Anual y evidencias de su cumplimiento de ser el caso.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 6',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Para universidades Públicas:
//                 Mapa de procesos de acuerdo a la Norma Técnica N° 001-2018-PCM/SGP y sus normas sustitutorias o derogatorias.

//                 Para universidades privadas:
//                 Mapa de procesos, identificando procesos misionales, procesos estratégicos y procesos de soporte.
//                 `,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 7',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Currículo Vitae (CV) documentado de los responsables de todas instancias vinculadas a la gestión y a la actividad académica de la universidad, según lo establecido en su normativa institucional.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 8',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Resoluciones de designación o contratos laborales o medio que acredite la vinculación con la institución, según corresponda, de los responsables de todas instancias vinculadas a la gestión y a la actividad académica de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 9',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento(s) donde se indique el perfil de todos los puestos y cargos, aprobado(s) por la autoridad competente. Mínimamente se encuentran los perfiles de los responsables de todas instancias vinculadas a la gestión y a la actividad académica de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 10',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Manual de Organización y Funciones.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 11',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reglamento de Organización y Funciones, aprobado(s) por la autoridad competente, de acuerdo a los “Lineamientos para la formulación del Reglamento de Organización y Funciones – ROF de las universidades públicas”, aprobado por Resolución Ministerial N° 588-2019-MINEDU y sus normas sustitutorias o modificatorias. Documento(s) donde se indique el perfil de todos los puestos y cargos. Mínimamente se encuentran los perfiles de los responsables de los procesos vinculados a los componentes de las CBC.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 12',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Cuadro de Puestos de la Entidad (CPE), o documento que haga sus veces, que establece los puestos, la valorización de estos y el presupuesto asignado a cada uno.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 3',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 2.2',
//         descripcion:'Financiamiento y sostenibilidad',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC II',
//         children:[
//           {
//             id:'Ind 4',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad tiene un presupuesto elaborado en concordancia con la normativa vigente del sistema del Estado y en el marco del proceso de la programación multianual. Asimismo, cuenta con reportes de ejecución, que incluyen aspectos de investigación, responsabilidad social universitaria, priorización y eficiencia de gasto.',
//             isCompleteTask:false,
//             parent:'Com 2.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Presupuesto Institucional detallado, elaborado acorde a la normativa de los sistemas administrativos del Estado, incluir como mínimo el siguiente detalle: Presupuesto de planilla de docentes, planilla administrativa, investigación, infraestructura física y tecnológica, mantenimiento, Bienestar Estudiantil y Responsabilidad Social Universitaria. Así mismo, debe presentar la ejecución del mismo tanto de los tres (03) años previos a la solicitud y del año corriente.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 4',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 5',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con presupuesto inicial de inversión con información proyectada y presupuesto a seis (06) años y los aportes de capital necesarios para el inicio de sus operaciones.',
//             isCompleteTask:false,
//             parent:'Com 2.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de inversión que incluya el presupuesto de inversión inicial correspondiente al año 0, necesaria para dar inicio a las operaciones, además debe incluir el presupuesto de inversiones proyectadas por un periodo de seis (06) años.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 5',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Declaración jurada de origen de fondos realizada por los aportantes.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 5',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de financiamiento proyectado por los seis (06) años.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 5',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 6',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con información del estado de resultados y el estado de situación financiera proyectados en un escenario conservador y con presupuesto a seis (06) años. Asimismo, la Universidad debe contar con la herramienta que permita garantizar el destino de recursos financieros al servicio educativo.',
//             isCompleteTask:false,
//             parent:'Com 2.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Estado de Resultados y de Situación Financiera con información proyectada en un escenario conservador por un periodo de seis (06) años. El documento debe incluir, como anexo, el sustento de ingresos y gastos y el sustento técnico de la proyección, que incluya la estimación de estudiantes, tarifas, tasa de deserción y la estrategia que llevará a cabo para lograr los gastos proyectados.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 6',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Presupuesto Institucional detallado formulado para los próximo seis (06) años, aprobado por la autoridad competente. Se evidencia que se destina el 2% de los ingresos a la RSU en todos los años.  El presupuesto debe realizarse por programa académico y debe incluir como mínimo el siguiente detalle: Presupuesto de planilla de docentes, planilla administrativa, investigación, infraestructura física y tecnológica, mantenimiento, Bienestar Estudiantil y Responsabilidad Social Universitaria.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 6',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Presupuesto de operación por seis (06) años con fuentes de financiamiento por actividad a realizar. Considere los siguientes ítems: programas académicos, investigación e infraestructura, así como datos que sirvan como evidencias de su cumplimiento en el futuro.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 6',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato de licenciamiento 01 que contiene presupuesto por Condiciones Básicas de Calidad (por sede y filial si corresponde).',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 6',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 7',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con herramientas de gestión financiera e información histórica del balance general, estado de ganancias y pérdidas, estado de cambio en el patrimonio neto, y estado de flujos de efectivo. Este indicador aplica solo para universidades con, por lo menos, un año de funcionamiento.',
//             isCompleteTask:false,
//             parent:'Com 2.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Informe o reporte que contenga información histórica del balance general, estado de ganancias y pérdidas, estado de cambio en el patrimonio neto, estado de flujos de efectivo.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 7',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Informe o reporte que contenga información sobre la planilla docente y administrativa; el número tanto de docentes como administrativos; número de estudiantes y las tarifas de hasta los últimos cuatro (4) años.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 7',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento que detalla la política de gestión financiera de la universidad como préstamos a accionistas, política de gestión de cuentas por cobrar comerciales y a terceros, entre otros, así como evidencia de la ejecución de las mismas.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 7',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 2.3',
//         descripcion:'Gobierno Universitario',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC II',
//         children:[
//           {
//             id:'Ind 8',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con autoridades e integrantes idóneos para el ejercicio de sus funciones.',
//             isCompleteTask:false,
//             parent:'Com 2.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Declaración Jurada de los miembros que participan del gobierno de la universidad de no encontrarse inscrito en el Registro de Deudores de Reparaciones Civiles ( REDERECI), Registro de Deudores Alimentarios Morosos del Poder Judicial  (REDAM,) no haber sido condenado por delito doloso con sentencia de autoridad de cosa juzgada, no haber sido condenado o estar procesado por los delitos a los que se refiere la Ley N° 29988 y sus modificatorias.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 8',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Declaración jurada de intereses de los miembros que participan del gobierno de la universidad, de forma que se evidencie en caso tengan intereses económicos, financieros, profesionales, empresariales u otros que pudieran interferir en el ejercicio de sus funciones o en la toma de las decisiones propias de su condición.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 8',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 9',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con políticas, mecanismos y procedimientos que definen y regulan la actuación de los integrantes de los órganos de gobierno.',
//             isCompleteTask:false,
//             parent:'Com 2.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Política, Plan o Código de Buen Gobierno que define la actuación de los órganos de gobierno en las siguientes materias:
//                 (i) Principios, valores, comportamiento ético y manejo de conflicto de intereses.
//                 (ii) Control interno y gestión de riesgos.
//                 (iii) Relacionamiento con la comunidad universitaria.
//                 (iv) Transparencia universitaria.
//                 (v) Mecanismos o procedimientos de atención de denuncias de actos irregulares, de corrupción y de hostigamiento sexual, de acuerdo con la normativa vigente.
//                 `,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 9',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 10',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad ha cumplido con las obligaciones a las que se refiere el Reglamento cese de actividades de universidades y escuelas de posgrado, aprobado por Resolución de Consejo Directivo N° 111-2018-SUNEDU/CD.',
//             isCompleteTask:false,
//             parent:'Com 2.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Un informe de cumplimiento de las obligaciones de cese de actividades que, como mínimo, contiene la información señalada en el Anexo N° 02. Si la información ya fue presentada a la Dirección de Supervisión (Disup), se debe entregar cargos de dicha presentación.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 10',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
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
//     descripcion:'LA OFERTA ACADÉMICA, RECURSOS EDUCATIVOS Y DOCENCIA',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com 3.1',
//         descripcion:'Justificación de la oferta propuesta',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC III',
//         children:[
//           {
//             id:'Ind 11',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La oferta académica propuesta por la universidad se encuentra fundamentada sobre la base de estudios empíricos—oficiales, confiables y verificables— y teóricos, que justifican su pertinencia económica, social, cultural o académica en el área de influencia. ',
//             isCompleteTask:false,
//             parent:'Com 3.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Estudios que cuenten con una base teórica y metodología verificable y con datos provenientes de fuentes primarias o secundarias.
//                 Deben tener, como mínimo, el siguiente contenido:
//                 (i) estudio de demanda laboral (potencial e insatisfecha)
//                 (ii) estudio de oferta formativa similar existente en el área de influencia. Para ello, presenta previamente una justificación sobre la determinación de su área de influencia.
//                 (iii) Justificación de la pertinencia social y cultural de la propuesta (o pertinencia con las políticas nacionales, internacionales o regionales).
//                 (iv) Justificación sobre la existencia de referentes en el ámbito nacional e internacional en torno a la propuesta académica.
//                 (v) De ser el caso, pertinencia de la modalidad semi-presencial de acuerdo a la infraestructura digital del área de influencia y los fines del programa.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 11',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 3.2',
//         descripcion:'Propuesta curricular',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC III',
//         children:[
//           {
//             id:'Ind 12',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con normativa que regula los mecanismos y procesos de selección y admisión de sus estudiantes, a través de concurso público, para sus modalidades de ingreso y niveles de enseñanza, de acuerdo a lo que al respecto estipula la Ley Universitaria.',
//             isCompleteTask:false,
//             parent:'Com 3.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Reglamento de admisión, aprobado por la autoridad competente. Establece como mínimo:
//                 (i) Requisitos para la admisión por modalidad de ingreso y de enseñanza.
//                 (ii) Procedimientos y mecanismos del proceso admisión por modalidad de ingreso y de enseñanza`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 12',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 13',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'Todos los programas académicos que propone ofrecer la universidad cuentan con documentos que planifican, estructuran y definen el proceso formativo de los estudiantes. Esto documentos estás alineados a su modelo educativo. ',
//             isCompleteTask:false,
//             parent:'Com 3.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato de Licenciamiento 02 donde se declara todos los programas académicos que propone ofrecer la universidad. Si la universidad cuenta con segundas especialidades debe presentar, adicionalmente, el Formato de Licenciamiento 02.1. Los formatos deben estar firmados por el representante legal de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Resolución de creación de todos sus programas académicos, que debe detallar la denominación del programa, el grado y título que otorga según nivel de enseñanza, la modalidad de enseñanza y la sede o local donde será impartido.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Planes de estudios o planes curriculares de todos los programas académicos propuestos, con resolución de aprobación por autoridad competente.

//                 Estos deben incluir, como mínimo, los siguientes componentes:
//                 (i) Denominación del programa, incluyendo menciones de ser el caso, y objetivos generales. La denominación se avala en referentes académicas nacionales o internacionales y es coherente con la naturaleza del campo de conocimiento al que pertenece.
//                 (ii) Perfil del estudiante y del graduado o egresado. El perfil responde a la justificación del programa. Se evidencia que la ruta formativa (cursos-malla curricular) planteada permite el cumplimiento del perfil.
//                 (iii) Modalidad de enseñanza
//                 (iv) Métodos de enseñanza teórico-prácticos y de evaluación de los estudiantes. Se encuentran alineados al Modelo Educativo. Se evidencia que el programa responde a fundamentaciones teóricas y metodológicas, coherentes con el campo profesional, tecnológico o técnico en el que se inserta. Se justifica el modo en que los cursos y su organización recogen tales fundamentaciones.
//                 (i) Malla curricular
//                 (ii) Sumilla de cada asignatura (descripción y justificación referente al perfil o a lo estipulado en el indicador 11), según su contenido teórico o práctico. Se precisa: los créditos; si es general, específico o de especialidad; si se dictara en presencial, semipresencial o a distancia; electivo u obligatorio; las horas por semestre o por semana (tanto teóricas como prácticas) y la codificación que utilice cada uno de ellos. Además, se señala los resultados de aprendizajes que se esperan adquirir (pudiéndose señalar si estas se logran en conjunto con otros cursos).
//                 (iii) Recursos indispensables para desarrollo de asignaturas (tipo de talleres y laboratorios, de corresponder).
//                 (iv) En caso corresponda, exigencia y duración de prácticas preprofesionales.
//                 (v) Grados y títulos que otorga
//                 (v) Mecanismos para la enseñanza de un idioma extranjero o lengua nativa según lo establecido en la Ley universitaria.
//                 (vi) Describe las estrategias dentro del currículo para el desarrollo de aprendizajes vinculadas a la investigación.
//                 (vi) Se presenta la descripción de los procedimientos de consulta tanto internos como externos que se han realizado para elaborar los planes de estudios.

//                 En caso, se otorgue certificaciones progresivas, además se debe incluir: i) Las Certificaciones progresivas que otorga el programa, ii) se justifica cómo la ruta formativa (cursos, talleres u otros espacios de aprendizaje) conduce al desarrollo de la competencia profesional del módulo y el tipo de proyecto que permitiría evidenciar el desarrollo de tal competencia; iii) se cuenta con normativa que defina la ruta y requisitos para la adquisición del certificado.  En esta, se define la forma en que se elaborara y sustentará el proyecto que demuestre la competencia alcanzada

//                 En caso que contenga menciones, se presenta: i) La justificación de la inclusión de las mismas; ii) El perfil específico que se lograrían con esa mención y la ruta formativa para desarrollarlos (cursos, módulos, creditaje). `,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento que detalle el perfil de docente por cada asignatura, consignando mínimamente el nivel académico, experiencia profesional y/o de investigación (en caso de asignaturas vinculadas a la investigación)',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato de Licenciamiento 03 de malla curricular y análisis de créditos académicos por programa. El formato debe estar firmado por el representante de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 13',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 3.3',
//         descripcion:'Infraestructura física',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC III',
//         children:[
//           {
//             id:'Ind 14',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'Todos los locales de la universidad (conducentes a grado académico y donde se brinden servicios complementarios) cuentan, según corresponda, con título de propiedad, contrato vigente de arrendamiento, o convenio de cesión de uso vigente.',
//             isCompleteTask:false,
//             parent:'Com 3.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato de Licenciamiento 04 que contiene el listado de todos los locales declarados por la universidad y sobre los cuales ejerce pleno derecho de uso para brindar ininterrumpidamente servicios educativos conducentes a grado y servicios complementarios. El formato debe estar firmado por el representante de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 14',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Títulos de propiedad, contrato de arrendamiento o documento de cesión o afectación de uso —registrados en Sunarp— que detalle vigencia, de todos los locales de la universidad, según sea el caso. Para el caso de los títulos de propiedad y contratos de arrendamiento, se debe adjuntar el número de la partida y la oficina registral a la cual pertenece. Se debe asegurar el derecho real por al menos cinco (5) años, respecto a la totalidad del inmueble destinado a la prestación del servicio.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 14',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 15',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'Todos los locales de la universidad (conducentes a grado académico y donde se brinden servicios complementarios) cuentan con capacidad adecuada al espacio físico, cumplen las condiciones de seguridad y de uso, tienen compatibilidad de uso, y son aptas para atender la demanda de los programas académicos. Estos locales cuentan con ambientes destinados al desarrollo de sus funciones (formación y docencia, investigación, servicios complementarios), como aulas, laboratorios y talleres equipados, ambientes para docentes, áreas de actividades deportivas, sociales, de recreación, áreas verdes, espacios libres, entre otros. Asimismo, la universidad cuenta con instrumentos normativos y de gestión que aseguren el mantenimiento sostenido de su infraestructura, equipamiento y mobiliario. ',
//             isCompleteTask:false,
//             parent:'Com 3.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Informe descriptivo del estado actual de la Infraestructura, equipamiento y mobiliario institucional, que incluye a todos los locales de la universidad. Este debe contener, como mínimo:
//                 (i) análisis de ocupabilidad de cada local que sustente porcentaje de utilización actual de la infraestructura existente.
//                 (ii) estudio técnico de cálculo de aforo de cada local elaborado por un arquitecto o ingeniero colegiado y habilitado, en correspondencia con certificado Inspección Técnica de Seguridad en Edificaciones (ITSE). Debe garantizarse la independencia del profesional que lo emita respecto a la Universidad.
//                 (iii) memoria descriptiva que demuestra que el local es accesible para las personas con discapacidad.
//                 (iv) memoria descriptiva de los servicios básicos con los que cuenta cada local (agua potable, desagüe, telefonía, energía eléctrica, internet). Ello acompañado de contratos o recibos que acrediten la prestación efectiva, salvo en zonas donde no hubiera prestación de dichos servicios, que se declararán mecanismos sustitutorios. Debe garantizarse la exclusividad de los servicios a fin de asegurar su continuidad.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Formato de Licenciamiento 05 donde se especifica la totalidad de las siguientes unidades de infraestructura con las que cuenta en cada uno de sus locales: aulas, laboratorios, talleres, ambientes para docentes, bibliotecas y ambientes destinados a servicios complementarios. Formato de Licenciamiento 05.1 donde se especifica cada laboratorio y taller según cada programa de estudios. Los formatos debes estar firmados por el representante de la universidad.
//                 Debe describirse:
//                 (i) denominación de cada ambiente,
//                 (ii) ubicación, área y aforo,
//                 (iii) equipamiento, mobiliario y softwares de los que disponen en cada laboratorio y taller declarado. Formato 05.2.
//                 (iv) cronograma u horario de atención de cada ambiente, indicando el programa de ser el caso o si es de uso compartido
//                 (v) Descripción de estos ambientes y las actividades que se realizan`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Plan de seguridad institucional que describa la gestión que realiza la universidad para garantizar la seguridad de los ocupantes de cada local.
//                 El plan debe contener, como mínimo:
//                 (i) procedimientos y estándares para garantizar la seguridad de la comunidad universitaria durante su uso actual.
//                 (ii) gestión integral para el manejo de residuos sólidos y líquidos peligrosos, y RAEE.
//                 (iii) gestión para la identificación y valoración de riesgo producto del desarrollo de las actividades académicas que el local alberga.
//                 (iv) lineamientos para el manejo de la seguridad y vigilancia en cada uno de los locales (conducentes a grado académico y donde se brinden servicios complementarios).`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Plan anual institucional de mantenimiento de la infraestructura, equipamiento y mobiliario de todos los locales conducentes a grado académico (por sede y filial, si corresponde), aprobado por la autoridad competente.
//                 El plan debe detallar:
//                 (i) actividades correspondientes al mantenimiento preventivo y correctivo
//                 (ii) presupuesto institucional
//                 (iii) cronograma mensual
//                 (iv) fuentes de financiamiento
//                 (v) responsables`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Política, reglamento u documento afín de carácter institucional que regule la gestión sostenida del mantenimiento de la infraestructura, equipamiento y mobiliario de la universidad. Debe incluir información sobre cómo se gestionan los recursos para el mantenimiento de la universidad, área a cargo y responsables.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 6',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Informe descriptivo de las aulas, laboratorios y talleres de la universidad. El cual debe incluir:
//                 (i) agrupamiento de talleres y laboratorios por tipología.
//                 (ii) sustento de la pertinencia de la infraestructura de cada taller y laboratorio con relación a los programas académicos vinculados.
//                 (iii) sustento de la pertinencia del equipamiento y mobiliario con relación a los programas académicos vinculados.
//                 (iv) sustento de la capacidad de atención de cada taller y laboratorio con relación a los programas académicos vinculados.
//                 (v) Sustento del aforo de cada aula, laboratorio y taller de acuerdo al tipo`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 7',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Protocolos de seguridad de los laboratorios y talleres que detallan el proceso de identificación y valoración de peligros y riesgos de acuerdo con las actividades específicas que albergan cada uno.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 8',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`De corresponder, Plan de implementación progresiva de los laboratorios y talleres a ser aplicados a partir del tercer año de los programas académicos, aprobado por la autoridad competente. Dicho plan debe proyectarse cumpliendo con toda la normativa relacionada a seguridad en edificaciones. Este debe incluir:
//                 (i) detalle de actividades a desarrollar,
//                 (ii) cronograma (considerando hitos y metas por meses y años),
//                 (iii) presupuesto,
//                 (iv) responsables
//                 (v) Impacto de la adecuación e implementación en la infraestructura existente del local.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 15',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 3.4',
//         descripcion:'Infraestructura tecnológica',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC III',
//         children:[
//           {
//             id:'Ind 16',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:`La universidad cuenta con un plan para desarrollar sistemas integrados de información para:
//             Gestión académica (registro y monitoreo de actividades académicas).
//             Gestión Administrativa (registro y monitoreo de trámites asociados a lo académico).
//             Gestión de acervo bibliográfico (registro y monitoreo de uso de bibliografía por todos los canales puestos a disposición de la comunidad universitaria).`,
//             isCompleteTask:false,
//             parent:'Com 3.4',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Plan de implementación de los sistemas integrados de información. Este debe incluir:
//                 (i) detalle de actividades a desarrollar,
//                 (ii) cronograma (con un año de duración)
//                 (iii) presupuesto,
//                 (iv) responsables`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 16',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 17',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con un plan para desarrollar un repositorio académico digital, según los requerimientos de RENATI y ALICIA, en el que se alojan sus documentos de investigación como tesis, trabajos de investigación, publicaciones, entre otros.',
//             isCompleteTask:false,
//             parent:'Com 3.4',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Plan de implementación de los sistemas integrados de información. Este debe incluir:
//                 (i) detalle de actividades a desarrollar,
//                 (ii) cronograma (con un año de duración)
//                 (iii) presupuesto,
//                 (iv) responsables`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 17',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 18',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:`En caso la universidad solicite ofrecer modalidad semipresencial para el desarrollo de sus programas académicos, debe contar con una plataforma de interacción orientada al aprendizaje autónomo con las siguientes funciones mínimas:
//             a) Uso de diversos instrumentos de participación individual y grupal para el logro del aprendizaje.
//             Uso de diversos instrumentos para la evaluación del logro de las competencias profesionales y capacidades académicas que se van adquiriendo a través de las asignaturas del currículo.
//             b) Integración con la plataforma académica y administrativa de la universidad.
//             c) Monitoreo de actividades y de toda la interacción.
//             d) Ancho de banda adecuado que garantice la accesibilidad y disponibilidad.`,
//             isCompleteTask:false,
//             parent:'Com 3.4',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Manual de usuario que contenga la indicación del link de la plataforma de interacción.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento de gestión académica en donde se especifiquen los procedimientos y cronología del monitoreo de las actividades en la plataforma semipresencial.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Usuario y contraseña de todos los perfiles (administrador, estudiante, docente, egresado) que tiene el sistema.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Contratos de arrendamiento o licencia de implementación de la plataforma, en caso aplique, de por lo menos un (01) año.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Informe elaborado por un experto que garantice que se cuenta con el ancho de banda necesario para garantizar la accesibilidad y disponibilidad del total de estudiantes proyectado.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 6',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento que acredite la existencia de una oficina o área encargada del monitoreo y soporte de (i) la plataforma y del (ii) desarrollo procesos semipresenciales en los programas académicos.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 18',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 3.5',
//         descripcion:'Docentes',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC III',
//         children:[
//           {
//             id:'Ind 19',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'Todos los docentes de la universidad cumplen con los requisitos para el ejercicio de la docencia, estipulados en la Ley universitaria. De ellos, un 25%, como mínimo, tiene como régimen de dedicación el de tiempo completo o dedicación exclusiva, quienes son preferentemente doctores y ejercen labores de docencia, investigación, gestión universitaria,  asesoría académica, o proyección social. En caso corresponda, este porcentaje debe cumplirse en cada sede y filial de la universidad. Se evidencia que se cuenta con docentes para los cursos de todos los programas correspondientes a los dos primeros años.',
//             isCompleteTask:false,
//             parent:'Com 3.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Formato de Licenciamiento 06 que contiene toda la plana docente de la universidad para los dos primeros años de funcionamiento, precisando su régimen de dedicación, categoría, programa, sede y filial a la que pertenecen, distribución horaria de dedicación a las diversas actividades según corresponda, entre otros. El formato debe estar firmado por el representante de la universidad.
//                 Se debe evidenciar que se cuenta con la plana docente para brindar los cursos de los dos primeros años de los programas y que el 25% de estos son a tiempo completo. En caso corresponda, este porcentaje debe cumplirse en cada sede y filial de la universidad.
//                 En ningún caso, podrá ser tiempo completo de otra institución ni deben contar con un tipo de carga (académica, administrativa, de investigación) en otra universidad que pueda afectar su disponibilidad efectiva y tiempo de dedicación.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 19',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Listado de todos los docentes de todos los programas tomando en cuenta los dos primeros años de funcionamiento, al que debe anexarse el curriculum vitae de cada uno. Además, contratos, resoluciones de nombramiento o contratación, según corresponda, de los docentes a tiempo completo de la universidad y/o a dedicación exclusiva, tomando en cuenta para los dos primeros años de funcionamiento.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 19',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 20',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad regula e implementa procesos de evaluación y fortalecimiento de la carrera docente, de acuerdo a criterios meritocráticos y una lógica de resultados, con fines de ingreso, nombramiento, promoción, renovación de contratos, ratificación y separación; lo que incluye un plan de desarrollo académico para los docentes. Todos estos procesos se desarrollan de acuerdo con la Ley Universitaria y la normativa de la universidad. Los procesos tienen una orientación hacia la promoción del desarrollo profesional del cuerpo docente. ',
//             isCompleteTask:false,
//             parent:'Com 3.5',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reglamentos u otros documentos normativos que regulen la gestión docente. Se regula los procesos vinculados a los docentes contratados, extraordinarios y ordinarios (nombramiento, promociones y ratificaciones), en caso corresponda. Estos medios de verificación deben adjuntar, en anexos, los instrumentos de evaluación de cada proceso. La selección debe garantizar transparencia, meritocracia y sobre todo que se realice en función de lo solicitado por el diseño curricular. Se cuenta con mecanismos para evaluar desempeño que se transformen acciones preventivas y/ o correctivas.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 20',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documentos que evidencien que en el cuerpo docente que presenta ha implementado el proceso de selección.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 20',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan progresivo de contratación y ordinarización docente, aprobado por la autoridad competente, que tiene como mínimo un periodo de implementación a culminarse en cinco (5) años. Indica como mínimo: (i) objetivos (ii) metas o resultados que se quieran alcanzar (ii) cronograma específico, (ii) presupuesto total y desagregado, (iii) número de docentes contratados y ordinarios por categoría, grado académico y, si corresponde por sede y filial, que se incorporará, (iv) responsables, (v) justificación del número de docentes planteados',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 20',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Política de desarrollo profesional del cuerpo docente dentro de la institución y/o el programa. Mínimamente se orientan a la promoción, acceso a puestos de gestión, bonificaciones y reconocimientos.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 20',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento donde se detalle cada uno de los programas de desarrollo académico para los docentes (programas de movilidad e intercambio, de actualización, participación en congresos, pasantías, investigación, entre otros). Se incluye mínimamente: (i) los objetivos de cada programa, (ii) descripción y justificación del programa, (iii) criterios de selección, de corresponder, para el acceso a los programas (iv) presupuesto por programa y (v) fuentes de financiamiento, (vi) responsables, (vii) precisión de sede y filial donde se desarrollarán, en caso corresponda.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 20',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 3.6',
//         descripcion:'Personal no docente',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC III',
//         children:[
//           {
//             id:'Ind 21',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Universidad cuenta con personal no docente calificado y a cargo de dar soporte para el inicio de las actividades académicas de todos los programas. ',
//             isCompleteTask:false,
//             parent:'Com 3.6',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Formato de Licenciamiento 07 que contiene la lista de personal no docente (evidenciándose que se cubre para las actividades de todos los programas) y, si corresponde, por sede y filial. El formato debe estar firmado por el representante de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 21',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Curriculum vitae documentado del personal no docente a cargo de dar soporte a los programas académicos.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 21',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'MOF o documento afín donde se indique el perfil del puesto del personal no docente que da soporte a los programas académicos. De haberlo presentado como MV en el indicador 3 se utilizarán dichos medios para la evaluación.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 21',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           },
//           {
//             id:'Ind 22',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La Universidad cuenta regula e implementa procesos de evaluación y fortalecimiento para el personal no docente, con selección, reconocimiento y promoción; lo que incluye un plan de desarrollo profesional.',
//             isCompleteTask:false,
//             parent:'Com 3.6',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de capacitación y desarrollo profesional para el personal no docente de acuerdo a sus funciones.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 22',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Marco normativo de procesos de selección, evaluación de desempeño, reconocimientos y promoción del personal no docente, de acuerdo a su tipo de gestión.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 22',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documentos que evidencien que en el cuerpo docente que presenta ha implementado el proceso de selección.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 22',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id:'CBC IV',
//     descripcion:'PROPUESTA EN INVESTIGACIÓN',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com 4.1',
//         descripcion:'Estructura Orgánica de gestión de la investigación',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC IV',
//         children:[
//           {
//             id:'Ind 23',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con un órgano responsable de la gestión de la investigación articulado en su estructura orgánica institucional. Además, la persona a cargo de la gestión del órgano tiene grado de doctor; mientras que el resto del personal responsable cumple con los requisitos establecidos en la Ley Universitaria y en su normativa interna. Tanto la estructura como el número de personal es pertinente con la política de investigación, así como con el número de docentes investigadores. ',
//             isCompleteTask:false,
//             parent:'Com 4.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Listado y Currículo Vitae documentado de todo el personal responsable de la gestión del órgano de investigación, del diseño y ejecución de la Política General de Investigación, y del Plan de Desarrollo de la Investigación.
//                 Para la evaluación del cumplimiento de este indicador, se utilizarán también los medios de verificación solicitados en el indicador 3 en lo que corresponda.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 23',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 4.2',
//         descripcion:'Desarrollo de la investigación',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC IV',
//         children:[
//           {
//             id:'Ind 24',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con documentos normativos que definen, orientan y promueven el desarrollo de la investigación bajo principios de calidad e integridad científica. Asimismo, cuenta con instrumentos de gestión que permiten hacer seguimiento a los resultados y también a la disponibilidad de los recursos necesarios para tal fin. Estos documentos están articulados entre sí, con la normativa nacional vigente y la institucional, con el modelo educativo de la universidad y con la normativa del Concytec.',
//             isCompleteTask:false,
//             parent:'Com 4.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Política General de Investigación de alcance institucional. Esta debe incluir, como mínimo:
//                 (i) Definición, enfoque y tipo de investigación que propone desarrollar.
//                 (ii) Objetivos generales para el desarrollo de la investigación.
//                 (iii) Definición del perfil de sus docentes investigadores.
//                 (iv) Actores de la comunidad involucrados en investigación.
//                 (v) Fondos y estrategias para el apoyo a los investigadores, participación en eventos y congresos de investigación, pasantías de investigación, iniciación científica, fomento de publicaciones, profesores visitantes, becas de posgrado, apoyo a tesis de investigación, entre otros, de acuerdo al enfoque de investigación de la universidad. `,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 24',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Reglamento (s) o instrumentos normativos afines que regulen, a nivel institucional, los procedimientos para la realización y fomento de la investigación, el rol del docente investigador, así como la integridad científica y los derechos de propiedad intelectual. como mínimo:
//                 (i) Postulación para el desarrollo de proyectos de investigación.
//                 (ii) adjudicación y monitoreo de fondos de investigación.
//                 (iii) monitoreo y evaluación de proyectos de investigación (incluyendo según resultados).
//                 (iv) procedimientos para publicaciones y difusión de la investigación.
//                 (v) procesos de selección, evaluación de desempeño, reconocimientos, incentivos y promoción de los docentes investigadores.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 24',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Documento que detalle la planificación para el desarrollo de la investigación. Contiene como mínimo:
//                 (i) Objetivos generales y específicos
//                 (ii) metas, actividades, e indicadores.
//                 (iii) cronograma detallado de ejecución mensual, por el periodo de un año.
//                 (iv) responsables de ejecución para el logro de objetivos.
//                 (v) presupuesto
//                 (vi) descripción de las fuentes de financiamiento (indicado si son internas o externas)
//                 (vii) descripción detallada de los niveles implementación del plan (investigación centralizada o por programa), incluyendo sedes y filiales, si corresponde.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 24',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Documento de líneas de investigación y grupos de investigación que se proponen desarrollar, evidenciando que estas cuentan con líderes Renacyt. Como mínimo, debe haber líneas de investigación para cada campo específico (según el clasificador de carreras de INEI) en el que se ubiquen los programas académicos de la Universidad.

//                 Incluye:
//                 (i) Listado y definición de las líneas de investigación y grupos de investigación que se proponen desarrollar, en base a la disponibilidad de investigadores, equipamiento e infraestructura de investigación y pertinencia
//                 (ii) objetivos y justificación de cada línea de investigación,
//                 (iii) nombres de los líderes de las líneas y de los grupos de investigación,
//                 (iv) sustentación de la articulación de las líneas y grupos de investigación con los programas académicos de la universidad,
//                 (v)  de corresponder, sede o filial donde se desarrollan cada línea y grupo de investigación

//                 Debe evidenciarse el proceso de identificación, priorización y aprobación de las líneas de investigación, de acuerdo con la guía práctica para la identificación, categorización, priorización y evaluación de líneas de investigación-Resolución de Presidencia N°115-2019-CONCYTEC-P.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 24',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 4.3',
//         descripcion:'Docentes Investigadores',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC IV',
//         children:[
//           {
//             id:'Ind 25',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:`La universidad cuenta con un cuerpo de docentes calificados y con experiencia para el desarrollo de la investigación, con categoría Renacyt, y son quienes lideran las líneas y grupos de investigación de la universidad. Estos representan al menos el 5% del total de docentes. Esto fortalecido de forma institucional a través de la implementación de instrumentos normativos y de gestión.

//             En caso la universidad tenga más de una sede o filial, el indicador aplica a cada una de estas.`,
//             isCompleteTask:false,
//             parent:'Com 4.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Se evaluará con el MV1 del indicador 19 (Formato de Licenciamiento 06) que lista los docentes investigadores con categoría Renacyt por programa, sede y filial. Se evidencia que representan como mínimo, el 5% del total de docentes de la universidad. De ser el caso, el 5% aplica por sede o por filial.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 25',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Marco normativo que incorpore los procesos de selección, evaluación de desempeño, reconocimientos, incentivos y promoción de los docentes investigadores. Se orienta a promover que los investigadores sean gestores del conocimiento, cuenten con publicaciones, y que participen en fondos concursables y pasantías de investigación.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 25',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documentos que evidencien la implementación del proceso de selección de docentes investigadores, debiendo incluir el curriculum vitae. En caso corresponda, la evidencia debe especificar sede y filial.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 25',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan progresivo de incorporación de docentes investigadores con calificación Renacyt que tiene como mínimo un periodo de implementación de tres (3) años. Este plan debe contar como mínimo con: (i) objetivos, (ii) metas y resultados que se quieran alcanzar (ii) cronograma específico, (ii) presupuesto total y desagregado, (iii) número de docentes a incorporar según nivel y categoría Renacyt, y (iv) responsables de la ejecución del plan. De corresponder, se debe especificar la implementación a nivel de sede y filial.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 25',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id:'CBC V',
//     descripcion:'RESPONSABILIDAD SOCIAL UNIVERSITARIA Y BIENESTAR UNIVERSITARIO ',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com 5.1',
//         descripcion:'Estructura orgánica para Responsabilidad Social Universitaria y para Bienestar Universitario',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC V',
//         children:[
//           {
//             id:'Ind 26',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con un órgano responsable de la gestión de la Responsabilidad Social Universitaria y del Bienestar Universitario a nivel institucional, y con personal a cargo que cumple con los requisitos establecidos en su normativa interna.',
//             isCompleteTask:false,
//             parent:'Com 5.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Este indicador se evaluará con los medios de verificación solicitados en el indicador 3 respecto al personal a cargo del órgano.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 26',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 5.2',
//         descripcion:'Desarrollo de la Responsabilidad Social Universitaria (RSU)',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC V',
//         children:[
//           {
//             id:'Ind 27',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con documentos normativos y de gestión de alcance institucional que definen, orientan y promueven el desarrollo de la RSU. Estos documentos están articulados entre sí, con la normativa nacional vigente y con el modelo educativo de la universidad.',
//             isCompleteTask:false,
//             parent:'Com 5.2',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Documento aprobado por la autoridad competente que defina la política general de RSU, enmarcada en la Ley universitaria y el modelo educativo de la universidad.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 27',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Plan de desarrollo de RSU con fuentes de financiamiento, responsables de ejecución, metas y plazos.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 27',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Marco normativo para la RSU (ejecución, reconocimiento, monitoreo, beneficiarios, impacto, etc.).',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 27',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 4',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Marco normativo para el Servicio Social Universitario, parte integrante de la RSU, con normas claras de cómo los alumnos acceden a los procesos de evaluación y otorgamiento.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 27',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 5',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'En el caso de universidades públicas se garantiza que se destina el 2% del presupuesto institucional anual, a la responsabilidad social universitaria; y en el caso de las universidades privadas se garantiza que se destina a esta materia el 2% de los ingresos.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 27',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id:'Com 5.3',
//         descripcion:'Bienestar Universitario',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC V',
//         children:[
//           {
//             id:'Ind 28',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con documentos normativos y de gestión de alcance institucional que organizan el desarrollo, acceso y la continuidad de los servicios y programas de bienestar universitario para todos sus estudiantes (de todos los niveles, programas académicos y locales). Estos instrumentos están articulados entre sí y con su normativa interna.',
//             isCompleteTask:false,
//             parent:'Com 5.3',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Reglamento(s) o instrumento(s) normativo(s) afines que regule(n) objetivos, desarrollo y el acceso de los servicios y programas de bienestar universitario. Puede ser incorporada en la normativa general de la Universidad.
//                 La universidad garantiza el acceso a los siguientes programas y servicios de bienestar:
//                 1. Programa de becas por situación económica, rendimiento académico y rendimiento deportivo
//                 2. Servicio de salud
//                 3. Servicio psicopedagógico
//                 4. Programa de prevención e intervención en casos de acoso sexual
//                 5. Programa de alimentación saludable
//                 6. Programa de inserción laboral y seguimiento al egresado.
//                 7. Programa deportivo de formación-recreación
//                 8. Programa Deportivo de Alta Competencia (PRODAC)
//                 9. Programa de actividades artísticas y culturales.
//                 10. Programa de atención a la diversidad.
//                 11. Programa de acceso, permanencia y acompañamiento (servicio social). `,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 28',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`Política(s) de bienestar con planificación para el desarrollo progresivo de cada servicio y programa, aprobado por autoridad competente. Esta última puede ser comprendida en los medios de verificación del indicador 3 en lo que corresponda. El periodo de aplicación de la planificación es de un (1) año académico. Contiene, como mínimo, los siguientes componentes:
//                 (i) Objetivos generales y específicos,
//                 (ii) Descripción de actividades, indicadores y metas objetivas,
//                 (iii) Cronograma mensual. La temporalidad es consistente con los instrumentos de planificación institucional.
//                 (iv) Presupuesto
//                 (v) Fuentes de financiamiento,
//                 Responsables de su implementación.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 28',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id:'CBC VI',
//     descripcion:'TRANSPARENCIA',
//     nivel:1,
//     isCompleteTask:false,
//     parent:'root',
//     children:[
//       {
//         id:'Com 6.1',
//         descripcion:'Transparencia',
//         nivel:2,
//         isCompleteTask:false,
//         parent:'CBC VI',
//         children:[
//           {
//             id:'Ind 29',
//             descripcion:'',
//             nivel:3,
//             hasDescriptionChild:'La universidad cuenta con un marco normativo que orienta y promueve la transparencia y acceso a la información pública con observancia de las normas de protección de datos personales y de la seguridad de la información. Asimismo, cuenta con procesos y mecanismos para la gestión, presentación y publicación de la información.',
//             isCompleteTask:false,
//             parent:'Com 6.1',
//             children:[
//               {
//                 id: 'MV 1',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Reglamento o instrumento normativo que regula la transparencia y acceso a la información pública, así como los procesos y mecanismos para la gestión, presentación y publicación de la misma, los cuales deben ser interoperables con el Sistema de Información Universitaria de Sunedu.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 29',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 2',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:'Evidencias del cumplimiento de la normativa respecto al área y personal responsable del cumplimiento de su finalidad y de atender los requerimientos de información de carácter institucional. Se complementará la evaluación con los medios de verificación del indicador 3 en lo que corresponda.',
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 29',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               },
//               {
//                 id: 'MV 3',
//                 descripcion:'',
//                 nivel:4,
//                 hasDescriptionChild:`El portal web institucional
//                 (i) contiene la información exigida en la Ley Universitaria y normativa aplicable de forma permanente y actualizada,
//                 (ii) incorpora información en lengua originaria (en caso corresponda)
//                 (iii) tiene opciones de acceso para personas con algún tipo de discapacidad, que pueda limitar su acceso a la información.
//                 (iv) debe ser interoperable con el Sistema de Información Universitaria de Sunedu.`,
//                 typeBodyChild:1,
//                 isCompleteTask:false,
//                 parent:'Ind 29',
//                 idFile:'5e4dc69cc7075a388016bcec',
//                 files:[],
//                 children:[]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ]

export class MediosVerificacion implements IMediosVerificacion {
  isLoading = false;
  error = null;
  isSolicitud = null;
  comboLists = {
    //sedes: new ComboList([{ 'text': 'SI', 'value': '1' }, { 'text': 'NO', 'value': '0' }])
    sedes: new ComboList([{ text: 'S - Lima/Lima', value: '1' }]),
  };
  modelData: IFormularioModel = null;
  //tree=treeData;
  arbol: any[];
}

export class SedesFiliales implements ISedesFiliales {
  isLoading = false;
  error = null;
  sedes = [];
}

export class MediosVerificacionStoreModel {
  mediosVerificacion = new MediosVerificacion();
  sedesFiliales = new SedesFiliales();
}
