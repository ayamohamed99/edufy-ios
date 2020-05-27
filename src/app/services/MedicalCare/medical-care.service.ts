import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {BehaviorSubject, from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HTTP} from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class MedicalCareService {

  DomainUrl: Url_domain;
  commonUrl = '/authentication/medicalrecord.ent';
  val: any;
  localStorageUserName = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword = 'LOCAL_STORAGE_PASSWORD';
  httpOptions: any;
  headers: any;
  getMedicines_FOR_MedicalReport: BehaviorSubject<object> = new BehaviorSubject(null);
  getDosageTypes_FOR_MedicalReport: BehaviorSubject<object> = new BehaviorSubject(null);
  getInstructions_FOR_MedicalReport: BehaviorSubject<object> = new BehaviorSubject(null);
  getIncidentTemplate_FOR_MEDICALREPORT: BehaviorSubject<object> = new BehaviorSubject(null);
  getCheckupTemplate_FOR_MEDICALREPORT: BehaviorSubject<object> = new BehaviorSubject(null);
  getSETINGS_FOR_MEDICALREPORT: BehaviorSubject<object> = new BehaviorSubject(null);


  constructor(private http: HttpClient, private httpN:HTTP,private platform: Platform) {
    this.DomainUrl = new Url_domain;
  }

  putHeader(value) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: value
      })
    };
    this.val = value;
  }


  getMedicalRecords(selectedClass, selectedStudent, selectedStatus, date, page, View, startDate, endDate, pageSize) {

    const requestURL = '/WebApp.ent?classId=' + selectedClass + '&studentId=' +
        selectedStudent + '&status=' + selectedStatus + '&date=' + date + '&page=' + page + '&view=' + View + '&startDate=' +
        startDate + '&endDate=' + endDate + '&pageSize=' + pageSize;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
    // }
  }

  sendTakeMedication(shceduleId) {
    const requestURL = '/authentication/medications_motifications.ent/updatemedicationtaken.ent?medicationScheduleID=' + shceduleId ;
    // if(this.platform.is('cordova')) {
    //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL,{}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else {
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }
  }

  getAccountMedicalCareSettings(accountId): any {
    const requestURL = '/getAccountMedicalCareSettings.ent?accountId=' + accountId;

    if (this.getSETINGS_FOR_MEDICALREPORT.getValue() != null) {
      return this.getSETINGS_FOR_MEDICALREPORT;
    } else {
      // if(this.platform.is('cordova')){
      //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val})).pipe(
      //       tap(response => {
      //         this.getSETINGS_FOR_MEDICALREPORT.next(JSON.parse(response.data));
      //       }, err => {
      //
      //       }));
      // }else{
        return this.http.get(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions).pipe(
            tap(response => {
              this.getSETINGS_FOR_MEDICALREPORT.next(response);
            }, err => {

            }));
      // }
    }
  }


  postMedicalRecord(medicalRecordObject) {

    const requestURL = '/newmedicalRecordWebApp.ent' ;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.post(this.DomainUrl.Domain + this.commonUrl + requestURL, medicalRecordObject, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.post(this.DomainUrl.Domain + this.commonUrl + requestURL, medicalRecordObject, this.httpOptions);
    // }
  }


  updateMedicalRecord(medicalRecord , View) {
    const requestURL = '/updatemedicalRecordWebApp.ent?view=' + View;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(this.DomainUrl.Domain + this.commonUrl + requestURL, medicalRecord, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + this.commonUrl + requestURL, medicalRecord, this.httpOptions);
    // }

  }

  updateMedication(medicalRecordId, medicationIndex , medication) {
    const requestURL = '/authentication/medication.ent/updateMedicationWebApp.ent?medicalrecordID=' + medicalRecordId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(this.DomainUrl.Domain + requestURL, medication, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + requestURL, medication, this.httpOptions);
    // }

  }

  deleteMedicalRecord(medicalRecordId) {
    const requestURL = '/deleteMedicalRecord.ent?id=' + medicalRecordId ;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.delete(this.DomainUrl.Domain + this.commonUrl + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.delete(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
    // }

  }

  deleteIncident(medicalRecordId) {
    const requestURL = '/authentication/incident.ent/deleteincidentWebApp.ent?medicalRecordID=' + medicalRecordId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.delete(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.delete(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }
  }


  deleteCheckup(medicalRecordId) {
    const requestURL = '/authentication/checkup.ent/deletecheckupWebApp.ent?medicalrecordID=' + medicalRecordId ;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.delete(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.delete(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }
  }


  deleteMedication(medicalRecordId , medicationIndex) {
    const requestURL = '/authentication/medication.ent/deletemedicationWebApp.ent?medicationID=' + medicationIndex + '&medicalRecordID=' + medicalRecordId ;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.delete(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.delete(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }

  }

  updateTableMedication() {
    const requestURL = '/authentication/medication.ent/updateTableMedication.ent' ;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }

  }

  getMedicines(): any {
    const requestURL = '/authentication/medicine.ent/WebApp.ent';

    if (this.getMedicines_FOR_MedicalReport.getValue() != null) {
      return this.getMedicines_FOR_MedicalReport;
    } else {

      // if(this.platform.is('cordova')){
      //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL, {},{'content-type': 'application/json', 'Authorization': this.val})).pipe(
      //       tap(response => {
      //         // @ts-ignore
      //         this.getMedicines_FOR_MedicalReport.next(JSON.parse(response.data));
      //       }, err => {
      //
      //       }));      }else{
        return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
            tap(response => {
              this.getMedicines_FOR_MedicalReport.next(response);
            }, err => {

            }));
      // }


    }
  }

  getDosageTypes(): any {
    const requestURL = '/authentication/dosagetype.ent/WebApp.ent';

    if (this.getDosageTypes_FOR_MedicalReport.getValue() != null) {
      return this.getDosageTypes_FOR_MedicalReport;
    } else {

      // if(this.platform.is('cordova')){
      //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val})).pipe(
      //       tap(response => {
      //         // @ts-ignore
      //         this.getDosageTypes_FOR_MedicalReport.next(JSON.parse(response.data));
      //       }, err => {
      //
      //       }));
      // }else{
        return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
            tap(response => {
              this.getDosageTypes_FOR_MedicalReport.next(response);
            }, err => {

            }));
      // }



    }
  }


  getInstructions(): any {
    const requestURL = '/authentication/instructions.ent/WebApp.ent';

    if (this.getInstructions_FOR_MedicalReport.getValue() != null) {
      return this.getInstructions_FOR_MedicalReport;
    } else {

      // if(this.platform.is('cordova')) {
      //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val})).pipe(
      //       tap(response => {
      //         this.getInstructions_FOR_MedicalReport.next(JSON.parse(response.data));
      //       }, err => {
      //
      //       }));
      // }else{
        return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
            tap(response => {
              this.getInstructions_FOR_MedicalReport.next(response);
            }, err => {

            }));
      // }

    }
  }

  getIncidentTemplate(): any  {
    const requestURL = '/authentication/incident.ent/incidentTemplate.ent' ;
    if (this.getIncidentTemplate_FOR_MEDICALREPORT.getValue() != null) {
      return this.getIncidentTemplate_FOR_MEDICALREPORT;
    } else {

      // if(this.platform.is('cordova')) {
      //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val})).pipe(
      //       tap(response => {
      //         this.getIncidentTemplate_FOR_MEDICALREPORT.next(response);
      //       }, err => {
      //
      //       }));
      // }else{
        return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
            tap(response => {
              this.getIncidentTemplate_FOR_MEDICALREPORT.next(response);
            }, err => {

            }));
      // }

    }
  }

  getCheckupTemplate(): any {
    const requestURL = '/authentication/checkup.ent/CheckupTemplate.ent' ;

    if (this.getCheckupTemplate_FOR_MEDICALREPORT.getValue() != null) {
      return this.getCheckupTemplate_FOR_MEDICALREPORT;
    } else {

      // if(this.platform.is('cordova')){
      //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL, {}, {'content-type': 'application/json', 'Authorization': this.val})).pipe(
      //       tap(response => {
      //         this.getCheckupTemplate_FOR_MEDICALREPORT.next(response);
      //       }, err => {
      //
      //       }));
      // }else{
        return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
            tap(response => {
              this.getCheckupTemplate_FOR_MEDICALREPORT.next(response);
            }, err => {

            }));
      // }

    }
  }

  getIncidentAnswers(incidentId , date) {
    const requestURL = '/authentication/incident.ent/getIncidentAnswersWeb.ent?incidentId=' + incidentId + '&date=' + date ;


    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }

  }

  getCheckupAnswers(checkupId , date) {
    const requestURL = '/authentication/checkup.ent/getCheckupAnswersWeb.ent?checkupId=' + checkupId + '&date=' + date;


    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }

  }

  approveMedicalRecord(medicalRecordId) {
    const requestURL = '/approveMedicalRecord.ent?medicalRecordId=' + medicalRecordId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(this.DomainUrl.Domain + this.commonUrl + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + this.commonUrl + requestURL, {} , this.httpOptions);
    // }

  }

  editMedicationReceiverStatus(medicationIds, userId) {
    const requestURL = '/editMedicationReceiverStatus.ent?medicationIds=' + medicationIds + '&userId=' + userId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(this.DomainUrl.Domain + this.commonUrl + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
    // }

  }


  editRequestCheckupReceiverStatus(requestIds, userId) {
    const requestURL = '/authentication/requestcheckup.ent/editRequestCheckupReceiverStatus.ent?requestIds=' + requestIds + '&userId=' + userId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }

  }


  countMedicalRecords(selectedClass, selectedStudent, selectedStatus, date, page, View, startDate, endDate, pageSize) {

    const requestURL = '/authentication/medicalrecord.ent/WebApp.ent?classId=' + selectedClass + '&studentId=' + selectedStudent + '&status=' + selectedStatus + '&date=' + date + '&page=' + page + '&view=' + View
        + '&startDate=' + startDate + '&endDate=' + endDate + '&pageSize=' + pageSize;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL,  {},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }


  }

}
