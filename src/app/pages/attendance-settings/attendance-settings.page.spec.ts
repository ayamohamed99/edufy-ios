import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSettingsPage } from './attendance-settings.page';

describe('AttendanceSettingsPage', () => {
  let component: AttendanceSettingsPage;
  let fixture: ComponentFixture<AttendanceSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
