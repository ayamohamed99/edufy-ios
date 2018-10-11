import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";
import {tap} from "rxjs/operators";

@Injectable()
export class DailyReportService {

  httpOptions: any;
  headers: any;
  DomainUrl: Url_domain = new Url_domain;
  reportClassQuestionsGroups;

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

  getDailyReportTemplate(language, date, classId,reportId) {

    let requestURL = "";
    if (classId == null && reportId== null) {
      requestURL = '/authentication/dailyReport.ent/dailyReportTemplate.ent?language=' + language + '&date=' + date;
    } else if(classId != null && reportId== null){
      requestURL = '/authentication/dailyReport.ent/dailyReportTemplate.ent?language=' + language + '&date=' + date + '&classId=' + classId;
    }
    if (classId == null && reportId!= null) {
      requestURL = '/authentication/report.ent/reportTemplate.ent?language=' + language + '&date=' + date + '&reportId=' + reportId;
    } else if(classId != null && reportId!= null) {
      requestURL = '/authentication/report.ent/reportTemplate.ent?language=' + language + '&date=' + date + '&classId=' + classId + '&reportId=' + reportId;
    }

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);

  }


  getDropDownPremeter(key,reportId) {

    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyreportparameter.ent/getparameter.ent?key=' + key;
    }else{
      requestURL = '/authentication/reportparameter.ent/getparameter.ent?key=' + key + '&reportId=' + reportId;
    }

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
  }


  saveDailyReportTemplateQuestionParameters(questionId, parameterWrapper, questionNumber,reportId) {
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent/dailyReportEditQuestionParameters.ent?questionId=' + questionId;
    }else{
      requestURL = '/authentication/report.ent/reportEditQuestionParameters.ent?questionId=' + questionId + '&reportId=' + reportId;
    }
    return this.http.post(this.DomainUrl.Domain + requestURL, parameterWrapper, this.httpOptions);
  }

  getStudentReportAnswers(classId, date,reportId){
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent/getClassGroups.ent?classId=' + classId + '&date=' + date;
    }else{
      requestURL = '/authentication/report.ent/getClassGroups.ent?classId=' + classId + '&date=' + date + '&reportId=' + reportId;
    }

    return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions).pipe(
      tap(response => {
        this.reportClassQuestionsGroups = response;
      },err => {
      }));
  }

  approveReport(date,classId,reportId){
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent/approveDailyReport.ent?date=' + date + "&classId=" + classId;
    }else{
      requestURL = '/authentication/report.ent/approveReport.ent?date=' + date + "&classId=" + classId + '&reportId=' + reportId;
    }
    return this.http.put(this.DomainUrl.Domain + requestURL,null, this.httpOptions);
  }

  deleteStudnetReport(studentId, date, reportId) {
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent?studentId=' + studentId + '&date=' + date;
    }else{
      requestURL = '/authentication/report.ent?studentId=' + studentId + '&date=' + date + '&reportId=' + reportId;
    }

    return this.http.delete(this.DomainUrl.Domain + requestURL,this.httpOptions);
  }

  saveReport(answerObject, date, reportId){
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent?date=' + date;
    }else{
      requestURL = '/authentication/report.ent?date=' + date + '&reportId=' + reportId;
    }
    return this.http.post(this.DomainUrl.Domain + requestURL,answerObject, this.httpOptions);
  }

  updateReport(answerObject, date, reportId){
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent?date=' + date;
    }else{
      requestURL = '/authentication/report.ent?date=' + date + '&reportId=' + reportId;
    }
    console.log(answerObject);
    return this.http.put(this.DomainUrl.Domain + requestURL,answerObject, this.httpOptions);
  }



  approveReportByStudent(date,studentIds,reportId){
    let requestURL;
    if(reportId== null){
      requestURL = '/authentication/dailyReport.ent/approveStudentDailyReport.ent?date=' + date + "&studentIds=" + studentIds;
    }else{
      requestURL = '/authentication/report.ent/approveStudentReport.ent?date=' + date + "&studentIds=" + studentIds + '&reportId=' + reportId;
    }
    return this.http.put(this.DomainUrl.Domain + requestURL,null, this.httpOptions);
  }

}
