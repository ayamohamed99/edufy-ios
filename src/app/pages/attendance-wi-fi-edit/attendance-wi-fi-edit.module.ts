import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendanceWiFiEditPage } from './attendance-wi-fi-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [AttendanceWiFiEditPage],
  entryComponents:[AttendanceWiFiEditPage]
})
export class AttendanceWiFiEditPageModule {}
