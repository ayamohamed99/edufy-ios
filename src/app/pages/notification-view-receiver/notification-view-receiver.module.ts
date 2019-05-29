import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationViewReceiverPage } from './notification-view-receiver.page';
import {MatExpansionModule} from '@angular/material';
import {ComponentsModule} from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationViewReceiverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    MatExpansionModule
  ],
  declarations: [NotificationViewReceiverPage]
})
export class NotificationViewReceiverPageModule {}
