import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewMedicalReportMedicinePage } from './new-medical-report-medicine';
import {FormsModule} from "@angular/forms";
import {NG_SELECT_DEFAULT_CONFIG, NgSelectModule} from "@ng-select/ng-select";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {ComponentsModule} from "../../components/components.module";
import {RlTagInputModule} from "angular2-tag-input/dist";
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material";

@NgModule({
  declarations: [
    NewMedicalReportMedicinePage,
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
    IonicPageModule.forChild(NewMedicalReportMedicinePage),
    ComponentsModule,
    RlTagInputModule,
    NgSelectModule, FormsModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule
  ],
})
export class NewMedicalReportMedicinePageModule {}
