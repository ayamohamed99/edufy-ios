import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Platform, ToastController} from 'ionic-angular';
import {ChatService} from "../../services/chat";
import {Storage} from "@ionic/storage";
import {ChatDialogue} from "../../models/chat-dialogue";
import {TransFormDate} from "../../services/transFormDate";
import {AccountService} from "../../services/account";
import {observable} from "rxjs/symbol/observable";
import {Observable} from "rxjs";

/**
 * Generated class for the ChatDialoguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-dialogue',
  templateUrl: 'chat-dialogue.html',
})
export class ChatDialoguePage {
  @ViewChild('ChatDialogue') private ChatDialogueScroll: any;
  student;
  chatDialogs:any[] = [];
  theMessage;
  loading=false;
  sendLoading=false;
  resendLoading=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController,
              public platform:Platform,public storage:Storage,public chatServ:ChatService,
              public accountServ:AccountService, public getDate:TransFormDate, public tost:ToastController){
    this.student = this.navParams.get('studentData');
    if (platform.is('core')) {
      chatServ.putHeader(localStorage.getItem('LOCAL_STORAGE_TOKEN'));
      this.getChatHistory();
    }else{
      storage.get('LOCAL_STORAGE_TOKEN').then(
        val => {
          chatServ.putHeader(val);
          this.getChatHistory();
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDialoguePage');
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  getChatHistory(){
    this.loading = true;
    this.chatServ.getChatMessagesHistory(this.student.studentId,this.student.studentClass.branch.id).subscribe(
      val =>{
        this.loading = false;
        console.log(val);
        let data:any;
        data = val;
        for(let message of data){
          let chat = new ChatDialogue();
          chat.chatMessageRecieverStatesList=message.chatMessageRecieverStatesList;
          chat.chatThread=message.chatThread;
          chat.dateTimeRead=message.dateTimeRead;
          chat.dateTimeRecieved=message.dateTimeRecieved;
          chat.dateTimeSent=message.dateTimeSent;
          chat.id=message.id;
          chat.message=message.message;
          chat.senderId=message.senderId;
          chat.status=message.status;
          chat.user=message.user;
          this.chatDialogs.push(chat);
        }

        this.chatServ.newMessageSubject$.subscribe(
          value => {
            if(value){
              let message:any = value;
              if(message.chatThread.student.id == this.student.studentId) {
                let chat = new ChatDialogue();
                chat.chatMessageRecieverStatesList = message.chatMessageRecieverStatesList;
                chat.chatThread = message.chatThread;
                chat.dateTimeRead = message.dateTimeRead;
                chat.dateTimeRecieved = message.dateTimeRecieved;
                chat.dateTimeSent = message.dateTimeSent;
                chat.id = message.id;
                chat.message = message.message;
                chat.senderId = message.senderId;
                chat.status = message.status;
                chat.user = message.user;
                this.chatDialogs.push(chat);
                this.scrollDown();
              }else{
                this.chatServ.NewChats.push(message);
              }
            }
          },error1 => {
            console.log(error1);
          });
        this.scrollDown();
        this.loading = false;
        },error1 => {
        this.loading = false;
        this.tost.create({
          message: 'Oops! I\'m sorry. can\'t get your chat history' ,
          duration: 3000,
          position: 'bottom'
        }).present();
      });
  }


  sendMessage(){
    this.sendLoading = true;
    let chat = new ChatDialogue();
    chat.chatMessageRecieverStatesList='';
    chat.chatThread={student:{id:this.student.studentId}};
    chat.dateTimeRead='';
    chat.dateTimeRecieved='';
    chat.dateTimeSent = new Date();
    chat.id=0;
    chat.message=this.theMessage;
    chat.senderId=this.accountServ.userId;
    chat.status='';
    chat.errorSend = false;
    chat.user=  {id: this.accountServ.userId, name:this.accountServ.getUserName() };
    this.chatDialogs.push(chat);
    this.scrollDown();
    this.chatServ.sendChat(this.student.studentId,this.theMessage,this.accountServ.userId,
      this.accountServ.getUserName()).subscribe(
        val=>{
          let message:any;
          message = val;
          chat.chatMessageRecieverStatesList=message.chatMessageRecieverStatesList;
          chat.chatThread=message.chatThread;
          chat.dateTimeRead=message.dateTimeRead;
          chat.dateTimeRecieved=message.dateTimeRecieved;
          chat.dateTimeSent=message.dateTimeSent;
          chat.id=message.id;
          chat.message=message.message;
          chat.senderId=message.senderId;
          chat.status=message.status;
          chat.user=message.user;
          chat.errorSend = false;
          this.sendLoading = false;
        },error1 => {
        console.log(error1);
        chat.errorSend = true;
        this.sendLoading = false;
        this.tost.create({
          message: 'Oops! I\'m sorry. can\'t send the message' ,
          duration: 3000,
          position: 'bottom'
        }).present();
      });

    this.theMessage = '';
  }

  scrollDown(){
    let intervaldata = setInterval(() => {
      this.ChatDialogueScroll.nativeElement.scrollTop = this.ChatDialogueScroll.nativeElement.scrollHeight;
      clearInterval(intervaldata);
    },250);
  }

  reloadSend(data,index){
    document.getElementById('errorIcon'+index).classList.toggle("rotate-scale-up");
    this.chatServ.sendChat(this.student.studentId,data.message,this.accountServ.userId,
      this.accountServ.getUserName()).subscribe(
      val=>{
        let message:any;
        message = val;
        this.chatDialogs[index].chatMessageRecieverStatesList=message.chatMessageRecieverStatesList;
        this.chatDialogs[index].chatThread=message.chatThread;
        this.chatDialogs[index].dateTimeRead=message.dateTimeRead;
        this.chatDialogs[index].dateTimeRecieved=message.dateTimeRecieved;
        this.chatDialogs[index].dateTimeSent=message.dateTimeSent;
        this.chatDialogs[index].id=message.id;
        this.chatDialogs[index].message=message.message;
        this.chatDialogs[index].senderId=message.senderId;
        this.chatDialogs[index].status=message.status;
        this.chatDialogs[index].user=message.user;
        this.chatDialogs[index].errorSend = false;
        this.sendLoading = false;
      },error1 => {
        document.getElementById('errorIcon'+index).classList.toggle("rotate-scale-up");
        console.log(error1);
        this.chatDialogs[index].errorSend = true;
        this.sendLoading = false;
        this.tost.create({
          message: 'Oops! I\'m sorry. can\'t send the message' ,
          duration: 3000,
          position: 'bottom'
        }).present();
      });
  }

}
