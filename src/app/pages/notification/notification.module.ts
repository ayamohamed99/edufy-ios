import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationPage } from './notification.page';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {NotificationEditPageModule} from '../notification-edit/notification-edit.module';
import {NotificationViewReceiverPageModule} from '../notification-view-receiver/notification-view-receiver.module';
import {NotificationNewPageModule} from '../notification-new/notification-new.module';
import {PopoverNotificationCardPageModule} from '../popover-notification-card/popover-notification-card.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    NotificationEditPageModule,
    NotificationViewReceiverPageModule,
    NotificationNewPageModule,
    PopoverNotificationCardPageModule
  ],
  declarations: [NotificationPage]
})
export class NotificationPageModule {}
