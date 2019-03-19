import {Component, ViewChild} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {
  AlertController, LoadingController, ModalController, Platform, PopoverController, ToastController
} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";
import {NotificationService} from "../../services/notification";
import {PopoverNotificationCardPage} from "./popover_notification/popovernotificationcard";
import {Notification} from "../../models/notification";
import {Storage} from "@ionic/storage";
import {NotificationEditPage} from "./popover_notification/notification-edit/notification-edit";
import {AccountService} from "../../services/account";
import {Class} from "../../models/class";
import {StudentsService} from "../../services/students";
import {Student} from "../../models/student";
import {Attachment} from "../../models/attachment";
import {File} from '@ionic-native/file';
import {DocumentViewer, DocumentViewerOptions} from '@ionic-native/document-viewer';
import {FileTransfer} from '@ionic-native/file-transfer';
import {Media} from "@ionic-native/media";
import {FileOpener} from '@ionic-native/file-opener';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Pendingnotification} from "../../models/pendingnotification";
import {Network} from "@ionic-native/network";
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {ClassesService} from "../../services/classes";
import { Slides } from 'ionic-angular';
import {NotificationViewReceiver} from "../notification-view-receiver/notification-view-receiver";


declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage{
  @ViewChild(Slides) slides: Slides;
  notifications:Notification[] = [];
  notificationsSent:Notification[] = [];
  notificationsApproved:Notification[] = [];
  notificationsArchived:Notification[] = [];
  noNOtifications = false;
  noNotificationsSent = false;
  noNotificationsApproved = false;
  noNotificationsArchived = false;
  notificationPage=1;
  notificationIds = [];
  loading:any;
  fristOpen:boolean;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  tokenKey:string;
  tagsArr:any[] = [];

  classes:any[] = [];
  studentsName:any[] = [];
  studentwithClass:any[] = [];
  loadNow:boolean = false;
  NewNotification:boolean = true;
  editId;
  editTitle;
  editDetails;
  editTags;
  selectedTab;
  scrollTab;
  approved;
  archived;
  sent;
  console=console;
  editAsNewAttachmentList;

  constructor(private alrtCtrl:AlertController,public platform:Platform,private storage:Storage,
              private modalCtrl: ModalController,private notificationService:NotificationService,
              private popoverCtrl: PopoverController, private load:LoadingController, private accService:AccountService,
              private studentService:StudentsService, private document: DocumentViewer, private file: File,
              private transfer: FileTransfer, public audio: Media,private fileOpener: FileOpener,
              private transferF: Transfer, public accountServ:AccountService,private network:Network,
              private androidPermissions: AndroidPermissions,private toastCtrl:ToastController,private classesServ:ClassesService) {
    this.approved = null;
    this.archived = null;
    this.sent = null;
    this.selectedTab = "all";
    this.fristOpen = true;
    if (platform.is('core')) {

      this.tokenKey = localStorage.getItem(this.localStorageToken);
      notificationService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
    } else {
      storage.get(this.localStorageToken).then(
        val => {
            this.getPendingNotification();
          this.tokenKey = val;
          notificationService.putHeader(val);
          this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        });
    }
    if (platform.is('android')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          console.log('Has permission?',result.hasPermission);
          if(!result.hasPermission){
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    }

    this.tagsArr = accService.accountBranchesListIds;
  }

  fullString(fristPart:string, secoundPart:string){
    return fristPart+' '+secoundPart;
  }

  ionViewDidLoad() {
  }

  onSelectCard(event:Event, i:any,notification:any){
    let popover = this.popoverCtrl.create('PopoverNotificationCardPage', {notification:notification});

    popover.onDidDismiss(data => {
      if(data == null) {
      }else{
      if(data.done === 'deleteSuccess') {
        this.fristOpen = false;
        this.loadNow = true;
        this.notifications.splice(0);
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,this.approved, this.archived, this.sent,0);

      }else if(data.done === 'restored'){
        if(this.approved && data.archived === false){
          this.notificationsApproved[i].archived = data.archived;
        }else if(this.archived && data.archived === false){
          this.notificationsArchived[i].archived = data.archived;
          this.notificationsArchived.splice(i, 1);
        }else if(this.sent && data.archived === false) {
          this.notificationsSent[i].archived = data.archived;
        }else if(!this.sent && !this.archived && this.approved && data.archived === false){
          this.notifications[i].archived = data.archived;
        }
        this.presentToast(data.tostmsg);
      }else if(data.done === 'archive'){
        if(this.approved && data.archived === true){
          this.notificationsApproved[i].archived = data.archived;
        }else if(this.archived && data.archived === true){
          this.notificationsArchived[i].archived = data.archived;
          this.notificationsArchived.splice(i, 1);
        }else if(this.sent && data.archived === true) {
          this.notificationsSent[i].archived = data.archived;
        }else if(!this.sent && !this.archived && this.approved && data.archived === true){
          this.notifications[i].archived = data.archived;
        }
        this.presentToast(data.tostmsg);
      }else if (data.done === 'updateSuccess'){
        this.fristOpen = false;
        this.loadNow = true;
        let model = this.modalCtrl.create('NotificationEditPage',{notification:notification});
        model.onDidDismiss(data=>{
          if(data.name != "dismissed") {
            this.notifications.splice(0);
            this.notificationPage = 1;
            this.notificationService.putHeader(this.tokenKey);
            this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
          }
        });
        model.present();

      }else if(data.done === 'newSuccess'){
        this.fristOpen = false;
        this.loadNow = true;
        this.loading = this.load.create({
          content: '',
          cssClass:"loadingWithoutBackground"
        });
        this.loading.present();
        this.NewNotification = false;
        this.editAsNewAttachmentList = notification.attachmentsList;
        this.getNotificationReciver(notification.notificationId, notification.title, notification.body,notification.recreceiversList,notification.tagsListName, i);
      }
      }
    });

    popover.present({ev: event});
  }
  reciversList;
  getNotificationReciver(id:number, title:string, details:string,reciversList:any,tagsList:any, i:any){
    this.notificationService.getNotificationReceivers(id).subscribe(
      (data) => {
        this.reciversList = data;
        // this.loading.dismiss();
        this.editId = id;
        this.editTitle = title;
        this.editDetails = details;
        this.editTags = tagsList;
        this.getAllDataThenNavigate();
      },
      err => {
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: "Please, check the internet and try again",
          buttons: ['OK']
        }).present();
      },
      () => {
      });
  }

  onOpenView() {
    this.NewNotification = true;
    this.getAllDataThenNavigate();
  }

  getData = false;
  getNotifications(pageNumber:number,userId:number,classId:number,approved,archived,sent,tagId:number){
    let thereIsDataInArray = false;
    if(this.approved && this.notificationsApproved.length > 0){
        thereIsDataInArray = true;
    }else if(this.archived && this.notificationsArchived.length > 0){
        thereIsDataInArray = true;
    }else if(this.sent && this.notificationsSent.length > 0) {
        thereIsDataInArray = true;
    }else if(!this.sent && !this.archived && !this.approved && this.notifications.length > 0) {
        thereIsDataInArray = true;
    }

    if(!thereIsDataInArray) {
      let contentMsg;
      if (this.approved) {
        contentMsg = 'Loading Awaiting Approved Notifications...';
      } else if (this.archived) {
        contentMsg = 'Loading Archived Notifications...';
      } else if (this.sent) {
        contentMsg = 'Loading Sent Notifications...';
      } else {
        contentMsg = 'Loading Notifications...';
      }
      // if(!this.getData) {
      //   this.getData = true;
      if (this.fristOpen || this.loadNow) {
        this.loading = this.load.create({
          content: contentMsg
        });
        this.loading.present();
      }
      // }
      this.getNotification(pageNumber, userId, classId, approved, archived, sent, tagId);
    }
  }

  getNotification(pageNumber:number,userId:number,classId:number,approved,archived,sent,tagId:number){
    this.notificationService.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId).subscribe(
      (data) => {
        this.getData = false;
        let allData:any = data;
        for (let value of allData){
          let notify = new Notification;
          for(let item of value.attachmentsList){
            let attach = new Attachment();
            attach.id=item.id;
            attach.name=item.name;
            attach.type=item.type;
            attach.url=item.url;
            attach.date=item.uploadDate;
            notify.attachmentsList.push(attach);
          }

          notify.body = value.body;
          notify.dateTime =  value.dateTime;
          notify.notificationId = value.id;
          notify.title = value.title;
          notify.receiversList = value.receiversList;
          notify.senderName = value.senderName;
          notify.tagsList = value.tagsList;
          notify.archived = value.archived;
          notify.approved = value.approved;
          if(value.tagsList != null) {
            notify.tagsListName = value.tagsList.name;
          }
          this.notificationIds.push(value.id);
          if(this.sent){
            this.notificationsSent.push(notify);
          }else if(this.approved){
            this.notificationsApproved.push(notify);
          }else if(this.archived){
            this.notificationsArchived.push(notify);
          }else {
            this.notifications.push(notify);
          }
        }

        if (this.approved && this.notificationsApproved.length <= 0) {
          this.noNotificationsApproved = true;
        } else if (this.archived && this.notificationsArchived.length <= 0) {
          this.noNotificationsArchived = true;
        } else if (this.sent && this.notificationsSent.length <= 0) {
          this.noNotificationsSent = true;
        } else if(!this.sent && !this.archived && !this.approved && this.notifications.length <= 0) {
          this.noNOtifications = true;
        }

        this.getSeencount(this.notificationIds, this.loading);
      },
      err => {
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: "Please, check the internet and try again",
          buttons: ['OK']
        }).present();
      },
      () => {
      });
  }

  doInfinite(){

    return new Promise((resolve) => {
      // setTimeout(() => {

        this.notificationPage += this.notificationPage + 1;
      this.notificationService.getNotification(this.notificationPage,0,0,this.approved,this.archived,this.sent,0).subscribe(
        (data) => {
          this.getData = false;
          let allData:any = data;
          for (let value of allData){
            let notify = new Notification;
            for(let item of value.attachmentsList){
              let attach = new Attachment();
              attach.id=item.id;
              attach.name=item.name;
              attach.type=item.type;
              attach.url=item.url;
              notify.attachmentsList.push(attach);
            }

            notify.body = value.body;
            notify.dateTime =  value.dateTime;
            notify.notificationId = value.id;
            notify.title = value.title;
            notify.receiversList = value.receiversList;
            notify.senderName = value.senderName;
            notify.tagsList = value.tagsList;
            notify.archived = value.archived;
            notify.approved = value.approved;
            if(value.tagsList != null) {
              notify.tagsListName = value.tagsList.name;
            }
            this.notificationIds.push(value.id);
            if(this.sent){
              this.notificationsSent.push(notify);
            }else if(this.approved){
              this.notificationsApproved.push(notify);
            }else if(this.archived){
              this.notificationsArchived.push(notify);
            }else {
              this.notifications.push(notify);
            }
          }
          this.getSeencount(this.notificationIds, this.loading);
          resolve();
        },
        err => {
          resolve();
          this.loading.dismiss();
          this.alrtCtrl.create( {
            title: 'Error',
            subTitle: "Please, check the internet and try again",
            buttons: ['OK']
          }).present();
        },
        () => {

        });



      // }, 20000);
    })
  }

  getAllClasses(){
    this.classesServ.getClassList("NOTIFICATION",2,null,null,null,null).subscribe((value) => {
        let allData: any = value;
        this.classes = [];
        for (let data of allData) {
          let item = new Class();
          item.id = data.id;
          item.name = data.name;
          item.grade.id = data.grade.id;
          item.grade.name = data.grade.name;
          item.branch.id = data.branch.id;
          item.branch.name = data.branch.name;
          item.branch.managerId = data.branch.managerId;
          this.classes.push(item);
        }
        this.getAllStudent();
      },
      err =>{
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
        this.loading.dismiss();
      });
  }

  getAllStudent(){
    this.studentService.getAllStudents(7,'Notification').subscribe(
      (val)=>{
        let data:any = val;
        this.studentwithClass = [];
        this.studentsName = [];
        for (let value of data){
          let students = new Student();

          students.classes.id = value.classes.id;
          students.classes.name = value.classes.name;
          students.classes.grade.id = value.classes.grade.id;
          students.classes.grade.name = value.classes.grade.name;
          students.classes.branch.id = value.classes.branch.id;
          students.classes.branch.name = value.classes.branch.name;
          students.classes.branch.managerId = value.classes.branch.managerId;
          students.id = value.id;
          students.name = value.name;
          students.address = value.address;

          this.studentsName.push(value.name);
          this.studentwithClass.push(students);
        }


        if(this.NewNotification){

          let model = this.modalCtrl.create('NotificationNewPage',{classesList:this.classes,
            studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass});
          model.present();

          model.onDidDismiss(data => {
            if(data.name =="dismissed&SENT"){
              this.fristOpen = false;
              this.loadNow = true;
              this.notifications.splice(0);
              this.notificationPage = 1;
              this.getPendingNotification();
              this.notificationService.putHeader(this.tokenKey);
              this.getNotifications(this.notificationPage,0,0,this.approved, this.archived, this.sent,0);

            }else if(data.name =="dismissed&NOTSENT"){
              this.fristOpen = false;
              this.loadNow = true;
              let TempNotify:any[]=[];
              for (let notify of this.notifications){
                TempNotify.push(notify);
              }
              this.notifications.splice(0);
              this.getPendingNotification();
              for(let temp of TempNotify){
                this.notifications.push(temp);
              }
            }
          });

        }else{

          let model = this.modalCtrl.create('NotificationNewPage',{id:this.editId,title:this.editTitle, details:this.editDetails,
            classesList:this.classes, studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass
            ,recieverList:this.reciversList, tagList:this.editTags, attachmentList:this.editAsNewAttachmentList});
          model.onDidDismiss(()=>{
            this.notifications.splice(0);
            this.notificationPage = 1;

            this.notificationService.putHeader(this.tokenKey);
            this.getNotifications(this.notificationPage,0,0,this.approved, this.archived, this.sent,0);
          });
          model.present();

        }
        this.loading.dismiss();
      },
      err=>{
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
        this.loading.dismiss();
      });
  }

  onAttachmentClick(event:Event, attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any,pending:any){
    if(pending!="pending" && this.accountServ.getUserRole().notificationAttachmentDownload) {
      this.alrtCtrl.create({
        title: 'Atachment',
        subTitle: 'What are you want to do with this file!',
        buttons: [
          {
            text: 'Download',
            handler: () => {
              this.loading = this.load.create({
                content: ""
              });
              this.loading.present();
              this.downloadFile(attachmentName.substring(17), attachmentId, attachmentType, attachmentURL);
            }
          },
          {
            text: 'Open',
            handler: () => {
              this.loading = this.load.create({
                content: ""
              });
              this.loading.present();
              if (attachmentName) {
                let exType: string;
                let pos = attachmentName.lastIndexOf('.');
                let extension = attachmentName.substring(pos + 1);
                if (attachmentType == "IMAGE") {
                  exType = "image/" + extension;
                } else if (attachmentType == "PDF") {
                  exType = "application/" + extension;
                } else if (attachmentType == "WORD") {
                  if (extension == "doc") {
                    exType = "application/msword";
                  } else {
                    exType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                  }
                } else if (attachmentType == "EXCEL") {
                  if (extension == "xls") {
                    exType = "application/vnd.ms-excel";
                  } else {
                    exType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                  }
                } else if (attachmentType == "POWERPOINT") {
                  if (extension == "ppt") {
                    exType = "application/vnd.ms-powerpoint";
                  } else {
                    exType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                  }
                } else if (attachmentType == "AUDIO") {
                  exType = "audio/" + extension;
                } else if (attachmentType == "VIDEO") {
                  exType = "video/" + extension;
                } else if (extension == "3gp") {
                  exType = "video/" + extension;
                } else if (extension == "txt") {
                  exType = "text/plain";
                } else {
                  exType = "application/" + extension;
                }
                this.OpenFiles(attachmentName.substring(17), attachmentId, attachmentType, attachmentURL, exType);
              }
            }
          }
        ]
      }).present();
    }
  }


  OpenFiles(attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any,extinstion:any){

    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.externalRootDirectory+'/Download/';
    }

    const transfer = this.transfer.create();
    transfer.download(attachmentURL,
      path + attachmentName).then(entry => {
      this.loading.dismiss();
      let url = entry.toURL();
      const options: DocumentViewerOptions = {
        title: attachmentName
      };
      this.fileOpener.open(url, extinstion)
        .then(() => {})
        .catch(e => {
          let error:string;
          if(e.message.includes("Activity not found")){
            error = "There is no app to open this file";
          }else{
            error = 'Something went wrong try again later.'+JSON.stringify(e);
          }

          this.alrtCtrl.create( {
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
          }).present();
          this.loading.dismiss();
        });
    }).catch(reason => {
      let error:string = '';
      if(reason.exception.includes("Permission")){
        error = "Edufy need permission to access storage";
      }else{
        error =reason.exception;
      }
      this.alrtCtrl.create( {
        title: 'Error',
        subTitle: error,
        buttons: ['OK']
      }).present();
      this.loading.dismiss();
    });
  }

  downloadFile(attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any) {

    let storageDirectory = null;

    if (this.platform.is('ios')) {
      storageDirectory = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      storageDirectory = this.file.externalRootDirectory+'/Download/';
    }

    this.platform.ready().then(() => {

      const fileTransfer: TransferObject = this.transferF.create();

      const fileLocation = attachmentURL;

      fileTransfer.download(fileLocation, storageDirectory + attachmentName).then((entry) => {
        this.loading.dismiss();
        const alertSuccess = this.alrtCtrl.create({
          title: `Download Success`,
          subTitle: `${attachmentName} was successfully downloaded.`,
          buttons: ['Ok']
        });

        alertSuccess.present();

      }, (error) => {

        const alertFailure = this.alrtCtrl.create({
          title: `Download Failed!`,
          subTitle: `${attachmentName} was not successfully downloaded. Error code: ${error.code}`,
          buttons: ['Ok']
        });

        alertFailure.present();

      });

    });

  }


  async getPendingNotification(){
    let pendingNotification:any[]=[];
    await this.storage.get('Notifications').then(
      data => {
        let notis = data;
        if (notis) {
          for (let temp of notis) {
            let PN = new Pendingnotification();
            PN.title = temp.title;
            PN.body = temp.body;
            PN.attachmentsList = temp.attachmentsList;
            PN.tagsList = temp.tagsList;
            PN.receiversList = temp.receiversList;
            pendingNotification.push(PN);
          }
        }

        if(pendingNotification){
          for(let showPN of pendingNotification){
            let notify = new Notification;
            notify.senderName = this.accountServ.getUserName();
            notify.title = showPN.title;
            notify.body = showPN.body;
            notify.attachmentsList = [];
            for(let temp of showPN.attachmentsList){
              let attach = new Attachment();
              attach.name = temp.name;
              attach.type = this.getFileType(temp.name);
              if(attach.type == "IMAGE"){
               attach.url = this.readFile(temp);
              }
              notify.attachmentsList.push(attach);
            }
            notify.tagsList = showPN.tagsList;
            notify.receiversList = showPN.receiversList;
            notify.pending = "pending";
            this.notifications.push(notify);
          }
        }
      });
  }

  getFileType(fileName) {
    let pos = fileName.lastIndexOf('.');
    let extension = fileName.substring(pos + 1);

    switch (extension.toLowerCase()) {
      case "jpg":
        return "IMAGE";
      case "jpeg":
        return "IMAGE";
      case "png":
        return "IMAGE";
      case "gif":
        return "IMAGE";
      case "ico":
        return "IMAGE";
      case "bmp":
        return "IMAGE";
      case "webp":
        return "IMAGE";
      case "tiff":
        return "IMAGE";

      case "pdf":
        return "PDF";

      case "txt":
        return "TXT";

      case "xls":
        return "EXCEL";
      case "xlsx":
        return "EXCEL";
      case "doc":
      case "docx":
        return "WORD";
      case "ppt":
      case "pptx":
        return "POWERPOINT";
      case "mp4":
        return "VIDEO";
      case "flv":
        return "VIDEO";
      case "avi":
        return "VIDEO";
      case "mov":
        return "VIDEO";
      case "wmv":
        return "VIDEO";
      case "mp3":
        return "AUDIO";
      case "wma":
        return "AUDIO";
      default:
        return "OTHER";
    }

  }
  readFile(file: File){
    let reader = new FileReader();
     reader.onloadend = function(e){
      return reader.result;
    };
    reader.readAsDataURL(reader.result);
  }

  getAllDataThenNavigate(){
    if(this.NewNotification) {
      this.loading = this.load.create({
        content: "",
        cssClass: "loadingWithoutBackground"
      });
    }
    this.loading.present();
    if(this.platform.is('core')) {
      this.tokenKey = localStorage.getItem(this.localStorageToken);
      this.studentService.putHeader(localStorage.getItem(this.localStorageToken));
      this.classesServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getAllClasses();
    }else {
      this.storage.get(this.localStorageToken).then(
        val => {
          this.tokenKey = val;
          this.studentService.putHeader(val);
          this.classesServ.putHeader(val);
          this.getAllClasses();
          this.fristOpen = false;
        });
    }
  }

  tabThatSelectedDo(tabName){
    this.notificationPage = 1;
    console.log("TabName "+this.selectedTab);
    let speed = 500;
    if(tabName == 'all'){
      this.slides.slideTo(0, speed);
    }else if(tabName == 'sent'){
      this.slides.slideTo(1, speed);
    }else if(tabName == 'approved'){
      this.slides.slideTo(2, speed);
    }else if(tabName == 'archived'){
      this.slides.slideTo(3, speed);
    }
  }
  slideChanged() {
    this.notificationPage = 1;
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    switch (currentIndex){
      case 1:
        this.selectedTab = 'sent';
        this.sent = true;
        this.approved = null;
        this.archived = null;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;

      case 2:
        this.selectedTab = 'approved';
        this.sent = null;
        this.approved = true;
        this.archived = null;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;

      case 3:
        this.selectedTab = 'archived';
        this.sent = null;
        this.approved = null;
        this.archived = true;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;

      default:
        this.selectedTab = 'all';
        this.sent = null;
        this.approved = null;
        this.archived = null;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;
    }
  }

  approveNotification(index){
    // this.loading = this.load.create({
    //   content: "Approving"
    // });
    // this.loading.present();
    let elButton;
    if(this.approved && this.notificationsApproved.length > 0){
      elButton = document.getElementById("buttonApproveApp"+index);
    }else if(this.archived && this.notificationsArchived.length > 0){
      elButton = document.getElementById("buttonApproveArc"+index);
    }else if(this.sent && this.notificationsSent.length > 0) {
      elButton = document.getElementById("buttonApproveSent"+index);
    }else if(!this.sent && !this.archived && !this.approved && this.notifications.length > 0) {
      elButton = document.getElementById("buttonApprove"+index);
    }
    elButton.classList.add("onclic");
    let approvedNotification;
    if(this.sent){
      approvedNotification = this.notificationsSent[index];
    }else if(this.approved){
      approvedNotification = this.notificationsApproved[index];
    }else if(this.archived){
      approvedNotification = this.notificationsArchived[index];
    }else {
      approvedNotification = this.notifications[index];
    }
    // get select notification to approve it
    // check if this notification need to post int to facebook or not
    if (approvedNotification.fbPosted) {// if need
      if (approvedNotification.attachment == null) { // check
        // if there is attachment or not to post notification to facebook with Image or not
        // facebookService.postNotificationText(approvedNotification.title, approvedNotification.body).then(function (response) {
        //   messageService.message("success", messageService.messageSubject.successPostToFacebook);
          let sentNotification = {
            "id": approvedNotification.notificationId
            // "fbPostId": response.id
          };
          // calling send notification service.
          this.notificationService.editNotification(sentNotification, 2).subscribe(
            (response) => {
              // this.loading.dismiss();
              // removeProcessingMessage();
              // getNotificationNumFromServer();
              // $scope.currentPage = 1;

              // if(this.sent){
              //   this.notificationsSent[index].approved = true;
              // }else if(this.approved){
              //   this.notificationsApproved[index].approved = true;
              // }else if(this.archived){
              //   this.notificationsArchived[index].approved = true;
              // }else {
              //   this.notifications[index].approved = true;
              // }


              elButton.classList.remove("onclic");
              elButton.classList.add("validate");

              // elItem.style.maxHeight = "0px";

              // this.notificationPage = 1;
              // this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
            this.presentToast('Notification approved & sent successfully.');
          }, (reason) => {
              elButton.classList.remove("onclic");
              this.presentToast('Problem approving notifications.');
            console.error('Error: notification.module>NotificationCtrl>approveNotification> cannot send notification -  ' + reason);
          });
        // }, function (reason) {
        //   removeProcessingMessage();
        //   messageService.message("failed", messageService.messageSubject.failedPostToFacebook);
        //   messageService.message("failed", messageService.messageSubject.failedApprovedNotification);
        //   console.error('Error: notification.module>NotificationCtrl>approveNotification> cannot approve and send notification -  ' + reason);
        // });
      } else {// there is not attachment
        // facebookService.postNotificationImage(approvedNotification.attachment.url, approvedNotification.title, approvedNotification.body).then(function (response) {
        //   messageService.message("success", messageService.messageSubject.successPostToFacebook);
          var sentNotification = {
            "id": approvedNotification.notificationId
            // "fbPostId": response.id
          };
          // calling send notification service.
          this.notificationService.editNotification(sentNotification, 2).subscribe(
            (response) => {
              // approvedNotification.approved = true;
              // this.loading.dismiss();
              // removeProcessingMessage();
              // getNotificationNumFromServer();
              // $scope.currentPage = 1;
              if(this.sent){
                this.notificationsSent[index].approved = true;
              }else if(this.approved){
                this.notificationsApproved[index].approved = true;
              }else if(this.archived){
                this.notificationsArchived[index].approved = true;
              }else {
                this.notifications[index].approved = true;
              }


              elButton.classList.remove("onclic");
              elButton.classList.add("validate");

              // elItem.style.maxHeight = "0px";
              // this.notificationPage = 1;
              // this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
              this.presentToast('Notification approved & sent successfully.');
            // messageService.message("success", messageService.messageSubject.successApprovedNotification);
          },(reason) => {
              elButton.classList.remove("onclic");
            // removeProcessingMessage();
              this.presentToast('Problem approving notifications.');
            // messageService.message("failed", messageService.messageSubject.failedApprovedNotification);
            console.error('Error: notification.module>NotificationCtrl>approveNotification> cannot send notification -  ' + reason);
          });
        // }, function (reason) {
        //   removeProcessingMessage();
        //   messageService.message("failed", messageService.messageSubject.failedPostToFacebook);
        //   messageService.message("failed", messageService.messageSubject.failedApprovedNotification);
        //   console.error('Error: notification.module>NotificationCtrl>approveNotification> cannot approve and send notification -  ' + reason);
        // });
      }
    } else {
      var sentNotification = {
        "id": approvedNotification.notificationId
      };
      // calling send notification service.
      this.notificationService.editNotification(sentNotification, 2).subscribe(
        (response) => {
          // approvedNotification.approved = true;
          // this.loading.dismiss();
        // removeProcessingMessage();
        // getNotificationNumFromServer();
        // $scope.currentPage = 1;
        //   if(this.sent){
        //     this.notificationsSent[index].approved = true;
        //   }else if(this.approved){
        //     this.notificationsApproved[index].approved = true;
        //   }else if(this.archived){
        //     this.notificationsArchived[index].approved = true;
        //   }else {
        //     this.notifications[index].approved = true;
        //   }


          elButton.classList.remove("onclic");
          elButton.classList.add("validate");

          // this.notificationPage = 1;
          // this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
          this.presentToast('Notification approved & sent successfully.');
        // messageService.message("success", messageService.messageSubject.successApprovedNotification);
      },(reason) => {
          elButton.classList.remove("onclic");
        // removeProcessingMessage();
          this.presentToast('Problem approving notifications.');
        // messageService.message("failed", messageService.messageSubject.failedApprovedNotification);
        console.error('Error: notification.module>NotificationCtrl>approveNotification> cannot send notification -  ' + reason);
      });
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  getSeencount(notificationsIds,load){
    this.notificationService.getSeencount(notificationsIds).subscribe(
      (data) => {
        console.log("Date Is", data);
        let AllData:any = [];
        AllData = data;
        this.notificationIds = [];
        for (let id in AllData){
          if(this.sent){
            for(let notify of this.notificationsSent){
              if(notify.notificationId.toString() == id){
                notify.seenCount = AllData[id];
              }
            }
          }else if(this.approved){
            for(let notify of this.notificationsApproved){
              if(notify.notificationId.toString() == id){
                notify.seenCount = AllData[id];
              }
            }
          }else if(this.archived){
            for(let notify of this.notificationsArchived){
              if(notify.notificationId.toString() == id){
                notify.seenCount = AllData[id];
              }
            }
          }else {
            for(let notify of this.notifications){
              if(notify.notificationId.toString() == id){
                notify.seenCount = AllData[id];
              }
            }
          }
        }
        load.dismiss();
      },
      err => {
        console.log("POST call in error", err);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }



  openNotificationViewBy(notification){
    let model = this.modalCtrl.create('NotificationViewReceiver',{notification:notification});
    model.onDidDismiss(data=>{
      this.console.log('Page Dismissed');
    });
    model.present();
  }



  doRefresh(refresher) {
    this.notificationPage = 1;
    this.notificationService.getNotification(this.notificationPage,0,0,this.approved,this.archived,this.sent,0).subscribe(
      (data) => {
        if(this.sent){
          this.notificationsSent = [];
        }else if(this.approved){
          this.notificationsApproved = [];
        }else if(this.archived){
          this.notificationsArchived = [];
        }else {
          this.notifications = [];
        }
        this.getData = false;
        let allData:any = data;
        for (let value of allData){
          let notify = new Notification;
          for(let item of value.attachmentsList){
            let attach = new Attachment();
            attach.id=item.id;
            attach.name=item.name;
            attach.type=item.type;
            attach.url=item.url;
            notify.attachmentsList.push(attach);
          }

          notify.body = value.body;
          notify.dateTime =  value.dateTime;
          notify.notificationId = value.id;
          notify.title = value.title;
          notify.receiversList = value.receiversList;
          notify.senderName = value.senderName;
          notify.tagsList = value.tagsList;
          notify.archived = value.archived;
          notify.approved = value.approved;
          if(value.tagsList != null) {
            notify.tagsListName = value.tagsList.name;
          }
          this.notificationIds.push(value.id);
          if(this.sent){
            this.notificationsSent.push(notify);
          }else if(this.approved){
            this.notificationsApproved.push(notify);
          }else if(this.archived){
            this.notificationsArchived.push(notify);
          }else {
            this.notifications.push(notify);
          }
        }
        this.getSeencount(this.notificationIds, this.loading);
        refresher.complete();
      },
      err => {
        refresher.complete();
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: "Please, check the internet and try again",
          buttons: ['OK']
        }).present();
      },
      () => {

      });
    }
}
