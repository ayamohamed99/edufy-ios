import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CafeteriaCartViewPageRoutingModule } from './cafeteria-cart-view-routing.module';

import { CafeteriaCartViewPage } from './cafeteria-cart-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CafeteriaCartViewPageRoutingModule
  ],
  declarations: [CafeteriaCartViewPage]
})
export class CafeteriaCartViewPageModule {}
