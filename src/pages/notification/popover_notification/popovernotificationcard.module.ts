import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PopoverNotificationCardPage} from "./popovernotificationcard";

@NgModule({
  declarations: [
    PopoverNotificationCardPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverNotificationCardPage),
  ],
})
export class PopoverNotificationCardPageModule {}
