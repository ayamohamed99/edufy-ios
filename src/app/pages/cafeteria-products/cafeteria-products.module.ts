import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CafeteriaProductsPage } from './cafeteria-products.page';

const routes: Routes = [
  {
    path: '',
    component: CafeteriaProductsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CafeteriaProductsPage]
})
export class CafeteriaProductsPageModule {}
