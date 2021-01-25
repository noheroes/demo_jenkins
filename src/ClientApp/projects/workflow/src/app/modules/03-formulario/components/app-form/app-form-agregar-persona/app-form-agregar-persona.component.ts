import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from '@sunedu/shared';
import { Observable } from 'rxjs';
import { IAgregarPersona, TIPO_PERSONA } from '../../../store/maestropersona/maestropersona.store.interface';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import { map, distinctUntilChanged, tap, concatMap } from 'rxjs/operators';
import { AppFormNodocenteComponent } from '../app-form-nodocente/app-form-nodocente.component';
import { AppFormMaestroPersonaComponent } from '../app-form-maestro-persona/app-form-maestro-persona.component';

@Component({
  selector: 'app-form-agregar-persona',
  templateUrl: './app-form-agregar-persona.component.html',
  styleUrls: ['./app-form-agregar-persona.component.scss'],
  entryComponents: [AppFormNodocenteComponent, AppFormMaestroPersonaComponent]
})
export class AppFormAgregarPersonaComponent implements OnInit {
  state$: Observable<IAgregarPersona>;
  @Input() tipo: number;
  @Input() titleButton: string;
  constructor(
    private store: MaestroPersonaStore,
    public dialog: DialogService) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.agregarPersona), distinctUntilChanged());
  }
  handleClickAgregarTipo = () => {
    if (this.tipo === TIPO_PERSONA.DOCENTE) {
      this.openTypeModalDocente();
    } else if (this.tipo === TIPO_PERSONA.NODOCENTE) {
      this.openTypeModalNoDocente();
    }
  }
  private openTypeModalDocente() {
    this.store.maestroPersonaModalActions.setModalNew();
    const dialogRef = this.dialog.openMD(AppFormMaestroPersonaComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed()
      .pipe(
        tap(item => this.store.maestroPersonaModalActions.resetModal()),
        concatMap(item => this.store.maestroPersonaBuscadorActions.asyncFetchPageMaestroPersona())
      ).subscribe();
  }
  private openTypeModalNoDocente() {
    this.store.maestroNoDocenteModalActions.setModalNew();
    const dialogRef = this.dialog.openMD(AppFormNodocenteComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.afterClosed()
      .pipe(
        tap(response => this.store.maestroNoDocenteModalActions.resetModal()),
        concatMap(response => this.store.maestroNoDocenteBuscadorActions.asyncFetchPageMaestroNoDocente())
      ).subscribe();
  }
}
