import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormType, FormModel, AlertService } from '@sunedu/shared';
import { Observable } from 'rxjs';
import firmaSettings from '../../../store/firmaSettings.json';
import { environment } from '../../../../../../src/environments/environment';
import { APP_CLOSE_MODAL } from '@lic/core';

@Component({
  selector: 'app-modal-firma',
  templateUrl: './app-modal-firma.component.html',
})
export class ModalFirmaComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalFirma>;
  model: ModelFirma;
  state$: Observable<IModalFirma>;
  @Output() succesEvent = new EventEmitter<StatusFirma>();
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(public dialogRef: MatDialogRef<ModalFirmaComponent>) {}

  @HostListener('window:message', ['$event'])
  RespuestaSignNet(me: MessageEvent) {
    const re = JSON.parse(me.data);

    this.succesEvent.emit({
      success: re.resultado === '1',
      message: re.estado,
    });
  }

  ngOnInit() {
    this.loadConfig();
  }

  ngOnDestroy(): void {}

  loadConfig() {
    this.state$ = new Observable<IModalFirma>((observer) => {
      const value: IModalFirma = {
        title: 'SignNet',
        isLoading: false,
        error: null,
        type: FormType.CONSULTAR,
        id: null,
      };

      observer.next(value);
      observer.complete();
    });
    setTimeout(this.setFirmar, 1000);
  }
  handleSubmit = () => {
    this.form.submit();
  };
  handleClose = () => {
    this.dialogRef.close();
  };

  setFirmar = () => {
    const lmodel = this.model;

    // const obj: FirmaSettings = firmaSettings;
    firmaSettings.accion = environment.linu_firma_accion;
    firmaSettings.urlConfigService = environment.linu_firma_urlConfigService;
    firmaSettings.webService = environment.linu_firma_webService;
    firmaSettings.rutaOrigen = environment.linu_firma_rutaOrigen;
    firmaSettings.rutaDestino = environment.linu_firma_rutaDestino;

    const obj: FirmaSettings = Object.assign({}, firmaSettings);
    obj.alias = lmodel.nroDocumento;
    obj.rutaOrigen = obj.rutaOrigen + lmodel.rutaOrigen;
    obj.rutaDestino = obj.rutaDestino + lmodel.rutaDestino;
    obj.nombreArchivos = lmodel.nombreArchivos;

    let form: HTMLFormElement = document.getElementById(
      'frmFirma'
    ) as HTMLFormElement;
    if (form !== null) {
      document.body.removeChild(form);
    }
    form = document.createElement('form');
    document.body.appendChild(form);
    form.id = 'frmFirma';
    form.method = 'post';
    form.action = obj.accion;
    form.target = 'iframeFirma';

    Object.getOwnPropertyNames(obj).forEach(
      (pro: any, idx: number, array: any) => {
        if (pro !== 'accion' || pro !== 'estado' || pro !== 'urlViewService') {
          const input: HTMLInputElement = document.createElement('input');
          input.id = pro;
          input.name = pro;
          input.value = obj[pro];
          input.type = 'hidden';

          form.appendChild(input);
        }
      }
    );

    form.submit();
  };
}

export interface StatusFirma {
  success: boolean;
  message: string;
}
export interface IModalFirma {
  title: string;
  isLoading: boolean;
  error: any;
  type: FormType;
  id?: string;
}
export interface ModelFirma {
  nroDocumento: string;
  rutaOrigen: string;
  rutaDestino: string;
  nombreArchivos: string;
}
export interface FirmaSettings {
  estado: boolean;
  accion: string;
  cargo: string;
  comentario: string;
  razon: string;
  ubicacion: string;
  rutaOrigen: string;
  rutaDestino: string;
  nombreArchivos: string;
  posicionFirma: string;
  ubicacionPagina: string;
  urlConfigService: string;
  webService: string;
  invisible: string;
  rutaImagen: string;
  imagen: string;
  altoRubrica: string;
  anchoRubrica: string;
  activarDescripcion: string;
  estiloFirma: string;
  aplicarImagen: string;
  usarPersonalizado: string;
  tipoFirma: string;
  listarArchivos: string;
  nomarch: string;
  nombreTag: string;
  tamanoFuente: string;
  alias: string;
  session: string;
  coordenadas: string;
  numeroPagina: string;
  firmarPfxAlmacen: string;
  tipoCades: string;
  urlViewService: string;
  ValidarFirmante: boolean;
}
