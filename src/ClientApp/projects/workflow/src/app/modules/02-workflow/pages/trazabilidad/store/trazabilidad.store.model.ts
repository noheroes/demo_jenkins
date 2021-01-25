import { BuildGridButton, IDataGridSource, ComboList, FormType } from '@sunedu/shared';
import { IBandejaSolicitud, IBandejaTrazabilidad, IBuscadorBandejaTrazabilidad, IBuscardorBandejaSolicitud, IGridBandejaSolicitud, IGridBandejaTrazabilidad, IDataMemory, IEntidadEstado, IEntidadUniversidad, ITrazabilidadRequest, IDataMemoryTrazabilidad } from './trazabilidad.store.interface';
export class DataMemory implements Partial<IDataMemory> {
  universidad = null;
  estado = null;
}
export class DataMemoryTrazabilidad implements Partial<IDataMemoryTrazabilidad> {
  fechamin ='';
  fechamax ='';
  estado = null;
  actividad= null;
  responsable= null;
  rol= null;
  idProceso= null;
}
export class EntidadUniversidad implements IEntidadUniversidad {
  id = '';
  nombre = '';
}
export class EntidadEstado implements IEntidadEstado {
  value = 0;
  text = '';
}

export class BandejaDataGridSource implements IDataGridSource<IGridBandejaSolicitud>{
  items = [
    {
      id: '',
      numeroSolicitud: '',
      universidad: '',
      procedimiento: '',
      fechaCreacion: new Date(),
      estado: '',
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BuscardorBandejaSolicitud implements IBuscardorBandejaSolicitud {
  /**constructor(rol: string = '') {
    this.rol = rol;
  } */
  tipoUsuario = '';
  numeroSolicitud = '';
  idEntidad = '';
}
export class BandejaSolicitud implements IBandejaSolicitud {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: '#', field: 'numero' },
      { label: 'N° Solicitud', field: 'numeroSolicitud' },
      { label: 'Universidad', field: 'universidad' },
      { label: 'Fecha de creación', field: 'fechaCreacion', isDatetime: true, dateTimeFormat: 'DD/MM/YYYY hh:mm A' },
      { label: 'Estado', field: 'estado' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          {
            action: 'VER_TRAZABILIDAD',
            icon: 'list',
            color: 'primary',
            tooltip: 'Ver trazabilidad'
          },
          BuildGridButton.CONSULTAR(),
        ]
      }
    ]
  };
  source = new BandejaDataGridSource();
  formBuscar = new BuscardorBandejaSolicitud();
  dataMemory: Partial<DataMemory> = new DataMemory();
  comboLists = {
    universidades: new ComboList([]),
  };
}

export class BandejaTrazabilidad implements IBandejaTrazabilidad {
  isLoading = false;
  error = null;
  type: FormType.CONSULTAR;
  title = 'Consulta Trazabilidad';
  gridDefinition = {
    columns: [
      { label: 'Fecha de ingreso', field: 'fechaCreacion',   isDatetime: true, dateTimeFormat: 'DD/MM/YYYY hh:mm A',sortable: true},
      { label: 'Fecha de culminación', field: 'fechaFinalizacion',  isDatetime: true, dateTimeFormat: 'DD/MM/YYYY hh:mm A' ,sortable: true},
      { label: 'Actividad', field: 'pasoNombre',  sortable: true},
      { label: 'Rol', field: 'responsableRol',  sortable: true},
      { label: 'Responsable', field: 'responsable',  sortable: true},
      { label: 'Respuesta', field: 'respuestaRuta',  sortable: true},
      { label: 'Estado', field: 'estado',  sortable: true},

    ]
  };
  formBuscar: Partial<BuscadorBandejaTrazabilidad> = new BuscadorBandejaTrazabilidad();
  source = new DataGridSourceTrazabilidad();
  dataMemory: Partial<DataMemoryTrazabilidad> = new DataMemoryTrazabilidad();
  comboLists = {
    actividades: new ComboList([]),
    responsables: new ComboList([]),
    estados: new ComboList([]),
    roles: new ComboList([]),
  };
}
export class DataGridSourceTrazabilidad implements IDataGridSource<IGridBandejaTrazabilidad>{
  items = [
    {
      estado: '',
      fechaCreacion: '',
      fechaFinalizacion: '',
      pasoNombre: '',
      responsable: '',
      responsableRol: '',
      respuestaRuta: '',
    }
  ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}
export class TrazabilidadRequest implements Partial<ITrazabilidadRequest> {
  filter:Partial<BuscadorBandejaTrazabilidad>;
}
export class BuscadorBandejaTrazabilidad implements Partial<IBuscadorBandejaTrazabilidad> {
  idProceso = '';
  tipoUsuario = '';
  fechaMinimo = '';
  fechaMaximo= '';
  pasoNombre='';
  responsable='';
  estado='';
  rol='';
  page=1;
  pageSize=1000;
}



export class TrazabilidadStoreModel {
  bandejaSolicitud = new BandejaSolicitud();
  bandejaTrazabilidad = new BandejaTrazabilidad();
}
