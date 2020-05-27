import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CafeteriaCreditPage } from './cafeteria-credit.page';

const routes: Routes = [
  {
    path: '',
    component: CafeteriaCreditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CafeteriaCreditPage]
})
export class CafeteriaCreditPageModule {}
