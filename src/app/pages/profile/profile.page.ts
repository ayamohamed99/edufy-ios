import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {AccountService} from "../../services/Account/account.service";
import {Postattachment} from "../../models/postattachment";
import {Pendingnotification} from "../../models/pendingnotification";
import {Storage} from "@ionic/storage";
import {Network} from "@ionic-native/network/ngx";
import {NotificationService} from "../../services/Notification/notification.service";
import {Ng2ImgMaxService} from "ng2-img-max";
import {DomSanitizer} from "@angular/platform-browser";
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {DatePipe} from '@angular/common';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import { Device } from '@ionic-native/device/ngx';
import {error} from 'selenium-webdriver';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {LoginService} from '../../services/Login/login.service';
import {UpdatePasswordPage} from '../update-password/update-password.page';
import { ModalController } from '@ionic/angular';
// declare var wifiinformation: any;
declare var WifiWizard2: any;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
  providers: [DatePipe],
})
export class ProfilePage implements OnInit {
  @ViewChild("commentDiv", { static: false }) commentAppear: ElementRef;

  name: string;
  userName: string;
  userPhone: string;
  userMail: string;
  userAddress: string;
  pendingNotification: any[] = [];
  arrayToPostAttachment: any[] = [];
  wifiUploadKey = "WIFI_UPLOAD";
  localStorageToken: string = "LOCAL_STORAGE_TOKEN";
  // localStorageAttendanceShift:string = 'LOCAL_STORAGE_USER_SHIFT';
  localStorageAttendanceWIFIS: string = "LOCAL_STORAGE_USER_WIFIS";

  WIFI_CODE = 1;
  QRCODE_CODE = 2;

  uploadedImage: File;
  imagePreview: any[] = [];

  wifi: any;
  attendData: [any];
  userShiftData;
  connectedToSameWiFi = false;
  // checkIn = true;
  samePhone = false;

  constructor(
    public modalController: ModalController,
    public platform: Platform,
    public accountServ: AccountService,
    public alertController: AlertController,
    public load: LoadingViewService,
    public toast: ToastViewService,
    public storage: Storage,
    public network: Network,
    public notiServ: NotificationService,
    public attend: AttendanceTeachersService,
    public transDate: TransFormDateService,
    public datepipe: DatePipe,
    public androidPermission: AndroidPermissions,
    public auth: LoginService
  ) {
    this.name = accountServ.getUserName();
    this.userName = accountServ.getUserUserName();
    this.userPhone = accountServ.getUserTelephone();
    this.userMail = accountServ.getUserEmail();
    this.userAddress = accountServ.getUserAddress();
    if (!this.name || this.name == "") {
      this.name = "No Name";
    }
    if (!this.userName || this.userName == "") {
      this.userName = "No User Name";
    }
    if (!this.userPhone || this.userPhone == "") {
      this.userPhone = "No Phone";
    }
    if (!this.userMail || this.userMail == "") {
      this.userMail = "No Mail";
    }
    if (!this.userAddress || this.userAddress == "") {
      this.userAddress = "No Address";
    }

    network.onChange().subscribe((value) => {
      let val = value;
    });

    if (platform.is("desktop")) {
      notiServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotificationINStorage();
    } else {
      // storage.get(this.localStorageToken).then(
      //     val => {
      notiServ.putHeader(this.auth.accessToken);
      this.getNotificationINStorage();
      // });
    }

    if (this.accountServ.getAccountFeature().attendanceTeachersActivated) {
      this.startWiFiWiz();
    }
  }

  startWiFiWiz() {
    if (this.platform.is("desktop")) {
      this.attend.putHeader(localStorage.getItem(this.localStorageToken));
      this.checkTheAttendanceShift();
      this.getAttendData();
    } else {
      // storage.get(this.localStorageToken).then(
      //     val => {
      this.attend.putHeader(this.auth.accessToken);
      this.checkTheAttendanceShift();
      this.getAttendData();
      // });
    }

    if (this.network.type == "wifi") {
      WifiWizard2.requestPermission()
        .then((per) => {
          console.log("requestPermission" + per);
          this.wifi = { ssid: "", mac: "" };
          WifiWizard2.getConnectedSSID().then((ssid) => {
            console.log("SSID" + ssid);
            this.wifi.ssid = ssid;
          });

          WifiWizard2.getConnectedBSSID().then((bssid) => {
            console.log("BSSID" + bssid);
            this.wifi.mac = bssid;
          });
        })
        .catch((err) => {
          console.log("Error" + err);
        });

      // wifiinformation.getSampleInfo(wifi => {
      //     // alert(
      //     //     'SSID: ' + wifi.ssid +
      //     //     '\nMAC: ' + wifi.mac +
      //     //     '\nIP: ' + wifi.ip +
      //     //     '\nGateway: ' + wifi.gateway
      //     // );
      //
      //     this.wifi = wifi;
      //
      // }, (err) => console.error(err));
    }

    if (this.platform.is("android")) {
      this.androidPermission
        .checkPermission(this.androidPermission.PERMISSION.READ_PHONE_STATE)
        .then(
          (result) => {
            console.log("Has permission?", result.hasPermission);
            if (!result.hasPermission) {
              this.androidPermission
                .requestPermission(
                  this.androidPermission.PERMISSION.READ_PHONE_STATE
                )
                .then((value) => {
                  if (value) {
                    this.checkSamePhone();
                  }
                });
            } else {
              this.checkSamePhone();
            }
          },
          (err) => {
            this.androidPermission
              .requestPermission(
                this.androidPermission.PERMISSION.READ_PHONE_STATE
              )
              .then((value) => {
                if (value) {
                  this.checkSamePhone();
                }
              });
          }
        );
    } else {
      this.checkSamePhone();
    }
  }

  checkSamePhone() {
    this.attend.checkIfSameMobile(this.accountServ.user).subscribe(
      (value) => {
        console.log(value);
        let dataArr = [];
        //@ts-ignore
        dataArr = value;
        let foundThatUUID = false;
        dataArr.forEach((value1) => {
          if (value1.uuid == this.attend.getCurrentUUID()) {
            foundThatUUID = true;
          }
        });
        this.samePhone = foundThatUUID;
      },
      (error1) => {
        // "WOULD YOU LIKE TO REQUEST APPROVE FROM ADMIN TO LOGIN ?"
        this.samePhone = false;
      }
    );
  }

  ngOnInit() {}

  checkTheAttendanceShift() {
    let todat = this.transDate.transformTheDate(new Date(), "yyyy-MM-dd HH:mm");
    this.attend
      .getCheckUserAttendance(this.accountServ.userId, todat)
      .subscribe(
        (value) => {
          console.log(value);
          this.userShiftData = value;
        },
        (error1) => {
          if (error1.error == "This user has no attendance in this date") {
          } else {
            this.presentAlert("Error", error1.error);
          }
        }
      );
  }

  getAttendData() {
    this.load
      .startLoading("", false, "loadingWithoutBackground")
      .then((value) => {
        this.attend
          .getBranchAttendMeathodsData(this.accountServ.userBranchId, 1)
          .subscribe(
            (next) => {
              this.load.stopLoading();
              let data = next;
              // @ts-ignore
              this.attendData = data;

              this.storage.set(
                this.localStorageAttendanceWIFIS,
                JSON.stringify(data)
              );

              this.attendData.forEach((val) => {
                let data = JSON.parse(val.methodData);
                if (
                  val.methods.id == this.WIFI_CODE &&
                  data.mac == this.wifi.mac
                ) {
                  this.connectedToSameWiFi = true;
                }
              });

              // if(this.attendData.length > 0 && this.userShiftData == null){
              //     this.checkIn = true;
              // }else if(this.attendData.length < 1 && this.accountServ.getUserRole().controlWifiPoint){
              //     this.attendanceButton = "";
              // }else if(this.attendData.length > 0 && this.userShiftData != null){
              //     this.checkIn = false;
              // }
            },
            (err) => {
              this.load.stopLoading();
            }
          );
      });
  }

  checkInOut(from) {
    if (this.accountServ.getUserRole().controlWifiPoint && from == "Add") {
      this.getWifiIPAddress();
    } else if (
      (this.accountServ.getUserRole().checkInAttendance ||
        this.accountServ.getUserRole().checkOutAttendance) &&
      from != "Add"
    ) {
      this.attendData.forEach((val) => {
        let data = JSON.parse(val.methodData);
        if (val.methods.id == this.WIFI_CODE && data.mac == this.wifi.mac) {
          this.connectedToSameWiFi = true;
        }
      });
      if (this.network.type != "wifi") {
        this.presentAlert("Alert", "You need to connect to wifi");
      } else if (!this.connectedToSameWiFi) {
        this.presentAlert("Alert", "You need to connect to one of saved wifi");
      } else {
        let date = this.transDate.transformTheDate(
          new Date(),
          "yyyy-MM-dd HH:mm"
        );
        if (from == "In") {
          if (this.samePhone) {
            this.load.startLoading("", false, "loadingWithoutBackground");
            this.CallCheckIn(date);
          } else {
            this.presentChangePhoneAlert();
          }
        } else {
          if (this.samePhone) {
            this.load.startLoading("", false, "loadingWithoutBackground");
            this.CallCheckOut(date);
          } else {
            this.presentChangePhoneAlert();
          }
        }
      }
    }
  }

  async presentChangePhoneAlert() {
    const alert = await this.alertController.create({
      header: "Alert",
      message:
        "This phone not connect to your account do you want to add it by request to your admin?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.load
              .startLoading("", false, "loadingWithoutBackground")
              .then((value) => {
                this.attend
                  .sentMobileMacAddress(this.accountServ.user)
                  .subscribe(
                    (value) => {
                      console.log(value);
                      this.load.stopLoading().then((val) => {
                        this.toast.presentTimerToast("Request sent");
                      });
                    },
                    (error1) => {
                      console.log(error1);
                      this.load.stopLoading().then((val) => {
                        if (
                          error1.error == "Saved" ||
                          error1.error.text == "Saved"
                        ) {
                          this.toast.presentTimerToast("Request sent");
                        } else if (error1.error == "UUID IS ALREADY EXISTS") {
                          this.toast.presentTimerToast(
                            "The request already sent"
                          );
                        } else {
                          this.toast.presentTimerToast(
                            "Can't send request, right now !"
                          );
                        }
                      });
                    }
                  );
              });
          },
        },
      ],
    });

    await alert.present();
  }

  CallCheckIn(date) {
    this.attend.checkInAttendance(date, this.accountServ.userId).subscribe(
      (value) => {
        let val = value;
        this.load.stopLoading();
        // this.checkIn = false;
        this.userShiftData = value;
      },
      (error1) => {
        this.load.stopLoading().then((value) => {
          if (error1.error.text) {
            this.presentAlert("Alert", error1.error.text);
          } else {
            this.presentAlert("Alert", error1.error);
          }
        });
      }
    );
  }

  CallCheckOut(date) {
    this.attend.checkOutAttendance(date, this.userShiftData).subscribe(
      (value) => {
        let val = value;
        this.load.stopLoading();
        this.userShiftData = value;
      },
      (error1) => {
        this.load.stopLoading().then((value) => {
          if (error1.error.text) {
            this.presentAlert("Alert", error1.error.text);
          } else {
            this.presentAlert("Alert", error1.error);
          }
        });
      }
    );
  }

  checktheDateIn(date) {
    let savedShiftDate = this.transDate.transformTheDate(
      new Date(date),
      "yyyy/MM/dd"
    );
    let nowDate = this.transDate.transformTheDate(new Date(), "yyyy/MM/dd");

    if (savedShiftDate == nowDate) {
      return true;
    } else {
      return false;
    }
  }

  checktheDateOut() {
    let savedShiftDate = this.transDate.transformTheDate(
      new Date(this.userShiftData.checkOutDate),
      "yyyy/MM/dd"
    );
    let nowDate = this.transDate.transformTheDate(new Date(), "yyyy/MM/dd");

    if (savedShiftDate == nowDate) {
      return true;
    } else {
      return false;
    }
  }

  getWifiIPAddress() {
    this.attend
      .addMethodData(
        this.accountServ.userBranchId,
        1,
        JSON.stringify(this.wifi)
      )
      .subscribe(
        (value) => {
          alert(this.wifi.ssid + " saved as login wifi");
        },
        (error1) => {
          alert("Couldn't save " + this.wifi.ssid + "as login WiFi");
        }
      );
  }

  async presentAlert(head, msg) {
    const alert = await this.alertController.create({
      header: head,
      message: msg,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async openUpdatePasswordModal(){
    const modal = await this.modalController.create({
      component: UpdatePasswordPage});
    return await modal.present();
  }
  // async getActiveDevices() {
  //     // get all active devices
  //     wifiinformation.getActiveDevices(success => {
  //         alert('Success: ' + JSON.stringify(success));
  //
  //     }, (err) => {
  //         console.error(err);
  //     });
  // }
  //
  // getDHCPInfo() {
  //     wifiinformation.getDHCPInfo(success => {
  //         alert('Success: ' + JSON.stringify(success));
  //
  //     }, (err) => console.error(err));
  // }
  //
  // getSampleInfo() {
  //     wifiinformation.getSampleInfo(wifi => {
  //         alert(
  //             'SSID: ' + wifi.ssid +
  //             '\nMAC: ' + wifi.mac +
  //             '\nIP: ' + wifi.ip +
  //             '\nGateway: ' + wifi.gateway
  //         );
  //
  //     }, (err) => console.error(err));
  // }

  onCore() {
    if (this.platform.is("desktop")) {
      return true;
    } else {
      return false;
    }
  }

  onMobile() {
    if (!this.platform.is("desktop")) {
      return true;
    } else {
      return false;
    }
  }

  // opend = true;
  // openComment(){
  //   if(this.opend) {
  //     this.commentAppear.nativeElement.name = "slideUp";
  //     this.opend = false;
  //   }else{
  //     this.commentAppear.nativeElement.name = "slideDown";
  //     this.opend = true;
  //   }
  // }

  ionViewDidLoad() {}

  async getNotificationINStorage() {
    await this.storage
      .get("Notifications")
      .then((data) => {
        let notis: any = data;
        if (notis.length > 0) {
          for (let temp of notis) {
            let PN = new Pendingnotification();
            PN.title = temp.title;
            PN.body = temp.body;
            PN.attachmentsList = temp.attachmentsList;
            PN.tagsList = temp.tagsList;
            PN.receiversList = temp.receiversList;
            this.pendingNotification.push(PN);
          }
        }
        this.storage
          .get(this.wifiUploadKey)
          .then((wi) => {
            let wifiUpload: any = wi.wifi;
            let WIFIOn: boolean = false;
            if (wifiUpload) {
              WIFIOn = true;
            }
            if (WIFIOn && this.network.type == "wifi") {
              if (this.pendingNotification.length > 0) {
                for (let temp of this.pendingNotification) {
                  if (temp.attachmentsList) {
                    let promisesArray = [];
                    for (
                      let index = 0;
                      index < temp.attachmentsList.length;
                      index++
                    ) {
                      // let form: FormData = temp.attachmentsList[index];
                      let form = new FormData();
                      form.append("file", temp.attachmentsList[index]);
                      promisesArray.push(this.uploadAttach(form));
                    }
                    Promise.all(promisesArray)
                      .then((data) => {
                        this.SendNotificationBackground(
                          temp.title,
                          temp.body,
                          this.arrayToPostAttachment,
                          temp.receiversList,
                          temp.tagsList
                        );
                      })
                      .catch((e) => {});
                  } else {
                    this.SendNotificationBackground(
                      temp.title,
                      temp.body,
                      this.arrayToPostAttachment,
                      temp.receiversList,
                      temp.tagsList
                    );
                  }
                }
              }
            } else if (!WIFIOn) {
              for (let temp of this.pendingNotification) {
                if (temp.attachmentsList) {
                  let promisesArray = [];
                  for (
                    let index = 0;
                    index < temp.attachmentsList.length;
                    index++
                  ) {
                    // let form: FormData = temp.attachmentsList[index];
                    let form = new FormData();
                    form.append("file", temp.attachmentsList[index]);
                    promisesArray.push(this.uploadAttach(form));
                  }
                  Promise.all(promisesArray)
                    .then((data) => {
                      this.SendNotificationBackground(
                        temp.title,
                        temp.body,
                        this.arrayToPostAttachment,
                        temp.receiversList,
                        temp.tagsList
                      );
                    })
                    .catch((e) => {});
                } else {
                  this.SendNotificationBackground(
                    temp.title,
                    temp.body,
                    this.arrayToPostAttachment,
                    temp.receiversList,
                    temp.tagsList
                  );
                }
              }
            }
          })
          .catch((e) => {});
      })
      .catch((e) => {});
  }

  SendNotificationBackground(
    title,
    details,
    postAttachment,
    RecieverArray,
    SelectedTags
  ) {
    let sentNotify: any[] = [];
    this.notiServ
      .postNotification(
        title,
        details,
        postAttachment,
        RecieverArray,
        SelectedTags
      )
      .subscribe(
        // @ts-ignore
        (data) => {
          let PN = new Pendingnotification();
          PN.title = title;
          PN.body = details;
          PN.attachmentsList = postAttachment;
          PN.tagsList = RecieverArray;
          PN.receiversList = SelectedTags;
          sentNotify.push(PN);
        },
        (err) => {},
        () => {
          this.deleteFromStorage(sentNotify);
        }
      );
  }

  async deleteFromStorage(sentNotify) {
    let pendingNotification: any[] = [];
    await this.storage.get("Notifications").then((data) => {
      let notis = data;
      if (notis) {
        for (let temp of notis) {
          let PN = new Pendingnotification();
          let found = false;
          sentNotify.some((x) => {
            found = true;
          });
          if (!found) {
            PN.title = temp.title;
            PN.body = temp.body;
            PN.attachmentsList = temp.attachmentsList;
            PN.tagsList = temp.tagsList;
            PN.receiversList = temp.receiversList;
            pendingNotification.push(PN);
          }
        }
      }
      this.storage.remove("Notifications");
      this.storage.set("Notifications", pendingNotification);
    });
  }

  uploadAttach(formData) {
    this.notiServ
      .postAttachment(formData)
      .toPromise()
      .then(
        (s) => {
          let allData: any = s;
          if (allData.data != null) {
            allData = JSON.parse(allData.data);
          }

          let attach = new Postattachment();
          attach.name = allData.name;
          attach.type = allData.type;
          attach.url = allData.url;
          attach.uploadDate = allData.date;
          this.arrayToPostAttachment.push(attach);
          return true;
        },
        (e) => {
          return true;
        }
      )
      .catch((e) => {});
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("myAllnav").style.width = "100%";
  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myAllnav").style.width = "0";
  }

  // editMenuView(){
  //   let intervaldata = setInterval(() => {
  //     if (document.getElementById('profilePage')) {
  //       if (!document.getElementById('profilePage').classList.contains("selected")) {
  //         document.getElementById('profilePage').classList.toggle("selected");
  //       }
  //       if (document.getElementById('logOutPage').classList.contains("selected")) {
  //         document.getElementById('logOutPage').classList.toggle("selected");
  //       }
  //     }
  //     clearInterval(intervaldata);
  //   },50);
  // }
}
