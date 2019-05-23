 import { Component } from '@angular/core';

import {AlertController, ModalController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 import {LoginService} from './services/Login/login.service';
 import {Storage} from "@ionic/storage";
 import {Router, RouterEvent} from '@angular/router';
 import {LoadingViewService} from './services/LoadingView/loading-view.service';
 import {BehaviorSubject} from 'rxjs';
 import {ClassesService} from './services/Classes/classes.service';
 import {StudentsService} from './services/Students/students.service';
 import {MedicalCareService} from './services/MedicalCare/medical-care.service';
 import {LogoutService} from './services/Logout/logout.service';
 import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
 import {AccountService} from './services/Account/account.service';
 import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
 import {FCMService} from './services/FCM/fcm.service';
 import {Student} from './models';
 import {Url_domain} from './models/url_domain';
 import {ChatService} from './services/Chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  homePath = '/home';
  menuPath = '/menu';
  userName:string;
  password:string;
  accessToken:string;

  token:string;
  values:any =[];
  toKenFull:string;

  profilePage = 'ProfilePage';
  notificationPage = 'NotificationPage';
  settingsPage = 'SettingsPage';
  reportPage = 'ReportPage';
  chatPage = 'ChatPage';
  medicalcarePage = 'MedicalCarePage';
  medicationNotificationPage = 'MedicationNotificationPage';

  DomainUrl:Url_domain;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loginServ:LoginService,
    private storage:Storage,
    private router: Router,
    private loadCtrl:LoadingViewService,
    private classesServ:ClassesService,
    private studentServ:StudentsService,
    private medicalService:MedicalCareService,
    private logout:LogoutService,
    private localNotifications:LocalNotifications,
    private accountServ:AccountService,
    private iab:InAppBrowser,
    private fire:FCMService,
    private chatServ:ChatService,
    private modalCtrl:ModalController,
    private alertCtrl:AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#5C87F7');
      this.startAutoLogin();
      this.splashScreen.hide();
    });
  }

  startAutoLogin(){
    if(this.platform.is('desktop')){
      this.userName = localStorage.getItem(this.loginServ.localStorageUserName);
      this.password = localStorage.getItem(this.loginServ.localStoragePassword);
      if((this.userName && this.userName != '') && (this.password && this.password != '')){
        this.startLogIn();
      }else {
        this.router.navigateByUrl(this.homePath);
      }
    }else{
      this.storage.get(this.loginServ.localStorageUserName).then(value => this.userName = value, (err) => {
      }).catch((err) => {
      });
      this.storage.get(this.loginServ.localStoragePassword).then(
          value =>{
            this.password = value;
            if((this.userName && this.userName != '') && (this.password && this.password != '')){
              this.startLogIn();
            }else {
              this.router.navigateByUrl(this.homePath);
            }

          });
    }
  }




  //Mark: SignOut Method
  onSignOut(){
    this.loadCtrl.startNormalLoading('Wait please ...');

    this.classesServ.getClassListWithID_2_AND_NOT_REPORTS = new BehaviorSubject(null);
    this.studentServ.getAllStudentWithID_7 = new BehaviorSubject(null);
    this.medicalService.getMedicines_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getDosageTypes_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getInstructions_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getIncidentTemplate_FOR_MEDICALREPORT = new BehaviorSubject(null);
    this.medicalService.getCheckupTemplate_FOR_MEDICALREPORT = new BehaviorSubject(null);
    this.medicalService.getSETINGS_FOR_MEDICALREPORT = new BehaviorSubject(null);

    let plat=this.platform.is('desktop');

    if(plat){
      let token = localStorage.getItem(this.loginServ.localStorageToken);
      this.logout.putHeader(token);
      if(this.platform.is('desktop')) {
        localStorage.clear();
      }else {
        this.storage.clear();
      }
      this.loadCtrl.stopLoading();
      this.router.navigateByUrl(this.homePath);
    }else{
      this.storage.get(this.loginServ.localStorageToken).then(
          value => {
            this.logout.putHeader(value);
            // this.logoutMethod();
            if(this.platform.is('desktop')) {
              localStorage.clear();
            }else {
              this.storage.clear();
            }
            this.loadCtrl.stopLoading();
            this.router.navigateByUrl(this.homePath);
          })

    }

  }


  logoutMethod(){
    this.logout.postlogout(null,null,null).subscribe(
        (data) => {
          this.loadCtrl.stopLoading();
          if(this.platform.is('desktop')) {
            localStorage.clear();
          }else {
            this.storage.clear();
          }
          this.router.navigateByUrl(this.homePath);
        },
        err => {
          this.loadCtrl.stopLoading();
          if(this.platform.is('desktop')) {
            localStorage.clear();
          }else {
            this.storage.clear();
          }
          this.router.navigateByUrl(this.homePath);
        },
        () => {
        });
  }



  //MARK: START LOGIN METHODS
  startLogIn(){
    this.loadCtrl.startNormalLoading('Logging in...');
    this.localNotifications.clear(2481993);
    let getToken:string;
    this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);
    this.loginServ.postlogin(this.userName,this.password).subscribe(
        (data) => {
          this.values = data;
          this.accessToken = this.values.refreshToken.value;
          this.refreshToken();
        },
        err => {
          this.loadCtrl.stopLoading();
          this.router.navigateByUrl(this.homePath);
        },
        () => {
        });
  }

  fullToken(){
    return 'Bearer ' +this.token;
  }

  refreshToken(){
    this.loginServ.authenticateUserByRefreshToken(this.accessToken).subscribe(
        (data) => {
          this.values = data;
          this.token = this.values.value;
          this.toKenFull = this.fullToken();

          let getToken:string;
          this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);

          if ( (this.platform.is("desktop") )
              && (this.token != null || this.token != '')
              && (this.fullToken() != localStorage.getItem(this.loginServ.localStorageToken)))
          {

            localStorage.setItem(this.loginServ.localStorageToken, this.fullToken());
            localStorage.setItem(this.loginServ.localStorageAccessToken, this.token);
            localStorage.setItem(this.loginServ.localStorageUserName, this.userName);
            localStorage.setItem(this.loginServ.localStoragePassword, this.password);

          } else {
            if ((this.token != null || this.token != '')
                && (getToken != this.fullToken()))
            {
              this.storage.set(this.loginServ.localStorageToken, this.fullToken());
              this.storage.set(this.loginServ.localStorageUserName, this.userName);
              this.storage.set(this.loginServ.localStoragePassword, this.password);
            }
          }

          this.manageAccount();
        },
        err => {
          this.loadCtrl.stopLoading();
          this.router.navigateByUrl(this.homePath);
        });
  }

  manageAccount(){
    this.loginServ.authenticateUserManager(this.token,this.toKenFull).subscribe(
        (data) => {
          this.accountInfo();
        },
        err => {
          this.loadCtrl.stopLoading();
          this.router.navigateByUrl(this.homePath);
        },
        () => {
        });
  }

  accountInfo(){
    this.accountServ.getAccountRoles(this.toKenFull).subscribe(
        (data) => {
          this.accountServ.setDate(data);
          // this.accountServ.getTags(this.fullToken());
          this.CustomReport();
          // this.setNameInMenu(this.accountServ.getUserName());
          // this.knowFeatures(this.accountServ.getAccountFeature());
          // this.load.dismiss();
          // this.nav.setRoot(this.profilePage);
        },
        err => {
          this.loadCtrl.stopLoading();
          this.router.navigateByUrl(this.homePath);
        },
        () => {
        });
  }


  //MARKS: GET CUSTOM REPORTS
  CustomReport(){
    this.accountServ.getCustomReports(this.toKenFull).subscribe(
        (data) => {
          this.loadCtrl.stopLoading();
          this.accountServ.setCustomReport(data);
          this.accountServ.getTags(this.fullToken());
          // this.navCtrl.setRoot('ProfilePage');
          this.router.navigateByUrl('/menu/profile');
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
        },
        err => {
          if(err.error == "FORBIDDEN" ||err.error ==  "NO_REPORTS_FOUNDED_FOR_YOUR_ACCOUNT"){
            this.loadCtrl.stopLoading();
            console.log('Has No Custom report(s)');
            this.accountServ.getTags(this.fullToken());
            // this.navCtrl.setRoot('ProfilePage');
            this.router.navigateByUrl('/menu/profile');
            this.startSocket(this.accountServ.userId);
            this.setupNotification();
            if(this.accountServ.getUserRole().viewMedicalRecord) {
              this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
            }
          }else if(!err.error){
            this.loadCtrl.stopLoading();
            console.log('Has No Custom report(s)');
            this.accountServ.getTags(this.fullToken());
            // this.navCtrl.setRoot('ProfilePage');
            this.router.navigateByUrl('/menu/profile');
            this.startSocket(this.accountServ.userId);
            this.setupNotification();
            if(this.accountServ.getUserRole().viewMedicalRecord) {
              this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
            }
          } else{
            this.loadCtrl.stopLoading();
            this.router.navigateByUrl(this.homePath);
          }
        },
        () => {
        });
  }


  //MARKS: SETUP NOTIFICATION
  setupNotification(){
    this.fire.getToken();

    this.fire.onBackgroundNotification().subscribe(
        data => {

          console.log("Background Notification : \n", JSON.stringify(data));
          if(data.page === this.reportPage){
            this.onLoadReport(this.reportPage, data.reportName,data.reportId);
          }else if(data.page === this.chatPage){
            this.handelChatOnBackground(data);
          } else if(data.page === this.medicationNotificationPage){
            this.openMedicalCareNotification(data);
          } else{
            if(this.getPathFromPageName(data.data.page) != null){
              this.router.navigateByUrl(this.getPathFromPageName(data.data.page));
            }else {
              this.openWeb();
            }
          }

        });

    this.fire.onForgroundNotification().subscribe(
        data => {
          debugger;
          let title;
          let body;
          if(this.platform.is('ios')){
            title = data.aps.alert.title;
            body = data.aps.alert.body;
          }else{
            title = data.gcm.title;
            body = data.gcm.body;
          }
          this.fire.setLocatNotification(title,body,JSON.parse(JSON.stringify(data)));
          this.fire.onOpenLocalNotification().subscribe(
              data => {
                debugger;
                console.log('Foreground');
                if(data.data.page === this.reportPage){
                  this.onLoadReport(this.reportPage, data.data.reportName,data.data.reportId);
                }else if(data.data.page === this.chatPage){
                  this.handelChatONForeground(data);
                } else if(data.data.page === this.medicationNotificationPage){
                  this.openMedicalCareNotification(data.data);
                }else{
                  if(this.getPathFromPageName(data.data.page) != null){
                    this.router.navigateByUrl(this.getPathFromPageName(data.data.page));
                  }else {
                    this.openWeb();
                  }
                }

              });
        });
  }


  handelChatOnBackground(data){
    let JData = JSON.parse(data.chatMessage);
    let student = JData.chatThread.student;
    let Stud = new Student();
    Stud.id = student.id;
    Stud.name = student.name;
    Stud.address = student.address;
    Stud.classes = student.classes;
    Stud.profileImg = student.profileImg;
    Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
    this.presentChatDialogue(Stud, student);
  }

  async presentChatDialogue(Stud,student) {
    const modal = await this.modalCtrl.create({
      component: 'ChatDialoguePage',
      componentProps: {studentData:Stud}
    });

    modal.dismiss(
        val=>{
          this.storage.get('LOCAL_STORAGE_RECENT_CHAT').then(
              val => {
                if(val) {
                  this.updateRecentChatData(val,student);
                }
              });
        });

    return await modal.present();
  }

  handelChatONForeground(data){
    let JData = JSON.parse(data.data.chatMessage);
    let student = JData.chatThread.student;
    let Stud = new Student();
    Stud.id = student.id;
    Stud.name = student.name;
    Stud.address = student.address;
    Stud.classes = student.classes;
    Stud.profileImg = student.profileImg;
    Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
    this.presentChatDialogue(Stud, student);
  }



  openWeb(){
    this.iab.create("http://104.198.175.198/", "_self");
  }

  startSocket(userId){
    let that = this;
    this.DomainUrl = new Url_domain();

    let hostName= this.DomainUrl.Domain;

    if (hostName == null || hostName == "") {
      hostName = "wss://" + "education.entrepreware.com";
    } else if(hostName.includes("192.168.1")){
      hostName = "ws://" + hostName.substring(6);
    }else{
      hostName = "wss://" + "education.entrepreware.com";
    }
    let websocket = new WebSocket(hostName + "/socket");
    websocket.onopen = function(message) {
      console.log("OPEN_WEB_SOCKET");
      websocket.send("id" + userId);
    };
    websocket.onmessage = function(message) {
      console.log("onmessage");
      console.log(JSON.parse(message.data));
      let data = JSON.parse(message.data);
      that.handelOnMassage(data,message);
    };
    websocket.onclose = function(message) {
      console.log("onclose");
      console.log(message);
    };
    websocket.onerror = function(message) {
      console.log("onerror");
      console.log(message);
      try {
        websocket.onopen = function(message) {
          console.log("OPEN_WEB_SOCKET");
          websocket.send("id" + userId);
        };
      }catch (e) {
        console.log(e);
      }
    };
  }

  handelOnMassage(data,message){
    this.router.events.subscribe((event: RouterEvent) =>{

      if(event.url.startsWith(this.getPathFromPageName(this.chatPage))){
        this.chatServ.newMessageSubject$.next(JSON.parse(message.data));
      }else {
        if(!data.user){
          this.chatServ.NewChats.push(JSON.parse(message.data));
          this.alertCtrl.create({
            header: 'Chat',
            message: "New chat from your student " + data.chatThread.student.name,
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
                  let student = data.chatThread.student;
                  let Stud = new Student();
                  Stud.id = student.id;
                  Stud.name = student.name;
                  Stud.address = student.address;
                  Stud.classes = student.classes;
                  Stud.profileImg = student.profileImg;
                  Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
                  this.presentChatDialogue(Stud, student);
                }
              }
            ]
          }).then( alrt => alrt.present());
        }
      }

    });
  }

  updateRecentChatData(val,student){
    let studentsInStorage:any = JSON.parse(val);
    let found = false;
    for (let i = 0; i < studentsInStorage.length; i++) {
      if (student.id == studentsInStorage[i].id) {
        studentsInStorage.splice(i, 1);
        studentsInStorage.splice(0, 0, student);
        found = true;
      }
    }

    if(!found){
      studentsInStorage.splice(0, 0,student);
    }

    if (this.platform.is('desktop')) {
      localStorage.setItem('LOCAL_STORAGE_RECENT_CHAT', JSON.stringify(studentsInStorage));
    }else {
      this.storage.set('LOCAL_STORAGE_RECENT_CHAT', JSON.stringify(studentsInStorage));
    }
  }

  async openMedicalCareNotification(data){

    const modal = await this.modalCtrl.create({
        component: this.medicationNotificationPage,
        componentProps: { medicationName: data.medicationName,
            dosageType: data.dosageType,
            dosageNumber: data.dosageNumber,
            shceduleId:parseInt(data.shceduleId),
            medicationTime:data.medicationTime.slice(0, -3),
            medicationNextTime:data.medicationNextTime.slice(0,-3),
            student:JSON.parse(data.student) }
    });

    modal.dismiss();
    return await modal.present();
  }

  onLoadReport(page:any, pageName:any, reportId:any){
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
    this.router.navigateByUrl(this.getPathFromPageName(this.reportPage));
  }

  getPathFromPageName(name){
    if(name == 'NotificationPage'){
      return '/menu/profile'
    }else if(name == 'SettingsPage'){
      return '/menu/profile'
    }else if(name == 'ReportPage'){
      return '/menu/profile'
    }else if(name == 'ChatPage'){
      return '/menu/profile'
    }else if(name == 'MedicalCarePage'){
      return '/menu/profile'
    }else if(name == 'MedicationNotificationPage'){
      return '/menu/profile'
    }else if(name == 'ProfilePage'){
      return '/menu/profile'
    }else{
      return null;
    }
  }



}
