import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatDialoguePage } from './chat-dialogue.page';
import {MatButtonModule, MatFormFieldModule, MatInputModule} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ChatDialoguePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,MatInputModule,MatButtonModule
  ],
  declarations: [ChatDialoguePage]
})
export class ChatDialoguePageModule {}
