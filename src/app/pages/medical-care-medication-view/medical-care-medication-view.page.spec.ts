import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCareMedicationViewPage } from './medical-care-medication-view.page';

describe('MedicalCareMedicationViewPage', () => {
  let component: MedicalCareMedicationViewPage;
  let fixture: ComponentFixture<MedicalCareMedicationViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCareMedicationViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCareMedicationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
