import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicalCarePage } from './medical-care.page';
import {MedicalCareCardOptionPageModule} from '../medical-care-card-option/medical-care-card-option.module';
import {MedicalReportViewPageModule} from '../medical-report-view/medical-report-view.module';
import {MedicalCareMedicationViewPageModule} from '../medical-care-medication-view/medical-care-medication-view.module';
import {MedicalCareNewMedicalReportPageModule} from '../medical-care-new-medical-report/medical-care-new-medical-report.module';
import {MedicalCareNewMedicalReportMedicinePageModule} from '../medical-care-new-medical-report-medicine/medical-care-new-medical-report-medicine.module';
import {FilterViewPage} from '../filter-view/filter-view.page';
import {FilterViewPageModule} from '../filter-view/filter-view.module';

const routes: Routes = [
  {
    path: '',
    component: MedicalCarePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MedicalCareCardOptionPageModule,
    MedicalReportViewPageModule,
    MedicalCareMedicationViewPageModule,
    MedicalCareNewMedicalReportPageModule,
    MedicalCareNewMedicalReportMedicinePageModule,
    FilterViewPageModule
  ],
  declarations: [MedicalCarePage]
})
export class MedicalCarePageModule {}
