import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendanceSettingsPage } from './attendance-settings.page';
import {AttendanceWiFiEditPageModule} from '../attendance-wi-fi-edit/attendance-wi-fi-edit.module';
import {PhoneChangeConfirmPageModule} from '../phone-change-confirm/phone-change-confirm.module';

const routes: Routes = [
  {
    path: '',
    component: AttendanceSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AttendanceWiFiEditPageModule,
    PhoneChangeConfirmPageModule
  ],
  declarations: [AttendanceSettingsPage]
})
export class AttendanceSettingsPageModule {}
