import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-gestor-archivos-tags',
  templateUrl: './gestor-archivos-tags.component.html',
  styleUrls: ['./gestor-archivos-tags.component.scss']
})
export class GestorArchivosTagsComponent implements OnInit {

  @Input() existeArchivo: any = null;

  @Input() tags: string;

  @Input() editable: boolean = false;

  @Input() disabled: boolean = false;

  @Output() changeTag: EventEmitter<string> = new EventEmitter();

  @Output() save: EventEmitter<any> = new EventEmitter();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  ngOnInit() {
  }

  get tagsArray() {
    if (!this.tags) { return []; }
    return this.tags.split(',');
  }

  handleRemove = ($index) => {

    const tags = [...this.tagsArray];

    tags.splice($index, 1);

    this.changeTag.emit(tags.join(','));
  }

  handleAdd = (event) => {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      const tags = [...this.tagsArray, value.trim()];
      this.changeTag.emit(tags.join(','));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

}
