import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  ActionSheetController,
  AlertController, IonicPage,
  LoadingController,
  NavParams,
  Platform,
  ToastController,
  ViewController
} from 'ionic-angular';
import {NotificationService} from "../../services/notification";
import {Network} from '@ionic-native/network';
import {AccountService} from "../../services/account";
import {Class} from "../../models/class";
import {Student} from "../../models/student";
import {Autocomplete_shown_array} from "../../models/autocomplete_shown_array";
import {Send_student_notification} from "../../models/send_student_notification";
import {Storage} from "@ionic/storage";
import {AutoCompleteOps} from "angular2-tag-input/dist/lib/shared/tag-input-autocompleteOps";
import {Postattachment} from "../../models/postattachment";
import {BackgroundMode} from '@ionic-native/background-mode';
import {Pendingnotification} from "../../models/pendingnotification";

@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  wifiUploadKey = 'WIFI_UPLOAD';
  sendTo:any[] = [];
  Title:string;
  Details:string;
  name: string;
  tags:any[] = [];
  preparedTags:Autocomplete_shown_array[] = [];
  allStudentList:any[] = [];
  updateTags:any[]=[];
  tagsArr:any[] = [];
  allClasses:Class[] = [];
  allStudentNames:any[]=[];
  allStudentsDetails:any[]=[];
  autocompleteArray:AutoCompleteOps<any>;

  attachmentButtonName:string = "Add New Attachment";
  attachmentArray:any[] = [];
  chooseAllClasses:any[] = [];
  fileTypes=["jpg","jpeg","png","gif","ico","bmp","webp","tiff","pdf","txt","xls","xlsx","doc","docx","ppt","pptx","mp4","flv",
  "avi","mov","wmv","mp3","wma"];
  showSupportFiles:boolean;
  wifiUpload:boolean;
  placeHolder:string;
  arrayFormData:any[]=[];
  arrayToPostAttachment:any[]=[];
  pendingNotification:any[]=[];
  subscribtion;
  ifOpenWIFIANDNOTGOTOBACKGROUND;
  reciverListFound = 0;
  @ViewChild('file') inputEl: ElementRef;

  constructor(public navParams: NavParams,public viewCtrl: ViewController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastController, private platform:Platform,public accountServ:AccountService,
              private accServ:AccountService, private alertCtrl:AlertController, private loadingCtrl:LoadingController,
              public actionSheetCtrl: ActionSheetController, private storage:Storage,private backgroundMode:BackgroundMode)
  {
    this.sendTo = [];this.preparedTags = [];
     if(!this.platform.is('core')) {
       this.backgroundMode.enable();

       if (this.backgroundMode.isEnabled()) {
         console.log('backgroundMode isEnabled');
       }

       this.backgroundMode.on("activate").subscribe((s) => {
         console.log('background activate:', s);
       });
     }
      this.network.onConnect().subscribe((e) => {console.log('network:',e);});
    this.wifiUpload = false;
    this.placeHolder = "To :";
    this.showSupportFiles = false;
    this.tagsArr = accServ.tagArry;
    this.Title =this.navParams.get('title');
    this.Details=this.navParams.get('details');
    this.sendTo.splice(0);this.preparedTags.splice(0);
    this.allStudentNames=this.navParams.get('studetsNameList');
    this.allStudentsDetails=this.navParams.get('studentsdetailsList');
    let reciverArray = this.navParams.get('recieverList');
    this.tags = this.navParams.get('tagList');
    if(reciverArray) {
      this.reciverListFound = reciverArray.length;
      for (let temp of reciverArray) {
        let autoShownReciever = new Autocomplete_shown_array();
        autoShownReciever.id = temp.id;
        autoShownReciever.name = temp.name;
        autoShownReciever.type = temp.type;
        this.sendTo.push(autoShownReciever);
      }
      if(this.accountServ.getUserRole().notificationAttachmentUpload) {
        for (let temp of this.navParams.get('attachmentList')) {
          let attach = new Postattachment();
          attach.name = temp.name;
          attach.type = temp.type;
          attach.url = temp.url;
          attach.uploadDate = temp.date;
          this.attachmentArray.push(attach);
          this.arrayToPostAttachment.push(attach);
        }
      }
    }

    //+++++++++All Classes+++++++++
    let autoShownAllClasses = new Autocomplete_shown_array();
    autoShownAllClasses.id = -1;
    autoShownAllClasses.name = "All Classes";
    autoShownAllClasses.dataList=this.chooseAllClasses;

    //+++++++++Classes+++++++++
    this.allClasses=this.navParams.get('classesList');
    for (let classes of this.allClasses){
      let autoShownClasses = new Autocomplete_shown_array();
      autoShownClasses.id = classes.classId;
      autoShownClasses.name = classes.grade.gradeName+" "+classes.className;
      autoShownClasses.type = "Class";
      autoShownClasses.header = classes.branch.branchName;
      this.chooseAllClasses.push(autoShownClasses);
      this.preparedTags.push(autoShownClasses);
    }

    this.preparedTags.push( autoShownAllClasses);

    console.log("see", this.preparedTags);

    //++++++++++++++Students+++++++++++++++++++++
    for (let student of this.allStudentsDetails){
      let autoShownStudents = new Autocomplete_shown_array();
      autoShownStudents.id = student.studentId;
      autoShownStudents.name = student.studentName;
      autoShownStudents.type = "Student";
      autoShownStudents.header = student.studentClass.grade.gradeName+" "+student.studentClass.className;
      autoShownStudents.studentClassId = student.studentClass.classId;
      this.preparedTags.push(autoShownStudents);
    }
    console.log("see2", this.preparedTags);

    this.autocompleteArray = {

      toString: item => item.name,
      // searchIn: (item, inputValue) => {return item.studentName.indexOf(inputValue) > -1}
      searchIn: ["name"],
      groupByHeader: item => {if(item.header == null){return ""}else{return item.header}}

    };

    let tokenKey;
    if (platform.is('core')) {

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
          this.wifiUpload = true;
        }else{
          this.wifiUpload = false;
        }
      },
      (err)=> {
        console.log('ERROR'+err);
        this.wifiUpload = false;
      })
      .catch((err)=>{
        console.log('ERROR'+err);
        this.wifiUpload = false;
      });
  }

  sendNotification() {
    debugger;
    let RecieverArray:any[] = [];

    if(this.sendTo && this.sendTo.some(x => x.id === -1))
    {
      for(let temp of this.sendTo){
        for(let sub of temp.dataList){
          let ssn = new Send_student_notification();
          ssn.id = sub.id;
          if(sub.type == "STUDENT") {
            ssn.type = "Student";
          }else if(sub.type == "CLASS") {
            ssn.type = "Class";
          }else{
            ssn.type = sub.type;
          }
          ssn.name = sub.name;
          RecieverArray.push(ssn);
        }
      }
    }else{
      for(let temp of this.sendTo){
        let ssn = new Send_student_notification();
        ssn.id = temp.id;
        if(temp.type == "STUDENT") {
          ssn.type = "Student";
        }else if(temp.type == "CLASS") {
          ssn.type = "Class";
        }else{
          ssn.type = temp.type;
        }
        ssn.name = temp.name;
        RecieverArray.push(ssn);
      }
    }

    let SelectedTags:any[]=[];
    if(this.tags) {
      for (let tag of this.tags) {
        for (let tagArr of this.tagsArr)
          if (tagArr.name === tag) {
            SelectedTags.push(tagArr);
          }
      }
    }

    if (this.platform.is('core')){

          this.uploadFromWeb(RecieverArray,SelectedTags);

    }else{

      this.uploadFromMobile(RecieverArray,SelectedTags);

    }

  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  activeSend(){
    if(this.sendTo && (this.sendTo.length > 0) && this.Title && this.Details){
      return true;
    }else{
      return false;
    }
  }

  onChange(reef){
    console.log(reef);
    if(this.sendTo) {
      if (this.sendTo.some(x => x.id === -1)) {
        // this.sendTo.splice(0);
        // let autoShownAllClasses = new Autocomplete_shown_array();
        // autoShownAllClasses.id = -1;
        // autoShownAllClasses.name = "All Class";
        // autoShownAllClasses.dataList = this.chooseAllClasses;
        // this.sendTo.push(autoShownAllClasses);
        for(let i=0;i<this.sendTo.length;i++){
          if(this.sendTo[i].id != -1){
            this.sendTo.splice(i,1);
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
      else if (this.sendTo.some(x => x.type === "Class") && this.sendTo.some(y => y.type === "Student")) {
        let TempClassessArray: any[] = [];
        for (let selectedClasses of this.sendTo) {
          if (selectedClasses.type == "Class") {
            TempClassessArray.push(selectedClasses);
          }
        }
        let tempStudentId;
        let j;
        for(j=0;j<this.sendTo.length;){
          if (this.sendTo[j].type === "Student") {
            for (let tempClass of TempClassessArray) {
                if (tempClass.id == this.sendTo[j].studentClassId) {
                  tempStudentId = this.sendTo[j].id;
                  this.sendTo.splice(j, 1);
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
    console.log(this.sendTo);
  }

  presentConfirm(err:string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
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
    alert.present();
  }

  filesChange() {
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
          formData.append('file', inputEl.files.item(i));
          console.log(JSON.stringify(formData));
          this.arrayFormData.push(inputEl.files.item(i));
           // this.uploadAttach(formData);
              let file: File = inputEl.files.item(i);

              let fileType = this.getFileType(file.name);
              if(fileType == "IMAGE"){

                this.readFile(file);
              } else {
                let attach = new Postattachment();
                attach.name = fileName;
                attach.type = fileType;
                attach.file = inputEl.files.item(i);
                this.attachmentArray.push(attach);
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
      let attach = new Postattachment();
      attach.name = file.name;
      attach.type = "IMAGE";
      attach.url = reader.result;
      attach.file = file;
      that.attachmentArray.push(attach);
    };
    reader.readAsDataURL(file);
  }

     uploadAttach(formData){
    let errorAppear:boolean;
       return this.notiServ.postAttachment(formData).toPromise().then(
        s=> {
          console.log('Success post => ' + JSON.stringify(s));
          let allData:any = s;

          let attach = new Postattachment();
          attach.name = allData.name;
          attach.type = allData.type;
          attach.url = allData.url;
          attach.uploadDate = allData.date;
          this.arrayToPostAttachment.push(attach);
        },
        e=> {
          console.log('error post => '+JSON.stringify(e));
          if(errorAppear) {
            errorAppear = false;
            this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Can\'t upload the attachment, please try later',
              buttons: ['OK']
            }).present();
          }
        }
      );
    }

  deleteAttach(attachIndex:any){
    let alert = this.alertCtrl.create({
      title: 'Alert',
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
            this.arrayFormData.splice(attachIndex,1);
          }
        }
      ]
    });
    alert.present();
  }



  uploadFromMobile(RecieverArray,SelectedTags){
    debugger;

    if((this.wifiUpload && !(this.network.type == 'wifi') )|| (this.wifiUpload && this.network.type ==  "none")){
      alert('You have been activated upload by \"WiFi only\"');
      this.viewCtrl.dismiss({name: 'dismissed&SENT'});
      this.saveTheNewNotificationFrist(RecieverArray,SelectedTags);
      this.backgroundMode.on("activate").subscribe((s)=>{
        console.log('network:',this.network.type);
          this.getNotificationINStorage();
      });
      this.ifOpenWIFIANDNOTGOTOBACKGROUND = this.network.onConnect().subscribe(s=>{
        this.getNotificationINStorageNOTINBACKGROUND();
      });

    }else {

      let loading = this.loadingCtrl.create({
        content: ""
      });
      loading.present();
      if(this.arrayFormData) {
        let promisesArray = [];
        for (let index = 0; index <this.arrayFormData.length; index++) {
          // let form: FormData = this.arrayFormData[index];
          let form = new FormData();
          form.append('file', this.arrayFormData[index]);
          promisesArray.push(this.uploadAttach(form));
        }
        Promise.all(promisesArray).then( data=> {
          let sentNotify:any[]=[];
          this.notiServ.postNotification(this.Title, this.Details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
            (data) => {
              console.log("POST without wait Date Is", JSON.stringify(data));
              let PN = new Pendingnotification();
              PN.title = this.Title;
              PN.body = this.Details;
              PN.attachmentsList = this.arrayToPostAttachment;
              PN.tagsList = SelectedTags;
              PN.receiversList = RecieverArray;
              sentNotify.push(PN);
              loading.dismiss();
              this.viewCtrl.dismiss({name: 'dismissed&SENT'});
            },
            err => {
              console.log("POST without wait error", JSON.parse(JSON.stringify(err.error)));
              loading.dismiss();
              this.presentConfirm("Please check the internet and try again");
            },()=>{
              this.deleteFromStorage(sentNotify);
            });
        }).catch( e=>{
          console.log("Promises Error: "+e);
        });
      }else {
        let sentNotify: any[] = [];
        this.notiServ.postNotification(this.Title, this.Details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
          (data) => {
            debugger;
            console.log("POST without wait Date Is", JSON.stringify(data));
            let PN = new Pendingnotification();
            PN.title = this.Title;
            PN.body = this.Details;
            PN.attachmentsList = this.arrayToPostAttachment;
            PN.tagsList = SelectedTags;
            PN.receiversList = RecieverArray;
            sentNotify.push(PN);
            loading.dismiss();
            this.viewCtrl.dismiss({name: 'dismissed&SENT'});
          },
          err => {
            debugger;
            console.log("POST without wait error", JSON.parse(JSON.stringify(err.error)));
            loading.dismiss();
            this.presentConfirm("Please, check the internet then try again");
          }, () => {
            this.deleteFromStorage(sentNotify);
          });
      }
    }
  }

  uploadFromWeb(RecieverArray,SelectedTags) {
    let loading = this.loadingCtrl.create({
      content: ""
    });

    loading.present();
    if(this.arrayFormData) {
      let promisesArray = [];
      for (let index = 0; index < this.arrayFormData.length; index++) {
        // let form: FormData = this.arrayFormData[index];
        let form = new FormData();
        form.append('file', this.arrayFormData[index]);
        promisesArray.push(this.uploadAttach(form));
      }
      Promise.all(promisesArray).then(data => {
        // this.talks.push({name: this.name, topics: this.topics});
        this.notiServ.postNotification(this.Title, this.Details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
          data => {
            console.log("Date Is", data);
            loading.dismiss();
            this.viewCtrl.dismiss({name: 'dismissed&SENT'});
          },
          err => {
            console.log("POST call in error", err);
            loading.dismiss();
            this.presentConfirm(err);
          });
      });
    }else{
      this.notiServ.postNotification(this.Title, this.Details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
        data => {
          console.log("Date Is", data);
          loading.dismiss();
          this.viewCtrl.dismiss({name: 'dismissed&SENT'});
        },
        err => {
          console.log("POST call in error", err);
          loading.dismiss();
          this.presentConfirm("Please, check the internet then try again");
        });
    }
  }

  async saveTheNewNotificationFrist(RecieverArray,SelectedTags){
    this.storage.get('Notifications').then(
      data => {
        let pendingNotification: any[] = [];
        let notis: any = data;
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
          this.storage.remove('Notifications');
        }

        let PN = new Pendingnotification();
        PN.title = this.Title;
        PN.body = this.Details;
        PN.attachmentsList = this.arrayFormData;
        PN.tagsList = SelectedTags;
        PN.receiversList = RecieverArray;
        pendingNotification.push(PN);

        this.storage.set('Notifications',pendingNotification).catch(err=>{
          console.log("DATA Error: "+err);
        });

      });
  }

  async getNotificationINStorage(){
    await this.storage.get('Notifications').then(
      data =>{
        this.subscribtion = this.network.onConnect().subscribe((e) => {
          console.log('network:',e);
          if (this.network.type == 'wifi') {
            let notis:any = data;
            if(notis) {
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

            console.log('network:onlineWithWifi');
            if(this.pendingNotification.length > 0) {
              for (let temp of this.pendingNotification) {
                if (temp.attachmentsList) {
                  let promisesArray = [];
                  for (let index = 0; index < temp.attachmentsList.length; index++) {
                    // let form: FormData = temp.attachmentsList[index];
                    let form = new FormData();
                    form.append('file', temp.attachmentsList[index]);
                    promisesArray.push(this.uploadAttach(form));
                  }
                  Promise.all(promisesArray).then(data => {
                    this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                  }).catch(e => {
                    console.log("error" + e);
                  });
                }else{
                  this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                }
              }
            }
            this.subscribtion.unsubscribe();
          }
        },error2 => {
          console.log("error onConnent: ",error2);
        });
        }).catch(e=>{
          console.log('error: ',JSON.stringify(e));
    });
  }

  async SendNotificationBackground(title, details, postAttachment, RecieverArray, SelectedTags){
    let sentNotify:any[]=[];
    await this.notiServ.postNotification(title, details, postAttachment, RecieverArray, SelectedTags).subscribe(
      (data) => {
        console.log("network POST wait to call Date Is", JSON.stringify(data));
        let PN = new Pendingnotification();
        PN.title = title;
        PN.body = details;
        PN.attachmentsList = postAttachment;
        PN.tagsList = RecieverArray;
        PN.receiversList = SelectedTags;
        sentNotify.push(PN);
      },
      err => {
        console.log("network POST wait to call error", JSON.stringify(err));
      },
      () => {
        this.deleteFromStorage(sentNotify);
      });
  }


  async deleteFromStorage(sentNotify){
    let pendingNotification:any[] = [];
    await this.storage.get('Notifications').then(
      data =>{
        let notis = data;
        if(notis) {
          for (let temp of notis) {
            let PN = new Pendingnotification();
            let found = false;
            sentNotify.some( x => { found = true;});
            if(!found){
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


  async getNotificationINStorageNOTINBACKGROUND(){
    await this.storage.get('Notifications').then(
      data =>{
          if (this.network.type == 'wifi') {
            let notis:any = data;
            if(notis) {
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

            console.log('network:onlineWithWifi');
            if(this.pendingNotification.length > 0) {
              for (let temp of this.pendingNotification) {
                if (temp.attachmentsList) {
                  let promisesArray = [];
                  for (let index = 0; index < temp.attachmentsList.length; index++) {
                    // let form: FormData = temp.attachmentsList[index];
                    let form = new FormData();
                    form.append('file', temp.attachmentsList[index]);
                    promisesArray.push(this.uploadAttach(form));
                  }
                  Promise.all(promisesArray).then(data => {
                    this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                  }).catch(e => {
                    console.log("error" + e);
                  });
                }else{
                  this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                }
              }
            }
            this.ifOpenWIFIANDNOTGOTOBACKGROUND.unsubscribe();
          }
      }).catch(e=>{
      console.log('error: ',JSON.stringify(e));
    });
  }
}



