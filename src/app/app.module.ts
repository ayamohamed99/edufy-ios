import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Network} from '@ionic-native/network';

import {LoginService} from "../services/login";
import {HttpClientModule} from "@angular/common/http";

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {IonicStorageModule} from "@ionic/storage";
import {NotificationPage} from "../pages/notification/notification";
import {AccountService} from "../services/account";
import {ProfilePage} from "../pages/profile/profile";
import {NotificationNewPage} from "../pages/notification-new/notification-new";
import {RlTagInputModule} from "angular2-tag-input/dist";
import {NotificationService} from "../services/notification";
import {PopoverNotificationCardPage} from "../pages/notification/popover_notification/popovernotificationcard";
import {SettingsPage} from "../pages/settings/settings";
import {NativeStorage} from "@ionic-native/native-storage";
import {NotificationEditPage} from "../pages/notification/popover_notification/notification-edit/notification-edit";
import {StudentsService} from "../services/students";

import {File} from '@ionic-native/file';
import {FileTransfer} from '@ionic-native/file-transfer'
import {DocumentViewer} from '@ionic-native/document-viewer';
import {Media} from '@ionic-native/media';
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {FileOpener} from "@ionic-native/file-opener";
import {Transfer} from '@ionic-native/transfer';
import {LogoutService} from "../services/logout";

import {BackgroundMode} from '@ionic-native/background-mode';
import {HTTP} from '@ionic-native/http';

import {AndroidPermissions} from '@ionic-native/android-permissions';
import {ClassesService} from "../services/classes";
import {DailyReportService} from "../services/dailyreport";

import {DatePicker} from '@ionic-native/date-picker';

import {MatAutocompleteModule, MatExpansionModule, MatFormFieldModule} from '@angular/material';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select'
import {CheckboxFunctionService} from "../services/checkboxFunctionService";
import {DatePipe} from "@angular/common";
import {TransFormDate} from "../services/transFormDate";
import {ComponentsModule} from "../components/components.module";
import {ReportCommentProvider} from "../providers/report-comment/report-comment";
import {NotificationViewReceiver} from "../pages/notification-view-receiver/notification-view-receiver";


let mods = [MatExpansionModule , MatAutocompleteModule , MatFormFieldModule,MatIconModule,MatDatepickerModule,MatSelectModule];
@NgModule({
  declarations: [
    MyApp,
    // ProfilePage,
    HomePage,
    // NotificationPage,
    // NotificationNewPage,
    // PopoverNotificationCardPage,
    // SettingsPage,
    // NotificationEditPage,
    // NotificationViewReceiver
    // ReportPage,
   // ReportTemplatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    RlTagInputModule,
    mods,
    BrowserAnimationsModule,
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // ProfilePage,
    HomePage,
    // NotificationPage,
    // NotificationNewPage,
    // PopoverNotificationCardPage,
    // SettingsPage,
    // NotificationEditPage,
    // NotificationViewReceiver
    //ReportPage,
   // ReportTemplatePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    LogoutService,
    NotificationService,
    AccountService,
    Network,NativeStorage,
    StudentsService,
    File,
    DocumentViewer,
    FileTransfer,
    Media,
    PhotoViewer,
    FileOpener,
    Transfer,
    BackgroundMode,
    HTTP,
    AndroidPermissions,
    ClassesService,
    DailyReportService,
    DatePicker,
    CheckboxFunctionService,
    CheckboxFunctionService,
    ReportCommentProvider,
    [DatePipe],TransFormDate
  ]
})
export class AppModule {
constructor(){
  console.log("still format");
  const stringPrototype = <any>String.prototype;
  stringPrototype.format = function() {
    console.log("formated");
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}
}




