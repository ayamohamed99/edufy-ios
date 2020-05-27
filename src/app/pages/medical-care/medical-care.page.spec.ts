import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCarePage } from './medical-care.page';

describe('MedicalCarePage', () => {
  let component: MedicalCarePage;
  let fixture: ComponentFixture<MedicalCarePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCarePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
