import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NotificationPage} from "./notification";
import {RlTagInputModule} from "angular2-tag-input/dist";

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage),
    RlTagInputModule,
  ],
})
export class NotificationPageModule {}
