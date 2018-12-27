import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatDialoguePage } from './chat-dialogue';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    ChatDialoguePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatDialoguePage),
    MatFormFieldModule,MatInputModule
  ],
})
export class ChatDialoguePageModule {}
