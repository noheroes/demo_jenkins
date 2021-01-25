import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadLayoutComponent } from './actividad-layout.component';

describe('ActividadLayoutComponent', () => {
  let component: ActividadLayoutComponent;
  let fixture: ComponentFixture<ActividadLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
