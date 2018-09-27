import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";
import {map, tap} from "rxjs/operators";

@Injectable()
export class DailyReportService {

  httpOptions: any;
  headers: any;
  DomainUrl: Url_domain = new Url_domain;
  dailyReportClassQuestionsGroups;

  constructor(public http: HttpClient, private platform: Platform) {
  }

  putHeader(value) {
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : '*',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        'Authorization': value
      })
    };
  }

  getDailyReportTemplate(language, date, classId) {

    let requestURL = "";
    if (classId == null) {
      requestURL = '/authentication/dailyReport.ent/dailyReportTemplate.ent?language=' + language + '&date=' + date;
    } else {
      requestURL = '/authentication/dailyReport.ent/dailyReportTemplate.ent?language=' + language + '&date=' + date + '&classId=' + classId;
    }

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);

  }


  getDropDownPremeter(key) {
    return this.http.get(this.DomainUrl.Domain + '/authentication/dailyreportparameter.ent/getparameter.ent?key=' + key, this.httpOptions);
  }


  saveDailyReportTemplateQuestionParameters(questionId, parameterWrapper, questionNumber) {
    return this.http.post(this.DomainUrl.Domain + '/authentication/dailyReport.ent/dailyReportEditQuestionParameters.ent?questionId=' + questionId, parameterWrapper, this.httpOptions);
  }

  getStudentReportAnswers(classId, date){
    return this.http.get(this.DomainUrl.Domain + '/authentication/dailyReport.ent/getClassGroups.ent?classId=' + classId + '&date=' + date, this.httpOptions).pipe(
      tap(response => {
        this.dailyReportClassQuestionsGroups = response;
      },err => {
      }));
  }

  approveReport(date,classId){
    let requestURL = '/authentication/dailyReport.ent/approveDailyReport.ent?date=' + date + "&classId=" + classId;
    return this.http.put(this.DomainUrl.Domain + requestURL,null, this.httpOptions);
  }

  deleteStudnetReport(studentId, date) {
    let requestURL = '/authentication/dailyReport.ent?studentId=' + studentId + '&date=' + date;
    return this.http.delete(this.DomainUrl.Domain + requestURL,this.httpOptions);
  }

}
