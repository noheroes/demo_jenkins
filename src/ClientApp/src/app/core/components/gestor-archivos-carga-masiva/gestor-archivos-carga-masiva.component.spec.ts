import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorArchivosCargaMasivaComponent } from './gestor-archivos-carga-masiva.component';

describe('GestorArchivosCargaMasivaComponent', () => {
  let component: GestorArchivosCargaMasivaComponent;
  let fixture: ComponentFixture<GestorArchivosCargaMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestorArchivosCargaMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorArchivosCargaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
