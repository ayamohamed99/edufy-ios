import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CafeteriaMenuPage } from "./cafeteria-menu.page";
import { IonBottomDrawerModule } from "ion-bottom-drawer";
import { CafeteriaCartViewPageModule } from '../cafeteria-cart-view/cafeteria-cart-view.module';

const routes: Routes = [
  {
    path: "",
    component: CafeteriaMenuPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CafeteriaCartViewPageModule,
    IonBottomDrawerModule,
  ],
  declarations: [CafeteriaMenuPage],
})
export class CafeteriaMenuPageModule {}
