import { AlertService } from '@sunedu/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const MESSAGES = {
  CONFIRM_IR_BANDEJA: '¿Está seguro que desea retornar a bandeja?',
  CONFIRM_FINALIZAR: '¿Está seguro que desea finalizar la actividad?',
};

@Component({
  selector: 'app-actividad-footer',
  templateUrl: './actividad-footer.component.html',
  styleUrls: ['./actividad-footer.component.scss']
})
export class ActividadFooterComponent implements OnInit {

  @Input() finalizarText: string = 'Finalizar Actividad';
  @Input() loading: boolean;
  @Output() clickFinalizar: EventEmitter<any> = new EventEmitter();
  @Output() clickBandeja: EventEmitter<any> = new EventEmitter();
  @Output() clickValidar: EventEmitter<any> = new EventEmitter();

  constructor(private alertService: AlertService) { }

  ngOnInit() {
  }

  handleFinalizar = () => {
    this.alertService.open(MESSAGES.CONFIRM_FINALIZAR, null, { confirm: true })
      .then(c => {
        if (c) {
          this.clickFinalizar.emit(null);
        }
      });
  }

  handleValidar = () => {
    this.clickValidar.emit(null);
  }

  handleIrBandeja = () => {
    this.alertService.open(MESSAGES.CONFIRM_IR_BANDEJA, null, { confirm: true })
      .then(c => {
        if (c) {
          this.clickBandeja.emit(null);
        }
      });
  }

}
