import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendanceRankPage } from './attendance-rank.page';
import {AvatarModule} from 'ng2-avatar';

const routes: Routes = [
  {
    path: '',
    component: AttendanceRankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AvatarModule
  ],
  declarations: [AttendanceRankPage]
})
export class AttendanceRankPageModule {}
