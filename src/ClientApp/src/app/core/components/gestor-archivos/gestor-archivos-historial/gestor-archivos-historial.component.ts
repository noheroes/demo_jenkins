import { IDataGridSource, IDataGridDefinition } from '@sunedu/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gestor-archivos-historial',
  templateUrl: './gestor-archivos-historial.component.html',
  styleUrls: ['./gestor-archivos-historial.component.scss']
})
export class GestorArchivosHistorialComponent implements OnInit {

  @Input() loading: boolean = false;

  @Input() emptyText: string;

  @Input() source: IDataGridSource<any> = { items: [] };

  @Output() download: EventEmitter<any> = new EventEmitter();

  definition: IDataGridDefinition = {
    columns: [
      {
        label: 'Nombre', field: 'nombre'
      },
      {
        label: 'Autor', field: 'autor'
      },
      {
        label: 'Creado', field: 'fechaCreacion', isDatetime: true, dateTimeFormat: 'DD/MM/YYYY'
      },
      {
        label: 'Versión de archivo', field: 'version', template: 'version'
      },
    ],
  };

  constructor() { }

  ngOnInit() {
  }

  handleDownload = (data) => {
    this.download.emit({
      version: data.version,
      nombre: data.nombre
    });
  }

}
