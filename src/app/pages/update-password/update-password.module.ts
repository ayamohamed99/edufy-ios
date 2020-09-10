import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from "src/app/components/components.module";
import { UpdatePasswordPage } from './update-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule
  ],
  declarations: [UpdatePasswordPage],
  entryComponents: [UpdatePasswordPage],
})
export class UpdatePasswordPageModule {}
