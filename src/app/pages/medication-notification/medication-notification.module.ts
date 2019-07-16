import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicationNotificationPage } from './medication-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MedicationNotificationPage],
  entryComponents: [MedicationNotificationPage]
})
export class MedicationNotificationPageModule {}
