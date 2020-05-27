import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneChangeConfirmPage } from './phone-change-confirm.page';

describe('PhoneChangeConfirmPage', () => {
  let component: PhoneChangeConfirmPage;
  let fixture: ComponentFixture<PhoneChangeConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneChangeConfirmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneChangeConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
