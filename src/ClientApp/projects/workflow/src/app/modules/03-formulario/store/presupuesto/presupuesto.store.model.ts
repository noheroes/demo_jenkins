import { FormType, ComboList, IDataGridSource, BuildGridButton } from '@sunedu/shared';

import { IGridMultiSourcePresupuesto, IEntidadPresupuesto, IFormPresupuesto, IGridBandejaPresupuesto, IBandejaPresupuesto, IEntidadRequestValues, IRequestSolicitudVersion } from './presupuesto.store.interface';
export class RequestSolicitudVersion implements IRequestSolicitudVersion {
  idVersion='';
  idSede='';
  idLocal='';
  tipoCBCEnum='';
}
export class EntidadRequestValues implements IEntidadRequestValues{
  id='';
  idVersion='';
  idSedeFilial='';
  idLocal='';
  tipoCBCEnum=0;
}
export class EntidadPresupuesto implements IEntidadPresupuesto {
  tipoCBCEnum='';
  codigo='';
  concepto='';
  anioUnoPresupuesto=0;
  anioUnoEjecucion=0;
  anioDosPresupuesto=0;
  anioTresPresupuesto=0;
  anioCuatroPresupuesto=0;
  anioCincoPresupuesto=0;
  anioSeisPresupuesto=0;
  esOtroconcepto=false;
  readOnly=true;
}

export class FormPresupuesto implements IFormPresupuesto {
  title = 'Agregar concepto por condición básica de calidad';
  isLoading = false;
  error = null;
  type = FormType.REGISTRAR;
  form = new EntidadPresupuesto();
  tipoCBCEnum = null;
  requestValues = new EntidadRequestValues();
}
export class GridMultiSourcePresupuesto implements IGridMultiSourcePresupuesto {
  tipoCBCEnum ='';
  tipoCBCName ='';
  pageRequest = null;
  source = new DataGridSource();
}
export class DataGridSource implements IDataGridSource<IGridBandejaPresupuesto>{
  items = [ ];
  page = 1;
  pageSize = 10;
  total = 0;
  orderBy = null;
  orderDir = null;
}

export class BandejaPresupuesto implements IBandejaPresupuesto {
  isLoading = false;
  error = null;
  gridDefinition = {
    columns: [
      { label: 'Cod.', field: 'codigo' },
      { label: 'Concepto', field: 'concepto' },
      { label: 'Año-1 Presupuestado', field: 'anioUnoPresupuesto' },
      { label: 'Año-1 Ejecutado', field: 'anioUnoEjecucion' },
      { label: 'Año-2 Presupuestado', field: 'anioDosPresupuesto' },
      { label: 'Año-3 Presupuestado', field: 'anioTresPresupuesto' },
      { label: 'Año-4 Presupuestado', field: 'anioCuatroPresupuesto' },
      { label: 'Año-5 Presupuestado', field: 'anioCincoPresupuesto' },
      { label: 'Año-6 Presupuestado', field: 'anioSeisPresupuesto' },
      {
        label: 'Acciones', field: 'buttons',
        buttons: [
          //BuildGridButton.EDITAR(),
          //BuildGridButton.ELIMINAR(),
          {
            action: 'EDITAR',
            icon: 'attach_money',
            color: 'primary',
            tooltip: 'Editar Presupuesto',
            hidden:item=>item.concepto=="TOTAL" || item.readOnly
          },
          {
            action: 'ELIMINAR',
            icon: 'delete',
            color: 'primary',
            tooltip: 'Eliminar Presupuesto',
            hidden:item=> !item.esOtroconcepto || item.concepto=="TOTAL" || item.readOnly
          }
        ]
      }
    ]
  };
  source = new DataGridSource();
  sourceList = [];
  sourceListTotales = [];
  formRequest = new RequestSolicitudVersion;
}

export class PresupuestoStoreModel {
  formPresupuesto = new FormPresupuesto();
  bandejaPresupuesto = new BandejaPresupuesto();
}
