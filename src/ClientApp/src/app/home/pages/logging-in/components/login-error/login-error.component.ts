import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss'],
})
export class LoginErrorComponent {
  @Input() message;
  @Output('on-retry') onRetryEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  handleRetry = () => {
    this.onRetryEvent.emit();
  };
}
