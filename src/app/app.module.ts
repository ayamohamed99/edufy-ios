import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';

import {LoginService} from "../services/login";
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
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

import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer'
import { DocumentViewer } from '@ionic-native/document-viewer';
import { Media } from '@ionic-native/media';
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {FileOpener} from "@ionic-native/file-opener";
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {LogoutService} from "../services/logout";

import { BackgroundMode } from '@ionic-native/background-mode';
import { HTTP } from '@ionic-native/http';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import {NotificationViewReceiver} from "../pages/notification-view-receiver/notification-view-receiver";


@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    NotificationPage,
    NotificationNewPage,
    PopoverNotificationCardPage,
    SettingsPage,
    NotificationEditPage,
    NotificationViewReceiver
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    RlTagInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    HomePage,
    NotificationPage,
    NotificationNewPage,
    PopoverNotificationCardPage,
    SettingsPage,
    NotificationEditPage,
    NotificationViewReceiver
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
    AndroidPermissions
  ]
})
export class AppModule {}
