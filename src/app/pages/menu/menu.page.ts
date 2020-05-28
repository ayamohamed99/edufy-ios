import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { AccountService } from "../../services/Account/account.service";
import _ from "lodash";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  selectedPath = "";

  // toolTabNum = 1;

  custumReportTabIn = 3;

  pages = [];

  customReportList = [];

  elementByClass: any = [];

  constructor(private router: Router, private accountServ: AccountService) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
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
        url: "/menu/cafeteria-",
        customReport: false,
        children: [
          {
            title: "Credit",
            icon: "",
            url: "/menu/cafeteria-credit",
            customReport: false,
          },
          {
            title: "Online Ordering",
            icon: "",
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
        icon: "ios-chatbubbles",
        main: true,
        url: "/menu/chat",
        customReport: false,
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
    };
    this.pages.push(LogOut);
  }

  knowCustomReport(data) {
    let customReports: any = [];
    customReports = data;
    if (customReports.length > 0) {
      let CR = {
        title: "Reports",
        icon: "ios-copy",
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

  stopAll(ev: Event) {
    ev.stopPropagation();
  }
}
