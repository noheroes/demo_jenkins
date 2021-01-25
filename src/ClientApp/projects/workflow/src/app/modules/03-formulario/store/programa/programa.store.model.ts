import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IRequestSolicitudVersion,IEntidadProgramaMencionSedeFilial,
  IBuscadorPrograma,IEntidadBuscador,
  IGridBandejaPrograma,IEntidadPrograma, IBandejaPrograma } from './programa.store.interface';

export class  RequestSolicitudVersion implements IRequestSolicitudVersion {
  idVersion = '';
}
//Buscador
export class EntidadBuscador implements IEntidadBuscador{
  idSedeFilial='';
  idLocal= '';
  modalidadEstudio= '';
  programaMencion= '';
  facultad= '';
}
export class BuscadorPrograma implements IBuscadorPrograma {
  isLoading = false;
  error = null;
  form = new EntidadBuscador();
  comboLists = {
    modalidadEstudios: new ComboList([{ 'text': 'modalidadEstudios 1', 'value': '1' }])
  };
}

//Bandeja
export class EntidadProgramaMencionSedeFilial implements IEntidadProgramaMencionSedeFilial{
  IdLocal='';
  IdPrograma='';
  DenominacionPrograma='';
  Facultad=''; 
  GradoAcademico='';
  Titulo='';
  Id='';
}
export class GridBandejaPrograma implements IGridBandejaPrograma {
  id='';
  numero='';
  denominacionPrograma='';
  facultad='';
  gradoAcademico='';
  titulo='';
  idPrograma='';
}
export class EntidadPrograma implements IEntidadPrograma {
  id='';
  denominacionPrograma='';  
  idFacultad='';
  denominacionGradoAcademico='';
  idPrograma='';
  denominacionTituloOtorgado='';
}
export class DataGridSource implements IDataGridSource<IGridBandejaPrograma>{
  items = [ ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaPrograma implements IBandejaPrograma {
  isLoading = false;
  error = null;
  type = FormType.BUSCAR;
  //form = new FormPrograma();
  codigoPrograma = null;
  gridDefinition = {
    columns: [
      { label: 'Denominación del programa', field: 'denominacionPrograma' },
      //{ label: 'Facultad', field: 'facultad' },
      { label: 'Grado académico', field: 'gradoAcademico' },
      { label: 'Título', field: 'titulo' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          BuildGridButton.ELIMINAR()
        ]
      }
    ]
  };
  source = new DataGridSource();
  form = new EntidadPrograma();
  comboLists = {
    listadoProgramas:  new ComboList([]),
  };
  formBuscar = new BuscadorPrograma();
  formRequest = new RequestSolicitudVersion();
  idPrograma = '';
  programas = [];
  allItems = [];
}

export class ProgramaStoreModel {
  buscadorPrograma = new BuscadorPrograma();
  bandejaPrograma = new BandejaPrograma();
}

