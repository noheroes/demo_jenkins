import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IFormBuscardorMaestroPersona, IGridBuscardorMaestroPersona, IBuscardorMaestroPersona, IFormMaestroPersona, IModalMaestroPersona, IDocente, IFormGradoAcademico, IModalGradoAcademico, IModalProgramaDocente, IFormProgramaDocente, IGridProgramaDocente, IFormHoraAsignadaDocente, IGridHoraAsignadaDocente, IModalHoraAsignadaDocente, INoDocente, IModalMaestroNoDocente, IFromAgregarPersona, IAgregarPersona, IFormProgramaNoDocente, IGridProgramaNoDocente, IModalProgramaNoDocente, IGridGradoAcademico, IFormato } from './maestropersona.store.interface';

export class FormBuscardorMaestroPersona implements IFormBuscardorMaestroPersona {
  id = '';
  idVersion = '';
  listSexoEnum = [];
}

export class DataGridSource implements IDataGridSource<IGridBuscardorMaestroPersona>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorMaestroPersona implements IBuscardorMaestroPersona {
  comboLists = {
    tipoPersonas: new ComboList([])
  };
  tipoPersona = '';
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Apellido paterno', field: 'apellidoPaterno' },
      { label: 'Apellido materno', field: 'apellidoMaterno' },
      { label: 'Nombres', field: 'nombres' },
      { label: 'Sexo', field: 'tpl-sexo' },
      { label: 'Cant de Programas Vinculados', field: 'cantidadProgramaVinculado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'GRADO_ACADEMICO',
            icon: 'school',
            color: 'primary',
            tooltip: 'Grado académico',
            hidden: (item => item.tipoPersonaEnum == '2')
          },
          {
            action: 'PROGRAMA_DOCENTE',
            icon: 'library_books',
            color: 'primary',
            tooltip: 'Vinculación con Programa'
          },
          {
            action: 'HORARIO_ASIGNACION',
            icon: 'table_view',
            color: 'primary',
            tooltip: 'Horario asignación',
            hidden: (item => item.tipoPersonaEnum == '2')
          },
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorMaestroPersona();
}

export class BuscardorMaestroNoDocente implements IBuscardorMaestroPersona {
  comboLists = {
    tipoPersonas: new ComboList([])
  };
  tipoPersona = '';
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Apellido paterno', field: 'apellidoPaterno' },
      { label: 'Apellido materno', field: 'apellidoMaterno' },
      { label: 'Nombres', field: 'nombres' },
      { label: 'Sexo', field: 'tpl-sexo' },
      { label: 'Cant de Programas Vinculados', field: 'cantidadProgramaVinculado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'GRADO_ACADEMICO',
            icon: 'school',
            color: 'primary',
            tooltip: 'Grado académico',
            hidden: (item => item.tipoPersonaEnum == '2')
          },
          {
            action: 'PROGRAMA_DOCENTE',
            icon: 'library_books',
            color: 'primary',
            tooltip: 'Vinculación con Programa'
          },
          {
            action: 'HORARIO_ASIGNACION',
            icon: 'table_view',
            color: 'primary',
            tooltip: 'Horario asignación',
            hidden: (item => item.tipoPersonaEnum == '2')
          },
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  formBuscar = new FormBuscardorMaestroPersona();
}

export class Docente implements IDocente {
  tipoGradoAcademicoMayorEnum = '';
  descripcionGradoAcademicoMayor = '';
  tipoCategoriaDocenteEnum = '';
  anioCategoria = '';
  tipoRegimenDedicatoriaEnum = '';
  conActividadInvestigacionEnum = '';
  conRENACYTEnum = '';
  grupoRENACYTEnum = '';
  nivelRENACYTEnum = '';
  fechaInicioContrato = '';
  fechaFinContrato = '';
  idNivelProgramas = [];
  comentario = '';
  nivelProgramaPregrado = false;
  nivelProgramaMaestria = false;
  nivelProgramaDoctorado = false;
}
export class NoDocente implements INoDocente {
  tipoGradoAcademicoMayorEnum = '';
  descripcionGradoAcademicoMayor = '';
  denominacionPuesto = '';
  idNivelProgramas = [];
  comentario = '';
  nivelProgramaPregrado = false;
  nivelProgramaMaestria = false;
  nivelProgramaDoctorado = false;
}
export class FormMaestroPersona implements IFormMaestroPersona {
  id = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  nombres = '';
  tipoSexoEnum = '';
  tipoDocumentoEnum = '';
  descripcionTipoDocumento = '';
  numeroDocumento = '';
  codigoNacionalidad = '';
  tipoPersonaEnum = null;
  docente = new Docente();
  noDocente = new NoDocente();
  cantidadProgramaVinculado = '';
}
export class ModalMaestroPersona implements IModalMaestroPersona {
  title = 'Agregar docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormMaestroPersona();
  codigoMaestroPersona = null;
  idVersion = null;
  comboLists = {
    sexos: new ComboList([]),
    tipoDocumentos: new ComboList([]),
    paises: new ComboList([]),
    mayorGrados: new ComboList([]),
    categoriaDocentes: new ComboList([]),
    regimenDedicaciones: new ComboList([]),
    actividaInvestifacion: new ComboList([]),
    registraRENACYT: new ComboList([]),
    grupoRENACYT: new ComboList([]),
    nivelRENACYT: new ComboList([])
  };
}

export class ModalMaestroNoDocente implements IModalMaestroNoDocente {
  title = 'Agregar no docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormMaestroPersona();
  codigoMaestroPersona = null;
  idVersion = null;
  comboLists = {
    sexos: new ComboList([], true),
    tipoDocumentos: new ComboList([], true),
    paises: new ComboList([], true),
    mayorGrados: new ComboList([], true),
    categoriaDocentes: new ComboList([], true),
  };

}
export class FormGradoAcademico implements IFormGradoAcademico {
  id='';
  tipoMencionEnum= '';
  mencion= '';
  codigoPaisGrado= '';
  codigoUniversidadGrado= '';
  institucionGrado= '';
  resolucionSunedu= '';
  esTitulado= '';
  denominacionTitulo= '';
  codigoPaisTitulo= '';
  codigoUniversidadTitulo= '';
  institucionTitulo= '';
}
export class ModalGradoAcademico implements IModalGradoAcademico {
  title = 'Agregar persona';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormGradoAcademico();
  codigoMaestroPersona = null;
  gradoAcademico = null;
  idVersion = null;
  nombre_docente = null;
  gridDefinition = {
    columns: [
      { label: 'Tipo de grado y/o título', field: 'descTipoGrado' },
      { label: 'Mención del grado y/o título', field: 'mencion' },
      { label: 'País del grado y/o título', field: 'descPaisGrado' },
      { label: 'Institución del grado y/o título', field: 'descInstGrado' },
      { label: 'Res. Sunedu', field: 'resolucionSunedu' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridGradoAcademicoSource();
  comboLists = {
    tipoGrado: new ComboList([]),
    listadoUniversidades: new ComboList([]),
    tipoRespuesta: new ComboList([]),
    paises: new ComboList([])
  };
}
export class FormProgramaDocente implements IFormProgramaDocente {
  idPrograma = '';
  nombre = '';
  facultad = '';
  grado = '';
  titulo = '';
}
export class DataGridGradoAcademicoSource implements IDataGridSource<IGridGradoAcademico>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}
export class DataGridProgramaDocenteSource implements IDataGridSource<IGridProgramaDocente>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class ModalProgramaDocente implements IModalProgramaDocente {
  title = 'Programas en los que dicta clases el docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormProgramaDocente();
  gridDefinition = {
    columns: [
      { label: 'Denominación del programa', field: 'descripcion' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridProgramaDocenteSource();
  codigoMaestroPersona?= null;
  comboLists = {
    programas: new ComboList([]),
  };
}


export class FormProgramaNoDocente implements IFormProgramaNoDocente {
  idPrograma = '';
  nombre = '';
  facultad = '';
  grado = '';
  titulo = '';
}
export class DataGridProgramaNoDocenteSource implements IDataGridSource<IGridProgramaNoDocente> {
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class ModalProgramaNoDocente implements IModalProgramaNoDocente {
  title = 'Programas en los que dicta clases el docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormProgramaNoDocente();
  gridDefinition = {
    columns: [
      { label: 'Denominación del programa', field: 'descripcion' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridProgramaNoDocenteSource();
  codigoMaestroPersona?= null;
  comboLists = {
    programas: new ComboList([]),
  };
}



export class FormHoraAsignadaDocente implements IFormHoraAsignadaDocente {
  tipoHoraActividadEnum = '';
  cantidad = '';
  HoraActividades = [];
  idVersion = null;
  descripcionHoraActividad = '';
}
export class DataGridHoraAsignadaDocenteSource implements IDataGridSource<IGridHoraAsignadaDocente>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class ModalHoraAsignadaDocente implements IModalHoraAsignadaDocente {
  title = 'Programas en los que dicta clases el no docente';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new FormHoraAsignadaDocente();
  gridDefinition = {
    columns: [
      { label: 'Actividad', field: 'descripcionHoraActividad' },
      { label: 'Cantidad de Horas', field: 'cantidad' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridProgramaDocenteSource();
  codigoMaestroPersona?= '';
  comboLists = {
    horaActividades: new ComboList([]),
  };
}

export class FromAgregarPersona implements IFromAgregarPersona {
  idTipo = '';
}
export class AgregarPersona implements IAgregarPersona {
  isLoading = false;
  error = null;
  form = new FromAgregarPersona();
  comboLists = {
    tipoPersonas: []
  };
}

export class Formato implements IFormato {
  currentForm = 'maestroPersona';
}

export class MaestroPersonaStoreModel {
  buscadorMaestroNoDocente = new BuscardorMaestroNoDocente();
  buscadorMaestroPersona = new BuscardorMaestroPersona();
  modalMaestroPersona = new ModalMaestroPersona();
  modalMaestroNoDocente = new ModalMaestroNoDocente();
  modalGradoAcademico = new ModalGradoAcademico();
  modalProgramaDocente = new ModalProgramaDocente();
  modalProgramaNoDocente = new ModalProgramaNoDocente();
  modalHoraAsignadaDocente = new ModalHoraAsignadaDocente();
  agregarPersona = new AgregarPersona();
  formato: Formato = new Formato();  
}
