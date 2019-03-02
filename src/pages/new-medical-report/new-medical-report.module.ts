import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewMedicalReportPage } from './new-medical-report';
import {ComponentsModule} from "../../components/components.module";
import {RlTagInputModule} from "angular2-tag-input/dist";
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
    NewMedicalReportPage,
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
    IonicPageModule.forChild(NewMedicalReportPage),
    ComponentsModule,
    RlTagInputModule,
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,MatInputModule,MatCheckboxModule,MatRadioModule
  ],
})
export class NewMedicalReportPageModule {}
