import {Student} from "./student";

export class MedicalRecord {
  accountId;
  approved;
  branchId;
  checkup;
  createdFrom;
  id;
  incident;
  prescription;
  oneMedication;
  student;
  ///////////////////////
  activeMedication:boolean;
  activeMedicationTaken:boolean;
  timeOfActiveMedication:string;
  otherTimeOfTakenMedication:any;
}
