import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";

@Injectable()
export class ClassesService{

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


  getClassList(viewName,opId,date,id,branchId,reportId){

    let URL = this.DomainUrl.Domain + '/authentication/class.ent?view='+viewName+'&operationId='+opId;
    if(id!=null){
      URL += '&id='+id;
    }
    if(date!=null){
      URL += '&date='+date;
    }
    if(branchId!=null){
      URL += '&branchId='+branchId;
    }
    if(reportId !=null){
      URL += '&reportId='+reportId;
    }

    return this.http.get(URL, this.httpOptions);
  }

}
