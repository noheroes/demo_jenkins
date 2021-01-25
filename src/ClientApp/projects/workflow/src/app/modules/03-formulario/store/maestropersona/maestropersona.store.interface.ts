import { IDataGridDefinition, IDataGridSource, IComboList, FormType } from '@sunedu/shared';

export interface IBuscardorMaestroPersona {
  isLoading: boolean;
  error: any;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridBuscardorMaestroPersona>>;
  formBuscar: Partial<IFormBuscardorMaestroPersona>;
  comboLists: {
    tipoPersonas: IComboList;
  };
  tipoPersona: string;
  readOnly?:boolean;
}
export interface IGridBuscardorMaestroPersona {
  id: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  tipoSexoEnum: string;
  tipoDocumetoEnum: string;
  numeroDocumento: string;
  codigoNacionalidad: string;
  tipoPersonaEnum: string;
}
export interface IFormBuscardorMaestroPersona {
  id: string;
  idVersion: string;
  listSexoEnum: any;
}

export interface IFormMaestroPersona {
  id: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  tipoSexoEnum: string;
  tipoDocumentoEnum: string;
  descripcionTipoDocumento: string;
  numeroDocumento: string;
  codigoNacionalidad: string;
  tipoPersonaEnum?: number;
  docente: Partial<IDocente>;
  noDocente: Partial<INoDocente>;
  cantidadProgramaVinculado: string;
}
export interface IDocente {
  tipoGradoAcademicoMayorEnum: string;
  descripcionGradoAcademicoMayor: string;
  tipoCategoriaDocenteEnum: string;
  anioCategoria: string;
  tipoRegimenDedicatoriaEnum: string;
  conActividadInvestigacionEnum: string;
  conRENACYTEnum: string;
  grupoRENACYTEnum: string;
  nivelRENACYTEnum: string;
  fechaInicioContrato: any;
  fechaFinContrato: any;
  idNivelProgramas: Array<string>;
  comentario: string;
  nivelProgramaPregrado: boolean;
  nivelProgramaMaestria: boolean;
  nivelProgramaDoctorado: boolean;
}
export interface INoDocente {
  tipoGradoAcademicoMayorEnum: string;
  descripcionGradoAcademicoMayor: string;
  denominacionPuesto: string;
  idNivelProgramas: Array<string>;
  comentario: string;
  nivelProgramaPregrado: boolean;
  nivelProgramaMaestria: boolean;
  nivelProgramaDoctorado: boolean;
}
export interface IModalMaestroPersona {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormMaestroPersona>;
  codigoMaestroPersona?: string;
  idVersion?: string;
  comboLists: {
    sexos: IComboList;
    tipoDocumentos: IComboList;
    paises: IComboList;
    mayorGrados: IComboList;
    categoriaDocentes: IComboList;
    regimenDedicaciones: IComboList;
    actividaInvestifacion: IComboList;
    grupoRENACYT: IComboList;
    nivelRENACYT: IComboList;
    registraRENACYT: IComboList;
  };
}
export interface IModalMaestroNoDocente {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormMaestroPersona>;
  codigoMaestroPersona?: string;
  idVersion?: string;
  comboLists: {
    sexos: IComboList;
    tipoDocumentos: IComboList;
    paises: IComboList;
    mayorGrados: IComboList;
  };
}
export interface IFormGradoAcademico {
  id: string;
  tipoMencionEnum: string;
  mencion: string;
  codigoPaisGrado: string;
  codigoUniversidadGrado: string;
  institucionGrado: string;  
  resolucionSunedu: string;
  esTitulado: string;
  denominacionTitulo: string;
  codigoPaisTitulo: string;
  codigoUniversidadTitulo: string;
  institucionTitulo: string;  
}
export interface IModalGradoAcademico {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormGradoAcademico>;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridGradoAcademico>>;
  codigoMaestroPersona?: string;
  gradoAcademico: any;
  idVersion?: string;
  comboLists: {
    tipoGrado: IComboList;
    paises: IComboList;
    listadoUniversidades: IComboList;
    tipoRespuesta: IComboList;
  };
  readOnly?:boolean;
  nombre_docente: string;
}
export interface IFormProgramaDocente {
  idPrograma: string;
  nombre: string;
  facultad: string;
  grado: string;
  titulo: string;
}
export interface IGridGradoAcademico {
  id: string;
  tipoMencionEnum: string;
  mencion: string;
  codigoPaisGrado: string;
  institucionGrado: string;
  resolucionSunedu: string;
}
export interface IGridProgramaDocente {
  idPrograma: string;
  nombre: string;
  facultad: string;
  grado: string;
  titulo: string;
}
export interface IModalProgramaDocente {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormProgramaDocente>;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridProgramaDocente>>;
  codigoMaestroPersona?: string;
  idVersion?: string;
  comboLists: {
    programas: IComboList;
  };
  readOnly?:boolean;
}

export interface IFormProgramaNoDocente {
  idPrograma: string;
  nombre: string;
  facultad: string;
  grado: string;
  titulo: string;
}
export interface IGridProgramaNoDocente {
  idPrograma: string;
  nombre: string;
  facultad: string;
  grado: string;
  titulo: string;
}
export interface IModalProgramaNoDocente {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormProgramaNoDocente>;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridProgramaNoDocente>>;
  codigoMaestroPersona?: string;
  idVersion?: string;
  comboLists: {
    programas: IComboList;
  };
  readOnly?:boolean;
}


export interface IFormHoraAsignadaDocente {
  tipoHoraActividadEnum: string;
  descripcionHoraActividad: string;
  cantidad: string;
  HoraActividades: Array<IGridHoraAsignadaDocente>;
  idVersion?: string;
}
export interface IGridHoraAsignadaDocente {
  Id: string;
  TipoHoraActividadEnum: string;
  DescripcionTipoHora: string;
  Cantidad: string;
}
export interface IModalHoraAsignadaDocente {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  form: Partial<IFormHoraAsignadaDocente>;
  gridDefinition: IDataGridDefinition;
  source: IDataGridSource<Partial<IGridHoraAsignadaDocente>>;
  codigoMaestroPersona?: string;
  horaActividadesTotal?: [];
  comboLists: {
    horaActividades: IComboList;
  };
  readOnly?:boolean;
}

export interface IFromAgregarPersona {
  idTipo: string;
}
export interface IAgregarPersona {
  isLoading: boolean;
  error: any;
  form: IFromAgregarPersona;
  comboLists: {
    tipoPersonas: any[];
  };
}

export interface IFormato {
  currentForm: string;
}

export enum TIPO_PERSONA {
  DOCENTE = 1,
  NODOCENTE = 2
}
export enum NIVELPROGRAMA {
  NIVELPROGRAMAPREGRADO = 1,
  NIVELPROGRAMAMAESTRIA = 2,
  NIVELPROGRAMADOCTORADO = 3
}

export enum TIPOMENCION {
  BACHILLER = 1,
  TITULO = 2,
  MAESTRIA = 3,
  DOCTORADO = 4,
  SEGUNDAESPECIALIDAD = 5
}
export enum HORAASIGNADA {
  AGREGAR = 1,
  ELIMINAR = 2
}
export enum TIPODOCUMENTO {
  DNI = 1,
  CE = 2
}
export enum TIPOGRADO {
  BACHILLER = 1,
  MAESTRIA = 2,
  DOCTORADO = 3
}
export enum ESTITULADO {
  SI = 1,
  NO = 2
}

export enum TIPO_AUTPORIZACION_ENTIDAD {
  VIGENTES = "1",
  HISTORICOS = "2"
}
export enum ESTADO_VIGENCIA_ENTIDAD {
  LICENCIADA = 1,
  LEYCREACION = 2,
  AUTORIZACIONDEFINITIVA = 3,
  AUTORIZACIONPROVISIONAL = 4,
  CESEVOLUNTARIO = 5,
  LICENCIADENEGADA = 6,
  LICENCIACANCELADA = 7,
  PENDIENTE = 8
}
