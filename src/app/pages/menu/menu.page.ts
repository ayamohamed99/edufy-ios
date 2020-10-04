import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { AccountService } from "../../services/Account/account.service";
import {BehaviorSubject} from 'rxjs';
import {LogoutService} from './../../services/Logout/logout.service';
import {LoadingViewService} from './../../services/LoadingView/loading-view.service';
import {StudentsService} from './../../services/Students/students.service';
import {ClassesService} from './../../services/Classes/classes.service';
import {MedicalCareService} from './../../services/MedicalCare/medical-care.service';
import {LoginService} from './../../services/Login/login.service';
import { Platform, NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {ChatService} from '../../services/Chat/chat.service';
import {RefreshService} from '../../services/refresh/refresh.service';

import _ from "lodash";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  selectedPath = "";

  // toolTabNum = 1;
  homePath = '/home';

  custumReportTabIn = 3;

  pages = [];

  customReportList = [];

  elementByClass: any = [];

  // public noOfUnseenMessages:any = 0;

  constructor(private router: Router,
    private platform: Platform,
    private logout: LogoutService,
    private loadCtrl: LoadingViewService,
    private loginServ: LoginService,
    private classesServ: ClassesService,
    private storage: Storage,
    private medicalService: MedicalCareService,
    private studentServ: StudentsService,
    private navCtrl: NavController,
    public refresh: RefreshService,
    private chatService: ChatService,
    private accountServ: AccountService) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
    // this.chatService.getNumberOfUnseenMessages().subscribe(
    //   val => {
    //     this.noOfUnseenMessages = val;
    //   }
    // )
    this.refresh.refreshNoOfUnseenMessages();
  }

  ngOnInit() {}

  getUrlPartTwo(part) {
    let data = decodeURI(part);
    return data;
  }

  ionViewDidEnter() {
    this.accountServ.menuFeatures.subscribe((value) => {
      if (value != null) {
        this.knowFeatures(value);
      }
    });
  }

  knowFeatures(data: any) {
    this.pages = [];
    let profile = {
      title: "Profile",
      icon: "person",
      main: true,
      url: "/menu/profile",
      customReport: false,
    };
    this.pages.push(profile);

    if (
      this.accountServ.getUserRole().notificationView &&
      data.notificationActivated
    ) {
      let data = {
        title: "Notification",
        icon: "notifications",
        main: true,
        url: "/menu/notification",
        customReport: false,
      };
      // this.pages.splice(this.pages.length - this.toolTabNum, 0, data);
      this.pages.push(data);
    }

    // TODO
    // if(this.accountServ.getUserRole().cafeteriaCanOrder && data.cafeteriaActivated){
    if (data.cafeteriaActivated) {
      let data = {
        title: "Cafeteria",
        icon: "cafe",
        main: true,
        url: "/menu/cafeteria-card",
        customReport: false,
        children: [
          {
            title: "Card",
            icon: "wallet",
            url: "/menu/cafeteria-card",
            customReport: false,
          },
          {
            title: "Online Ordering",
            icon: "basket",
            url: "/menu/cafeteria-menu",
            customReport: false,
          },
        ],
      };

      this.pages.push(data);
    }

    if (
      this.accountServ.getUserRole().dailyReportView &&
      data.dailyReportActivated
    ) {
      let data = {
        title: "Daily Report",
        icon: "document",
        main: true,
        url: "/menu/daily-report",
        customReport: false,
      };
      // this.pages.splice(this.pages.length - this.toolTabNum, 0, data);
      this.pages.push(data);
    }

    this.knowCustomReport(this.accountServ.getCustomReportsList());

    if (this.accountServ.getUserRole().chatView && data.chatActivated) {
      let data = {
        title: "Chat",
        icon: "chatbubbles",
        main: true, 
        url: "/menu/chat",
        customReport: false,
        chat: true
      };
      // this.pages.splice(this.pages.length - this.toolTabNum, 0, data);
      this.pages.push(data);
    }
    if (
      this.accountServ.getUserRole().viewMedicalCare &&
      data.medicalCareActivated &&
      this.accountServ.getUserRole().viewMedicalRecord
    ) {
      let data = {
        title: "Medical Care",
        icon: "heart",
        main: true,
        url: "/menu/medical-care",
        customReport: false,
      };
      // this.pages.splice(this.pages.length - this.toolTabNum, 0, data);
      this.pages.push(data);
    }

    if (this.accountServ.getAccountFeature().attendanceTeachersActivated) {
      if (this.accountServ.getUserRole().attendanceAllTeachersAppear) {
        let data = {
          title: "Attendance",
          icon: "md-checkmark-circle-outline",
          main: true,
          url: "/menu/attendance-plus",
          customReport: false,
        };
        // this.pages.splice(this.pages.length - this.toolTabNum, 0, data);
        this.pages.push(data);
      } else {
        let data = {
          title: "Attendance",
          icon: "md-checkmark-circle-outline",
          main: true,
          url: "/menu/attendance",
          customReport: false,
        };
        // this.pages.splice(this.pages.length - this.toolTabNum, 0, data);
        this.pages.push(data);
      }
    }

    let Setting = {
      title: "Settings",
      icon: "cog",
      main: false,
      url: "/menu/settings",
    };
    this.pages.push(Setting);

    let LogOut = {
      title: "LogOut",
      icon: "log-out",
      main: false,
      url: "/home",
      logout: true
    };
    this.pages.push(LogOut);
  }

  knowCustomReport(data) {
    let customReports: any = [];
    customReports = data;
    if (customReports.length > 0) {
      let CR = {
        title: "Reports",
        icon: "copy",
        main: true,
        url: "",
        customReport: true,
      };
      this.pages.push(CR);
      data.forEach((val) => {
        let oneCR = {
          title: val.name,
          icon: "document",
          main: true,
          url: "/menu/report",
          id: val.id,
        };
        this.customReportList.push(oneCR);
      });
      this.setCollaps();
    }
  }

  onLoadReport(page: any, pageName: any, reportId: any) {
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
  }

  setCollaps() {
    var coll = document.getElementsByClassName("collopsible");
    var i;

    let foundBefore;

    for (i = 0; i < coll.length; i++) {
      this.elementByClass.find((x) => {
        if (x === coll[i]) {
          foundBefore = true;
        } else {
          foundBefore = false;
        }
      });

      if (!foundBefore) {
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
  }

  // Mark: SignOut Method
  onSignOut() {
    // clear storage only
    // this.loadCtrl.startNormalLoading('Wait please ...');

    this.classesServ.getClassListWithID_2_AND_NOT_REPORTS = new BehaviorSubject(null);
    this.studentServ.getAllStudentWithID_7 = new BehaviorSubject(null);
    this.medicalService.getMedicines_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getDosageTypes_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getInstructions_FOR_MedicalReport = new BehaviorSubject(null);
    this.medicalService.getIncidentTemplate_FOR_MEDICALREPORT = new BehaviorSubject(null);
    this.medicalService.getCheckupTemplate_FOR_MEDICALREPORT = new BehaviorSubject(null);
    this.medicalService.getSETINGS_FOR_MEDICALREPORT = new BehaviorSubject(null);

    const plat = this.platform.is('desktop');

    if (plat) {
      const token = localStorage.getItem(this.loginServ.localStorageToken);
      this.logout.putHeader(token);
      if (this.platform.is('desktop')) {
        localStorage.clear();
      } else {
        this.storage.clear();
      }
    } else {
      this.storage.get(this.loginServ.localStorageToken).then(
        value => {
          this.logout.putHeader(value);
          // this.logoutMethod();
          if (this.platform.is('desktop')) {
            localStorage.clear();
          } else {
            this.storage.clear();
          }
        }
      );
    }
    // this.loadCtrl.stopLoading();
    this.navCtrl.navigateRoot(this.homePath);
  }

  stopAll(ev: Event) {
    ev.stopPropagation();
  }
}
