import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";

@Injectable()
export class DailyReportService{

  httpOptions:any;
  headers:any;
  DomainUrl:Url_domain = new Url_domain;

  constructor(public http:HttpClient,private platform:Platform){}

  putHeader(value){
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

  getDailyReportTemplate(language, date, classId){

    let requestURL = "";
    if (classId == null) {
      requestURL = '/authentication/dailyReport.ent/dailyReportTemplate.ent?language=' + language + '&date=' + date;
    } else {
      requestURL = '/authentication/dailyReport.ent/dailyReportTemplate.ent?language=' + language + '&date=' + date + '&classId=' + classId;
    }

    return this.http.get(this.DomainUrl.Domain+requestURL,this.httpOptions);

  }


  getDropDownPremeter(key){
    return this.http.get(this.DomainUrl.Domain+'authentication/dailyreportparameter.ent/getparameter.ent?key=' + key,this.httpOptions);
  }


}
