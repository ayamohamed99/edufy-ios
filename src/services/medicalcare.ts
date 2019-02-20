import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";


@Injectable()
export class MedicalCareService {

  DomainUrl: Url_domain;
  commonUrl = '/authentication/medicalrecord.ent';
  val:any;
  localStorageUserName: string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword: string = 'LOCAL_STORAGE_PASSWORD';
  httpOptions: any;
  headers: any;


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
    let requestURL = 'authentication/medicalrecord.ent/getAccountMedicalCareSettings.ent?accountId='+accountId;
    return this.http.get(this.DomainUrl.Domain + this.commonUrl + requestURL, this.httpOptions);
  }

}
