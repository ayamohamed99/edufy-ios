import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportTemplatePage} from './report-template';
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [
    ReportTemplatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportTemplatePage),
    ComponentsModule,
  ],
})
export class ReportTemplatePageModule {}
