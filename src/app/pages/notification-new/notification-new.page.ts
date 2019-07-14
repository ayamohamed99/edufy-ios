import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {Autocomplete_shown_array} from '../../models/autocomplete_shown_array';
import {Class} from '../../models';
import {NgSelectConfig} from '@ng-select/ng-select';
import {ActionSheetController, AlertController, IonSlides, ModalController, NavParams, Platform} from '@ionic/angular';
import {NotificationService} from '../../services/Notification/notification.service';
import {Network} from '@ionic-native/network/ngx';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {AccountService} from '../../services/Account/account.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {ImageCompressorService} from '../../services/ImageCompressor/image-compressor.service';
import {BackgroundNotificationService} from '../../services/BackgroundNotification/background-notification.service';
import {Postattachment} from '../../models/postattachment';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-notification-new',
  templateUrl: './notification-new.page.html',
  styleUrls: ['./notification-new.page.scss'],
})
export class NotificationNewPage implements OnInit {

  @ViewChild('newNotificationSlides') slides: IonSlides;
  @ViewChild('file') inputEl: ElementRef;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  wifiUploadKey = 'WIFI_UPLOAD';
  Title:string;
  Details:string;
  name: string;
  tags:any[] = [];
  preparedTags:Autocomplete_shown_array[] = [];
  allStudentList:any[] = [];
  updateTags:any[]=[];
  allClasses:Class[] = [];
  allStudentNames:any[]=[];
  allStudentsDetails:any[]=[];

  attachmentButtonName:string = "Add New Attachment";
  attachmentArray:any[] = [];
  attachmentFiles:any[] = [];
  chooseAllClasses:any[] = [];
  fileTypes=["jpg","jpeg","png","gif","ico","bmp","webp","tiff","pdf","txt","xls","xlsx","doc","docx","ppt","pptx","mp4","flv",
    "avi","mov","wmv","mp3","wma"];
  showSupportFiles:boolean;
  placeHolder:string;
  pendingNotification:any[]=[];
  reciverListFound = 0;

  @Input() title:any;
  @Input() details:any;
  @Input() studetsNameList:any;
  @Input() studentsdetailsList:any;
  @Input() recieverList:any;
  @Input() tagList:any;
  @Input() attachmentList:any;
  @Input() classesList:any;

  constructor(private config: NgSelectConfig,public modalCtrl: ModalController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastViewService, private platform:Platform,public accountServ:AccountService,
              private accServ:AccountService, private alertCtrl:AlertController, private loadingCtrl:LoadingViewService,
              public actionSheetCtrl: ActionSheetController, private storage:Storage,private compress:ImageCompressorService,
              public backNotify:BackgroundNotificationService) {
    this.config.notFoundText = 'Custom not found';


    this.backNotify.sendTo = [];this.preparedTags = [];
    this.backNotify.wifiUpload = false;
    this.placeHolder = "To :";
    this.showSupportFiles = false;
    this.backNotify.tagsArr = accServ.tagArry;
    this.Title =this.title;
    this.Details=this.details;
    this.backNotify.sendTo.splice(0);this.preparedTags.splice(0);
    this.allStudentNames=this.studetsNameList;
    this.allStudentsDetails=this.studentsdetailsList;
    let reciverArray = this.recieverList;
    this.backNotify.tags = this.tagList;
    if(reciverArray) {
      this.reciverListFound = reciverArray.length;
      for (let temp of reciverArray) {
        let autoShownReciever = new Autocomplete_shown_array();
        autoShownReciever.id = temp.id;
        autoShownReciever.name = temp.name;
        autoShownReciever.type = temp.type;
        this.backNotify.sendTo.push(autoShownReciever);
      }
      if(this.accountServ.getUserRole().notificationAttachmentUpload) {
        for (let temp of this.attachmentList) {
          let attach = new Postattachment();
          attach.name = temp.name;
          attach.type = temp.type;
          attach.url = temp.url;
          attach.uploadDate = temp.date;
          this.attachmentArray.push(attach);
          this.backNotify.arrayToPostAttachment.push(attach);
        }
      }
    }

    //+++++++++All Classes+++++++++
    let autoShownAllClasses = new Autocomplete_shown_array();
    autoShownAllClasses.id = -1;
    autoShownAllClasses.name = "All Classes";
    autoShownAllClasses.dataList=this.chooseAllClasses;

    //+++++++++Classes+++++++++
    this.allClasses=this.classesList;
    for (let classes of this.allClasses){
      let autoShownClasses = new Autocomplete_shown_array();
      autoShownClasses.id = classes.id;
      autoShownClasses.name = classes.grade.name+" "+classes.name;
      autoShownClasses.type = "Class";
      autoShownClasses.header = classes.branch.name;
      this.chooseAllClasses.push(autoShownClasses);
      this.preparedTags.push(autoShownClasses);
    }

    this.preparedTags.push( autoShownAllClasses);

    console.log("see", this.preparedTags);

    //++++++++++++++Students+++++++++++++++++++++
    for (let student of this.allStudentsDetails){
      let autoShownStudents = new Autocomplete_shown_array();
      autoShownStudents.id = student.id;
      autoShownStudents.name = student.name;
      autoShownStudents.type = "Student";
      autoShownStudents.header = student.classes.grade.name+" "+student.classes.name;
      autoShownStudents.studentClassId = student.classes.id;
      this.preparedTags.push(autoShownStudents);
    }
    console.log("see2", this.preparedTags);

    // this.autocompleteArray = {
    //
    //   toString: item => item.name,
    //   // searchIn: (item, inputValue) => {return item.name.indexOf(inputValue) > -1}
    //   searchIn: ["name"],
    //   groupByHeader: item => {if(item.header == null){return ""}else{return item.header}}
    //
    // };

    let tokenKey;
    if (platform.is('desktop')) {

      tokenKey = localStorage.getItem(this.localStorageToken);
      this.notiServ.putHeader(localStorage.getItem(this.localStorageToken));
    } else {

      storage.get(this.localStorageToken).then(
          val => {
            tokenKey = val;
            this.notiServ.putHeader(val);
          });
    }

    this.storage.get(this.wifiUploadKey).then(
        value => {
          let val = value;
          if(val.wifi){
            this.backNotify.wifiUpload = true;
          }else{
            this.backNotify.wifiUpload = false;
          }
        },
        (err)=> {
          console.log('ERROR'+err);
          this.backNotify.wifiUpload = false;
        })
        .catch((err)=>{
          console.log('ERROR'+err);
          this.backNotify.wifiUpload = false;
        });
  }

  ngOnInit() {
  }


  sendNotification() {
    // this.backNotify.toSendNotification(this.modalCtrl,this.Title, this.Details,this.backNotify.arrayFormData,this.loadingCtrl);
    this.backNotify.toSendNotification(this.modalCtrl,this.Title, this.Details,this.attachmentFiles,this.loadingCtrl);
  }

  close(){
    this.DismissClick({name:'dismissed'});
  }

  activeSend(){
    if(this.backNotify.sendTo && (this.backNotify.sendTo.length > 0) && this.Title && (this.Details || this.attachmentArray.length>0)){
      return true;
    }else{
      return false;
    }
  }

  onChange(reef){
    console.log(reef);
    if(this.backNotify.sendTo) {
      if (this.backNotify.sendTo.some(x => x.id === -1)) {
        // this.backNotify.sendTo.splice(0);
        // let autoShownAllClasses = new Autocomplete_shown_array();
        // autoShownAllClasses.id = -1;
        // autoShownAllClasses.name = "All Class";
        // autoShownAllClasses.dataList = this.chooseAllClasses;
        // this.backNotify.sendTo.push(autoShownAllClasses);
        for(let i=0;i<this.backNotify.sendTo.length;i++){
          if(this.backNotify.sendTo[i].id != -1){
            this.backNotify.sendTo.splice(i,1);
          }
        }

        let a;
        for(a=0;a<reef.selectedValues.length;){
          if(reef.selectedValues[a].id != -1){
            // reef.itemsList._selected[reef.selectedValues[i].index].selected = false;
            let itemIndex;
            for(let k=0;k<reef.itemsList.items.length;k++) {
              if(reef.itemsList.items[k].value.id != -1 && reef.itemsList.items[k].selected){
                itemIndex = reef.itemsList.items[k].index;
                reef.itemsList.unselect(reef.itemsList.items[itemIndex]);
              }
            }
            reef.selectedValues.splice(a,1);
            a=0;
          }else{a++;}
        }
      }
      else if (this.backNotify.sendTo.some(x => x.type === "Class") && this.backNotify.sendTo.some(y => y.type === "Student")) {
        let TempClassessArray: any[] = [];
        for (let selectedClasses of this.backNotify.sendTo) {
          if (selectedClasses.type == "Class") {
            TempClassessArray.push(selectedClasses);
          }
        }
        let tempStudentId;
        let j;
        for(j=0;j<this.backNotify.sendTo.length;){
          if (this.backNotify.sendTo[j].type === "Student") {
            for (let tempClass of TempClassessArray) {
              if (tempClass.id == this.backNotify.sendTo[j].studentClassId) {
                tempStudentId = this.backNotify.sendTo[j].id;
                this.backNotify.sendTo.splice(j, 1);
                j=0;
                for(let i=0;i<reef.selectedValues.length;i++){
                  if(reef.selectedValues[i].id == tempStudentId){
                    let itemIndex;
                    for(let k=0;k<reef.itemsList.items.length;k++) {
                      if(reef.itemsList.items[k].value.id == tempStudentId){
                        itemIndex = reef.itemsList.items[k].index;
                      }
                    }
                    reef.itemsList.unselect(reef.itemsList.items[itemIndex]);
                    reef.selectedValues.splice(i,1);
                    break;
                  }
                }
              }
            }
          }else{j++}
        }
      }
    }
    console.log(this.backNotify.sendTo);
  }

  async presentConfirm(err:string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: err,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Retry',
          handler: () => {
            this.sendNotification();
          }
        }
      ]
    });
    await alert.present();
  }

  async filesChange() {
    let inputEl: HTMLInputElement = this.inputEl.nativeElement;
    let fileCount: number = inputEl.files.length;
    let faildFilesNamesSize: any[] = [];
    let faildFilesNameseExtantion: any[] = [];
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        let num: number = inputEl.files.item(i).size;
        let fileName = inputEl.files.item(i).name;
        let fileExtintion: string = fileName.slice(fileName.length - 4);
        fileExtintion = fileExtintion.replace('.', '');
        if (num <= 26214400 && this.fileTypes.find(x => x == fileExtintion)) {
          let formData = new FormData();
          debugger;
          let file: File=inputEl.files.item(i);
          let fileType = this.getFileType(inputEl.files.item(i).name);
          if (fileType == "IMAGE") {
            // this.loadingCtrl.startLoading('',true,'loadingWithoutBackground');
            let that = this;
            await new Promise(function(resolve, reject) {
              // let these = that;
              // that.compress.compressImage(inputEl.files.item(i)).subscribe(
              //     result => {
              //       debugger;
              //       file = result;
              //       formData.append('file', result, result.name);
              //       console.log(JSON.stringify(formData));
              //       these.backNotify.arrayFormData.push(result);
              that.attachmentFiles.push(file);
              let thats = that;


              let reader = new FileReader();
                    reader.onloadend = function(e){
                      // you can perform an action with readed data here
                      console.log(reader.result);
                      // these.loadingCtrl.stopLoading();
                      let attach = new Postattachment();
                      attach.name = file.name;
                      attach.type = "IMAGE";
                      attach.url = reader.result;
                      attach.file = file;
                      thats.attachmentArray.push(attach);
                      resolve(resolve);
                    };
                    reader.readAsDataURL(file);

                  //   // that.organizeData(inputEl, i, formData, result, fileType, fileName,result,result);
                  // }, error => {
                  //   console.log('😢 Oh no!', error);
                  //   reject(error);
                  // });
              return true
            });

          }else{
            file = inputEl.files.item(i);
            formData.append('file', file);
            console.log(JSON.stringify(formData));
            this.attachmentFiles.push(file);
            this.organizeData(inputEl,i,formData,inputEl.files.item(i),fileType,fileName);
          }



        } else if (num > 26214400) {
          faildFilesNamesSize.push(inputEl.files.item(i).name);
        } else {
          faildFilesNameseExtantion.push(inputEl.files.item(i).name);
        }
      }
    }
    if (faildFilesNamesSize.length > 0 && faildFilesNameseExtantion.length <= 0) {
      alert('Can\'t upload files name: ' + faildFilesNamesSize.join(',') + ' because it is bigger than 25 Mb');
    } else if (faildFilesNamesSize.length <= 0 && faildFilesNameseExtantion.length > 0) {
      this.showSupportFiles = true;
      alert('Can\'t upload files name: ' + faildFilesNameseExtantion.join(',') + ' because it is not supported');
    } else if (faildFilesNamesSize.length > 0 && faildFilesNameseExtantion.length > 0) {
      this.showSupportFiles = true;
      alert('Can\'t upload files name: ' + faildFilesNamesSize.join(',') + ' because it is bigger than 25 Mb and' +
          ' files name: ' + faildFilesNameseExtantion.join(',') + ' because it is not supported.');
    }
  }

  organizeData(inputEl,i,formData,file,fileType,fileName){
    // this.uploadAttach(formData);

    if (fileType == "IMAGE") {

      this.readFile(file);
    } else {
      let attach = new Postattachment();
      attach.name = fileName;
      attach.type = fileType;
      attach.file = inputEl.files.item(i);
      this.attachmentArray.push(attach);
    }
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
    let that = this;
    let reader = new FileReader();
    reader.onloadend = function(e){
      // you can perform an action with readed data here
      console.log(reader.result);
      that.loadingCtrl.stopLoading();
      let attach = new Postattachment();
      attach.name = file.name;
      attach.type = "IMAGE";
      attach.url = reader.result;
      attach.file = file;
      that.attachmentArray.push(attach);
    };
    reader.readAsDataURL(file);
  }

  //  uploadAttach(formData){
  // let errorAppear:boolean;
  //    return this.notiServ.postAttachment(formData).toPromise().then(
  //     s=> {
  //       console.log('Success post => ' + JSON.stringify(s));
  //       let allData:any = s;
  //
  //       let attach = new Postattachment();
  //       attach.name = allData.name;
  //       attach.type = allData.type;
  //       attach.url = allData.url;
  //       attach.uploadDate = allData.date;
  //       this.backNotify.arrayToPostAttachment.push(attach);
  //     },
  //     e=> {
  //       console.log('error post => '+JSON.stringify(e));
  //       if(errorAppear) {
  //         errorAppear = false;
  //         this.alertCtrl.create({
  //           title: 'Error',
  //           subTitle: 'Can\'t upload the attachment, please try later',
  //           buttons: ['OK']
  //         }).present();
  //       }
  //     }
  //   );
  // }

  async deleteAttach(attachIndex:any){
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'Are you sure that you want to delete this attachment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.attachmentArray.splice(attachIndex, 1);
            this.attachmentFiles.splice(attachIndex,1);
            this.backNotify.arrayToPostAttachment.splice(attachIndex,1);
            this.slides.update();
          }
        }
      ]
    });
    await alert.present();
  }

  async DismissClick(data) {
    await this.modalCtrl.dismiss(data);
  }

}
