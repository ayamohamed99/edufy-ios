import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportTemplatePage } from './report-template.page';
import {MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule} from '@angular/material';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,MatFormFieldModule,MatInputModule,MatCheckboxModule,MatRadioModule
  ],
  declarations: [ReportTemplatePage],
  entryComponents: [ReportTemplatePage]
})
export class ReportTemplatePageModule {}
