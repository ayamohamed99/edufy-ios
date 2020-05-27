import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTemplatePage } from './report-template.page';

describe('ReportTemplatePage', () => {
  let component: ReportTemplatePage;
  let fixture: ComponentFixture<ReportTemplatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTemplatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTemplatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
