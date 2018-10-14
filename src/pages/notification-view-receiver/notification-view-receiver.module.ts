import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import {NotificationViewReceiver} from "./notification-view-receiver";
import {MatExpansionModule} from "@angular/material";


@NgModule({
  declarations: [
    NotificationViewReceiver,
  ],
  imports: [
    IonicPageModule.forChild(NotificationViewReceiver),
    ComponentsModule,
    MatExpansionModule,
  ],
})
export class NotificationViewReceiverModule {}
