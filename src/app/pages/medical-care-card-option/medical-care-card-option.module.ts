import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicalCareCardOptionPage } from './medical-care-card-option.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalCareCardOptionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MedicalCareCardOptionPage]
})
export class MedicalCareCardOptionPageModule {}
