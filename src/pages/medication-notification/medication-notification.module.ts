import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicationNotificationPage } from './medication-notification';

@NgModule({
  declarations: [
    MedicationNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicationNotificationPage),
  ],
})
export class MedicationNotificationPageModule {}
