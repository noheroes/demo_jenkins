import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdministracionModelADM } from './modules/stores/administracion.interface';
import {
  AdministracionStoreModel,
  AdministracionModel,
} from './modules/stores/adminitracion.store.model';
import { AdministracionStore } from './modules/stores/administracion.store';
import { EnumeradoGeneralStore } from '../../../workflow/src/app/modules/03-formulario/store/maestro/enumerado/enumerado.store';

@Component({
  selector: 'app-administracion',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AdministracionStore],
})
export class AppComponent implements OnInit {
  modelData: IAdministracionModelADM = null;
  title: string;
  contentSource: any = null;
  loading: boolean = false;

  public readonly state$: Observable<AdministracionStoreModel> = this
    .administracionStore.state$;
  constructor(
    private storeEnumerado: EnumeradoGeneralStore,
    private administracionStore: AdministracionStore
  ) {

  }

  async ngOnInit() {
    this.setTitle();
    await this.loadConfiguracion();
  }
  private async loadConfiguracion() {
    this.administracionStore.state.isLoading = true;

    const promises: any[] = [];
    promises.push(this.setContentSource());
    promises.push(await this.loadEnumerados());

    await Promise.all(promises).then(() => {
      this.administracionStore.state.isLoading = false;
    });
  }

  private setTitle = () => {
    this.title =
      'Maestro : Información Preliminar para el registro de solicitud';
  };

  private setContentSource = () => {
    return new Promise((resolve) => {
      this.modelData = new AdministracionModel();

      this.contentSource = Object.entries(
        this.modelData.formulario.configuracionTabs
      ).map((k: [string, any]) => ({
        key: k[0],
        ...k[1],
      }));
      resolve();
    });
  };

  private async loadEnumerados() {
    return new Promise((resolve) => {
      this.storeEnumerado.currentEnumeradoActions
        .asyncGetEnumeradosTodos()
        .then(() => {
          // const todo = this.storeEnumerado.currentEnumeradoActions.getEnumerados();
          resolve();
        });
    });
  }
}
