import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClientModule} from '@angular/common/http';

import {Ng2ImgMaxModule} from 'ng2-img-max';

//Angular Materials
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule, MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {IonicStorageModule} from '@ionic/storage';

//Plugin
import {Network} from '@ionic-native/network/ngx';
import {FirebaseMessaging} from '@ionic-native/firebase-messaging/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {Media} from '@ionic-native/media/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {Transfer} from '@ionic-native/transfer';
import {AccountService} from './services/Account/account.service';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {ToastViewService} from './services/ToastView/toast-view.service';
import {ClassesService} from './services/Classes/classes.service';
import {StudentsService} from './services/Students/students.service';
import {DocumentViewer} from '@ionic-native/document-viewer/ngx';
import {File} from '@ionic-native/file/ngx';
// import {Storage} from "@ionic/storage";
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {FCMService} from './services/FCM/fcm.service';
import {PopoverNotificationCardPageModule} from './pages/popover-notification-card/popover-notification-card.module';
import {NotificationEditPageModule} from './pages/notification-edit/notification-edit.module';
import {NotificationViewReceiverPageModule} from './pages/notification-view-receiver/notification-view-receiver.module';
import {NotificationNewPageModule} from './pages/notification-new/notification-new.module';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {ChatDialoguePageModule} from './pages/chat-dialogue/chat-dialogue.module';
import {DatePipe} from '@angular/common';
import {MedicalCareCardOptionPageModule} from './pages/medical-care-card-option/medical-care-card-option.module';
import {MedicalReportViewPageModule} from './pages/medical-report-view/medical-report-view.module';
import {MedicalCareMedicationViewPageModule} from './pages/medical-care-medication-view/medical-care-medication-view.module';
import {MedicalCareNewMedicalReportPageModule} from './pages/medical-care-new-medical-report/medical-care-new-medical-report.module';
import {MedicalCareNewMedicalReportMedicinePageModule} from './pages/medical-care-new-medical-report-medicine/medical-care-new-medical-report-medicine.module';
import {MedicationNotificationPageModule} from './pages/medication-notification/medication-notification.module';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {ReportTemplatePageModule} from './pages/report-template/report-template.module';


let mods = [MatExpansionModule , MatAutocompleteModule , MatFormFieldModule,MatIconModule,MatDatepickerModule,MatSelectModule,MatNativeDateModule,MatInputModule];
let popOvers = [PopoverNotificationCardPageModule];
let modals = [NotificationEditPageModule,NotificationViewReceiverPageModule,NotificationNewPageModule,ChatDialoguePageModule,MedicalCareCardOptionPageModule,MedicalReportViewPageModule,MedicalCareMedicationViewPageModule,MedicalCareNewMedicalReportPageModule,MedicalCareNewMedicalReportMedicinePageModule, MedicationNotificationPageModule, ReportTemplatePageModule];
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    mods,
    popOvers,
    modals,
    NgSelectModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    FirebaseMessaging,
    LocalNotifications,
    InAppBrowser,
    Network,
    File,
    DocumentViewer,
    FileTransfer,
    Media,
    FileOpener,
    BackgroundMode,
    AndroidPermissions,
    FCMService,FirebaseMessaging,
    LocalNotifications,
    DatePipe,
    DatePicker
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('still format');
    const stringPrototype = String.prototype as any;
    stringPrototype.format = function() {
      console.log('formated');
      const args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
      });
    };
  }
}
