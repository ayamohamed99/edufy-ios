import {Class} from "./class";

export class Student{


  id:number;
  name:string;
  address:string;
  classes:Class = new Class();
  reportChecked:boolean;
  reportApproved:boolean;
  reportFinalized:boolean;
  numberInList:number;
  reportSeenByParent: boolean;
  reportSeenByStudent: boolean;
  numberOfUnseenComments: number;
  totalNumberOfComments:number;
  profileImg = '';
  searchByClassGrade:string;
  constructor() {
  }
}
