import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss']
})
export class WellcomeComponent implements OnInit {
  @Output('on-click-login') onClickLoginEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  handleClickLogin = () => {
    this.onClickLoginEvent.emit();
  }
}
