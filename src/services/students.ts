import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";

@Injectable()
export class StudentsService{

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

  getAllStudents(fromPage:string){
      return this.http.get(this.DomainUrl.Domain + '/authentication/student.ent?operationId=7&name=' +
        fromPage, this.httpOptions);
  }

}
