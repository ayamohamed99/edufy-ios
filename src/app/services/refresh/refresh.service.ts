import { Injectable } from '@angular/core';
import { ChatService } from './../Chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  
  public noOfUnSeenMessages ;
  constructor(private chatService: ChatService) { }

  refreshNoOfUnseenMessages(){
    this.chatService.getNumberOfUnseenMessages().subscribe(val => {
      this.noOfUnSeenMessages = val;
    })
  };
}
