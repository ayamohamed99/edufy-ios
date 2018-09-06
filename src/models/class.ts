import {Grade} from "./grade";
import {Branch} from "./branch";

export class Class{

  classId:any;
  className:string;
  grade:Grade = new Grade();
  branch:Branch = new Branch();
  studentsList:any[] = [];
  allStudentApproved:boolean = false;
  allStudentFinalized:boolean = false;
  constructor() {
  }
}