import {Class} from "./class";

export class Student{


  studentId:number;
  studentName:string;
  studentAddress:string;
  studentClass:Class = new Class();
  reportChecked:boolean;

  constructor() {
  }
}
