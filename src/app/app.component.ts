import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, ModalController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {Storage} from "@ionic/storage";
import {LoginService} from "../services/login";
import {NotificationPage} from "../pages/notification/notification";
import {AccountService} from "../services/account";
import {ProfilePage} from "../pages/profile/profile";
import {SettingsPage} from "../pages/settings/settings";
import {LogoutService} from "../services/logout";
import {ReportPage} from "../pages/report/report";
import {FCMService} from "../services/fcm";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Url_domain} from "../models/url_domain";
import {ChatService} from "../services/chat";
import {Student} from "../models";
import {tryCatch} from "rxjs/util/tryCatch";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {MedicalCareService} from "../services/medicalcare";
import {StudentsService} from "../services/students";
import {ClassesService} from "../services/classes";
import {BehaviorSubject} from "rxjs";

declare var window:any;

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  view:any = [];
  rootPage:any;
  profilePage = 'ProfilePage';
  homePage = HomePage;
  notificationPage = 'NotificationPage';
  settingsPage = 'SettingsPage';
  reportPage = 'ReportPage';
  chatPage = 'ChatPage';
  medicalcarePage = 'MedicalCarePage';
  medicationNotificationPage = 'MedicationNotificationPage';

  userName:string;
  password:string;
  accessToken:string;
  // refreshToken:string;
  token:string;
  values:any =[];
  toKenFull:string;
  load:any;
  names:string;

  appearNotification:boolean = false;
  appearDailyReport:boolean = false;
  appearCustomReport:boolean = false;
  appearChat:boolean = false;
  appearMedicalReport:boolean = false;
  customReportList:any = [];

  elementByClass:any = [];
  oldPage = null;
  startApp = false;
  DomainUrl:Url_domain;
  hereONPage;

  constructor(private platform: Platform, statusBar: StatusBar,splashScreen: SplashScreen, private menu: MenuController,private storage:Storage,
              private loginServ:LoginService, private loading:LoadingController, private accountServ:AccountService,public chatServ:ChatService,
              private logout:LogoutService, private alertCtrl: AlertController, private fire:FCMService, private iab: InAppBrowser,public modalCtrl:ModalController,
              private localNotifications:LocalNotifications,public medicalService:MedicalCareService,public studentServ:StudentsService,public classesServ:ClassesService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.overlaysWebView(true);
      statusBar.backgroundColorByHexString('#5C87F7');
      if(platform.is('core')){
        this.userName = localStorage.getItem(this.loginServ.localStorageUserName);
        this.password = localStorage.getItem(this.loginServ.localStoragePassword);
      }else{
        storage.get(this.loginServ.localStorageUserName).then(value => this.userName = value, (err) => {
        }).catch((err) => {
        });
        storage.get(this.loginServ.localStoragePassword).then(
            value =>{
              this.password = value;
              if((this.userName && this.userName != '') && (this.password && this.password != '')){
                this.startLogIn();
              }else {
                this.rootPage = this.homePage;
              }

            });
      }

      if((this.userName && this.userName != '') && (this.password && this.password != '') &&
        platform.is('core')){
        this.startLogIn();
      }else {
        this.rootPage = this.homePage;
      }
      statusBar.styleDefault();
      splashScreen.hide();
      this.startApp = true;
      // this.oldPage = 'profilePage';
      // document.getElementById('profilePage').classList.toggle("selected");
      // document.getElementById('logOutPage').classList.remove("selected");
      this.nav.viewDidEnter.subscribe(
        page=>{
          console.log(page);
          if(page.name) {
            this.hereONPage = page.name;
          }else{
            this.hereONPage = page.id;
          }
          this.onSelectView(page.name);
        },err=>{
          console.log(err);
        });
    });
  }

  public whichPage(){


    var coll = document.getElementsByClassName("collopsible");
    var i;

    let foundBefore;

    for (i = 0; i < coll.length; i++) {
     this.elementByClass.find(x =>{
       if(x === coll[i]){
         foundBefore=true;
       }else{
         foundBefore=false;
       }
     });

      if(!foundBefore) {
        coll[i].addEventListener("click", function () {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
        this.elementByClass.push(coll[i]);
      }
    }



    this.view=this.nav.getActive();
    this.setNameInMenu(this.accountServ.getUserName());
    this.knowFeatures(this.accountServ.getAccountFeature());
    this.knowCustomReport(this.accountServ.getCustomReportsList());
    if(this.view && this.platform.is('core') && this.platform.width() > 992){
      if(this.view.name == 'HomePage' && this.platform.is('core')){
        return false;
      }else{
        return true;
      }
    }
    else
    {
      return false;
    }
  }

  onLoad(page:any){
    this.nav.setRoot(page);
    this.menu.close();
  }

  onLoadReport(page:any, pageName:any, reportId:any){
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
    this.nav.setRoot(page);
    this.menu.close();
  }

  onLoadReportTemplateWithComments() {
    this.accountServ.reportId = -1;
    // this.nav.setRoot("ReportTemplatePage",
    //   {student:{id:16642,name:"ADAM"},classId:303,reportDate:"29-05-2019",comment:true})

   const model = this.modalCtrl.create('ReportTemplatePage',
     {student:{id:16642,name:"ADAM"},classId:303,reportDate:"29-05-2019",comment:true});
    model.present();
    this.menu.close();
  }

  onSignOut(){
    this.load = this.loading.create({
      content: 'Wait please ...'
    });
    this.load.present();

    this.classesServ.getClassListWithID_2_AND_NOT_REPORTS = new BehaviorSubject(null);
    this.studentServ.getAllStudentWithID_7 = new BehaviorSubject(null);
    this.medicalService.getMedicines_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getDosageTypes_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getInstructions_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getIncidentTemplate_FOR_MEDICALREPORT = new BehaviorSubject(null);
    this.medicalService.getCheckupTemplate_FOR_MEDICALREPORT = new BehaviorSubject(null);
    this.medicalService.getSETINGS_FOR_MEDICALREPORT = new BehaviorSubject(null);

    let plat=this.platform.is('core');

    if(plat){
      let token = localStorage.getItem(this.loginServ.localStorageToken);
      this.logout.putHeader(token);
      if(this.platform.is('core')) {
        localStorage.clear();
      }else {
        this.storage.clear();
      }
      this.load.dismiss();
      this.menu.close();
      this.nav.setRoot(this.homePage);
    }else{
      this.storage.get(this.loginServ.localStorageToken).then(
        value => {
          this.logout.putHeader(value);
          // this.logoutMethod();
          if(this.platform.is('core')) {
            localStorage.clear();
          }else {
            this.storage.clear();
          }
          this.load.dismiss();
          this.menu.close();
          this.nav.setRoot(this.homePage);
        })

    }

    // document.getElementById('ProfilePage').classList.toggle("selected");
    // document.getElementById('logOutPage').classList.remove("selected");

  }


  logoutMethod(){
    this.logout.postlogout(null,null,null).subscribe(
      (data) => {
        this.load.dismiss();
        if(this.platform.is('core')) {
          localStorage.clear();
        }else {
          this.storage.clear();
        }
        this.menu.close();
        this.nav.setRoot(this.homePage);
      },
      err => {
        this.load.dismiss();
        if(this.platform.is('core')) {
          localStorage.clear();
        }else {
          this.storage.clear();
        }
        this.menu.close();
        this.nav.setRoot(this.homePage);
      },
      () => {
      });
  }











//All services For Auto login

  startLogIn(){
    this.load = this.loading.create({
      content: 'Logging in...'
    });
    this.load.present();
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
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
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

        if ( (this.platform.is("core") )
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
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      });
  }


  manageAccount(){
    this.loginServ.authenticateUserManager(this.token,this.toKenFull).subscribe(
      (data) => {
        this.accountInfo();
      },
      err => {
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
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
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      },
      () => {
      });
  }

  setNameInMenu(name:string){
    this.names = name;
  }

  knowFeatures(data:any){
    if(this.accountServ.getUserRole().notificationView && data.notificationActivated){
      this.appearNotification = true;
    }else{
      this.appearNotification = false;
    }

    if(this.accountServ.getUserRole().dailyReportView && data.dailyReportActivated){
      this.appearDailyReport = true;
    }else{
      this.appearDailyReport = false;
    }

    if(this.accountServ.getUserRole().chatView && data.chatActivated){
      this.appearChat = true;
    }else{
      this.appearChat = false;
    }

    if(this.accountServ.getUserRole().viewMedicalCare && data.medicalCareActivated && this.accountServ.getUserRole().viewMedicalRecord){
      this.appearMedicalReport = true;
    }else{
      this.appearMedicalReport = false;
    }

  }

  knowCustomReport(data){
    let customReports:any = [];
    customReports = data;
    if(customReports.length > 0){
      this.appearCustomReport = true;
      this.customReportList = data;
    }
  }

  CustomReport(){
    this.accountServ.getCustomReports(this.toKenFull).subscribe(
      (data) => {
        this.accountServ.setCustomReport(data);
        this.accountServ.getTags(this.fullToken());
        this.setNameInMenu(this.accountServ.getUserName());
        this.knowFeatures(this.accountServ.getAccountFeature());
        this.knowCustomReport(this.accountServ.getCustomReportsList());
        this.load.dismiss();
        this.nav.setRoot(this.profilePage);
        this.startSocket(this.accountServ.userId);
        this.setupNotification();
      },
      err => {
        if(err.error == "FORBIDDEN" ||err.error ==  "NO_REPORTS_FOUNDED_FOR_YOUR_ACCOUNT"){
          this.load.dismiss();
          console.log('Has No Custom report(s)');
          this.accountServ.getTags(this.fullToken());
          this.nav.setRoot('ProfilePage');
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
          if(this.accountServ.getUserRole().viewMedicalRecord) {
            this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
          }
        }else if(!err.error){
          this.load.dismiss();
          console.log('Has No Custom report(s)');
          this.accountServ.getTags(this.fullToken());
          this.nav.setRoot('ProfilePage');
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
          if(this.accountServ.getUserRole().viewMedicalRecord) {
            this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
          }
        } else {
          this.load.dismiss();
          this.nav.setRoot(this.homePage);
        }
      });
  }

  onSelectView(page){
    let TO_OPEN_PAGE = page;
    if(page == "ReportPage" && this.accountServ.reportId > 0){
      TO_OPEN_PAGE = page+this.accountServ.reportId;
    }

    if(this.oldPage != null && document.getElementById(this.oldPage) ) {
      document.getElementById(this.oldPage).classList.toggle("selected");
    }
    if (document.getElementById(TO_OPEN_PAGE)) {
      document.getElementById(TO_OPEN_PAGE).classList.toggle("selected");
    }
    this.oldPage = TO_OPEN_PAGE;
  }

  setupNotification(){
    this.fire.getToken();

    this.fire.onBackgroundNotification().subscribe(
      data => {

        console.log("Background Notification : \n", JSON.stringify(data));
        if(data.page === this.reportPage){
          this.onLoadReport(this.reportPage, data.reportName,data.reportId);
        }else if(data.page === this.chatPage){
          let JData = JSON.parse(data.chatMessage);
          let student = JData.chatThread.student;
          let Stud = new Student();
          Stud.id = student.id;
          Stud.name = student.name;
          Stud.address = student.address;
          Stud.classes = student.classes;
          Stud.profileImg = student.profileImg;
          Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
          let modal = this.modalCtrl.create('ChatDialoguePage',
            {studentData:Stud});
          modal.onDidDismiss(
            val=>{
              this.storage.get('LOCAL_STORAGE_RECENT_CHAT').then(
                val => {
                  if(val) {
                    this.updateRecentChatData(val,student);
                  }
                });
            });
          modal.present();
        } else if(data.page === this.medicationNotificationPage){
          this.openMedicalCare(data);
        } else{
          this.nav.setRoot(data.page).then(
            value => {
              console.log(value);
            }).catch( err=>{
              console.log('err');
              console.log(err);
              if(err.includes("invalid")){
                this.openWeb();
              }
          });
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
              let JData = JSON.parse(data.data.chatMessage);
              let student = JData.chatThread.student;
              let Stud = new Student();
              Stud.id = student.id;
              Stud.name = student.name;
              Stud.address = student.address;
              Stud.classes = student.classes;
              Stud.profileImg = student.profileImg;
              Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
              let modal = this.modalCtrl.create('ChatDialoguePage',
                {studentData:Stud});
              modal.onDidDismiss(
                val=>{
                  this.storage.get('LOCAL_STORAGE_RECENT_CHAT').then(
                    val => {
                      if(val) {
                        this.updateRecentChatData(val,student);
                      }
                    });
                });
              modal.present();
            } else if(data.data.page === this.medicationNotificationPage){
              this.openMedicalCare(data.data);
            }else{
              this.nav.setRoot(data.data.page).then(
                value => {
                  console.log(value);
                }).catch(
                  err=>{
                    console.log('err');
                    console.log(err);
                    if(err.includes("invalid")){
                      this.openWeb();
                    }
              });
            }

          });
      });
  }

  openWeb(){

    this.iab.create("http://104.198.175.198/", "_self");

  }

  startSocket(userId){
    let that = this;
    this.DomainUrl = new Url_domain;

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
      if(that.hereONPage == that.chatPage){
        that.chatServ.newMessageSubject$.next(JSON.parse(message.data));
      }else {
        if(!data.user){
          that.chatServ.NewChats.push(JSON.parse(message.data));
          that.alertCtrl.create({
            title: 'Chat',
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
                  // that.nav.setRoot(that.chatPage);
                  let student = data.chatThread.student;
                  let Stud = new Student();
                  Stud.id = student.id;
                  Stud.name = student.name;
                  Stud.address = student.address;
                  Stud.classes = student.classes;
                  Stud.profileImg = student.profileImg;
                  Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
                  let modal = that.modalCtrl.create('ChatDialoguePage',
                    {studentData:Stud});
                  modal.onDidDismiss(
                    val=>{
                      that.storage.get('LOCAL_STORAGE_RECENT_CHAT').then(
                        val => {
                          if(val) {
                            that.updateRecentChatData(val,student);
                          }
                        });
                    });
                  modal.present();
                }
              }
            ]
          }).present();
        }
      }
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

    if (this.platform.is('core')) {
      localStorage.setItem('LOCAL_STORAGE_RECENT_CHAT', JSON.stringify(studentsInStorage));
    }else {
      this.storage.set('LOCAL_STORAGE_RECENT_CHAT', JSON.stringify(studentsInStorage));
    }
  }

  openMedicalCare(data){

    let modal = this.modalCtrl.create(this.medicationNotificationPage,
      {

        medicationName: data.medicationName,
        dosageType: data.dosageType,
        dosageNumber: data.dosageNumber,
        shceduleId:parseInt(data.shceduleId),
        medicationTime:data.medicationTime.slice(0, -3),
        medicationNextTime:data.medicationNextTime.slice(0,-3),
        student:JSON.parse(data.student)

      });
    modal.onDidDismiss(val=>{});
    modal.present();
  }
}

