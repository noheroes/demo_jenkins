import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { DialogService, AlertService, IDataGridButtonEvent, IDataGridEvent } from '@sunedu/shared';
import { ListaLocalStore } from '../../../store/listalocal/listalocal.store';
import { ListaLocal } from './../../../store/listalocal/listalocal.store.model';

@Component({
  selector: 'app-container-listalocal',
  templateUrl: './app-container-listalocal.component.html',
  styleUrls: ['./app-container-listalocal.component.scss'],
  providers: [
    ListaLocalStore
  ]
})
export class AppContainerListaLocalComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  readonly state$ = this.store.state$;
  constructor(
    private store: ListaLocalStore,
    public dialog: DialogService,
    private alert: AlertService,
      
  ) { }

  ngOnInit() {
    
  }
  handleInputChange = ({ name, value }) => {
  };
}
