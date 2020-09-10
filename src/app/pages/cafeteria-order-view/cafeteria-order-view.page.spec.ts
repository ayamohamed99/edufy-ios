import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CafeteriaOrderViewPage } from './cafeteria-order-view.page';

describe('CafeteriaOrderViewPage', () => {
  let component: CafeteriaOrderViewPage;
  let fixture: ComponentFixture<CafeteriaOrderViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafeteriaOrderViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CafeteriaOrderViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
