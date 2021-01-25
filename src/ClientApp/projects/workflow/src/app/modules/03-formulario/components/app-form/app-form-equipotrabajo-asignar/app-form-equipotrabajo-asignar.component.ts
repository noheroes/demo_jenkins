import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { IMiembroEquipoTrabajo, IAsignacionEquipoTrabajo} from '../../../store/equipotrabajo/equipotrabajo.store.interface';
import { ISubmitOptions, AlertService, DialogService, isNullOrEmptyArray, ValidateFormFields, IMsgValidations, FormModel, ComboList, IComboList,Validators as ValidatorsSunedu, } from '@sunedu/shared';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { EquipoTrabajoStore } from '../../../store/equipotrabajo/equipotrabajo.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-equipotrabajo-asignar',
  templateUrl: './app-form-equipotrabajo-asignar.component.html',
  styleUrls: ['./app-form-equipotrabajo-asignar.component.css', './app-form-equipotrabajo-asignar.component.scss']
})
export class AppFormEquipoTrabajoComponent implements OnInit {
  readonly state$ = this.store.state$.pipe(map(x => x.asignacionEquipoModel), distinctUntilChanged());

  isAllExpand: boolean;
  usuariosEquipoTrabajo: IMiembroEquipoTrabajo[] = [];
  documento:any;
  form: FormGroup;
  validators: IMsgValidations;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storeCurrent: AppCurrentFlowStore,
    private store: EquipoTrabajoStore,
    public dialog: DialogService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit() {
    await this.loadUsuarios();
  }

  async loadUsuarios() {
    this.store.state.asignacionEquipoModel.isLoading= true;
    let promises: any[] = [];

    this.buildValidations();
    this.buildForm();
    
    const action0 = await this.getUsuarios();
    promises.push(action0);
    
    //const action1 = await this.getTiposDocumentos();
    //promises.push(action1);
    
    await Promise.all(promises).then(() => { this.store.state.asignacionEquipoModel.isLoading = false; });
  }

  private buildForm = () => {

  }

  buildValidations = () => {
    this.validators = {
     
    };
  }

  getUsuarios = () => {
    return new Promise(
      (resolve) => {
        const current = this.storeCurrent.currentFlowAction.get();
        this.store.equipoTrabajoActions.asyncFetchUsuariosEquipoTrabajo(current.idProceso, null)
          .subscribe(() => {
            this.usuariosEquipoTrabajo = this.store.equipoTrabajoActions.getUsuarios();
            resolve();
          })
      });
  }

  handleChange=(e:any)=>{
    console.log(e);
  }

  
}
