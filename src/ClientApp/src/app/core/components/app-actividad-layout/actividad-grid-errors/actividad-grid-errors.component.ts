import { IDataGridDefinition, IDataGridSource } from '@sunedu/shared';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actividad-grid-errors',
  templateUrl: './actividad-grid-errors.component.html',
  styleUrls: ['./actividad-grid-errors.component.scss']
})
export class ActividadGridErrorsComponent implements OnInit {

  gridDefinition: IDataGridDefinition = {
    columns: [{
      label: 'Mensaje', field: 'msg'
    }]
  };

  gridSource: IDataGridSource<any>;

  constructor(
    public dialogRef: MatDialogRef<ActividadGridErrorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gridSource = { items: data.errors };
  }

  ngOnInit() {
  }

}
