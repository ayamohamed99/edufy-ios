import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CafeteriaCartViewPage } from "./cafeteria-cart-view.page";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule],
  declarations: [CafeteriaCartViewPage],
  entryComponents: [CafeteriaCartViewPage],
})
export class CafeteriaCartViewPageModule {}
