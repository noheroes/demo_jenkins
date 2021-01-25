import { IDataGridDefinition, IDataGridSource } from '@sunedu/shared';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actividad-grid-errors',
  templateUrl: './app-modal-validar-finalizar.component.html',
  styleUrls: ['./app-modal-validar-finalizar.component.scss']
})
export class ModalValidarFinalizarComponent implements OnInit {

  gridDefinition: IDataGridDefinition = {
    columns: [{
      label: 'Mensaje', field: 'msg'
    }]
  };

  gridSource: IDataGridSource<any>;

  constructor(
    public dialogRef: MatDialogRef<ModalValidarFinalizarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gridSource = { items: data.errors };
  }

  ngOnInit() {
  }

}
