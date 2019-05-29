import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationViewReceiverPage } from './notification-view-receiver.page';

describe('NotificationViewReceiverPage', () => {
  let component: NotificationViewReceiverPage;
  let fixture: ComponentFixture<NotificationViewReceiverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationViewReceiverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationViewReceiverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
