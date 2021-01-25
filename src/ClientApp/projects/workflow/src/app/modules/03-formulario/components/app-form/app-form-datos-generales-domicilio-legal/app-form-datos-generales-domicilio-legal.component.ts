import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatosGeneralesStore } from '../../../store/datosgenerales/datosgenerales.store';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
import { IUbigeo, IUbigeoDepartamento } from '../../../store/external/ubigeo/ubigeo.interface';
import { Validators } from '@sunedu/shared';


@Component({
  selector: 'app-form-datos-generales-domicilio-legal',
  templateUrl: './app-form-datos-generales-domicilio-legal.component.html',
  styleUrls: ['./app-form-datos-generales-domicilio-legal.component.scss']
})
export class AppFormDatosGeneralesDomicilioLegalComponent implements OnInit {

  @Input() validations: any;
  @Input() formGroup: FormGroup;
  //@Input() departamentos:any;

  departamentos:IUbigeo[];


  provincias:any;


  constructor(
    private datosGeneralesStore: DatosGeneralesStore,
    private storeUbigeo:UbigeoGeneralStore
  ) { }

  ngOnInit() {
    //await this.buildDepartamentos()
  }
  handleChangeInput = e => {
    //console.log(e);
  }

  // onProvincias(){
  //   console.log("Get Departamento seleccionado CAYL");
  //   console.log(this.formGroup);
  //   let departamento = this.formGroup.controls['nombreDepartamento'].value;
  //   console.log(departamento);
  // }

  // private buildDepartamentos = ()=>{
  //   return new Promise(
  //     (resolve)=>{
  //       console.log("Get Departamentos AppDG CAYL");
  //       const { departamentos } = this.storeUbigeo.currentDepartamentoActions.getDepartamentos();
  //       //console.log(t);
  //       // type list={
  //       //   text:'',
  //       //   value:''
  //       // };
  //       // this.departamentos = [];
  //       // depasF.departamentos.map(dep=>{
  //       //   this.departamentos.push({
  //       //     text:dep.nombre,
  //       //     value:dep.codigo
  //       //   });
  //       // });

  //       //this.departamentos = list;
  //       this.departamentos = departamentos;
  //       console.log(this.departamentos);
  //       resolve();
  //     });
  //   }

  handleInputChangeDepartamento = ({text,value}) => {
    //console.log(value);
    // if(value==null) {this.currentSelect=null; return;}
    // const sedes = this.store.state.mediosVerificacion.comboLists.sedes.list;
    // const sede = sedes.find(x=>x.value==value);
    // this.currentSelect = sede.text;
  }

}
