import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NotificationPage} from "./notification";
import {RlTagInputModule} from "angular2-tag-input/dist";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage),
    RlTagInputModule,MatFormFieldModule,MatInputModule
  ],
})
export class NotificationPageModule {}
