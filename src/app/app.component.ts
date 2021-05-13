import { Component } from '@angular/core';

import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {Url_domain} from './models/url_domain';
import {ChatService} from './services/Chat/chat.service';
import {FCMService} from './services/FCM/fcm.service';
import {AccountService} from './services/Account/account.service';
import {LogoutService} from './services/Logout/logout.service';
import {MedicalCareService} from './services/MedicalCare/medical-care.service';
import {StudentsService} from './services/Students/students.service';
import {ClassesService} from './services/Classes/classes.service';
import {LoadingViewService} from './services/LoadingView/loading-view.service';
import {Router, RouterEvent} from '@angular/router';
import {LoginService} from './services/Login/login.service';
import {BehaviorSubject} from 'rxjs';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {MedicationNotificationPage} from './pages/medication-notification/medication-notification.page';
import {ChatDialoguePage} from './pages/chat-dialogue/chat-dialogue.page';
import {Student} from './models';
import { Storage } from '@ionic/storage';
import {PassDataService} from './services/pass-data.service';
import * as dateFNS from "date-fns";
import {TransFormDateService} from './services/TransFormDate/trans-form-date.service';
import {ReportTemplatePage} from './pages/report-template/report-template.page';
import { NavigationService } from './services/navigation/navigation.service';
import { BackListener } from './interfaces/BackListener';

declare var wkWebView: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {  
  homePath = '/home';
  menuPath = '/menu';
  userName: string;
  password: string;
  accessToken: string;

  token: string;
  values: any = [];
  toKenFull: string;

  profilePage = 'ProfilePage';
  notificationPage = 'NotificationPage';
  settingsPage = 'SettingsPage';
  reportPage = 'ReportPage';
  chatPage = 'ChatPage';
  medicalcarePage = 'MedicalCarePage';
  medicationNotificationPage = 'MedicationNotificationPage';

  DomainUrl: Url_domain;

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private loginServ: LoginService,
      private storage: Storage,
      private router: Router,
      private loadCtrl: LoadingViewService,
      private medicalService: MedicalCareService,
      private logout: LogoutService,
      private localNotifications: LocalNotifications,
      private accountServ: AccountService,
      private iab: InAppBrowser,
      private fire: FCMService,
      private chatServ: ChatService,
      private modalCtrl: ModalController,
      private alertCtrl: AlertController,
      private navCtrl: NavController,
      private navService: NavigationService,
      public passData:PassDataService,
      public transDate:TransFormDateService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("initializeApp");

      this.registerHardwareBackButton();

      wkWebView.injectCookie('http://104.198.175.198/');

      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#5C87F7');
      this.startAutoLogin();
      this.splashScreen.hide();
    });
  }

  registerHardwareBackButton() {
    this.platform.backButton.subscribeWithPriority(1000, async () => {
      const pages = (this.platform.url() as string).split("/");
      const currentPageUrl = pages[pages.length - 1];

      console.log("registerHardwareBackButton");
      console.log("currentPageUrl: ", currentPageUrl);

      // let modal = false;
      // try {
      //   modal = await this.modalCtrl.dismiss();
      // } catch (e) {
      //   console.log("Can not dismiss opened model");
      // }

      if (this.navService && this.navService.getChargeGiftPage() != null) {
        try {
          (this.navService.getChargeGiftPage() as BackListener).onBackButtonPressed();
        } catch (e) {
          console.error("custom back-navigation action", e);
        }
      }

    });
  }

  startAutoLogin() {
    if (this.platform.is('desktop')) {
      this.userName = localStorage.getItem(this.loginServ.localStorageUserName);
      this.password = localStorage.getItem(this.loginServ.localStoragePassword);
      if ((this.userName && this.userName != '') && (this.password && this.password != '')) {
        this.startLogIn();
      } else {
        this.navCtrl.navigateRoot(this.homePath);
      }
    } else {
      this.storage.get(this.loginServ.localStorageUserName).then(value => this.userName = value, (err) => {
      }).catch((err) => {
      });
      this.storage.get(this.loginServ.localStoragePassword).then(
          value => {
            this.password = value;
            if ((this.userName && this.userName != '') && (this.password && this.password != '')) {
              this.startLogIn();
            } else {
              this.navCtrl.navigateRoot(this.homePath);
            }

          });
    }
  }



  logoutMethod() {
    this.logout.postlogout(null, null, null).subscribe(
        // @ts-ignore
        (data) => {
          this.loadCtrl.stopLoading().then( () => {
            if (this.platform.is('desktop')) {
              localStorage.clear();
            } else {
              this.storage.clear();
            }
            this.navCtrl.navigateRoot(this.homePath);
          });
        },
        err => {
          this.loadCtrl.stopLoading().then( () => {
            if (this.platform.is('desktop')) {
              localStorage.clear();
            } else {
              this.storage.clear();
            }
            this.navCtrl.navigateRoot(this.homePath);
          });
        },
        () => {
        });
  }



  // MARK: START LOGIN METHODS
  startLogIn() {
    this.loadCtrl.startNormalLoading('Logging in...');
    this.localNotifications.clear(2481993);
    let getToken: string;
    this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);
    this.loginServ.postlogin(this.userName, this.password).subscribe(
        (data) => {
            this.values = data;
            // if(this.platform.is('cordova')){
            //     // @ts-ignore
            //     this.values = JSON.parse(data.data);
            // }
          this.accessToken = this.values.refreshToken.value;
          this.refreshToken();
        },
        err => {
          this.loadCtrl.stopLoading().then( () => {
            this.navCtrl.navigateRoot(this.homePath);
          });
        },
        () => {
        });
  }

  fullToken() {
    return 'Bearer ' + this.token;
  }

  refreshToken() {
    this.loginServ.authenticateUserByRefreshToken(this.accessToken).subscribe(
        (data) => {
          this.values = data;
            // if(this.platform.is('cordova')){
            //     // @ts-ignore
            //     this.values = JSON.parse(data.data);
            // }
          this.token = this.values.value;
          this.toKenFull = this.fullToken();

          let getToken: string;
          this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);

          if ( (this.platform.is('desktop') )
              && (this.token != null || this.token != '')
              && (this.fullToken() != localStorage.getItem(this.loginServ.localStorageToken))) {

            localStorage.setItem(this.loginServ.localStorageToken, this.fullToken());
            localStorage.setItem(this.loginServ.localStorageAccessToken, this.token);
            localStorage.setItem(this.loginServ.localStorageUserName, this.userName);
            localStorage.setItem(this.loginServ.localStoragePassword, this.password);

          } else {
            if ((this.token != null || this.token != '')
                && (getToken != this.fullToken())) {
              this.storage.set(this.loginServ.localStorageToken, this.fullToken());
              this.storage.set(this.loginServ.localStorageUserName, this.userName);
              this.storage.set(this.loginServ.localStoragePassword, this.password);
            }
          }

          this.manageAccount();
        },
        err => {
          this.loadCtrl.stopLoading().then( () => {
            this.navCtrl.navigateRoot(this.homePath);
          });
        });
  }

  manageAccount() {
    this.loginServ.authenticateUserManager(this.token, this.toKenFull).subscribe(
        (data) => {
          this.accountInfo();
        },
        err => {
          this.loadCtrl.stopLoading().then( () => {
            this.navCtrl.navigateRoot(this.homePath);
          });
        },
        () => {
        });
  }

  accountInfo() {
    console.log("get accountInfo app");
    this.accountServ.getAccountRoles(this.toKenFull).subscribe(
        (val) => {
            let data = val;
            // if(this.platform.is('cordova')){
            //     // @ts-ignore
            //     data = JSON.parse(val.data);
            // }

          // @ts-ignore
          if (data.id){
            this.accountServ.setDate(data);
            // this.accountServ.getTags(this.fullToken());
            this.CustomReport();
          }else{
            this.loadCtrl.stopLoading().then( () => {
              this.navCtrl.navigateRoot(this.homePath);
            });
          }
          // this.setNameInMenu(this.accountServ.getUserName());
          // this.knowFeatures(this.accountServ.getAccountFeature());
          // this.load.dismiss();
          // this.nav.setRoot(this.profilePage);
        },
        err => {
          this.loadCtrl.stopLoading().then( () => {
            this.navCtrl.navigateRoot(this.homePath);
          });
        },
        () => {
        });
  }


  // MARKS: GET CUSTOM REPORTS
  CustomReport() {
    this.accountServ.getCustomReports(this.toKenFull).subscribe(
        (data) => {
          this.loadCtrl.stopLoading().then( () => {
              // if(this.platform.is('cordova')){
              //     let val = data;
              //     // @ts-ignore
              //     this.accountServ.setCustomReport(JSON.parse(val.data));
              // }else{
                  this.accountServ.setCustomReport(data);
              // }
            this.accountServ.getTags(this.fullToken());
            // this.navCtrl.setRoot('ProfilePage');
            this.navCtrl.navigateRoot('/menu/profile');
            this.startSocket(this.accountServ.userId);
            this.setupNotification();
          });
        },
        err => {
          if (err.error == 'FORBIDDEN' || err.error ==  'NO_REPORTS_FOUNDED_FOR_YOUR_ACCOUNT') {
            this.loadCtrl.stopLoading().then( () => {
              console.log('Has No Custom report(s)');
              this.accountServ.getTags(this.fullToken());
              // this.navCtrl.setRoot('ProfilePage');
              this.navCtrl.navigateRoot('/menu/profile');
              this.startSocket(this.accountServ.userId);
              this.setupNotification();
              if (this.accountServ.getUserRole().viewMedicalRecord) {
                this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
              }
            });
          } else if (!err.error) {
            this.loadCtrl.stopLoading().then( () => {
              console.log('Has No Custom report(s)');
              this.accountServ.getTags(this.fullToken());
              // this.navCtrl.setRoot('ProfilePage');
              this.navCtrl.navigateRoot('/menu/profile');
              this.startSocket(this.accountServ.userId);
              this.setupNotification();
              if (this.accountServ.getUserRole().viewMedicalRecord) {
                this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
              }
            });
          } else {
            this.loadCtrl.stopLoading().then( () => {
              this.navCtrl.navigateRoot(this.homePath);
            });
          }
        },
        () => {
        });
  }


  // MARKS: SETUP NOTIFICATION
  setupNotification() {
    this.fire.getToken();

    this.fire.onBackgroundNotification().subscribe(
        data => {

          console.log('Background Notification : \n', JSON.stringify(data));
          if (data.isCommentNotification) {
            this.onLoadReportTemplateWithComments(data);
          } else if (data.page === this.reportPage) {
            this.onLoadReport(this.reportPage, data.reportName, data.reportId);
          } else if (data.page === this.chatPage) {
            this.handelChatOnBackground(data);
          } else if (data.page === this.medicationNotificationPage) {
            this.openMedicalCareNotification(data);
          } else {
            if (this.getPathFromPageName(data.data.page) != null) {
              this.navCtrl.navigateRoot(this.getPathFromPageName(data.data.page));
            } else {
              this.openWeb();
            }
          }

        });

    this.fire.onForgroundNotification().subscribe(
        data => {
          debugger;
          let title;
          let body;
          if (this.platform.is('ios')) {
            title = data.aps.alert.title;
            body = data.aps.alert.body;
          } else {
            title = data.gcm.title;
            body = data.gcm.body;
          }
          this.fire.setLocatNotification(title, body, JSON.parse(JSON.stringify(data)));
          this.fire.onOpenLocalNotification().subscribe(
              data => {
                debugger;
                console.log('Foreground');
                if (data.data.isCommentNotification) {
                  this.onLoadReportTemplateWithComments(data.data);
                } else if (data.data.page === this.reportPage) {
                  this.onLoadReport(this.reportPage, data.data.reportName, data.data.reportId);
                } else if (data.data.page === this.chatPage) {
                  this.handelChatONForeground(data);
                } else if (data.data.page === this.medicationNotificationPage) {
                  this.openMedicalCareNotification(data.data);
                } else {
                  if (this.getPathFromPageName(data.data.page) != null) {
                    this.navCtrl.navigateRoot(this.getPathFromPageName(data.data.page));
                  } else {
                    this.openWeb();
                  }
                }

              });
        });
  }


  handelChatOnBackground(data) {
    const JData = JSON.parse(data.chatMessage);
    const student = JData.chatThread.student;
    const Stud = new Student();
    Stud.id = student.id;
    Stud.name = student.name;
    Stud.address = student.address;
    Stud.classes = student.classes;
    Stud.profileImg = student.profileImg;
    Stud.searchByClassGrade = student.classes.grade.name + ' ' + student.classes.name;
    this.presentChatDialogue(Stud, student);
  }

  async presentChatDialogue(Stud, student) {
    let data = {studentData: Stud};

    this.passData.dataToPass = data;

    const modal = await this.modalCtrl.create({
      component: ChatDialoguePage,
      componentProps: data
    });

    modal.onDidDismiss().then(
        val => {
          this.storage.get('LOCAL_STORAGE_RECENT_CHAT').then(
              val => {
                if (val) {
                  this.updateRecentChatData(val, student);
                }
              });
        });

    return await modal.present();
  }

  handelChatONForeground(data) {
    const JData = JSON.parse(data.data.chatMessage);
    const student = JData.chatThread.student;
    const Stud = new Student();
    Stud.id = student.id;
    Stud.name = student.name;
    Stud.address = student.address;
    Stud.classes = student.classes;
    Stud.profileImg = student.profileImg;
    Stud.searchByClassGrade = student.classes.grade.name + ' ' + student.classes.name;
    this.presentChatDialogue(Stud, student);
  }



  openWeb() {
    // _self in app //_system in phone browser
    this.iab.create('http://104.198.175.198/', '_system');
  }

  startSocket(userId) {
    const that = this;
    this.DomainUrl = new Url_domain();

    let hostName = this.DomainUrl.Domain;

    if (hostName == null || hostName == '') {
      hostName = 'wss://' + 'education.entrepreware.com';
    } else if (hostName.includes('192.168.1')) {
      hostName = 'ws://' + hostName.substring(6);
    } else {
      hostName = 'wss://' + 'education.entrepreware.com';
    }
    const websocket = new WebSocket(hostName + '/socket');
    websocket.onopen = function(message) {
      console.log('OPEN_WEB_SOCKET');
      websocket.send('id' + userId);
    };
    websocket.onmessage = function(message) {
      console.log('onmessage');
      console.log(JSON.parse(message.data));
      const data = JSON.parse(message.data);
      that.handelOnMassage(data, message);
    };
    websocket.onclose = function(message) {
      console.log('onclose');
      console.log(message);
    };
    websocket.onerror = function(message) {
      console.log('onerror');
      console.log(message);
      try {
        websocket.onopen = function(message) {
          console.log('OPEN_WEB_SOCKET');
          websocket.send('id' + userId);
        };
      } catch (e) {
        console.log(e);
      }
    };
  }

  handelOnMassage(data, message) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url.startsWith(this.getPathFromPageName(this.chatPage))) {
        this.chatServ.newMessageSubject$.next(JSON.parse(message.data));
      } else {
        if (!data.user) {
          this.chatServ.NewChats.push(JSON.parse(message.data));
          this.alertCtrl.create({
            header: 'Chat',
            message: 'New chat from your student ' + data.chatThread.student.name,
            buttons: [
              {
                text: 'Later',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'See now',
                handler: () => {
                  // this.nav.setRoot(this.chatPage);
                  this.navCtrl.navigateRoot(this.getPathFromPageName(this.chatPage));
                  const student = data.chatThread.student;
                  const Stud = new Student();
                  Stud.id = student.id;
                  Stud.name = student.name;
                  Stud.address = student.address;
                  Stud.classes = student.classes;
                  Stud.profileImg = student.profileImg;
                  Stud.searchByClassGrade = student.classes.grade.name + ' ' + student.classes.name;
                  this.presentChatDialogue(Stud, student);
                }
              }
            ]
          }).then( alrt => alrt.present());
        }
      }

    });
  }

  updateRecentChatData(val, student) {
    const studentsInStorage: any = JSON.parse(val);
    let found = false;
    for (let i = 0; i < studentsInStorage.length; i++) {
      if (student.id == studentsInStorage[i].id) {
        studentsInStorage.splice(i, 1);
        studentsInStorage.splice(0, 0, student);
        found = true;
      }
    }

    if (!found) {
      studentsInStorage.splice(0, 0, student);
    }

    if (this.platform.is('desktop')) {
      localStorage.setItem('LOCAL_STORAGE_RECENT_CHAT', JSON.stringify(studentsInStorage));
    } else {
      this.storage.set('LOCAL_STORAGE_RECENT_CHAT', JSON.stringify(studentsInStorage));
    }
  }

  async openMedicalCareNotification(data) {

    let medData = { medicationName: data.medicationName,
      dosageType: data.dosageType,
      dosageNumber: data.dosageNumber,
      shceduleId: parseInt(data.shceduleId),
      medicationTime: data.medicationTime.slice(0, -3),
      medicationNextTime: data.medicationNextTime.slice(0, -3),
      student: JSON.parse(data.student) };

    this.passData.dataToPass = medData

    const modal = await this.modalCtrl.create({
      component: MedicationNotificationPage,
      componentProps: medData
    });

    modal.onDidDismiss();
    return await modal.present();
  }

  onLoadReport(page: any, pageName: any, reportId: any) {
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
    this.navCtrl.navigateRoot(this.getPathFromPageName(this.reportPage));
  }

  async onLoadReportTemplateWithComments(params?) {
    this.accountServ.reportId = params.reportId;
    this.accountServ.reportPage = params.reportName;

    let data = {
      student: { id: params.studentId, name: params.studentName },
      classId: params.classId,
      reportDate: params.reportDate,
      comment: true
    };

    this.passData.dataToPass = data;

    const model = await this.modalCtrl.create({
      component: ReportTemplatePage,
      componentProps: data
    });

    return await model.present();
    //  this.accountServ.reportId = 1;
    //  this.accountServ.reportPage = "Weakly";
    // const model = this.modalCtrl.create('ReportTemplatePage',
    //   {student:{id:9020,name:"Lina"},
    //     classId:36,reportDate:"02-06-2019",comment:true});
    //  model.present();
    //  this.menu.close();
  }

  getPathFromPageName(name) {
    if (name == 'NotificationPage') {
      return '/menu/notification';
    } else if (name == 'SettingsPage') {
      return '/menu/profile';
    } else if (name == 'ReportPage') {
      return '/menu/profile';
    } else if (name == 'ChatPage') {
      return '/menu/chat';
    } else if (name == 'MedicalCarePage') {
      return '/menu/profile';
    } else if (name == 'MedicationNotificationPage') {
      return '/menu/profile';
    } else if (name == 'ProfilePage') {
      return '/menu/profile';
    } else {
      return null;
    }
  }



}

