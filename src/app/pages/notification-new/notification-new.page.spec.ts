import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationNewPage } from './notification-new.page';

describe('NotificationNewPage', () => {
  let component: NotificationNewPage;
  let fixture: ComponentFixture<NotificationNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
