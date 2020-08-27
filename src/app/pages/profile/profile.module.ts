import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import {AvatarModule} from 'ng2-avatar';
import { UpdatePasswordPageModule } from '../update-password/update-password.module';


const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: [
      {
        path: "update-password",
        loadChildren: "../update-password/update-password.module#UpdatePasswordPageModule",
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AvatarModule,
    UpdatePasswordPageModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
