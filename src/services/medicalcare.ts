import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";
import {BehaviorSubject} from "rxjs";
import {tap} from "rxjs/operators";


@Injectable()
export class MedicalCareService {

  DomainUrl: Url_domain;
  commonUrl = '/authentication/medicalrecord.ent';
  val:any;
  localStorageUserName: string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword: string = 'LOCAL_STORAGE_PASSWORD';
  httpOptions: any;
  headers: any;
  getMedicines_FOR_MedicalReport:BehaviorSubject<object> = new BehaviorSubject(null);
  getDosageTypes_FOR_MedicalReport:BehaviorSubject<object> = new BehaviorSubject(null);
  getInstructions_FOR_MedicalReport:BehaviorSubject<object> = new BehaviorSubject(null);
  getIncidentTemplate_FOR_MEDICALREPORT:BehaviorSubject<object> = new BehaviorSubject(null);
  getCheckupTemplate_FOR_MEDICALREPORT:BehaviorSubject<object> = new BehaviorSubject(null);


  constructor(private http: HttpClient, private platform: Platform) {
    this.DomainUrl = new Url_domain;
  }

  putHeader(value) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': value
      })
    };
    this.val = value;
  }


  getMedicalRecords(selectedClass, selectedStudent, selectedStatus, date,page,View,startDate,endDate,pageSize) {

    let requestURL = '/WebApp.ent?classId=' + selectedClass + '&studentId=' +
      selectedStudent +'&status='+selectedStatus + '&date='+date+'&page='+page +'&view='+View+'&startDate='+
      startDate+'&endDate='+endDate+'&pageSize='+pageSize;

    return this.http.get(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
  }

  sendTakeMedication(shceduleId) {
    let requestURL = '/authentication/medications_motifications.ent/updatemedicationtaken.ent?medicationScheduleID='+shceduleId ;
    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }

  getAccountMedicalCareSettings(accountId) {
    let requestURL = '/getAccountMedicalCareSettings.ent?accountId='+accountId;
    return this.http.get(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
  }


  postMedicalRecord(medicalRecordObject) {

    let requestURL = '/newmedicalRecordWebApp.ent' ;

    return this.http.post(this.DomainUrl.Domain + this.commonUrl + requestURL,medicalRecordObject, this.httpOptions);
  }


  updateMedicalRecord(medicalRecord , View) {
    let requestURL = '/updatemedicalRecordWebApp.ent?view=' + View;

    return this.http.put(this.DomainUrl.Domain + this.commonUrl + requestURL,medicalRecord, this.httpOptions);
  }

  updateMedication(medicalRecordId,medicationIndex ,medication) {
    let requestURL = '/authentication/medication.ent/updateMedicationWebApp.ent?medicalrecordID='+medicalRecordId;

    return this.http.put(this.DomainUrl.Domain + requestURL,medication, this.httpOptions);
  }

  deleteMedicalRecord(medicalRecordId) {
    let requestURL = '/deleteMedicalRecord.ent?id='+medicalRecordId ;

    return this.http.delete(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
  }

  deleteIncident(medicalRecordId) {
    let requestURL = '/authentication/incident.ent/deleteincidentWebApp.ent?medicalRecordID='+medicalRecordId;

    return this.http.delete(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }


  deleteCheckup(medicalRecordId) {
    let requestURL = '/authentication/checkup.ent/deletecheckupWebApp.ent?medicalrecordID='+medicalRecordId ;

    return this.http.delete(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }


  deleteMedication(medicalRecordId , medicationIndex) {
    let requestURL = '/authentication/medication.ent/deletemedicationWebApp.ent?medicationID='+medicationIndex + '&medicalRecordID='+medicalRecordId ;

    return this.http.delete(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }

  updateTableMedication() {
    let requestURL = '/authentication/medication.ent/updateTableMedication.ent' ;

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }

  getMedicines():any {
    let requestURL = '/authentication/medicine.ent/WebApp.ent';

    if(this.getMedicines_FOR_MedicalReport.getValue() != null){
      return this.getMedicines_FOR_MedicalReport;
    }else {
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
        tap(response => {
          this.getMedicines_FOR_MedicalReport.next(response);
        },err => {

        }));
    }
  }

  getDosageTypes():any {
    let requestURL = '/authentication/dosagetype.ent/WebApp.ent';

    if(this.getDosageTypes_FOR_MedicalReport.getValue() != null){
      return this.getDosageTypes_FOR_MedicalReport;
    }else {
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
        tap(response => {
          this.getDosageTypes_FOR_MedicalReport.next(response);
        }, err => {

        }));
    }
  }


  getInstructions():any {
    let requestURL = 'authentication/instructions.ent/WebApp.ent';

    if(this.getInstructions_FOR_MedicalReport.getValue() != null){
      return this.getInstructions_FOR_MedicalReport;
    }else {
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
        tap(response => {
          this.getInstructions_FOR_MedicalReport.next(response);
        }, err => {

        }));
    }
  }

  getIncidentTemplate():any  {
    let requestURL = '/authentication/incident.ent/incidentTemplate.ent' ;
    if(this.getIncidentTemplate_FOR_MEDICALREPORT.getValue() != null){
      return this.getIncidentTemplate_FOR_MEDICALREPORT;
    }else {
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
        tap(response => {
          this.getIncidentTemplate_FOR_MEDICALREPORT.next(response);
        }, err => {

        }));
    }
  }

  getCheckupTemplate():any {
    let requestURL = '/authentication/checkup.ent/CheckupTemplate.ent' ;

    if(this.getCheckupTemplate_FOR_MEDICALREPORT.getValue() != null){
      return this.getCheckupTemplate_FOR_MEDICALREPORT;
    }else {
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
        tap(response => {
          this.getCheckupTemplate_FOR_MEDICALREPORT.next(response);
        }, err => {

        }));
    }
  }

  getIncidentAnswers(incidentId , date) {
    let requestURL = 'authentication/incident.ent/getIncidentAnswersWeb.ent?incidentId='+incidentId+'&date='+date ;

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }

  getCheckupAnswers(checkupId , date) {
    let requestURL = '/authentication/checkup.ent/getCheckupAnswersWeb.ent?checkupId='+checkupId+'&date='+date;

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }

  approveMedicalRecord(medicalRecordId) {
    let requestURL = '/approveMedicalRecord.ent?medicalRecordId='+medicalRecordId;

    return this.http.put(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
  }

  editMedicationReceiverStatus(medicationIds,userId) {
    let requestURL = '/editMedicationReceiverStatus.ent?medicationIds='+medicationIds+'&userId='+userId;

    return this.http.put(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
  }


  editRequestCheckupReceiverStatus(requestIds,userId) {
    let requestURL = '/authentication/requestcheckup.ent/editRequestCheckupReceiverStatus.ent?requestIds='+requestIds+'&userId='+userId;

    return this.http.put(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }
}
