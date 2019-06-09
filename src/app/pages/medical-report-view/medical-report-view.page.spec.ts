import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalReportViewPage } from './medical-report-view.page';

describe('MedicalReportViewPage', () => {
  let component: MedicalReportViewPage;
  let fixture: ComponentFixture<MedicalReportViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalReportViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalReportViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
