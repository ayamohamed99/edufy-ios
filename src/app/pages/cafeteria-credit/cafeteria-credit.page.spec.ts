import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafeteriaCreditPage } from './cafeteria-credit.page';

describe('CafeteriaCreditPage', () => {
  let component: CafeteriaCreditPage;
  let fixture: ComponentFixture<CafeteriaCreditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafeteriaCreditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafeteriaCreditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
