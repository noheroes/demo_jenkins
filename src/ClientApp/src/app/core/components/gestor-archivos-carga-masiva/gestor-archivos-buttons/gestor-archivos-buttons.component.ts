import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sunedu-gestor-archivos-buttons',
  templateUrl: './gestor-archivos-buttons.component.html',
  styleUrls: ['./gestor-archivos-buttons.component.scss']
})
export class GestorArchivosButtonsComponent implements OnInit {

  @Input() friendlyStyle: boolean = false;

  @Input() buttonsOnly: boolean = false;

  @Output() clickAttach: EventEmitter<any> = new EventEmitter();
  @Output() clickDownload: EventEmitter<any> = new EventEmitter();
  @Output() clickUpload: EventEmitter<any> = new EventEmitter();
  @Output() clickDelete: EventEmitter<any> = new EventEmitter();
  @Output() clickHelp: EventEmitter<any> = new EventEmitter();

  @Input() enableAttach: boolean = true;
  @Input() visibleAttach: boolean = true;

  @Input() enableUpload: boolean = true;
  @Input() visibleUpload: boolean = true;

  @Input() enableDownload: boolean = true;
  @Input() visibleDownload: boolean = true;

  @Input() enableDelete: boolean = true;
  @Input() visibleDelete: boolean = true;

  @Input() enableHistory: boolean = true;
  @Input() visibleHistory: boolean = true;

  @Input() enableHelp: boolean = true;
  @Input() visibleHelp: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
