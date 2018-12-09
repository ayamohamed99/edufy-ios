import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import {NotificationNewPage} from "./notification-new";
import {RlTagInputModule} from "angular2-tag-input/dist";
import {FormsModule} from "@angular/forms";
import {NG_SELECT_DEFAULT_CONFIG, NgSelectModule} from "@ng-select/ng-select";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";


@NgModule({
  declarations: [
    NotificationNewPage,
  ],
  providers: [
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
        notFoundText: 'No match found'
      }
    }
  ],
  imports: [
    IonicPageModule.forChild(NotificationNewPage),
    ComponentsModule,
    RlTagInputModule,
    NgSelectModule, FormsModule,MatFormFieldModule,MatInputModule
  ],
  bootstrap: [NotificationNewPage]
})
export class NotificationNewPageModule {}
