import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CafeteriaCardPage } from "./cafeteria-card.page";
import { NgxBarcodeModule } from "ngx-barcode";

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
    RouterModule.forChild(routes),
  ],
  declarations: [CafeteriaCardPage],
})
export class CafeteriaCreditPageModule {}
