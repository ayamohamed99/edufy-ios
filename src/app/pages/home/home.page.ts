import {Component, ElementRef, Renderer, Renderer2, ViewChild} from '@angular/core';
import {
    AlertController,
    LoadingController,
    ModalController, NavController,
    Platform
} from '@ionic/angular';
import {NgForm} from "@angular/forms";
import {LoginService} from "../../services/Login/login.service";
import {Storage} from "@ionic/storage";
import {AccountService} from "../../services/Account/account.service";
// import {ProfilePage} from "../profile/profile";
import {Network} from "@ionic-native/network/ngx";
import {NotificationService} from "../../services/Notification/notification.service";
import {FCMService} from "../../services/FCM/fcm.service";
import {InAppBrowser} from "@ionic-native/in-app-browser/ngx";
import {Url_domain} from "../../models/url_domain";
import {Student} from "../../models";
import {ChatService} from "../../services/Chat/chat.service";
import {MedicalCareService} from "../../services/MedicalCare/medical-care.service";
import {Router} from '@angular/router';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {__await} from 'tslib';
import {ChatDialoguePage} from '../chat-dialogue/chat-dialogue.page';
import {MedicationNotificationPage} from '../medication-notification/medication-notification.page';
import {ReportTemplatePage} from '../report-template/report-template.page';
import {PassDataService} from '../../services/pass-data.service';
import {DailyReportService} from '../../services/DailyReport/daily-report.service';
import {ClassesService} from '../../services/Classes/classes.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  userName: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  token: string;
  values: any = [];
  toKenFull: string;
  // load:any;
  elementByClass: any = [];
  @ViewChild("passwordInput", { static: false }) inp: any;
  chatPage = "ChatPage";
  hereONPage;
  DomainUrl;

  profilePage = "ProfilePage";
  notificationPage = "NotificationPage";
  settingsPage = "SettingsPage";
  reportPage = "ReportPage";
  medicalcarePage = "MedicalCarePage";
  medicationNotificationPage = "MedicationNotificationPage";
  homePage = "HomePage";

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private loginServ: LoginService,
    private storage: Storage,
    private platform: Platform,
    private loading: LoadingController,
    private alertCtrl: AlertController,
    private accountServ: AccountService,
    private network: Network,
    private notiServ: NotificationService,
    private fire: FCMService,
    public chatServ: ChatService,
    private el: ElementRef,
    private rend: Renderer,
    private rend2: Renderer2,
    public iab: InAppBrowser,
    public modalCtrl: ModalController,
    public medicalService: MedicalCareService,
    public load: LoadingViewService,
    public classesServ: ClassesService,
    private passData:PassDataService,
    private dailyReportServ:DailyReportService,
    public transformDate:TransFormDateService
  ) {
    // if(platform.is('desktop')){
    //     this.userName = localStorage.getItem(this.loginServ.localStorageUserName);
    //     this.password = localStorage.getItem(this.loginServ.localStoragePassword);
    //     if((this.userName && this.userName != '') && (this.password && this.password != '')){
    //         this.startLogIn();
    //     }
    // }else{
    //     storage.get(this.loginServ.localStorageUserName).then(value => this.userName = value, (err) => {
    //     }).catch((err) => {
    //     });
    //     storage.get(this.loginServ.localStoragePassword).then(
    //         value =>{
    //             this.password = value;
    //             if((this.userName && this.userName != '') && (this.password && this.password != '')){
    //                 this.startLogIn();
    //             }
    //         });
    // }
  }

  login(form: NgForm) {
    this.userName = form.value.userName;
    this.password = form.value.password;
    this.startLogIn();
  }

  startLogIn() {
    this.load.startNormalLoading("Logging in...").then(() => {
      let getToken: string;
      this.storage
        .get(this.loginServ.localStorageToken)
        .then((value) => (getToken = value));
      this.loginServ.postlogin(this.userName, this.password).subscribe(
        (data) => {
          this.values = data;
          // if(this.platform.is('cordova')){
          //     // @ts-ignore
          //     this.values = JSON.parse(data.data);
          // }
          this.accessToken = this.values.refreshToken.value;
          this.refreToken();
        },
        (err) => {
          this.load.stopLoading();
          this.alertCtrl
            .create({
              header: "Error!",
              subHeader: "Wrong Username or Password",
              buttons: ["OK"],
            })
            .then((alert) => alert.present());
        },
        () => {}
      );
    });
  }

  fullToken() {
    return "Bearer " + this.token;
  }

  refreToken() {
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
        this.storage
          .get(this.loginServ.localStorageToken)
          .then((value) => (getToken = value));

        if (
          this.platform.is("desktop") &&
          (this.token != null || this.token != "") &&
          this.fullToken() !=
            localStorage.getItem(this.loginServ.localStorageToken)
        ) {
          localStorage.setItem(
            this.loginServ.localStorageToken,
            this.fullToken()
          );
          localStorage.setItem(
            this.loginServ.localStorageUserName,
            this.userName
          );
          localStorage.setItem(
            this.loginServ.localStoragePassword,
            this.password
          );
        } else {
          if (
            (this.token != null || this.token != "") &&
            getToken != this.fullToken()
          ) {
            this.storage.set(
              this.loginServ.localStorageToken,
              this.fullToken()
            );
            this.storage.set(
              this.loginServ.localStorageUserName,
              this.userName
            );
            this.storage.set(
              this.loginServ.localStoragePassword,
              this.password
            );
          }
        }

        this.managAccount();
      },
      (err) => {
        this.load.stopLoading();
        this.alertCtrl
          .create({
            header: "Error!",
            subHeader: "Wrong Username or Password",
            buttons: ["OK"],
          })
          .then((alert) => alert.present());
      }
    );
  }

  managAccount() {
    this.loginServ
      .authenticateUserManager(this.token, this.toKenFull)
      .subscribe(
        (data) => {
          this.accountInfo();
        },
        (err) => {
          this.load.stopLoading();
          this.alertCtrl
            .create({
              header: "Error!",
              subHeader: "Wrong Username or Password",
              buttons: ["OK"],
            })
            .then((alert) => alert.present());
        },
        () => {}
      );
  }

  accountInfo() {
    this.accountServ.getAccountRoles(this.toKenFull).subscribe(
      (val) => {
        // this.load.stopLoading();
        let data = val;
        // if(this.platform.is('cordova')){
        //     // @ts-ignore
        //     data = JSON.parse(val.data);
        // }

        // @ts-ignore
        if (data.id) {
          this.accountServ.setDate(data);
          // this.accountServ.getTags(this.fullToken());
          // this.navCtrl.setRoot(ProfilePage);
          this.CustomReport();
        } else {
          this.load.stopLoading();
          this.alertCtrl
            .create({
              header: "Error!",
              subHeader: "Wrong Username or Password",
              buttons: ["OK"],
            })
            .then((alert) => alert.present());
        }
      },
      (err) => {
        this.load.stopLoading();
        this.alertCtrl
          .create({
            header: "Error!",
            subHeader: "Wrong Username or Password",
            buttons: ["OK"],
          })
          .then((alert) => alert.present());
      },
      () => {}
    );
  }

  CustomReport() {
    this.accountServ.getCustomReports(this.toKenFull).subscribe(
      (data) => {
        this.load.stopLoading();
        // if(this.platform.is('cordova')){
        //     // @ts-ignore
        //     this.accountServ.setCustomReport(JSON.parse(data.data));
        // }else{
        this.accountServ.setCustomReport(data);
        // }

        this.accountServ.getTags(this.fullToken());
        // this.navCtrl.setRoot('ProfilePage');
        this.navCtrl.navigateRoot("/menu/profile");
        this.startSocket(this.accountServ.userId);
        this.setupNotification();
      },
      (err) => {
        if (
          err.error == "FORBIDDEN" ||
          err.error == "NO_REPORTS_FOUNDED_FOR_YOUR_ACCOUNT"
        ) {
          this.load.stopLoading();
          console.log("Has No Custom report(s)");
          this.accountServ.getTags(this.fullToken());
          // this.navCtrl.setRoot('ProfilePage');
          this.navCtrl.navigateRoot("/menu/profile");
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
          if (this.accountServ.getUserRole().viewMedicalRecord) {
            this.medicalService
              .getAccountMedicalCareSettings(
                this.accountServ.userAccount.accountId
              )
              .subscribe();
          }
        } else if (!err.error) {
          this.load.stopLoading();
          console.log("Has No Custom report(s)");
          this.accountServ.getTags(this.fullToken());
          // this.navCtrl.setRoot('ProfilePage');
          this.navCtrl.navigateRoot("/menu/profile");
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
          if (this.accountServ.getUserRole().viewMedicalRecord) {
            this.medicalService
              .getAccountMedicalCareSettings(
                this.accountServ.userAccount.accountId
              )
              .subscribe();
          }
        } else {
          this.load.stopLoading();
          this.alertCtrl
            .create({
              header: "Error!",
              subHeader: "Wrong Username or Password",
              buttons: ["OK"],
            })
            .then((alert) => alert.present());
        }
      },
      () => {}
    );
  }

  passOn = false;
  inputTextType = "text";
  showPassword() {
    if (!this.passOn) {
      this.passOn = true;
    } else {
      this.passOn = false;
    }
  }

  setupNotification() {
    this.fire.getToken();

    this.fire.onBackgroundNotification().subscribe((data) => {
      console.log("Background Notification : \n", JSON.stringify(data));
      if (data.isCommentNotification) {
        this.onLoadReportTemplateWithComments(data);
      } else if (data.page === "ReportPage") {
        this.onLoadReport(this.reportPage,
          data.reportName,
          data.reportId,
          data.studentId,
          data.studentName,
          data.reportDate,
          data.classId);
      } else if (data.page === this.chatPage) {
        this.handelChatOnBackground(data);
      } else if (data.page === this.medicationNotificationPage) {
        this.openMedicalCareNotification(data);
      } else if (data.page === this.homePage) {
        this.navCtrl.navigateRoot("/menu/profile");
      }else {
        if (this.getPathFromPageName(data.data.page) != null) {
          this.navCtrl.navigateRoot(this.getPathFromPageName(data.data.page));
        } else {
          this.openWeb();
        }
      }
    });

    this.fire.onForgroundNotification().subscribe((data) => {
      debugger;
      let title;
      let body;
      if (this.platform.is("ios")) {
        title = data.aps.alert.title;
        body = data.aps.alert.body;
      } else {
        title = data.gcm.title;
        body = data.gcm.body;
      }
      this.fire.setLocatNotification(
        title,
        body,
        JSON.parse(JSON.stringify(data))
      );
      this.fire.onOpenLocalNotification().subscribe((data) => {
        debugger;
        console.log(data);
        console.log("Foreground");
        if (data.data.isCommentNotification) {
          this.onLoadReportTemplateWithComments(data.data);
        } else if (data.data.page === this.reportPage) {
          this.onLoadReport(
            this.reportPage,
            data.data.reportName,
            data.data.reportId,
            data.data.student.id,
            data.data.student.name,
            data.data.reportDate,
            data.data.classId
          );
        } else if (data.data.page === this.chatPage) {
          this.handelChatONForeground(data);
        } else if (data.data.page === this.medicationNotificationPage) {
          this.openMedicalCareNotification(data.data);
        } else if (data.data.page === this.homePage) {
          this.navCtrl.navigateRoot("/menu/profile");
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

  async openMedicalCareNotification(data) {
    const modal = await this.modalCtrl.create({
      component: MedicationNotificationPage,
      componentProps: {
        medicationName: data.medicationName,
        dosageType: data.dosageType,
        dosageNumber: data.dosageNumber,
        shceduleId: parseInt(data.shceduleId),
        medicationTime: data.medicationTime.slice(0, -3),
        medicationNextTime: data.medicationNextTime.slice(0, -3),
        student: JSON.parse(data.student),
      },
    });

    modal.onDidDismiss();
    return await modal.present();
  }

  handelChatOnBackground(data) {
    this.alertCtrl.getTop().then(val => {
      if(val.header == 'Chat'){
        val.dismiss();
      }
    })
    let JData = JSON.parse(data.chatMessage);
    let student = JData.chatThread.student;
    let Stud = new Student();
    Stud.id = student.id;
    Stud.name = student.name;
    Stud.address = student.address;
    Stud.classes = student.classes;
    Stud.profileImg = student.profileImg;
    Stud.searchByClassGrade =
      student.classes.grade.name + " " + student.classes.name;
    this.presentChatDialogue(Stud, student);
  }

  handelChatONForeground(data) {
    this.alertCtrl.getTop().then(val => {
      if(val.header == 'Chat'){
        val.dismiss();
      }
    })
    let JData = JSON.parse(data.data.chatMessage);
    let student = JData.chatThread.student;
    let Stud = new Student();
    Stud.id = student.id;
    Stud.name = student.name;
    Stud.address = student.address;
    Stud.classes = student.classes;
    Stud.profileImg = student.profileImg;
    Stud.searchByClassGrade =
      student.classes.grade.name + " " + student.classes.name;
    this.presentChatDialogue(Stud, student);
  }

  async presentChatDialogue(Stud, student) {

    let data = {
      studentData: Stud
    };

    this.passData.dataToPass = data;

    const modal = await this.modalCtrl.create({
      component: ChatDialoguePage,
      componentProps: data,
    });

    let students = [];
    students.push(student);

    if (this.platform.is("desktop")) {
      localStorage.setItem("LOCAL_STORAGE_RECENT_CHAT", JSON.stringify(students));
    }else{
      this.storage.set("LOCAL_STORAGE_RECENT_CHAT", JSON.stringify(students));
    }

    modal.onDidDismiss().then((val) => {
      if (this.platform.is("desktop")) {
        let v = localStorage.getItem("LOCAL_STORAGE_RECENT_CHAT");
        if (v) {
          this.updateRecentChatData(v, student);
        }
      }else{
        this.storage.get("LOCAL_STORAGE_RECENT_CHAT").then((val) => {
          if (val) {
            this.updateRecentChatData(val, student);
          }
        });
      }
    });

    return await modal.present();
  }

  updateRecentChatData(val, student) {
    let studentsInStorage: any = JSON.parse(val);
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

    if (this.platform.is("desktop")) {
      localStorage.setItem(
        "LOCAL_STORAGE_RECENT_CHAT",
        JSON.stringify(studentsInStorage)
      );
    } else {
      this.storage.set(
        "LOCAL_STORAGE_RECENT_CHAT",
        JSON.stringify(studentsInStorage)
      );
    }
  }

  openWeb() {
    this.iab.create("http://104.198.175.198/", "_system");
  }

  async onLoadReport(page: any, pageName: any, reportId: any,
      studentId: any, 
      studentName: any,
      reportDate: any,
      classId: any) {
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
    this.navCtrl.navigateRoot(["menu/report", pageName]);
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

  startSocket(userId) {
    let that = this;
    // this.navCtrl.viewDidEnter.subscribe(
    //     page=>{
    //       console.log(page);
    //       if(page.name) {
    //         this.hereONPage = page.name;
    //       }else{
    //         this.hereONPage = page.id;
    //       }
    //     },err=>{
    //       console.log(err);
    //     });
    this.DomainUrl = new Url_domain();

    let hostName = this.DomainUrl.Domain;

    if (hostName == null || hostName == "") {
      hostName = "wss://" + "education.entrepreware.com";
    } else if (hostName.includes("192.168.1")) {
      hostName = "ws://" + hostName.substring(6);
    } else {
      hostName = "wss://" + "education.entrepreware.com";
    }
    let websocket = new WebSocket(hostName + "/socket");
    websocket.onopen = function (message) {
      console.log("OPEN_WEB_SOCKET");
      websocket.send("id" + userId);
    };
    websocket.onmessage = function (message) {
      console.log("onmessage");
      console.log(JSON.parse(message.data));
      let data = JSON.parse(message.data);
      if (that.hereONPage == that.chatPage) {
        that.chatServ.newMessageSubject$.next(JSON.parse(message.data));
      } else {
        if (!data.user) {
          that.chatServ.NewChats.push(JSON.parse(message.data));
          that.alertCtrl
            .create({
              header: "Chat",
              subHeader:
                "New chat from your student " + data.chatThread.student.name,
              buttons: [
                {
                  text: "Later",
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
                {
                  text: "See now",
                  handler: () => {
                    // that.nav.setRoot(that.chatPage);
                    let student = data.chatThread.student;
                    let Stud = new Student();
                    Stud.id = student.id;
                    Stud.name = student.name;
                    Stud.address = student.address;
                    Stud.classes = student.classes;
                    Stud.profileImg = student.profileImg;
                    Stud.searchByClassGrade =
                      student.classes.grade.name + " " + student.classes.name;
                    // let modal = that.modalCtrl.create('ChatDialoguePage',
                    //     {studentData:Stud});
                    // modal.present();
                  },
                },
              ],
            })
            .then((alert) => alert.present());
        }
      }
    };
    websocket.onclose = function (message) {
      console.log("onclose");
      console.log(message);
    };
    websocket.onerror = function (message) {
      console.log("onerror");
      console.log(message);
      try {
        websocket.onopen = function (message) {
          console.log("OPEN_WEB_SOCKET");
          websocket.send("id" + userId);
        };
      } catch (e) {
        console.log(e);
      }
    };
  }

  getPathFromPageName(name) {
    if (name == "NotificationPage") {
      return "/menu/notification";
    } else if (name == "SettingsPage") {
      return "/menu/profile";
    } else if (name == "ReportPage") {
      return "/menu/profile";
    } else if (name == "ChatPage") {
      return "/menu/chat";
    } else if (name == "MedicalCarePage") {
      return "/menu/medical-care";
    } else if (name == "MedicationNotificationPage") {
      return "medication-notification";
    } else if (name == "ProfilePage") {
      return "/menu/profile";
    } else {
      return null;
    }
  }
}
