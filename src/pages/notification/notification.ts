import {Component} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, Platform, PopoverController
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
import {AttachmentList} from "../../modles/attachmentlist";
import {File} from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import {FileTransfer} from '@ionic-native/file-transfer';
import {Media} from "@ionic-native/media";
import { FileOpener } from '@ionic-native/file-opener';
import {Transfer, TransferObject} from '@ionic-native/transfer';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage{

  notifications:Notification[] = [];
  notificationPage=1;
  loading:any;
  fristOpen:boolean = true;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  tokenKey:string;
  tagsArr:any[] = [];

  classes:any[] = [];
  studentsName:any[] = [];
  studentwithClass:any[] = [];

  constructor(private alrtCtrl:AlertController,private platform:Platform,private storage:Storage,
              private modalCtrl: ModalController,private notificationService:NotificationService,
              private popoverCtrl: PopoverController, private load:LoadingController, private accService:AccountService,
              private studentService:StudentsService, private document: DocumentViewer, private file: File,
              private transfer: FileTransfer, public audio: Media,private fileOpener: FileOpener,
              private transferF: Transfer) {

    if (platform.is('core')) {

      this.tokenKey = localStorage.getItem(this.localStorageToken);
      notificationService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotifications(this.notificationPage, 0, 0, null, null, null, 0);
    } else {

      storage.get(this.localStorageToken).then(
        val => {
          this.tokenKey = val;
          notificationService.putHeader(val);
          this.getNotifications(this.notificationPage, 0, 0, null, null, null, 0);
        });
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
        this.fristOpen = true;
        this.notifications.splice(0);
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);

      }else if (data.done === 'updateSuccess'){
        console.log(data.done);
        this.fristOpen = true;

        let model = this.modalCtrl.create(NotificationEditPage,{id:data.id,title:data.title,
          details:data.details});
        model.onDidDismiss(()=>{
          this.notifications.splice(0);
          this.notificationPage = 1;

          this.notificationService.putHeader(this.tokenKey);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
        model.present();

      }else if(data.done === 'newSuccess'){
        this.fristOpen = true;
        console.log(data.done);
        this.loading = this.load.create({
          content: ""
        });
        this.loading.present();
        this.notificationService.getNotificationReceivers(id).subscribe(
              (data) => {
                this.loading.dismiss();
                console.log("Date Is", data);
                let model = this.modalCtrl.create(NotificationNewPage,{id:id,title:title, details:details, classesList:this.classes,
                  studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass,recieverList:data,
                  tagList:tagsList});
                model.onDidDismiss(()=>{
                  this.notifications.splice(0);
                  this.notificationPage = 1;

                  this.notificationService.putHeader(this.tokenKey);
                  this.getNotifications(this.notificationPage,0,0,null,null,null,0);
                });
                model.present();
              },
              err => {
                console.log("POST call in error", err);
                this.loading.dismiss();
                this.alrtCtrl.create( {
                  title: 'Error',
                  subTitle: err.message,
                  buttons: ['OK']
                }).present();
              },
              () => {
                console.log("The POST observable is now completed.");
              });
      }
      }
    });

    popover.present({ev: event});
  }

  onOpenView() {
    let model = this.modalCtrl.create(NotificationNewPage,{classesList:this.classes,
      studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass});
    model.present();

    model.onDidDismiss(data => {
      if(data.name =="dismissed&SENT"){
        this.fristOpen = true;
        this.notifications.splice(0);
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);
      }
    });
  }

  getNotifications(pageNumber:number,userId:number,classId:number,approved:string,archived:string,sent:string,tagId:number){
    if(this.fristOpen) {
      this.loading = this.load.create({
        content: 'Loading Notification...'
      });
      this.loading.present();
      this.fristOpen = false;
    }

    this.notificationService.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId).subscribe(
      (data) => {
        console.log("Date Is", data);
        let allData:any = data;
        for (let value of allData){
          let notify = new Notification;
          for(let item of value.attachmentsList){
            let attach = new AttachmentList();
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
          if(value.tagsList != null) {
            notify.tagsListName = value.tagsList.name;
          }

          this.notifications.push(notify);
        }

        if(this.platform.is('core')) {

          this.tokenKey = localStorage.getItem(this.localStorageToken);
          this.studentService.putHeader(localStorage.getItem(this.localStorageToken));
          this.getAllClasses();
          this.getAllStudent();
        }else {

          this.storage.get(this.localStorageToken).then(
            val=>{
              this.tokenKey = val;
              this.studentService.putHeader(val);
              this.getAllClasses();
              this.getAllStudent();
            });
        }
      },
      err => {
        console.log("POST call in error", err);
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: err.message,
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
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);

        console.log('Async operation has ended');
        resolve();
      }, 500);
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

  onAttachmentClick(event:Event, attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any){
    this.alrtCtrl.create( {
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
            if(attachmentType == "PDF"){
              this.downloadPdf(attachmentName,attachmentId,attachmentType,attachmentURL);
            }
            else if(attachmentType == "AUDIO"){
              this.downloadSong(attachmentName,attachmentId,attachmentType,attachmentURL);
            }else if(attachmentType == "IMAGE"){
              this.downloadFile(attachmentName.substring(17),attachmentId,attachmentType,attachmentURL);
            }
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
            if(attachmentName) {
              let exType: string = attachmentName.toString().slice(attachmentName.length - 3);
              console.log(exType);
              console.log(attachmentName.toString().slice(attachmentName.length - 3));
              this.OpenFiles(attachmentName.substring(17), attachmentId, attachmentType, attachmentURL,exType);
            }
          }
        }
      ]
    }).present();
  }


  OpenFiles(attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any,extinstion:any){

    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
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
      this.fileOpener.open(url, 'application/'+extinstion)
        .then(() => console.log('File is opened'))
        .catch(e => {
          console.log(e);
          this.alrtCtrl.create( {
            title: 'Error',
            subTitle: 'Something went wrong try again later.',
            buttons: ['OK']
          }).present();
          this.loading.dismiss();
        });
    }).catch(reason => {
      console.log(path + attachmentName);
      this.alrtCtrl.create( {
        title: 'Error',
        subTitle: reason,
        buttons: ['OK']
      }).present();
      this.loading.dismiss();
    });
  }

  downloadPdf(attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any){
    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }

    const transfer = this.transfer.create();
    transfer.download(attachmentURL,
      path + attachmentName).then(entry => {

      this.loading.dismiss();

    }).catch(reason => {

      this.alrtCtrl.create( {
        title: 'Error',
        subTitle: reason,
        buttons: ['OK']
      }).present();

      this.loading.dismiss();
    });
  }

  downloadSong(attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any){
    let path = this.file.dataDirectory;
    const transfer = this.transfer.create();
    transfer.download(attachmentURL,
      path + attachmentName).catch(reason => {

      this.alrtCtrl.create( {
        title: 'Error',
        subTitle: reason,
        buttons: ['OK']
      }).present();

      this.loading.dismiss();
    });
  }




  downloadFile(attachmentName:any,attachmentId:any,attachmentType:any,attachmentURL:any) {

    let storageDirectory = null;

    if (this.platform.is('ios')) {
      storageDirectory = this.file.syncedDataDirectory;
    } else if (this.platform.is('android')) {
      storageDirectory = this.file.externalRootDirectory;
    }

    this.platform.ready().then(() => {

      const fileTransfer: TransferObject = this.transferF.create();

      const imageLocation = attachmentURL;

      fileTransfer.download(imageLocation, storageDirectory + attachmentName).then((entry) => {

        const alertSuccess = this.alrtCtrl.create({
          title: `Download Succeeded!`,
          subTitle: `${attachmentName} was successfully downloaded to: ${entry.toURL()}`,
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
    // var fileTransfer = new window.FileTransfer;
    // let path = this.file.dataDirectory+name;
    // var uri = encodeURI(url);
    //
    // fileTransfer.download(
    //   uri,
    //   path,
    //   function(entry) {
    //     console.log("download complete: " + entry.toURL());
    //     console.log(uri);
    //     console.log(path);
    //   },
    //   function(error) {
    //     console.log("download error source " + error.source);
    //     console.log("download error target " + error.target);
    //     console.log("download error code" + error.code);
    //   },
    //   false,);




  // getSeencount(){
  //   this.notificationService.getSeencount(6094).subscribe(
  //     (data) => {
  //       console.log("Date Is", data);
  //     },
  //     err => {
  //       console.log("POST call in error", err);
  //     },
  //     () => {
  //       console.log("The POST observable is now completed.");
  //     });
  // }

}
