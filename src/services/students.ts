import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Url_domain} from "../models/url_domain";

@Injectable()
export class StudentsService{

  httpOptions:any;
  DomainUrl:Url_domain;

  constructor(public http:HttpClient){this.DomainUrl = new Url_domain;}

  putHeader(value){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Accept':'application/json',
        'content-type':'application/json',
        'Authorization': value
      })
    };
  }

  getAllStudents(fromPage:string){
    return this.http.get(this.DomainUrl.Domain+'/authentication/student.ent?operationId=7& name='+fromPage,this.httpOptions);
  }

}
