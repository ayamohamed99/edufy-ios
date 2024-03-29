import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PhoneChangeConfirmPage } from './phone-change-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [PhoneChangeConfirmPage],
  entryComponents:[PhoneChangeConfirmPage]
})
export class PhoneChangeConfirmPageModule {}
