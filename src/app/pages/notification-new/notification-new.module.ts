import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationNewPage } from './notification-new.page';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: NotificationNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgSelectModule, FormsModule,MatFormFieldModule,MatInputModule
  ],
  declarations: [NotificationNewPage]
})
export class NotificationNewPageModule {}
