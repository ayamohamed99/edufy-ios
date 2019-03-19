import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicationViewPage } from './medication-view';
import {ComponentsModule} from "../../components/components.module";
import {NG_SELECT_DEFAULT_CONFIG, NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule, MatRadioModule
} from "@angular/material";

@NgModule({
  declarations: [
    MedicationViewPage,
  ],
  providers: [
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
        notFoundText: 'No match found'
      }
    }
  ],
  imports: [
    IonicPageModule.forChild(MedicationViewPage),
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,MatInputModule,MatCheckboxModule,MatRadioModule
  ],
})
export class MedicationViewPageModule {}
