import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportPage } from './report.page';
import {MatCheckboxModule, MatExpansionModule} from '@angular/material';
import {ReportTemplatePageModule} from '../report-template/report-template.module';

const routes: Routes = [
  {
    path: '',
    component: ReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatExpansionModule,MatCheckboxModule,
    ReportTemplatePageModule
  ],
  declarations: [ReportPage]
})
export class ReportPageModule {}
