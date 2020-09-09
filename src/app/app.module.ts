import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy, NavParams } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
} from "@angular/material";
import { MedicationNotificationPageModule } from "./pages/medication-notification/medication-notification.module";
import { ChatDialoguePageModule } from "./pages/chat-dialogue/chat-dialogue.module";
import { ReportTemplatePageModule } from "./pages/report-template/report-template.module";

import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { Ng2ImgMaxModule } from "ng2-img-max";
import { NgSelectModule } from "@ng-select/ng-select";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { FCMService } from "./services/FCM/fcm.service";
import { DatePipe } from "@angular/common";
import { File } from "@ionic-native/file/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { Network } from "@ionic-native/network/ngx";
import { FirebaseMessaging } from "@ionic-native/firebase-messaging/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { Media } from "@ionic-native/media/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { HTTP } from "@ionic-native/http/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { AvatarModule } from "ng2-avatar";
import { Device } from "@ionic-native/device/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";

const mods = [
  MatExpansionModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatNativeDateModule,
  MatInputModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatRadioModule,
];
const modals = [ChatDialoguePageModule, MedicationNotificationPageModule, ReportTemplatePageModule];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: "__edufydb",
      driverOrder: ["localstorage"],
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    mods,
    modals,
    NgSelectModule,
    FormsModule,
    AvatarModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    Network,
    FirebaseMessaging,
    LocalNotifications,
    InAppBrowser,
    File,
    DocumentViewer,
    FileTransfer,
    Media,
    FileOpener,
    BackgroundMode,
    AndroidPermissions,
    FCMService,
    FirebaseMessaging,
    DatePipe,
    DatePicker,
    HTTP,
    Device,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    console.log("still format");
    const stringPrototype = String.prototype as any;
    stringPrototype.format = function () {
      console.log("formated");
      const args = arguments;
      return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
      });
    };
  }
}
