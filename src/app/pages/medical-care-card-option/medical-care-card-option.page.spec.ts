import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCareCardOptionPage } from './medical-care-card-option.page';

describe('MedicalCareCardOptionPage', () => {
  let component: MedicalCareCardOptionPage;
  let fixture: ComponentFixture<MedicalCareCardOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCareCardOptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCareCardOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
