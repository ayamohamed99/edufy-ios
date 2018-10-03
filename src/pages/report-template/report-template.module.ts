import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportTemplatePage} from './report-template';

@NgModule({
  declarations: [
    ReportTemplatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportTemplatePage),
  ],
})
export class ReportTemplatePageModule {}
