import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FilterViewPage } from './filter-view.page';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,MatInputModule,MatCheckboxModule,MatRadioModule

  ],
  declarations: [FilterViewPage],
  entryComponents:[FilterViewPage]
})
export class FilterViewPageModule {}
