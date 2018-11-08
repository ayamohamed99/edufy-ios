import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import {NotificationNewPage} from "./notification-new";
import {RlTagInputModule} from "angular2-tag-input/dist";
import {FormsModule} from "@angular/forms";
import {NG_SELECT_DEFAULT_CONFIG, NgSelectModule} from "@ng-select/ng-select";


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
    NgSelectModule, FormsModule
  ],
  bootstrap: [NotificationNewPage]
})
export class NotificationNewPageModule {}
