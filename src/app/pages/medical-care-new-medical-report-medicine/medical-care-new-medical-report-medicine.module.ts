import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicalCareNewMedicalReportMedicinePage } from './medical-care-new-medical-report-medicine.page';
import {ComponentsModule} from '../../components/components.module';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: MedicalCareNewMedicalReportMedicinePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NgSelectModule, FormsModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule
  ],
  declarations: [MedicalCareNewMedicalReportMedicinePage]
})
export class MedicalCareNewMedicalReportMedicinePageModule {}
