import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AppStore,
  IAppUser,
  IAppSession,
  ICurrentFlow,
} from '@lic/core';
import { Store, Select } from '@ngxs/store';
import { ComboList } from '@sunedu/shared';
import { AppCurrentFlowStore } from '../core/store/app.currentFlow.store';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  constructor(
    private storeCurrent: AppCurrentFlowStore,
    private store: Store
  ) {}

  ngOnInit(): void {
    const session = this.store.selectSnapshot<IAppSession>(
      (state) => state.appStore.session
    );
    //console.log('CAYL session',session);
    const { defaultRol } = session.user;

    const lscurrent = this.storeCurrent.currentFlowAction.getFromLocalStorage();

    if (
      lscurrent == null ||
      lscurrent.idSesion !== session.claims.SESION.GUID_SESION
    ) {
      const current: ICurrentFlow = {
        idSesion: session.claims.SESION.GUID_SESION,
        idUsuario: session.claims.USUARIO.GUID_USUARIO,
        idEntidad: session.user.defaultRol.CODIGO_ENTIDAD,
        esResponsable: session.claims.USUARIO.RESPONSABLE,
        idFlujo: '',
        idTipoUsuario: session.claims.USUARIO.TIPO_USUARIO,
        descripcionSede: defaultRol.DESCRIPCION_SEDE,
        codigoFlujos: [],
        idAplicacion: session.claims.SESION.GUID_SISTEMA,
        usuarioFullName: session.user.fullName,
        usuarioNumeroDocumento: session.claims.USUARIO.NUMERO_DOCUMENTO,
        usuarioEsRolAdministrado: defaultRol.TIPO_ROL_SIU==1?true:false,
        idRol: defaultRol.GUID_ROL,
        rolDescripcion: defaultRol.NOMBRE_ROL,
        idTipoRolSIU: defaultRol.TIPO_ROL_SIU,
        codigoActividad: '',
        idVersionSolicitud: '',
        expediente: null,
        page: 1,
        pageSize: 10,
        programaOne:new ComboList([]),
        programaTwo:new ComboList([])
      };
      this.storeCurrent.currentFlowAction.set(
        current
      );
    } else {
      this.storeCurrent.currentFlowAction.set(
        lscurrent
      );
    }
  }

  ngOnDestroy() {}
}
