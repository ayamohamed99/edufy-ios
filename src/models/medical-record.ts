import {Student} from "./student";

export class MedicalRecord {
  accountId:number;
  approved:boolean;
  branchId:number;
  checkup:any;
  createdFrom:string;
  id:number;
  incident:any;
  prescription:any;
  oneMedication:any;
  student:Student;
  activeMedication:boolean;
  activeMedicationTaken:boolean;
  timeOfActiveMedication:string;
  otherTimeOfTakenMedication:any;
}
