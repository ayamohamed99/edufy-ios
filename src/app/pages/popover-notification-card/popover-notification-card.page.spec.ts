import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverNotificationCardPage } from './popover-notification-card.page';

describe('PopoverNotificationCardPage', () => {
  let component: PopoverNotificationCardPage;
  let fixture: ComponentFixture<PopoverNotificationCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverNotificationCardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverNotificationCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
