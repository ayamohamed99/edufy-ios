import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PopoverNotificationCardPage } from './popover-notification-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [PopoverNotificationCardPage],
  entryComponents: [PopoverNotificationCardPage]
})
export class PopoverNotificationCardPageModule {}
