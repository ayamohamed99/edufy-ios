import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CafeteriaCartViewPage } from './cafeteria-cart-view.page';

describe('CafeteriaCartViewPage', () => {
  let component: CafeteriaCartViewPage;
  let fixture: ComponentFixture<CafeteriaCartViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafeteriaCartViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CafeteriaCartViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
