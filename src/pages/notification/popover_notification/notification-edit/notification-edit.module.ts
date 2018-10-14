import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NotificationEditPage} from "./notification-edit";
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
  declarations: [
    NotificationEditPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationEditPage),
    ComponentsModule,
  ],
})
export class NotificationEditPageModule {}
