import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicalCareMedicationViewPage } from './medical-care-medication-view.page';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: MedicalCareMedicationViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,MatInputModule,MatCheckboxModule,MatRadioModule
  ],
  declarations: [MedicalCareMedicationViewPage]
})
export class MedicalCareMedicationViewPageModule {}
