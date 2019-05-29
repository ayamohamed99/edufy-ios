import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationEditPage } from './notification-edit.page';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {ComponentsModule} from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [NotificationEditPage]
})
export class NotificationEditPageModule {}
