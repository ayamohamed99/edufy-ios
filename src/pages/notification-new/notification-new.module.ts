import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import {NotificationNewPage} from "./notification-new";
import {RlTagInputModule} from "angular2-tag-input/dist";


@NgModule({
  declarations: [
    NotificationNewPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationNewPage),
    ComponentsModule,
    RlTagInputModule,
  ],
})
export class NotificationNewPageModule {}
