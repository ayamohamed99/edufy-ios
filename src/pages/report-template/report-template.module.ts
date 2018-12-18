import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportTemplatePage} from './report-template';
import {ComponentsModule} from "../../components/components.module";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    ReportTemplatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportTemplatePage),
    ComponentsModule,MatFormFieldModule,MatInputModule,MatCheckboxModule,MatRadioModule
  ],
})
export class ReportTemplatePageModule {}
