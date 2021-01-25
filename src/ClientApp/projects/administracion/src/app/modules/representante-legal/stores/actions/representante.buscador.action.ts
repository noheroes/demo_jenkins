import { RepresentanteLegal } from './../../../entidades/stores/entidad.store.interface';
import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { IBuscadorRepresentante } from '../representante.store.interface';
import { EntidadService } from '../../../entidades/services/entidad.service';
import {
  IEntidad,
  RepresentanteLegalCustom,
} from '../../../entidades/stores/entidad.store.interface';
import { IDataGridPageRequest, ComboList } from '@sunedu/shared';

export class RepresentanteBuscadorActions {
  constructor(
    private getState: () => IBuscadorRepresentante,
    private setState: (newState: IBuscadorRepresentante) => void,
    private entidadService: EntidadService
  ) {}
  asyncFetchEntidades = (): Observable<IEntidad[]> => {
    this.showLoading(true);

    return this.entidadService.getEntidades().pipe(
      tap((response) => {
        this.showLoading(false);
        return response;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  };

  fetchPageRepresentanteLegal = (
    tipoDocumentoEnum: ComboList,
    items: Array<RepresentanteLegal>,
    total: number,
    pageRequest: IDataGridPageRequest
  ) => {
    let numeroOrden = 0;
    // To Custom
    const reItems = items.map((element) => {
      const reItem = element as RepresentanteLegalCustom;
      const tdEnumItem = tipoDocumentoEnum.list.find(
        (c) => c.value === element.tipoDocumentoEnum
      );     

      reItem.tipoDocumento = tdEnumItem.text;
      reItem.nombresApellidos = `${element.nombres} ${element.apellidoPaterno} ${element.apellidoMaterno}`;
      const index = items.indexOf(element);
      reItem.rowNum = index + 1;

      return reItem;
    }) as RepresentanteLegalCustom[];
    let elementos = (items || []).filter(item => !item.esEliminado);
    const totalItems =(items || []).filter(item => !item.esEliminado).length; 
    const elementosPag = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

      elementosPag.forEach(element => {
        numeroOrden = numeroOrden + 1;
        element['numero'] = numeroOrden;
      });

    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        gridSource: {
          items: { $set: elementosPag },
          total: { $set: totalItems },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip },
        },
      })
    );
  };

  private showLoading = (value: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: value },
      })
    );
  };
  private fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error },
      })
    );
  };
}
