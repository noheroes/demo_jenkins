import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IGridBandejaTaller, IBandejaTaller,
  IFormTaller,IEntidadTaller,
  IFormTallerPrograma,IEntidadTallerPrograma,IGridBandejaTallerPrograma, IRequestTaller, IPrograma } from './taller.store.interface';

  export class  RequestTaller implements IRequestTaller {
    id = '';
    idVersion = '';
    idSedeFilial = '';
    idLocal = '';   
    listTipoTaller = [];
  }

//Bandeja Taller
export class DataGridSourceTaller implements IDataGridSource<IGridBandejaTaller>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaTaller implements IBandejaTaller {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Código de Taller', field: 'codigo' },
      { label: 'Nombre del Taller', field: 'nombre' },
      { label: 'Tipo del Taller', field: 'descripcionTipoLaboratorioTaller' },
      { label: 'Ref ubicación Taller', field: 'ubicacion' },
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
          BuildGridButton.ELIMINAR()          
        ]
      }
    ]
  };
  source = new DataGridSourceTaller();
  form = new RequestTaller();  
}
//Form Taller
export class EntidadTaller implements IEntidadTaller{
  id = '';  
  codigoLocal= '';
  idLocal= '';  
  codigo= '';
  nombre= '';
  tipoLaboratorioTallerEnum= '';
  ubicacion= '';
  aforo= '';
  programa = new Programa();
  comentario= '';
  cantidadProgramaVinculado = '';
}

export class Programa implements IPrograma {
  idPrograma = '';
  programaMencion = '';
  facultad = '';
  gradoAcademico = '';
  titulo = '';
}

export class FormTaller implements IFormTaller {
  title = 'Agregar Taller';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new EntidadTaller();
  codigoTaller = null;
  codigoLocal = null;
  comboLists = {
    tipoTalleres: new ComboList([{ 'text': 'tipoTaller 1', 'value': '1' }]),
  };
}
//Form TallerPrograma
export class EntidadTallerPrograma implements IEntidadTallerPrograma{
  idPrograma = '';
  facultad  = '';
  gradoAcademico = '';
  programaMencion = '';
  titulo = '';
  codigoProgramaVinculado = '';
}
export class DataGridSourceTallerPrograma implements IDataGridSource<IGridBandejaTallerPrograma>{
  items = [];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}
export class FormTallerPrograma implements IFormTallerPrograma {
  title = 'Agregar programa';
  isLoading = false;
  error = null;
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
  source = new DataGridSourceTallerPrograma();
  type = FormType.EDITAR;
  form = new EntidadTallerPrograma();
  codigoTaller = null;
  idSedeFilial = null;
  idLocal = null;
  formato = [];
  formatoDetalle = [];
  comboLists = {
    programas: new ComboList([]),
  };
  allItems=[];
}

export class TallerStoreModel {
  bandejaTaller = new BandejaTaller();
  formTaller = new FormTaller();
  formTallerPrograma = new FormTallerPrograma();
}

