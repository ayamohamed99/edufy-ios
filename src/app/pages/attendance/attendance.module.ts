import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendancePage } from './attendance.page';
import {MatTabsModule} from '@angular/material/tabs';


const routes: Routes = [
  {
    path: '',
    component: AttendancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTabsModule
  ],
  declarations: [AttendancePage]
})
export class AttendancePageModule {}
