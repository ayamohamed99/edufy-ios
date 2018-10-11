import {Class} from "./class";

export class Student{


  studentId:number;
  studentName:string;
  studentAddress:string;
  studentClass:Class = new Class();
  reportChecked:boolean;
  reportApproved:boolean;
  reportFinalized:boolean;
  numberInList:number;
  reportSeenByParent: boolean;
  reportSeenByStudent: boolean;
  numberOfUnseenComments: number;
  numberOfUnseenReportComments: object;
  constructor() {
  }
}
