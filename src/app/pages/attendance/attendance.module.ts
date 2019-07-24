import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendancePage } from './attendance.page';
import {MatTabsModule} from '@angular/material/tabs';
import {AvatarModule} from 'ng2-avatar';


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
    MatTabsModule,AvatarModule
  ],
  declarations: [AttendancePage]
})
export class AttendancePageModule {}
