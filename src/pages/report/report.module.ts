import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportPage} from './report';
import {MatExpansionModule} from "@angular/material";

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    MatExpansionModule,
  ],
})
export class ReportPageModule {}
