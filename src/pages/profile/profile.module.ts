import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MatExpansionModule} from "@angular/material";
import {ProfilePage} from "./profile";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    ComponentsModule,
  ],
})
export class ProfilePageModule {}
