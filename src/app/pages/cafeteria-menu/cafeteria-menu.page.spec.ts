import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CafeteriaMenuPage } from "./cafeteria-menu.page";

describe("CafeteriaMenuPage", () => {
  let component: CafeteriaMenuPage;
  let fixture: ComponentFixture<CafeteriaMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CafeteriaMenuPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafeteriaMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
