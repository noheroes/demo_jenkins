import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContainerDatosgeneralesComponent } from './app-container-datosgenerales.component';

describe('AppContainerDatosgeneralesComponent', () => {
  let component: AppContainerDatosgeneralesComponent;
  let fixture: ComponentFixture<AppContainerDatosgeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppContainerDatosgeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppContainerDatosgeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
