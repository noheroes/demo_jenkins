import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormMallacurricularComponent } from './app-form-mallacurricular.component';

describe('AppFormMallacurricularComponent', () => {
  let component: AppFormMallacurricularComponent;
  let fixture: ComponentFixture<AppFormMallacurricularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFormMallacurricularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormMallacurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
