import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormDatosGeneralesComponent } from './app-form-datos-generales.component';

describe('AppFormDatosGeneralesComponent', () => {
  let component: AppFormDatosGeneralesComponent;
  let fixture: ComponentFixture<AppFormDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFormDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
