import {NgModule} from '@angular/core';
import {ReportCommentComponent} from './report-comment/report-comment';
import {IonicModule} from "ionic-angular";
import {DirectivesModule} from "../directives/directives.module";

@NgModule({
	declarations: [ReportCommentComponent],
  imports: [
    IonicModule,
    DirectivesModule,
  ],
	exports: [ReportCommentComponent]
})
export class ComponentsModule {}
