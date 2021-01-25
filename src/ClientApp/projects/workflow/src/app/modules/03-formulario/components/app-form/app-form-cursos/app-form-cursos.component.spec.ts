import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormCursosComponent } from './app-form-cursos.component';

describe('AppFormCursosComponent', () => {
  let component: AppFormCursosComponent;
  let fixture: ComponentFixture<AppFormCursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFormCursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
