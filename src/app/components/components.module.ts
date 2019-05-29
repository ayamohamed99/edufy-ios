import {NgModule} from '@angular/core';
import {ReportCommentComponent} from './report-comment/report-comment';
import {IonicModule} from '@ionic/angular';
import {DirectivesModule} from '../directives/directives.module';
import { ReportFilterComponent } from './report-filter/report-filter';

@NgModule({
	declarations: [],
  imports: [
    IonicModule,
    DirectivesModule,
  ],
	exports: []
})
export class ComponentsModule {}
