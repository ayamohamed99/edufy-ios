import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationEditPage } from './notification-edit.page';

describe('NotificationEditPage', () => {
  let component: NotificationEditPage;
  let fixture: ComponentFixture<NotificationEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
