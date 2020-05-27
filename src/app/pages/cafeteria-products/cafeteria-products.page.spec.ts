import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafeteriaProductsPage } from './cafeteria-products.page';

describe('CafeteriaProductsPage', () => {
  let component: CafeteriaProductsPage;
  let fixture: ComponentFixture<CafeteriaProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafeteriaProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafeteriaProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
