import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCareNewMedicalReportPage } from './medical-care-new-medical-report.page';

describe('MedicalCareNewMedicalReportPage', () => {
  let component: MedicalCareNewMedicalReportPage;
  let fixture: ComponentFixture<MedicalCareNewMedicalReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCareNewMedicalReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCareNewMedicalReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
