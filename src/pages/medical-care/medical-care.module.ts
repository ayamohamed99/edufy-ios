import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalCarePage } from './medical-care';

@NgModule({
  declarations: [
    MedicalCarePage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalCarePage),
  ],
})
export class MedicalCarePageModule {}
