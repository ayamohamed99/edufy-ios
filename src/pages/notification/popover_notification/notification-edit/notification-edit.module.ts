import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NotificationEditPage} from "./notification-edit";
import {ComponentsModule} from "../../../../components/components.module";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    NotificationEditPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationEditPage),
    ComponentsModule,MatFormFieldModule,MatInputModule
  ],
})
export class NotificationEditPageModule {}
