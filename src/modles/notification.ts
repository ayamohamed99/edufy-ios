export class Notification{
  attachmentsList:any[] = [];
  body:string;
  dateTime:string;
  notificationId:number;
  title:string;
  receiversList:any[] = [];
  senderName:string;
  tagsList:any[] = [];
  tagsListName:any[] = [];
  pending:any;
  archived:boolean;
  approved:boolean;
  seenCount:number = 0;

  constructor(){}

}
