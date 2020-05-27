import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationEditPage } from './notification-edit.page';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [NotificationEditPage],
  entryComponents:[NotificationEditPage]
})
export class NotificationEditPageModule {}
