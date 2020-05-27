import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatDialoguePage } from './chat-dialogue.page';
import {MatButtonModule, MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatFormFieldModule,MatInputModule,MatButtonModule
  ],
  declarations: [ChatDialoguePage],
  entryComponents:[ChatDialoguePage]
})
export class ChatDialoguePageModule {}
