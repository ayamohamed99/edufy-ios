import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendanceTabsPage } from './attendance-tabs.page';

const routes: Routes = [
  {
    path: 'tab',
    component: AttendanceTabsPage,
    children: [
      {
        path: 'home',
        loadChildren: '../attendance/attendance.module#AttendancePageModule'
      },
      {
        path: 'ranks',
        loadChildren: '../attendance-rank/attendance-rank.module#AttendanceRankPageModule'
      },
      {
        path: 'settings',
        loadChildren: '../attendance-settings/attendance-settings.module#AttendanceSettingsPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tab/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AttendanceTabsPage]
})
export class AttendanceTabsPageModule {}
