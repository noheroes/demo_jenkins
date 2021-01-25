import {
  IBuscadorBandeja,
  IFormBuscarBandeja,
} from './bandeja.store.interface';

export class FormBuscarBandeja implements IFormBuscarBandeja {
  idProcedimiento = null;
  idEntidad = null;
  numeroSolicitud = null;
}

export class BandejaStoreModel {
  // SET COLUMNAS CAMPOS BANDEJA CAYL
  buscadorBandeja: IBuscadorBandeja = {
    filterLists: {
      idProcedimientos: [],
      idEntidades: [],
      //   idTblOpcionMenu: [],
      //   idTblConfigurablePor: []
    },
    formBuscar: new FormBuscarBandeja(),
    isLoading: false,
    error: null,

    gridDefinition: {
      columns: [
        { label: 'N°', field: 'rowNum' },
        { label: 'Procedimiento', field: 'procedimiento' },
        { label: 'N° de solicitud', field: 'expediente.codigo' },
        { label: 'Universidad', field: 'metaDataProceso.entidad.nombre' },
        // { label: 'Oficina', field: 'descripcionSede' },
        /*
        {
          label: 'Fecha de asignación',
          field: 'fechaAsignacion',
          isDatetime: true,
          dateTimeFormat: 'DD/MM/YYYY hh:mm a',
        },
        */
        { label: 'Actividad', field: 'actividad.nombre' },
        {
          label: 'Fecha de creación',
          field: 'expediente.fechaCreacion',
          isDatetime: true,
          dateTimeFormat: 'DD/MM/YYYY hh:mm A',
        },
        { label: 'Estado', field: 'dsEstado' },
        {
          label: 'Acciones',
          field: 'buttons',
          buttons: [           
            {
              action: 'ATENDER',
              icon: 'group_work',
              color: 'primary',
              tooltip: 'Atender',
              hidden: (item) => item.dsEstado !== 'PENDIENTE'
            },
          ],
        },
      ],
    },
    gridSource: {
      items: [],
      page: 1,
      pageSize: 10,
      total: 0,
      skip: 0,
      orderBy: 'rowNum',
      orderDir: 'asc', // 'desc'
    },
  };
}
