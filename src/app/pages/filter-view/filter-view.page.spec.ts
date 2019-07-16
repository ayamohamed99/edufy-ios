import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterViewPage } from './filter-view.page';

describe('FilterViewPage', () => {
  let component: FilterViewPage;
  let fixture: ComponentFixture<FilterViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
