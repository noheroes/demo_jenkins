import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import {
  IRequestLaboratorio, IGridBandejaLaboratorio, IBandejaLaboratorio,
  IFormLaboratorio, IEntidadLaboratorio,
  IFormLaboratorioPrograma, IEntidadLaboratorioPrograma, IGridBandejaLaboratorioPrograma, IPrograma, IFormato
} from './laboratorio.store.interface';

export class RequestLaboratorio implements IRequestLaboratorio {
  id = '';
  idVersion = '';
  idSedeFilial = '';
  idLocal = '';
  listTipoLaboratorio = [];
  codigoLocal = '';
}
//Bandeja Laboratorio
export class DataGridSourceLaboratorio implements IDataGridSource<IGridBandejaLaboratorio>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaLaboratorio implements IBandejaLaboratorio {
  id = '';
  idVersion = '';
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [      
      { label: 'Código de Laboratorio', field: 'codigo' },
      { label: 'Nombre del Laboratorio', field: 'nombre' },
      { label: 'Tipo del Laboratorio', field: 'descripcionTipoLaboratorioTaller' },
      { label: 'Ref ubicación Laboratorio', field: 'ubicacion' },
      { label: 'Cant de Programas Vinculados', field: 'cantidadProgramaVinculado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'AGREGAR_EQUIPAMIENTO',
            icon: 'dynamic_feed',
            color: 'primary',
            tooltip: 'Equipamiento'
          },
          {
            action: 'VER_DOCUMENTO',
            icon: 'link',
            color: 'primary',
            tooltip: 'Vinculación con Programa'
          },
          BuildGridButton.CONSULTAR(),
          BuildGridButton.EDITAR(),
          BuildGridButton.ELIMINAR(),
        ]
      }
    ]
  };
  source = new DataGridSourceLaboratorio();
  comboLists = {
    locales: new ComboList([{ 'text': 'locale 1', 'value': '1' }]),
  };
  form = new RequestLaboratorio();
}
//Form Laboratorio
export class EntidadLaboratorio implements IEntidadLaboratorio {
  id = '';
  codigoLocal = '';
  idLocal = '';
  numero = '';
  codigo = '';
  nombre = '';
  tipoLaboratorioTallerEnum = '';
  ubicacion = '';
  aforo = '';
  programa = new Programa();
  comentario = '';
  cantidadProgramaVinculado = '';
  //tipoEquipamiento = '';
}

export class Programa implements IPrograma {
  idPrograma = '';
  programaMencion = '';
  facultad = '';
  gradoAcademico = '';
  titulo = '';
}

export class FormLaboratorio implements IFormLaboratorio {
  title = 'Agregar laboratorio';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new EntidadLaboratorio();
  codigoLaboratorio = null;
  codigoLocal = null;
  comboLists = {
    tipoLaboratorios: new ComboList([{ 'text': 'tipoLaboratorio 1', 'value': '1' }]),
  }
}
//Form LaboratorioPrograma
export class EntidadLaboratorioPrograma implements IEntidadLaboratorioPrograma {
  codigoProgramaVinculado = '';
}
export class DataGridSourceLaboratorioPrograma implements IDataGridSource<IGridBandejaLaboratorioPrograma>{
  items = [
    {
      id: '',
      numeroOrden: '',
      programaMencion: '',
      factultad: '',
      gradoAcademico: '',
      titulo: '',
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}
export class FormLaboratorioPrograma implements IFormLaboratorioPrograma {
  title = 'Agregar programa';
  isLoading = false;
  error = null;
  idVersion = '';
  idLaboratorio = '';
  idSedeFilial = '';
  gridDefinition = {
    columns: [
      { label: 'N°', field: 'numeroOrden' },
      { label: 'Programa y mención', field: 'programaMencion' },
      { label: 'Facultad', field: 'facultad' },
      { label: 'Grado académico', field: 'gradoAcademico' },
      { label: 'Título', field: 'titulo' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR(),
        ]
      }
    ]
  };
  source = new DataGridSourceLaboratorioPrograma();
  type = FormType.CONSULTAR;
  form = new EntidadLaboratorioPrograma();
  codigoLaboratorio = null;
  formato = [];
  formatoDetalle = [];
  comboLists = {
    programas: new ComboList([]),
  };
  allItems = [];
}

export class Formato implements IFormato {
  currentForm = 'laboratorio';
}

export class LaboratorioStoreModel {
  bandejaLaboratorio = new BandejaLaboratorio();
  formLaboratorio = new FormLaboratorio();
  formLaboratorioPrograma = new FormLaboratorioPrograma();
  formato: Formato = new Formato();
}
