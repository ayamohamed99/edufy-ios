import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, Platform, PopoverController, ToastController
} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";
import {NotificationService} from "../../services/notification";
import {PopoverNotificationCardPage} from "./popover_notification/popovernotificationcard";
import {Notification} from "../../modles/notification";
import {Storage} from "@ionic/storage";
import {NotificationEditPage} from "./popover_notification/notification-edit/notification-edit";
import {AccountService} from "../../services/account";
import {Class} from "../../modles/class";
import {StudentsService} from "../../services/students";
import {Student} from "../../modles/student";
import {Attachment} from "../../modles/attachment";
import {File} from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import {FileTransfer} from '@ionic-native/file-transfer';
import {Media} from "@ionic-native/media";
import { FileOpener } from '@ionic-native/file-opener';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Pendingnotification} from "../../modles/pendingnotification";
import {Network} from "@ionic-native/network";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Slides } from 'ionic-angular';


declare var cordova: any;

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

  constructor(private alrtCtrl:AlertController,private platform:Platform,private storage:Storage,
              private modalCtrl: ModalController,private notificationService:NotificationService,
              private popoverCtrl: PopoverController, private load:LoadingController, private accService:AccountService,
              private studentService:StudentsService, private document: DocumentViewer, private file: File,
              private transfer: FileTransfer, public audio: Media,private fileOpener: FileOpener,
              private transferF: Transfer, public accountServ:AccountService,private network:Network,
              private androidPermissions: AndroidPermissions,private toastCtrl:ToastController) {
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

    this.tagsArr = accService.accountBranchesList;
  }

  fullString(fristPart:string, secoundPart:string){
    return fristPart+' '+secoundPart;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  onSelectCard(event:Event, id:number, title:string, details:string,reciversList:any,tagsList:any, i:any){
    let popover = this.popoverCtrl.create(PopoverNotificationCardPage, {id:id, title:title, details:details});

    popover.onDidDismiss(data => {
      console.log(data);
      if(data == null) {
        console.log('dissmiss');
      }else{
      if(data.done === 'deleteSuccess') {
        this.fristOpen = false;
        this.loadNow = true;
        this.notifications.splice(0);
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,this.approved, this.archived, this.sent,0);

      }else if (data.done === 'updateSuccess'){
        console.log(data.done);
        this.fristOpen = false;
        this.loadNow = true;
        let model = this.modalCtrl.create(NotificationEditPage,{id:data.id,title:data.title,
          details:data.details});
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
        console.log(data.done);
        this.loading = this.load.create({
          content: ""
        });
        this.loading.present();
        this.NewNotification = false;
        this.getNotificationReciver(id, title, details,reciversList,tagsList, i);
      }
      }
    });

    popover.present({ev: event});
  }

  getNotificationReciver(id:number, title:string, details:string,reciversList:any,tagsList:any, i:any){
    this.notificationService.getNotificationReceivers(id).subscribe(
      (data) => {
        this.loading.dismiss();
        console.log("Date Is", data);
        this.editId = id;
        this.editTitle = title;
        this.editDetails = details;
        this.editTags = tagsList;
        this.getAllDataThenNavigate();
      },
      err => {
        console.log("POST call in error", err);
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: "Please, check the internet and try again",
          buttons: ['OK']
        }).present();
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  onOpenView() {
    this.NewNotification = true;
    this.getAllDataThenNavigate();
  }

  getData = false;
  getNotifications(pageNumber:number,userId:number,classId:number,approved,archived,sent,tagId:number){
    let contentMsg;
    if(this.approved){
      contentMsg = 'Loading Awaiting Approved Notifications...';
    }else if(this.archived){
      contentMsg = 'Loading Archived Notifications...';
    }else if(this.sent){
      contentMsg = 'Loading Sent Notifications...';
    }else{
      contentMsg = 'Loading Notifications...';
    }
    if(!this.getData) {
      this.getData = true;
      if (this.fristOpen || this.loadNow) {
        this.loading = this.load.create({
          content: contentMsg
        });
        this.loading.present();
      }
    }
    this.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId);
  }

  getNotification(pageNumber:number,userId:number,classId:number,approved,archived,sent,tagId:number){
    this.notificationService.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId).subscribe(
      (data) => {
        this.getData = false;
        console.log("Date Is", data);
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
      },
      err => {
        console.log("POST call in error", err);
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: "Please, check the internet and try again",
          buttons: ['OK']
        }).present();
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  doInfinite(){
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {

        this.notificationPage += this.notificationPage + 1;
        this.getNotifications(this.notificationPage,0,0,this.approved, this.archived, this.sent,0);

        console.log('Async operation has ended');
        resolve();
      }, 1000);
    })
  }

  getAllClasses(){
    this.notificationService.getClassList().subscribe((value) => {
        let allData: any = value;
        for (let data of allData) {
          let item = new Class();
          console.log(value);
          item.classId = data.id;
          item.className = data.name;
          item.grade.gradeId = data.grade.id;
          item.grade.gradeName = data.grade.name;
          item.branch.branchId = data.branch.id;
          item.branch.branchName = data.branch.name;
          item.branch.managerId = data.branch.managerId;
          this.classes.push(item);
        }
        this.getAllStudent();
      },
      err =>{
        console.log(err);
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
        this.loading.dismiss();
      });
  }

  getAllStudent(){
    this.studentService.getAllStudents('Notification').subscribe(
      (val)=>{
        console.log(val);
        let data:any = val;
        for (let value of data){
          let students = new Student();

          students.studentClass.classId = value.classes.id;
          students.studentClass.className = value.classes.name;
          students.studentClass.grade.gradeId = value.classes.grade.id;
          students.studentClass.grade.gradeName = value.classes.grade.name;
          students.studentClass.branch.branchId = value.classes.branch.id;
          students.studentClass.branch.branchName = value.classes.branch.name;
          students.studentClass.branch.managerId = value.classes.branch.managerId;
          students.studentId = value.id;
          students.studentName = value.name;
          students.studentAddress = value.address;

          this.studentsName.push(value.name);
          this.studentwithClass.push(students);
          console.log(students);
        }

        console.log(this.studentwithClass.length);

        console.log(this.studentsName);

        console.log(this.studentwithClass);

        if(this.NewNotification){

          let model = this.modalCtrl.create(NotificationNewPage,{classesList:this.classes,
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

          let model = this.modalCtrl.create(NotificationNewPage,{id:this.editId,title:this.editTitle, details:this.editDetails,
            classesList:this.classes, studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass
            ,recieverList:data, tagList:this.editTags});
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
        console.log('GetAllStudent Error: '+err);
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
              console.log('Download clicked');
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
              console.log('Open clicked');
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
                console.log(exType);
                console.log(attachmentName.toString().slice(attachmentName.length - 3));
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
      console.log(path + attachmentName);
      this.fileOpener.open(url, extinstion)
        .then(() => console.log('File is opened'))
        .catch(e => {
          console.log(e);
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
      console.log(path + attachmentName);
      console.log("REASON"+reason.exception);
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
    this.loading = this.load.create({
      content: ""
    });
    this.loading.present();
    if(this.platform.is('core')) {
      this.tokenKey = localStorage.getItem(this.localStorageToken);
      this.studentService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getAllClasses();
    }else {
      this.storage.get(this.localStorageToken).then(
        val => {
          this.tokenKey = val;
          this.studentService.putHeader(val);
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
        this.notificationsSent = [];
        this.selectedTab = 'sent';
        this.sent = true;
        this.approved = null;
        this.archived = null;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;

      case 2:
        this.notificationsApproved = [];
        this.selectedTab = 'approved';
        this.sent = null;
        this.approved = true;
        this.archived = null;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;

      case 3:
        this.notificationsArchived = [];
        this.selectedTab = 'archived';
        this.sent = null;
        this.approved = null;
        this.archived = true;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;

      default:
        this.notifications = [];
        this.selectedTab = 'all';
        this.sent = null;
        this.approved = null;
        this.archived = null;
        this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
        break;
    }
  }


  archiveNotification(index) {
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
    // get select notification to
    if (approvedNotification.approved == true) {
      // archive it
      if (approvedNotification.archived == true) {

        let confirm = this.alrtCtrl.create({
          title: "Alert!",
          message: "Do you want to restore this Notification? ",
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                // select notification to approve it
                let sentNotification = {
                  "id": approvedNotification.notificationId,
                };
                this.loading = this.load.create({
                  content: "Restoring Notification Now ..."
                });
                this.loading.present();

                /* messageService.operationMessage(messageService.messageSubject.archivingTitle,messageService.messageSubject.archivingingOperationMessage); */
                this.notificationService.editNotification(sentNotification, 4).subscribe(
                  (response) => {
                    this.loading.dismiss();
                    approvedNotification.archived = false;
                    // this.notificationPage = 1;
                    // this.getNotification(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
                    this.presentToast('Notification restored successfully.');
                },  (reason) => {
                    this.loading.dismiss();
                    this.presentToast('Problem deleting notifications from archive.');
                    console.error('Error: notification.module>NotificationCtrl>archiveNotification> cannot send notification -  ' + reason);
                });
              }
            }
          ]
        });
        confirm.present();
      } else {
        this.loading = this.load.create({
          content: "Archive Notification Now ..."
        });
        this.loading.present();
        /* messageService.operationMessage(messageService.messageSubject.archivingTitle,messageService.messageSubject.archivingingOperationMessage); */
        let sentNotification = {
          "id": approvedNotification.notificationId,
        };
        // calling update service.
        this.notificationService.editNotification(sentNotification, 3).subscribe(
          (response) => {
            this.loading.dismiss();
            approvedNotification.archived = true;
            // this.notificationPage = 1;
            // this.getNotification(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
            this.presentToast('Notification archived successfully.');
        },(reason) => {
            this.loading.dismiss();
            this.presentToast('Problem archiving notifications.');
            console.error('Error: notification.module>NotificationCtrl>archiveNotification> cannot send notification -  ' + reason);
        });
      }
    } else {
      let confirm = this.alrtCtrl.create({
        title: 'Alert!',
        message: 'Notification need to be approved first.',
        buttons: ['Ok']
      });
      confirm.present();
    }
  }


  approveNotification(index){
    this.loading = this.load.create({
      content: "Approving Now ..."
    });
    this.loading.present();

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
              approvedNotification.approved = true;
              this.loading.dismiss();
              // removeProcessingMessage();
              // getNotificationNumFromServer();
              // $scope.currentPage = 1;
              if(this.sent){
                this.notificationsSent = [];
              }else if(this.approved){
                this.notificationsApproved = [];
              }else if(this.archived){
                this.notificationsArchived = [];
              }else {
                this.notifications = [];
              }
              this.notificationPage = 1;
              this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
            this.presentToast('Notification approved & sent successfully.');
          }, (reason) => {
              this.loading.dismiss();
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
              approvedNotification.approved = true;
              this.loading.dismiss();
              // removeProcessingMessage();
              // getNotificationNumFromServer();
              // $scope.currentPage = 1;
              if(this.sent){
                this.notificationsSent = [];
              }else if(this.approved){
                this.notificationsApproved = [];
              }else if(this.archived){
                this.notificationsArchived = [];
              }else {
                this.notifications = [];
              }
              this.notificationPage = 1;
              this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
              this.presentToast('Notification approved & sent successfully.');
            // messageService.message("success", messageService.messageSubject.successApprovedNotification);
          },(reason) => {
              this.loading.dismiss();
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
          approvedNotification.approved = true;
          this.loading.dismiss();
        // removeProcessingMessage();
        // getNotificationNumFromServer();
        // $scope.currentPage = 1;
          if(this.sent){
            this.notificationsSent = [];
          }else if(this.approved){
            this.notificationsApproved = [];
          }else if(this.archived){
            this.notificationsArchived = [];
          }else {
            this.notifications = [];
          }
          this.notificationPage = 1;
          this.getNotifications(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
          this.presentToast('Notification approved & sent successfully.');
        // messageService.message("success", messageService.messageSubject.successApprovedNotification);
      },(reason) => {
          this.loading.dismiss();
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
      position: 'top'
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

}
