import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PopoverMedicalCareCardPage} from "./popovermedicalcarecard";
import {ComponentsModule} from "../../../components/components.module";


@NgModule({
  declarations: [
    PopoverMedicalCareCardPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverMedicalCareCardPage),
    ComponentsModule,
  ],
})
export class PopoverMedicalCareCardPageModule {}
