import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CafeteriaCardPage } from "./cafeteria-card.page";
import { NgxBarcodeModule } from "ngx-barcode";
import { CafeteriaOrderViewPage } from '../cafeteria-order-view/cafeteria-order-view.page';
import { CafeteriaOrderViewPageModule } from '../cafeteria-order-view/cafeteria-order-view.module';

const routes: Routes = [
  {
    path: "",
    component: CafeteriaCardPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxBarcodeModule,
    CafeteriaOrderViewPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CafeteriaCardPage],
})
export class CafeteriaCreditPageModule {}
