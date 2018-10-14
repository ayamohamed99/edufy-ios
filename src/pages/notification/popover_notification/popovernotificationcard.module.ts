import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PopoverNotificationCardPage} from "./popovernotificationcard";
import {ComponentsModule} from "../../../components/components.module";


@NgModule({
  declarations: [
    PopoverNotificationCardPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverNotificationCardPage),
    ComponentsModule,
  ],
})
export class PopoverNotificationCardPageModule {}
