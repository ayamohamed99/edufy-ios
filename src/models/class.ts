import {Grade} from "./grade";
import {Branch} from "./branch";

export class Class{

  id:any;
  name:string;
  grade:Grade = new Grade();
  branch:Branch = new Branch();
  studentsList:any[] = [];
  allStudentApproved:boolean = false;
  allStudentFinalized:boolean = false;
  noOfAllStudent;
  noOfStudentDailyReportApproved;
  noOfStudentDailyReportFinalized;
  noOfStudentReportApproved;
  noOfStudentReportFinalized;
  noOfUnseenComments:number;
  reportTemplet;
  totalNumberOfComments:number;
  classWithGrade;

  constructor() {
  }
}
