import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationNewPage } from './notification-new';

@NgModule({
  declarations: [
    NotificationNewPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationNewPage),
  ],
})
export class NotificationNewPageModule {}
