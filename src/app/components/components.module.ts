import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {DirectivesModule} from '../directives/directives.module';
import {ReportCommentComponent} from './report-comment/report-comment.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
	declarations: [ReportCommentComponent],
    imports: [
        IonicModule,
        DirectivesModule,
        FormsModule,
        CommonModule,
    ],
	exports: [ReportCommentComponent]
})
export class ComponentsModule {}
