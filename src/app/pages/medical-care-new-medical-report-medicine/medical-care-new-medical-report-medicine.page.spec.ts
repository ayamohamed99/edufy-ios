import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCareNewMedicalReportMedicinePage } from './medical-care-new-medical-report-medicine.page';

describe('MedicalCareNewMedicalReportMedicinePage', () => {
  let component: MedicalCareNewMedicalReportMedicinePage;
  let fixture: ComponentFixture<MedicalCareNewMedicalReportMedicinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCareNewMedicalReportMedicinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCareNewMedicalReportMedicinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
