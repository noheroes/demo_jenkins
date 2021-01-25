import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gestor-archivos-progress',
  templateUrl: './gestor-archivos-progress.component.html',
  styleUrls: ['./gestor-archivos-progress.component.scss']
})
export class GestorArchivosProgressComponent implements OnInit {

  @Input() show: boolean = false;
  @Input() progress: number = 0;
  @Input() indeterminate: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
