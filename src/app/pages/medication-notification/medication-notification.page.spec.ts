import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationNotificationPage } from './medication-notification.page';

describe('MedicationNotificationPage', () => {
  let component: MedicationNotificationPage;
  let fixture: ComponentFixture<MedicationNotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationNotificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
