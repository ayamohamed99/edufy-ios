import { Injectable } from '@angular/core';
import { ChatService } from './../Chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  
  public noOfUnSeenMessages ;
  constructor(private chatService: ChatService) { }
  public hasUnSeenMessages = false;
  refreshNoOfUnseenMessages(){
    this.chatService.getNumberOfUnseenMessages().subscribe(val => {
      this.noOfUnSeenMessages = val;
      if(this.noOfUnSeenMessages == 0) this.hasUnSeenMessages = false;
      else this.hasUnSeenMessages = true;
      console.log("number of unseen Messages: " + this.noOfUnSeenMessages);
    })
  };
}
