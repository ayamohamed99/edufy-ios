import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavParams, Platform} from '@ionic/angular';
import {ChatService} from '../../services/Chat/chat.service';
import {AccountService} from '../../services/Account/account.service';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {ChatDialogue} from '../../models/chat-dialogue';
import {Storage} from '@ionic/storage';
import {PassDataService} from '../../services/pass-data.service';

@Component({
  selector: 'app-chat-dialogue',
  templateUrl: './chat-dialogue.page.html',
  styleUrls: ['./chat-dialogue.page.scss'],
})
export class ChatDialoguePage implements OnInit {

  @ViewChild('ChatDialogue') private ChatDialogueScroll: any;
  student;
  chatDialogs:any[] = [];
  theMessage;
  loading=false;
  sendLoading=false;
  resendLoading=false;

  // @Input() studentData:any;
  constructor(public modalCtrl:ModalController,
              public platform:Platform,public storage:Storage,public chatServ:ChatService,public passData:PassDataService,
              public accountServ:AccountService, public getDate:TransFormDateService, public tost:ToastViewService)
  {
    this.student = this.passData.dataToPass.studentData;
    if (platform.is('desktop')) {
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

  ngOnInit() {
  }

  close(){
    this.DismissClick({name:'dismissed'});
  }

  getChatHistory(){
    this.loading = true;
    this.chatServ.getChatMessagesHistory(this.student.id,this.student.classes.branch.id).subscribe(
        // @ts-ignore
        val =>{
          this.loading = false;
          console.log(val);
          let data:any;
          data = val;
          // if(this.platform.is('cordova')){
          //     data = JSON.parse(val.data);
          // }
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
                  if(message.chatThread.student.id == this.student.id) {
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
          this.tost.presentPositionToast('Oops! I\'m sorry. can\'t get your chat history','bottom');
        });
  }


  sendMessage(){
    this.sendLoading = true;
    let chat = new ChatDialogue();
    chat.chatMessageRecieverStatesList='';
    chat.chatThread={student:{id:this.student.id}};
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
    this.chatServ.sendChat(this.student.id,this.theMessage,this.accountServ.userId,
        this.accountServ.getUserName()).subscribe(
        // @ts-ignore
        val=>{
          let message:any;
          message = val;
          // if(this.platform.is('cordova')){
          //     message = JSON.parse(val.data)
          // }
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
          this.tost.presentPositionToast('Oops! I\'m sorry. can\'t send the message','bottom');
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
    this.chatServ.sendChat(this.student.id,data.message,this.accountServ.userId,
        this.accountServ.getUserName()).subscribe(
        // @ts-ignore
        val=>{
          let message:any;
          message = val;
          // if(this.platform.is('cordova')){
          //     message = JSON.parse(val.data)
          // }
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
          this.tost.presentPositionToast('Oops! I\'m sorry. can\'t send the message','bottom');
        });
  }

  returndate(date){
    if(date){
      return this.getDate.transformTheDate(date,'HH:mm MMM dd, yyyy');
    }else{
      return ''
    }
  }

  async DismissClick(data) {
    await this.modalCtrl.dismiss(data);
  }

}
