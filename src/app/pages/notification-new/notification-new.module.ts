import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationNewPage } from './notification-new.page';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgSelectModule, FormsModule,MatFormFieldModule,MatInputModule
  ],
  declarations: [NotificationNewPage],
  entryComponents: [NotificationNewPage]
})
export class NotificationNewPageModule {}
