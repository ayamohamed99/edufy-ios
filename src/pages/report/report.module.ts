import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportPage} from './report';
import {MatExpansionModule} from "@angular/material";
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    MatExpansionModule,MatCheckboxModule
  ],
})
export class ReportPageModule {}
