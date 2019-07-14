import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicalCareNewMedicalReportPage } from './medical-care-new-medical-report.page';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';
import {ComponentsModule} from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: MedicalCareNewMedicalReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,MatInputModule,MatCheckboxModule,MatRadioModule
  ],
  declarations: [MedicalCareNewMedicalReportPage],
  entryComponents: [MedicalCareNewMedicalReportPage]
})
export class MedicalCareNewMedicalReportPageModule {}
