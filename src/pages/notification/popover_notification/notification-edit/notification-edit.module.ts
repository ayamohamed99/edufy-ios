import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationEditPage } from './notification-edit';

@NgModule({
  declarations: [
    NotificationEditPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationEditPage),
  ],
})
export class NotificationEditPageModule {}
