import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IRequestSolicitudVersion,IEntidadSegundaEspecialidadSedeFilial,
  IBuscadorProgramaSe,IEntidadBuscador,
  IGridBandejaProgramaSe,IEntidadProgramaSe, IBandejaProgramaSe } from './programase.store.interface';

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
export class BuscadorProgramaSe implements IBuscadorProgramaSe {
  isLoading = false;
  error = null;
  form = new EntidadBuscador();
  comboLists = {
    modalidadEstudios: new ComboList([{ 'text': 'modalidadEstudios 1', 'value': '1' }])
  };
}

//Bandeja
export class EntidadSegundaEspecialidadSedeFilial implements IEntidadSegundaEspecialidadSedeFilial{
  idLocal='';
  idSegundaEspecialidad='';
  denominacionSegundaEspecialidad='';
  facultad=''; 
  gradoAcademico='';
  titulo='';
  id='';
}
export class GridBandejaProgramaSe implements IGridBandejaProgramaSe {
  id='';
  numero='';
  denominacionPrograma='';
  facultad='';
  gradoAcademico='';
  titulo='';;
  idPrograma ='';
}
export class EntidadProgramaSe implements IEntidadProgramaSe {
  id='';
  denominacionPrograma='';
  idFacultad='';
  denominacionGradoAcademico='';
  idPrograma='';
  denominacionTituloOtorgado='';
}
export class DataGridSource implements IDataGridSource<IGridBandejaProgramaSe>{
  items = [ ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaProgramaSe implements IBandejaProgramaSe {
  isLoading = false;
  error = null;
  type = FormType.BUSCAR;
  //form = new FormProgramaSe();
  codigoProgramaSe = null;
  gridDefinition = {
    columns: [
      { label: 'Denominación del programa', field: 'denominacionPrograma' },
      //{ label: 'Facultad', field: 'facultad' },
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
  form = new EntidadProgramaSe();
  comboLists = {
    listadoProgramas:  new ComboList([]),
  };
  formBuscar = new BuscadorProgramaSe();
  formRequest = new RequestSolicitudVersion();
  idProgramaSe = '';
  ProgramaSes = [];
  allItems = [];
}

export class ProgramaSeStoreModel {
  buscadorProgramaSe = new BuscadorProgramaSe();
  bandejaProgramaSe = new BandejaProgramaSe();
}

